import { deleteNotification } from "$lib/admin/firebase/firebase.js";
import { error, json } from "@sveltejs/kit";

export const DELETE = async ({ locals, params }) => {
  if (!locals.user) throw error(401, "Unauthorized");

  const { id } = params;

  if (!id) throw error(400, "Malformed Request");

  const { uid } = locals.user;

  await deleteNotification(uid, id);
  return json({ ok: true });
};
