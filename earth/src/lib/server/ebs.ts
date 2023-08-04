import {
  getEBDispositions,
  setEBGroupDone,
} from "$lib/admin/firebase/firebase";
import { getEBGroups } from "$lib/server/firebase/database";
import { redis } from "$lib/server/redis";
import { fileNameToEBID } from "$lib/util";
import {
  markEBFileAsDuplicate,
  getDoneEBFiles,
  getEBFile,
  getEBFiles,
  getDuplicateEBFiles,
  markEBFileAsDone,
} from "./drive";

export async function updateEBCache(
  group: string,
  groups: Awaited<ReturnType<typeof getEBGroups>>
) {
  if (!groups[group]) throw new Error(`Group '${group}' not found.`);

  if (groups[group].done) {
    console.log(`EB > Group '${group}' is already marked as done.`);
    return;
  }

  console.log("EB > Updating Cache for group '" + group + "'.");

  await redis.set(redisKey(group) + "_caching", 1);

  const files = await getEBFiles(group);

  redis.del(redisKey(group));

  if (files.length === 0) {
    console.log(
      `EB > 🥳 No EB files found for group '${group}'. Marking as done`
    );
    await setEBGroupDone(group, true);
    await redis.del(redisKey(group) + "_caching");
    await redis.del("ebGroups");

    return;
  }

  try {
    for (const file of files) {
      if (file.name) redis.sadd(redisKey(group), fileNameToEBID(file.name));
    }

    console.log(
      `EB > ✨ Cached ${files.length} EB files for group '${group}'.`
    );

    const doneFiles = await getDoneEBFiles(group);

    redis.del(redisKey(group, true));

    for (const file of doneFiles) {
      if (file.name)
        redis.sadd(redisKey(group, true), fileNameToEBID(file.name));
    }

    redis.sadd(redisKey(group, true), -1); // Ensure the set is not empty if there are no done files

    console.log(
      `EB > ✨ Cached ${doneFiles.length} Done EB files for group '${group}'.`
    );

    redis.set(redisKey(group) + "_lastUpdated", Date.now().toString());
  } finally {
    await redis.del(redisKey(group) + "_caching");
  }
}

export async function validateCache(
  group: string,
  groups: Awaited<ReturnType<typeof getEBGroups>>
) {
  if (!groups[group]) throw new Error(`Group '${group}' not found.`);
  if (groups[group].done) return true;

  if (await redis.exists(redisKey(group) + "_caching")) {
    console.log(`EB > Cache for group '${group}' is already being updated.`);
    return false;
  }

  if (
    !(await redis.exists(redisKey(group))) ||
    !(await redis.exists(redisKey(group, true))) ||
    !(await redis.exists(redisKey(group) + "_lastUpdated")) ||
    Date.now() -
      parseInt((await redis.get(redisKey(group) + "_lastUpdated")) || "0") >
      1000 * 60 * 60 * 24 * 3.5
  ) {
    updateEBCache(group, groups);
    return false;
  }

  return true;
}

export async function invalidateCache(group: string) {
  console.log(`EB > Invalidating Cache for group '${group}'.`);

  redis.del(redisKey(group));
  redis.del(redisKey(group, true));
  redis.del(redisKey(group) + "_lastUpdated");
}

export async function getRandomEB(
  group: string,
  groups: Awaited<ReturnType<typeof getEBGroups>>,
  uid: string
) {
  if (!groups[group]) throw new Error(`NOT FOUND`);
  if (groups[group].done) throw new Error(`DONE`);

  if (!(await validateCache(group, groups))) return false;

  let id = "" as string | null;
  let tries = 0;

  do {
    if (tries === (await redis.scard(redisKey(group)))) {
      return true;
    }

    id = await redis.srandmember(redisKey(group));

    console.log(id);

    tries++;
  } while (
    !id ||
    (await getEBDispositions(group, id))?.find((o) => o.id === uid)
  );

  console.log("Picked " + id);

  return await getEBFile(group, id);
}

export function redisKey(group: string, done = false) {
  return `eb_${group}${done ? "_done" : ""}_ids`;
}

export async function purgeDuplicateFiles(group: string) {
  console.log(
    `EB > [Duplicates] ⚠️ Purging duplicate files for group '${group}'.`
  );

  const groups = await getEBGroups();

  if (!groups[group]) throw new Error(`Group '${group}' not found.`);

  const files = await getEBFiles(group);

  const otherGroups = Object.keys(groups).filter((g) => g !== group);

  const duplicateIds: string[] = [];

  for (const file of files) {
    if (file.name && file.id) {
      const id = fileNameToEBID(file.name);
      const fileId = file.id;

      for (const otherGroup of otherGroups) {
        if (
          (await redis.sismember(redisKey(otherGroup), id)) ||
          (await redis.sismember(redisKey(otherGroup, true), id))
        ) {
          console.log(
            `EB > [Duplicates] ⚠️ Marking duplicate file '${file.name}' from ${group} (duplicate: group '${otherGroup}').`
          );

          duplicateIds.push(fileId);
          break;
        }
      }
    } else console.warn(`EB > File ${file.webViewLink} has no name or id.`);
  }

  let count = 0;
  for (let i = 0; i < duplicateIds.length; i += 10) {
    console.log(
      `EB > [Duplicates] Executing batch ${i / 10 + 1} of ${
        duplicateIds.length / 10
      } (${duplicateIds.length}).`
    );

    await Promise.all(
      duplicateIds.slice(i, i + 10).map(markEBFileAsDuplicate)
    ).then((arr) => (count += arr.filter((v) => v).length));
  }

  console.log(
    `EB > [Duplicates] ⚠️ Moved ${count} files from group '${group}'.`
  );
}

export async function verifyDuplicates() {
  console.log(`EB > Verifying duplicate files.`);

  const duplicates = await getDuplicateEBFiles();
  const groups = await getEBGroups();

  let count = 0;

  for (const file of duplicates) {
    if (file.name && file.id) {
      const id = fileNameToEBID(file.name);

      let ok = false;
      for (const group of Object.keys(groups)) {
        if (
          (await redis.sismember(redisKey(group), id)) ||
          (await redis.sismember(redisKey(group, true), id))
        ) {
          count++;
          ok = true;
          break;
        }
      }

      if (!ok) {
        console.log(
          `EB > ⚠️ File '${file.name}' is marked as duplicate but is not in any group.`
        );
      }
    } else
      console.warn(
        `EB > File ${file.webViewLink} has no name or id.`,
        file.name,
        file.id
      );
  }

  console.log(`EB > ⚠️ Verified ${count} duplicate files.`);
}

export async function markEBAsDone(group: string, id: string) {
  const groups = await getEBGroups();

  if (!groups[group]) throw new Error(`Group '${group}' not found.`);
  if (groups[group].done) return true;

  if (!(await markEBFileAsDone(group, id))) {
    throw new Error(
      `An error occurred trying to move done EB File of ID ${id} in Group ${group}.`
    );
  }

  if (!(await redis.sismember(redisKey(group), id))) {
    console.warn(
      `EB > EB ${id} was successfully moved to done, but an error occurred updating Group ${group}'s redis cache. Invalidating...`
    );
    await invalidateCache(group);
    return true;
  }

  await redis.srem(redisKey(group), id);
  await redis.sadd(redisKey(group, true), id);

  console.log(`EB > ✨ Moved EB ${id} to done for group '${group}'.`);

  return true;
}

export async function getEBGroupCompletion(
  group: string,
  groups: Awaited<ReturnType<typeof getEBGroups>>
) {
  if (!groups[group]) throw new Error(`Group '${group}' not found.`);
  if (groups[group].done)
    return {
      ratio: 1,
      total: 1,
      active: 0,
    };

  const done = (await redis.scard(redisKey(group, true))) - 1; // Subtract 1 because -1 is always in the set as a placeholder.
  const active = await redis.scard(redisKey(group));

  return {
    ratio: done / (done + active),
    total: done + active,
    active,
  };
}

export async function getGroupOfEB(id: string) {
  const groups = await getEBGroups();

  for (const groupId of Object.keys(groups)) {
    if (await redis.sismember(redisKey(groupId), id))
      return { group: { ...groups[groupId], id: groupId }, done: false };
    if (await redis.sismember(redisKey(groupId, true), id))
      return { group: { ...groups[groupId], id: groupId }, done: true };
  }

  return { group: null };
}
