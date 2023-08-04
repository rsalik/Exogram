import { getEBDispCounts } from "$lib/server/firebase/database";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  return {
    streamed: {
      ebDispCount: await getEBDispCounts(),
    },
  };
}) satisfies PageServerLoad;
