import { error, redirect } from "@sveltejs/kit";

export const load = async ({ data, params, fetch, depends }) => {
  depends("data:eb");

  if (!data.user) throw error(401, "You must sign in to view this page.");

  if (params.id) {
    const res = await fetch("/api/get/eb/" + params.id);

    if (res.status === 404) throw error(404, `TIC ${params.id} not found.`);
    if (res.status === 500) throw error(500, "An internal error occurred.");

    const { group, file } = await res.json();

    if (group.id !== params.group)
      throw redirect(307, `/ebs/validate/${group.id}/${params.id}`);

    return {
      static: true,
      file,
      group,
    };
  }

  const res = await fetch("/api/get/random-eb/" + params.group);

  if (res.status === 401)
    throw error(401, "You must sign in to view this page.");
  if (res.status === 404)
    throw error(401, `EB Group <span>${params.group}</span> not found.`);

  const { caching, userDone, file, groups, done } = await res.json();

  if (done) {
    return {
      done: true,
      group: { ...groups[params.group], id: params.group },
      file: null,
    };
  }

  if (caching) {
    throw redirect(307, `/ebs/caching/${params.group}`);
  }

  if (userDone) {
    return {
      group: { ...groups[params.group], id: params.group },
      static: true,
      file: null,
      userComplete: true,
    };
  }

  return {
    group: { ...groups[params.group], id: params.group },
    static: false,
    file,
  };
};
