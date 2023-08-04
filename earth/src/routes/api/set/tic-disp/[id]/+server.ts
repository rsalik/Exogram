import {
  setTicDisposition,
  updateTicDispositionCount,
} from "$lib/admin/firebase/firebase.js";
import { error, json } from "@sveltejs/kit";

export const POST = async ({ params, request, locals }) => {
  const { id } = params;

  if (!id) throw error(400, "Missing TIC id.");

  const { user } = locals;

  if (!user)
    throw error(401, "You must be signed in to submit a TIC Disposition.");

  const { uid } = user;

  const { disposition } = await request.json();

  if (!disposition) throw error(400, "Malformed Request");

  await setTicDisposition(disposition, id, uid);
  await updateTicDispositionCount(id);

  return json({ ok: true });
};

export const DELETE = async ({ params, locals }) => {
  const { id } = params;

  if (!id) throw error(400, "Missing TIC id.");

  const { user } = locals;

  if (!user)
    throw error(401, "You must be signed in to submit a TIC Disposition.");

  const { uid } = user;

  await setTicDisposition(null, id, uid);
  await updateTicDispositionCount(id);

  return json({ ok: true });
};
