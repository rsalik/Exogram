import { ResConverter, resConvert, type WithId } from "$lib/util";
import type { TicGroup, Tic } from "$lib/api/tics";
import { redis } from "../redis";
import { get, ref, set } from "firebase/database";
import { db } from "$lib/firebase";
import type { EBGroup } from "$lib/api/ebs";

const fbGetTics = async () => getter<Record<string, Tic>>("tics");

export const getTicsLastModified = async () =>
  getter<number>("ticsLastModified");

export const getEBDispCounts = async () =>
  getter<Record<string, number>>("ebDispCount");

export const getEBDispCount = async (uid: string) =>
  getter<number>(["ebDispCount", uid]);

export const getDictionary = async () =>
  getter<Record<string, string>>("dictionary", 60 * 60 * 24);

export const getEBGroups = async () =>
  getter<Record<string, EBGroup>>("ebGroups", 600);

export const getSavedEBs = async () =>
  getter<Record<string, Record<string, any>>>("savedEBs");

export const getTicGroups = async () =>
  getter<WithId<TicGroup>[]>("ticGroups", 600, ResConverter.ARR);

export async function getTic(id: string) {
  return (await getTics())[id];
}

export async function getTics(): Promise<Record<string, Tic>> {
  const ticsLastModified = await redis.get("ticsLastModified");
  const serverLastModified = await getTicsLastModified();

  if (
    !ticsLastModified ||
    Number(ticsLastModified) < Number(serverLastModified)
  ) {
    console.log("TICs > Cache is stale. Updating...");

    const tics = await fbGetTics();
    redis.set("tics", JSON.stringify(tics));
    redis.set("ticsLastModified", serverLastModified);

    return tics;
  }

  const cached = await redis.get("tics");
  if (cached) {
    console.log("TICs > Cache hit.");
    return JSON.parse(cached);
  }

  console.warn("Cache miss. Updating...");

  const tics = await getTics();
  redis.set("tics", JSON.stringify(tics));
  redis.set("ticsLastModified", serverLastModified);

  return tics;
}

async function getter<T = string>(
  path: string | string[],
  ttl = 0,
  converter: ResConverter = ResConverter.NONE
) {
  if (path instanceof Array) path = path.join("/");

  if (ttl > 0) {
    const cached = await redis.get(path);
    if (cached) return JSON.parse(cached) as T;
  }

  const res = resConvert((await get(ref(db, path))).val(), converter) as T;

  if (ttl > 0) redis.set(path, JSON.stringify(res), "EX", ttl);

  return res as T;
}

async function setter(path: string[] | string, val: any, usedCache = false) {
  if (path instanceof Array) path = path.join("/");

  if (usedCache) redis.del(path);

  return await set(ref(db, path), val);
}
