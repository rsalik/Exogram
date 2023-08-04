import { getUsers } from "$lib/admin/firebase/firebase";
import { json } from "@sveltejs/kit";

export const GET = async () => {
  const users = await getUsers();

  const res = users.map((u) => ({ uid: u.id, pfp: u.pfp, name: u.name }));

  return json({ users: res });
};
