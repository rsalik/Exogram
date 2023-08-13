import { getIsUserSuperUser } from "$lib/admin/firebase/firebase.js";
import { json } from "@sveltejs/kit";

export const GET = async ({ locals }) => {
  return json({
    admin: locals.user?.admin || false,
    superuser: await getIsUserSuperUser(locals.user?.id),
  });
};
