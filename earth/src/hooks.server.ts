import { verifyIdToken } from "$lib/admin/firebase/firebase";
import type { Handle } from "@sveltejs/kit";

export const handle = (async ({ event, resolve }) => {
  const sessionCookie = event.cookies.get("__exogram_session");

  try {
    if (sessionCookie) {
      const decodedClaims = await verifyIdToken(sessionCookie);

      event.locals.user = decodedClaims;
    }
  } catch (e) {
    event.locals.user = null;
    return resolve(event);
  }

  return resolve(event);
}) satisfies Handle;
