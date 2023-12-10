import {
  ref,
  onValue,
  get,
  set,
  remove,
  DataSnapshot,
} from "firebase/database";
import {
  derived,
  get as storeGet,
  writable,
  type Writable,
} from "svelte/store";
import { db } from "$lib/firebase";
import { ResConverter, resConvert, type WithId } from "$lib/util";
import { readable, type Readable } from "svelte/store";
import type { TicDisposition } from "$lib/api/tics";
import { browser } from "$app/environment";
import { user, type UserData } from "./auth";
import type { User } from "firebase/auth";
import type { EBDisposition } from "$lib/api/ebs";
import type { UserNotificationData } from "../saveables";

export const useDispositions = (id: string) =>
  createStore<WithId<TicDisposition>[]>(
    ["/dispositions", id],
    false,
    ResConverter.DISP_ARR
  );

export const useIsEBSaved = (group: string, id: string) =>
  createStore<boolean>(["savedEBs", group, id], 2);
export const setIsEBSaved = (group: string, id: string, val: boolean) =>
  setter(["savedEBs", group, id], val ? true : null, 2);

export const getEBDisposition = (group: string, id: string) =>
  getter(["ebs", group, id], true);

export const useUserEBDisposition = (group: string, id: string) =>
  createStore<EBDisposition>(["ebs", group, id], true);

export const useUserNotifications = () =>
  createStore<UserNotificationData>(
    "/notifications",
    true,
    ResConverter.NOTIFICATIONS
  );

export const updateUserNotificationsRead = () =>
  setter(["notifications", "read"], Date.now(), 1);

export const adminSetIsUserSuperUser = (uid: string, val: boolean) =>
  setter(["users", uid, "superuser"], val);

export const adminUseUsers = () =>
  createStore<Record<string, string>[]>(["users"], 0, ResConverter.ARR);

export async function getUserData<
  const T extends string[],
  K extends keyof UserData
>(uids: T, fields: K | K[]) {
  if (!Array.isArray(fields)) fields = [fields];

  const promises: Promise<any>[] = [];
  uids.forEach((uid) =>
    promises.push(
      (async () => {
        const data = {} as Record<K, string>;

        for (const field of fields) {
          if (browser) {
            const ss = sessionStorage.getItem(`${field}:${uid}`);
            if (ss) {
              data[field as K] = ss;
              continue;
            }
          }

          const val = await get(ref(db, `users/${uid}/${field}`));

          if (browser) sessionStorage.setItem(`${field}:${uid}`, val.val());

          data[field as K] = val.val();
        }

        return data;
      })()
    )
  );

  const data = {} as Record<T[number], Record<K, string>>;

  const res = await Promise.all(promises);

  res.forEach((o, i) => {
    data[uids[i] as T[number]] = o;
  });

  return data;
}

export function useUserData<K extends keyof UserData>(
  store: Readable<string[]>,
  fields: K | K[]
) {
  const { subscribe } = readable<Record<string, Record<K, string>>>(
    {},
    (set) => {
      const unsubscribe = store.subscribe(async (uids) => {
        const val = storeGet({ subscribe }) || {};

        const newUserData = await getUserData(
          uids.filter((uid) => !val[uid]),
          fields
        );

        set({ ...val, ...newUserData });
      });

      return () => unsubscribe();
    }
  );

  return {
    subscribe,
  };
}

export function useAllUserData() {
  const { subscribe } = readable<Record<keyof UserData | "uid", string>[]>(
    [],
    (set) => {
      fetch("/api/get/all-users")
        .then((res) => res.json())
        .then((res) => set(res.users));
    }
  );

  return {
    subscribe,
  };
}

async function getter<T = string>(
  path: string | string[],
  userIndex: number | boolean = false,
  converter: ResConverter = ResConverter.NONE
) {
  const pathArr = path instanceof Array ? path : [path];

  if (userIndex && userIndex !== 0) {
    const uid = storeGet(user)?.uid;

    if (!uid) throw new Error("You must be logged in to get " + path);

    // Set uid as index userIndex
    if (userIndex === true) pathArr.push(uid);
    else pathArr.splice(userIndex, 0, uid);
  }

  return resConvert(
    (await get(ref(db, pathArr.join("/")))).val(),
    converter
  ) as T;
}

async function setter(
  path: string[] | string,
  val: any,
  userIndex: number | boolean = false
) {
  const pathArr = path instanceof Array ? path : [path];

  if (userIndex && userIndex !== 0) {
    const uid = storeGet(user)?.uid;

    if (!uid) throw new Error("You must be logged in to set " + path);

    // Set uid as index userIndex
    if (userIndex === true) pathArr.push(uid);
    else pathArr.splice(userIndex, 0, uid);
  }

  path = pathArr.join("/");

  if (val === null) return await remove(ref(db, path));
  return await set(ref(db, path), val);
}

function createStore<T>(
  path: string[] | string,
  userIndex: number | boolean = false,
  resHandler = ResConverter.NONE
) {
  if (!browser) {
    return readable(undefined);
  }

  const pathArr = path instanceof Array ? path : [path];
  const loading = writable(true);

  function callback(
    snapshot: DataSnapshot,
    set: (val: T | null | undefined) => void,
    loading?: Writable<boolean>
  ) {
    if (loading) loading.set(false);

    if (!snapshot.exists()) return set(undefined);
    const val = resConvert(snapshot.val(), resHandler);

    set((val as T) ?? null);
  }

  if (userIndex && userIndex !== 0) {
    const { subscribe } = derived<Readable<User>, T | null | undefined>(
      user as Readable<User>,
      ($user, set) => {
        if (!$user) return set(null);

        const uid = $user.uid;

        const newPathArr = [...pathArr];

        if (userIndex === true) newPathArr.push(uid);
        else newPathArr.splice(userIndex, 0, uid);

        const r = ref(db, newPathArr.join("/"));

        const unsubscribe = onValue(
          r,
          (snapshot) => callback(snapshot, set, loading),
          () => set(null)
        );

        return () => {
          unsubscribe();
        };
      }
    );

    return {
      subscribe,
    };
  }

  const r = ref(db, pathArr.join("/"));
  const { subscribe } = readable<T | null | undefined>(undefined, (set) => {
    const unsubscribe = onValue(
      r,
      (snapshot) => callback(snapshot, set, loading),
      () => set(null)
    );

    return () => {
      unsubscribe();
      loading;
    };
  });

  return {
    subscribe,
    loading,
  };
}
