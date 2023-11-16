import { flattenFolder } from '$lib/server/drive.js';
import { error, json } from '@sveltejs/kit';

export const GET = async ({ locals }) => {
  if (!locals.user?.admin) throw error(403, "Forbidden");

  try {await flattenFolder('tic_files'); }
  catch (e) { console.error(e); return json({ success: false }); }

  return json({ success: true });
};