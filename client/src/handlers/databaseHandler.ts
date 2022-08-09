import { ref, get, set, remove } from 'firebase/database';
import { useEffect, useState } from 'react';
import { auth, db } from './firebase';

// Get Tics Hook
export function useTicList() {
  const [tics, setTics] = useState<any[]>([]);

  useEffect(() => {
    get(ref(db, 'ticsLastModified')).then((snapshot) => {
      const ct = window.localStorage.getItem('ticsLastModified');
      const ticsString = window.localStorage.getItem('tics');
      if (ct && parseInt(ct) > snapshot.val() && ticsString) {
        setTics(convertTicsObjToList(JSON.parse(ticsString)));
      } else {
        get(ref(db, 'tics')).then((snapshot) => {
          setTics(convertTicsObjToList(snapshot.val()));
          window.localStorage.setItem('tics', JSON.stringify(snapshot.val()));
          window.localStorage.setItem('ticsLastModified', Date.now().toString());
        });
      }
    });
  }, []);

  return tics;
}

// Get Users Hook (Admins Only)
export function useUsers() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    get(ref(db, 'users')).then((snapshot: any) => {
      setUsers(convertUsersObjToList(snapshot.val()));
    });
  }, []);

  return users;
}

// Get Tics Groups Hook
export function useTicGroups() {
  const [groups, setGroups] = useState<any[]>([]);

  useEffect(() => {
    get(ref(db, 'ticGroups')).then((snapshot: any) => {
      setGroups(convertTicGroupsObjToList(snapshot.val()));
    });
  }, []);

  return groups;
}

// Get Individual Tic Data Hook
export function useTicData(ticId: string) {
  const [tic, setTic] = useState<any>();

  useEffect(() => {
    get(ref(db, `tics/${ticId}`)).then((snapshot: any) => {
      setTic({ ...snapshot.val(), ticId });
    });
  }, [ticId]);

  return tic;
}

// Get Individual Tic Data Hook
export function useTicDispositions(ticId: string) {
  const [dispositions, setDispositions] = useState<any>();

  useEffect(() => {
    get(ref(db, `dispositions/${ticId}`)).then(
      (snapshot: any) => {
        setDispositions(convertDispositionsObjectToList(snapshot.val()));
      },
      () => {
        setDispositions({ error: true });
      }
    );
  }, [ticId]);

  useEffect(() => {
    updateDispositionCount(ticId, dispositions);
  }, [ticId, dispositions]);

  return dispositions;
}

export async function getTicDispositions(ticId: string) {
  try {
    return convertDispositionsObjectToList((await get(ref(db, `dispositions/${ticId}`))).val());
  } catch {
    return null;
  }
}

export async function getAllTicDispositions(ticList: any[]) {
  const dispositions = {} as { [key: string]: any };
  const promises = [];

  async function getDispositions(ticId: string) {
    try {
      dispositions[ticId] = await getTicDispositions(ticId);
    } catch {}
  }

  for (const tic of ticList) {
    promises.push(getDispositions(tic.ticId));
  }

  await Promise.all(promises);
  return dispositions;
}

export function useUsername(uid: string) {
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    get(ref(db, `users/${uid}/name`)).then((snapshot: any) => {
      setUsername(snapshot.val());
    });
  }, [uid]);

  return username;
}

export async function amISuperuser() {
  if (!auth.currentUser) return false;

  return !!(await get(ref(db, `users/${auth.currentUser.uid}/superuser`))).val();
}

export async function amIAdmin() {
  if (!auth.currentUser) return false;

  const token = await auth.currentUser.getIdTokenResult();
  return !!token.claims.admin;
}

function convertTicsObjToList(tics: any) {
  const ticList = [];
  for (const key in tics) {
    ticList.push({
      ...tics[key],
      ticId: key,
    });
  }

  return ticList;
}

function convertTicGroupsObjToList(groups: any) {
  const ticGroupsList = [];
  for (const key in groups) {
    ticGroupsList.push({
      id: key,
      ...groups[key],
    });
  }

  return ticGroupsList;
}

function convertUsersObjToList(users: any) {
  const usersList = [];
  for (const key in users) {
    usersList.push({
      uid: key,
      ...users[key],
    });
  }

  return usersList;
}

function convertDispositionsObjectToList(dispositions: any) {
  const dispositionList = [];
  for (const key in dispositions) {
    dispositionList.push({
      ...dispositions[key],
      userId: key,
    });
  }

  return dispositionList;
}

export async function getDictionary() {
  let dict = (await get(ref(db, '/dictionary'))).val();

  let dictArr = [];
  for (const key in dict) {
    dictArr.push({
      name: key,
      def: dict[key],
    });
  }

  return dictArr;
}

export async function submitDisposition(disposition: { disposition: string; comments: string }, ticId: string) {
  const user = auth.currentUser;
  if (!user) return false;

  const userId = user.uid;

  try {
    await set(ref(db, `dispositions/${ticId}/${userId}`), disposition);
    await updateDispositionCount(ticId);
    return true;
  } catch {
    return false;
  }
}

export async function deleteDisposition(ticId: string) {
  const user = auth.currentUser;
  if (!user) return false;

  const userId = user.uid;

  try {
    await remove(ref(db, `dispositions/${ticId}/${userId}`));
    await updateDispositionCount(ticId);
    return true;
  } catch {
    return false;
  }
}

async function updateDispositionCount(ticId: string, dispositions?: any[]) {
  if (!dispositions) return;

  const count = dispositions.length;
  const curValue = (await get(ref(db, `tics/${ticId}/dispositionCount`))).val();

  if (curValue !== count) {
    await set(ref(db, `tics/${ticId}/dispositionCount`), count);
    await set(ref(db, `ticsLastModified`), Date.now());
  }
}

export async function writeUserData() {
  const user = auth.currentUser;
  if (!user) return;

  const userId = user.uid;

  try {
    await set(ref(db, `users/${userId}/email`), user.email);
    await set(ref(db, `users/${userId}/name`), user.displayName);
  } catch {}
}

export async function setTicGroupWritePermission(groupId: string, write: boolean) {
  try {
    await set(ref(db, `ticGroups/${groupId}/write`), write);
  } catch {}
}

export async function setTicGroupReadPermission(groupId: string, read: boolean) {
  try {
    await set(ref(db, `ticGroups/${groupId}/public`), read);
  } catch {}
}

export async function setUserSuperuserStatus(uid: string, superuser: boolean) {
  try {
    await set(ref(db, `users/${uid}/superuser`), superuser);
  } catch {}
}
