import { getEBFile } from "$lib/server/drive.js";
import { getGroupOfEB } from "$lib/server/ebs.js";
import { error, json } from "@sveltejs/kit";

export const GET = async ({ params }) => {
  const { id } = params;

  const { group, done } = await getGroupOfEB(id);

  if (!group) {
    throw error(404);
  }

  const file = await getEBFile(group.id, id, done);

  if (!file) {
    throw error(500);
  }

  return json({ file, group, done });
};
