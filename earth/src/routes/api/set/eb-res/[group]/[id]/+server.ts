import {
  setEBDispCount,
  setEBDisposition,
  getEBDispositions,
} from "$lib/admin/firebase/firebase.js";
import { EBQuestions, type EBDisposition } from "$lib/api/ebs.js";
import { markEBAsDone } from "$lib/server/ebs.js";
import { getEBDispCount } from "$lib/server/firebase/database.js";
import { error, json } from "@sveltejs/kit";

export const POST = async ({ params, request, locals }) => {
  const { group, id } = params;

  if (!group || !id) throw error(400, "Missing group or id.");

  const { user } = locals;

  if (!user)
    throw error(401, "You must be signed in to submit an EB Response.");

  const { responses } = await request.json();

  if (!(responses instanceof Array) || responses.length !== EBQuestions.length)
    throw error(400, "Invalid responses.");

  for (let i = 0; i < responses.length; i++) {
    if (EBQuestions[i].type === "boolean" && typeof responses[i] !== "boolean")
      throw error(400, `Malformed response ${i}.`);

    if (EBQuestions[i].type === "text" && typeof responses[i] !== "string")
      throw error(400, `Malformed response ${i}.`);
  }

  const response = EBQuestions.reduce(
    (acc, cur, i) => ({ ...acc, [cur.key]: responses[i] }),
    {} as EBDisposition
  );

  await setEBDisposition(group, id, user.uid, response);
  await setEBDispCount(user.uid, (await getEBDispCount(user.uid)) + 1);

  const ebDisps = (await getEBDispositions(group, id))?.length;

  if (ebDisps && ebDisps >= 3) {
    try {
      await markEBAsDone(group, id);
    } catch (err) {
      console.error(err);
    }
  }

  return json({ success: true });
};
