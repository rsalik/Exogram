import { error, text } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { getTic, getTicGroups } from "$lib/server/firebase/database";
import {
  getIsUserSuperUser,
  getTicDispositions,
} from "$lib/admin/firebase/firebase";
import { getUserData } from "$lib/client/firebase/database";
import { TicLongPropertyNames } from "$lib/api/tics";

export const GET = (async ({ params, locals }) => {
  if (!locals.user || !(await getIsUserSuperUser(locals.user.uid)))
    throw error(403, "Forbidden");

  const { id } = params;

  const header = ["Group", "TIC ID", "# Responses", "# FP / pFP", "# PC / CP"];

  const line = [];

  const tic = await getTic(id);

  if (!tic) throw error(404, "TIC " + id + " not found.");

  const dispositions = (await getTicDispositions(id)) as any;
  const users = await getUserData(Object.keys(dispositions), "name");

  const ticGroups = await getTicGroups();

  // Intentional double equals
  line.push(ticGroups.find((g) => g.id == tic.group)?.name || "Unknown");
  line.push(id);
  line.push(Object.keys(dispositions).length);
  line.push(...[0, 0]);

  header.push("Paper Disposition");
  line.push(tic.paperDisposition.disposition);

  header.push("Paper Comments");
  line.push(tic.paperDisposition.comments);

  for (const prop in TicLongPropertyNames) {
    header.push(
      TicLongPropertyNames[prop as keyof typeof TicLongPropertyNames]
        .replaceAll(`<span class="unit">`, "")
        .replaceAll("</span>", "")
        .replaceAll(/<.?sub>/gm, "")
    );
    line.push(tic[prop as keyof typeof tic]);
  }

  let fps = 0,
    pcs = 0;

  for (const user in dispositions) {
    header.push(`${users[user].name} (${user.substring(0, 5)}) Disposition`);
    line.push(dispositions[user].disposition);

    if (
      dispositions[user].disposition === "FP" ||
      dispositions[user].disposition === "pFP"
    ) {
      fps++;
    }

    if (
      dispositions[user].disposition === "PC" ||
      dispositions[user].disposition === "CP"
    ) {
      pcs++;
    }

    header.push(`${users[user].name} (${user.substring(0, 5)}) Comments`);
    line.push(dispositions[user].comments);
  }

  line[3] = fps;
  line[4] = pcs;

  // Make file automatically download
  return new Response(
    header.map((o) => `"${o}"`).join(",") +
      "\n" +
      line.map((o) => `"${o}"`).join(","),
    {
      headers: {
        "Content-Disposition": `attachment; filename="tic-${id}.csv"`,
      },
    }
  );
}) satisfies RequestHandler;
