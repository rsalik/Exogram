import { getDictionary } from "$lib/server/firebase/database";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  return {
    dictionary: await getDictionary(),
  };
}) satisfies PageServerLoad;
