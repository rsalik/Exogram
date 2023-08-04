import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { getTicFiles } from "$lib/server/drive";

export const GET = (async ({ params }) => {
  const { id } = params;

  return json(await getTicFiles(id));
}) satisfies RequestHandler;
