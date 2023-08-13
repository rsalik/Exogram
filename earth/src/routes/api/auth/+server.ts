import { getUser, setUser, verifyIdToken } from "$lib/admin/firebase/firebase";
import { error, type RequestHandler } from "@sveltejs/kit";

export const POST = (async ({ request, cookies, locals }) => {
  const { token } = await request.json();

  if (!token) return new Response("OK", { status: 200 });

  const user = await verifyIdToken(token);
  const uid = user?.uid;

  if (uid) {
    if (locals.user && locals.user.uid === uid) {
      console.log("Auth > NO OP");
      return new Response("NO OP", { status: 200 });
    }

    cookies.set("__exogram_session", token, {
      path: "/",
      secure: true,
      httpOnly: true,
      maxAge: 60 * 60,
    });

    const userData = await getUser(uid);
    if (!userData) {
      await setUser(uid, {
        name: user.name || "<NO NAME>",
        pfp: user.picture || "",
        superuser: true,
        email: user.email || "",
      });

      console.log("Auth > New User");
    } else {
      await setUser(uid, {
        ...userData,
        name: user.name || "<NO NAME>",
        pfp: user.picture || "",
        email: user.email || "",
      } as any);

      console.log("Auth > Existing User");
    }

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
