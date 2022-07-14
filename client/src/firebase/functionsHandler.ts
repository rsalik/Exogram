import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

async function invokeFunction(name: string, params: any) {
  const res = await httpsCallable(functions, name)(params);

  return res.data;
}

export const getTicFiles = (ticId: string) => invokeFunction('getTicFiles', { ticId });
