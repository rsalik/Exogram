import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";

export const load = (async ({ locals }) => {
  if (!locals.user || !locals.user?.admin) throw error(403, "Forbidden");
}) satisfies PageServerLoad;
