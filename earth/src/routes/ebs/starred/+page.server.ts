import { getUserData } from "$lib/client/firebase/database";
import { getEBGroups, getSavedEBs } from "$lib/server/firebase/database";

export const load = async () => {
  const savedEbs = await getSavedEBs();
  const groups = await getEBGroups();

  const ebs: Record<string, { group: string; uids: string[] }> = {};
  const uids: string[] = [];

  for (const group in savedEbs) {
    for (const uid in savedEbs[group]) {
      if (!uids.includes(uid)) uids.push(uid);

      for (const id in savedEbs[group][uid]) {
        if (!ebs[id]) ebs[id] = { group, uids: [] };
        ebs[id].uids.push(uid);
      }
    }
  }

  return {
    ebs,
    groups,
    userData: await getUserData(uids, ["name", "pfp"]),
  };
};
