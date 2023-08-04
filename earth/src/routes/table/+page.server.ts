import { getTicGroups, getTics } from "$lib/server/firebase/database";
import { ResConverter, resConvert } from "$lib/util";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  return {
    ticGroups: await getTicGroups(),
    streamed: {
      tics: (async () => resConvert(await getTics(), ResConverter.ARR))(),
    },
  };
}) satisfies PageServerLoad;
