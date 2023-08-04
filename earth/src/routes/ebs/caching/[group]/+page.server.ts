import { validateCache } from "$lib/server/ebs.js";
import { getEBGroups } from "$lib/server/firebase/database.js";
import { error } from "@sveltejs/kit";

export const load = async ({ depends, params }) => {
  depends("data:cache");

  const groups = await getEBGroups();

  if (!groups[params.group])
    throw error(404, `EB Group <span>${params.group}</span> not found.`);

  const valid = await validateCache(params.group, groups);

  return {
    caching: !valid,
    group: params.group,
  };
};
