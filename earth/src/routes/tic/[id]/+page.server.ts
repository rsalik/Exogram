import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import {
  getDictionary,
  getTic,
  getTicGroups,
} from "$lib/server/firebase/database";

export const load = (async ({ params }) => {
  const tic = await getTic(params.id);

  if (!tic)
    throw error(
      404,
      `No data for <span>TIC ${params.id}</span> was found on the server.`
    );

  return {
    tic: { ...tic, id: params.id },
    ticGroups: await getTicGroups(),
    dictionary: await getDictionary(),
  };
}) satisfies PageServerLoad;
