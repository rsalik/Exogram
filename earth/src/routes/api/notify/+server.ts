import { createNotification } from "$lib/admin/firebase/firebase.js";
import { encodeFirebaseKey } from "$lib/util.js";
import { error, json } from "@sveltejs/kit";

export const POST = async ({ request, locals }) => {
  if (!locals.user) throw error(401, "Unauthorized");

  const { saveable, users } = await request.json();

  if (!saveable || !users) throw error(400, "Malformed Request");

  // Check for malicious HTML code in saveable.data.name and saveable.data.property keys
  // Only <span> and <sub> tags are allowed with no attributes

  const regex = /<(?!\/?(span|sub)( class="[a-z]*?")?>).*/gm;

  if (regex.test(saveable.data.name))
    throw error(400, "Detected Malicious HTML");
  if (saveable.data.properties)
    for (const key in saveable.data.properties)
      if (regex.test(key)) throw error(400, "Detected Malicious HTML");

  if (saveable.data.properties) {
    saveable.data.properties = Object.fromEntries(
      Object.entries(saveable.data.properties).map(([key, value]) => [
        encodeFirebaseKey(key),
        value,
      ])
    );
  }

  for (const uid of users)
    await createNotification(uid, locals.user.uid, saveable);

  return json({ ok: true });
};
