import { getEBDisposition } from "$lib/admin/firebase/firebase.js";
import { error } from "@sveltejs/kit";

export const load = async ({ locals, params, fetch }) => {
  const res = await fetch(`/api/get/eb/${params.id}`);

  if (res.status === 404)
    throw error(404, `The TIC <span>${params.id}</span> was not found.`);
  if (res.status === 500)
    throw error(
      500,
      `A file could not be found for TIC <span>${params.id}</span> (Internal Error).`
    );

  const { group, done, file } = await res.json();
  const { user } = locals;

  return {
    group,
    file,
    done,
    id: params.id,
    disposition: user
      ? getEBDisposition(group.id, params.id, user.uid) ?? undefined
      : undefined,
  };
};
