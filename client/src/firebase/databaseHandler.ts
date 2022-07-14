import { ref, onValue, get } from 'firebase/database';
import { useEffect, useState } from 'react';
import { db } from './firebase';


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

export async function getDictionary() {
  let dict = (await get(ref(db, '/dictionary'))).val();

  console.log(dict);

  let dictArr = [];
  for (const key in dict) {
    dictArr.push({
      name: key,
      def: dict[key],
    });
  }

  return dictArr;
}
