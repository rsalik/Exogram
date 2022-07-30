import { ref, onValue, get, set, remove } from 'firebase/database';
import { useEffect, useState } from 'react';
import { auth, db } from './firebase';

// Get Tics Hook
export function useTicList() {
  const [tics, setTics] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onValue(ref(db, 'tics'), (snapshot: any) => {
      setTics(convertTicsObjToList(snapshot.val()));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return tics;
}

// Get Tics Groups Hook
export function useTicGroups() {
  const [groups, setGroups] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onValue(ref(db, 'ticGroups'), (snapshot: any) => {
      setGroups(convertTicGroupsObjToList(snapshot.val()));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return groups;
}

// Get Individual Tic Data Hook
export function useTicData(ticId: string) {
  const [tic, setTic] = useState<any>();

  useEffect(() => {
    const unsubscribe = onValue(ref(db, `tics/${ticId}`), (snapshot: any) => {
      setTic({ ...snapshot.val(), ticId });
    });

    return () => {
      unsubscribe();
    };
  }, [ticId]);

  return tic;
}

// Get Individual Tic Data Hook
export function useTicDispositions(ticId: string) {
  const [dispositions, setDispositions] = useState<any>();

  useEffect(() => {
    const unsubscribe = onValue(
      ref(db, `dispositions/${ticId}`),
      (snapshot: any) => {
        setDispositions(convertDispositionsObjectToList(snapshot.val()));
      },
      () => {
        setDispositions({ error: true });
      }
    );

    return () => {
      unsubscribe();
    };
  }, [ticId]);

  return dispositions;
}

export async function getTicDispositions(ticId: string) {
  return convertDispositionsObjectToList((await get(ref(db, `dispositions/${ticId}`))).val());
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
  console.log(dispositions);
  return dispositions;
}

export function useUsers() {
  const [users, setUsers] = useState<any>();

  useEffect(() => {
    const unsubscribe = onValue(ref(db, `users`), (snapshot: any) => {
      setUsers(convertUsersObjToList(snapshot.val()));
    });

    return () => {
      unsubscribe();
    };
  }, [users]);

  return users;
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
  const userList = [];
  for (const key in users) {
    userList.push({
      ...users[key],
      id: key,
    });
  }

  return userList;
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
    return true;
  } catch {
    return false;
  }
}
