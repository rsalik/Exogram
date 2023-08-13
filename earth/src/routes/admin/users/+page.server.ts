import { getUsers } from '$lib/admin/firebase/firebase.js';
import { error } from '@sveltejs/kit'

export const load = async ({ locals }) => {
  if (!locals.user?.admin) throw error(403, 'Forbidden');

  return {
    users: await getUsers()
  }
}