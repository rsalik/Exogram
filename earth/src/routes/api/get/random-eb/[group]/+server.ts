import { getRandomEB } from "$lib/server/ebs.js";
import { getEBGroups } from "$lib/server/firebase/database.js";
import { error, json } from "@sveltejs/kit";

export const GET = async ({ locals, params }) => {
  if (!locals.user)
    throw error(401, "You must be signed in to get a random EB.");

  const groups = await getEBGroups();

  if (!groups[params.group])
    throw error(404, `EB Group <span>${params.group}</span> not found.`);
  if (groups[params.group].done) return json({ done: true, groups });

  const file = await getRandomEB(params.group, groups, locals.user.uid);

  if (file === false) return json({ caching: true });
  if (file === true) return json({ userDone: true, groups });

  return json({ file, groups });
};
