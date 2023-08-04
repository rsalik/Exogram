import { getEBGroupCompletion, validateCache } from "$lib/server/ebs.js";
import { getEBGroups } from "$lib/server/firebase/database.js";
import { ResConverter, resConvert } from "$lib/util";

export const load = async () => {
  const groups = await getEBGroups();
  const progress: Record<
    string,
    Awaited<ReturnType<typeof getEBGroupCompletion>>
  > = {};

  for (const group in groups) {
    if (await validateCache(group, groups))
      progress[group] = await getEBGroupCompletion(group, groups);
  }

  return {
    groups: resConvert(groups, ResConverter.ARR),
    progress,
  };
};
