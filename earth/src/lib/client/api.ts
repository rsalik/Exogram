import { ResConverter, resConvert } from "$lib/util";
import type { drive_v3 } from "googleapis";

export const getTicFiles =
  createIDdGetter<drive_v3.Schema$File[]>("/api/get/tic-files");

function createGetter<T>(path: string, converter = ResConverter.NONE) {
  return async (
    f: (
      input: RequestInfo | URL,
      init?: RequestInit | undefined
    ) => Promise<Response> = fetch
  ) => resConvert(await (await f(path)).json(), converter) as T;
}

function createIDdGetter<T>(path: string, converter = ResConverter.NONE) {
  return async (
    id: string,
    f: (
      input: RequestInfo | URL,
      init?: RequestInit | undefined
    ) => Promise<Response> = fetch
  ) => resConvert(await (await f(path + "/" + id)).json(), converter) as T;
}
