import admin from "firebase-admin";
import {
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
} from "$env/static/private";
import { redis } from "$lib/server/redis";
import { ResConverter, resConvert, type WithId } from "$lib/util";
import type { EBDisposition } from "$lib/api/ebs";
import type { Saveable } from "$lib/client/saveables";
import type { TicDisposition } from "$lib/api/tics";
import type { UserData } from "$lib/client/firebase/auth";

let db: admin.database.Database;
let auth: admin.auth.Auth;

function initializeApp() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: "exogram-46cc8",
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY?.replace(/\\n/gm, "\n"),
      }),
      databaseURL: "https://exogram-46cc8-default-rtdb.firebaseio.com",
    });
  }
  db = admin.database();
  auth = admin.auth();
}

export const getUser = async (id: string) =>
  getter<Record<string, string>[]>(["users", id]);

export const setUser = async (
  id: string,
  val: UserData & { superuser: boolean; email: string }
) => setter(["users", id], val);

export const getUsers = async () =>
  getter<Record<string, string>[]>(["users"], 0, ResConverter.ARR);

export const getFolders = async () =>
  getter<Record<string, string>>(["drive", "folders"]);

export const setTicDisposition = async (
  val: TicDisposition | null,
  id: string,
  uid: string
) => await setter(["dispositions", id, uid], val);

export const updateTicDispositionCount = async (id: string) => {
  const curVal = (await getter<number>(["tics", id, "dispositionCount"])) || 0;
  const count = Object.keys(
    (await getter<any[]>(["dispositions", id])) || {}
  ).length;

  if (curVal !== count) {
    await setter(["tics", id, "dispositionCount"], count);

    await setter("ticsLastModified", Date.now());
  }
};

export const getEBDispositions = async (group: string, id: string) =>
  getter<WithId<EBDisposition>[] | null>(
    ["ebs", group, id],
    0,
    ResConverter.ARR
  );

export const getAllEBDispositions = async () =>
  getter<Record<string, Record<string, Record<string, EBDisposition>>>>(
    ["ebs"],
    0
  );

export const getEBDisposition = async (
  group: string,
  id: string,
  uid: string
) => getter<EBDisposition>(["ebs", group, id, uid]);

export const setEBGroupDone = async (id: string, val: boolean) =>
  setter(["ebGroups", id, "done"], val);

export const setEBDispCount = async (uid: string, val: number) =>
  setter(["ebDispCount", uid], val);

export const setEBDisposition = async (
  group: string,
  id: string,
  uid: string,
  val: EBDisposition
) => setter(["ebs", group, id, uid], val);

export const createNotification = async (
  uid: string,
  from: string,
  val: Saveable
) =>
  setter(["notifications", uid, "value", Date.now().toString()], {
    ...val,
    from,
  });

export const deleteNotification = async (uid: string, id: string) =>
  setter(["notifications", uid, "value", id], null);

export const getIsUserSuperUser = async (uid: string) =>
  getter<boolean>([uid, "superuser"]);

async function getter<T>(
  path: string[] | string,
  ttl = 0,
  converter = ResConverter.NONE
): Promise<T> {
  if (path instanceof Array) path = path.join("/");

  if (ttl > 0) {
    const cached = await redis.get(path);
    if (cached) return JSON.parse(cached);
  }

  const res = resConvert((await db.ref(path).get()).val(), converter) as T;

  if (ttl > 0) redis.set(path, JSON.stringify(res), "EX", ttl);

  return res as T;
}

async function setter(path: string[] | string, val: any, usedCache = false) {
  if (path instanceof Array) path = path.join("/");

  if (usedCache) redis.del(path);

  if (val === null) {
    return await db.ref(path).remove();
  }

  return await db.ref(path).set(val);
}

export async function verifyIdToken(token: string) {
  initializeApp();

  return await auth.verifyIdToken(token);
}
