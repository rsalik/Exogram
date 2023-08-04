import { verifyIdToken } from "$lib/admin/firebase/firebase";
import { error, type RequestHandler } from "@sveltejs/kit";

export const POST = (async ({ request, cookies, locals }) => {
  const { user } = await request.json();

  if (!user) return new Response("OK", { status: 200 });

  const uid = (await verifyIdToken(user)).uid;

  if (uid) {
    if (locals.user && locals.user.uid === uid) {
      console.log("Auth > NO OP");
      return new Response("NO OP", { status: 200 });
    }

    cookies.set("__exogram_session", user, {
      path: "/",
      secure: true,
      httpOnly: true,
      maxAge: 60 * 60,
    });

    console.log("Auth > OK");
    return new Response("OK", { status: 200 });
  }

  throw error(401, "Unauthorized");
}) satisfies RequestHandler;

export const DELETE = async ({ cookies }) => {
  cookies.set("__exogram_session", "", {
    path: "/",
    secure: true,
    httpOnly: true,
    maxAge: 0,
  });

  return new Response("OK", { status: 200 });
};
