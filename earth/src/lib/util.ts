import type { Tic } from "$lib/api/tics";

export enum ResConverter {
  NONE,
  ARR,
  DISP_ARR,
  NOTIFICATIONS,
}

export type WithId<T> = T & { id: string };

export function resConvert(o: any, converter: ResConverter) {
  if ((o === null || o === undefined) && converter !== ResConverter.DISP_ARR)
    return o;

  switch (converter) {
    case ResConverter.ARR:
      return convertIDdObjectToArray(o);
    case ResConverter.DISP_ARR:
      console.log(o);
      if (o === null) return null;
      if (o === undefined || o.length === 0) return [];
      return convertIDdObjectToArray(o);
    case ResConverter.NOTIFICATIONS:
      return {
        read: o.read,
        value: o.value ? convertIDdObjectToArray(o.value) : o.value,
        latest: o.value ? Object.keys(o.value).sort().at(-1) : 0,
      };
    default:
      return o;
  }
}

export function exofopLinkOf(tic: string) {
  return `https://exofop.ipac.caltech.edu/tess/target.php?id=${tic}`;
}

export function fliLinkOf(tic: string) {
  return `https://fast-lightcurve-inspector.osc-fr1.scalingo.io/${tic}`;
}

export function latteLinkOf(ticId: string) {
  return `http://latte-online.flatironinstitute.org/app#ID=${ticId}`;
}

export function convertIDdObjectToArray(obj: { [key: string]: any }) {
  return Object.keys(obj).map((id) => ({ ...obj[id], id }));
}

export function stringToFixed(num: string, digits: number) {
  const flt = parseFloat(num);

  if (isNaN(flt)) {
    return num;
  }

  return flt.toFixed(digits);
}

export function nestedGet(
  obj: { [key: string | number | symbol]: any },
  path: keyof typeof obj
) {
  if (typeof path !== "string") return obj[path];
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

export function isValue(a: any) {
  return a !== null && a !== undefined;
}

export function filterTics(
  tics: Tic[],
  filter: { group?: string | number; publishedOnly?: boolean }
) {
  let filteredTics = tics;

  if (filter.group) {
    filteredTics = filteredTics.filter(
      (tic) => Number(tic.group) === Number(filter.group)
    );
  }

  if (filter.publishedOnly) {
    filteredTics = filteredTics.filter((tic) => !!tic.paperDisposition);
  }

  return filteredTics;
}

export function fileNameToEBID(fileName: string) {
  return fileName
    .split(".")[0]
    .replaceAll(/[^0-9]/g, "")
    .replace(/^0+/, "");
}

export function ebIDToFileNamePartial(id: string) {
  return `TIC${id.padStart(16, "0")}`;
}

// Firebase Keys can't contain ".", "#", "$", "/", "[", or "]"
export function encodeFirebaseKey(key: string) {
  return key
    .replaceAll(".", "%2E")
    .replaceAll("#", "%23")
    .replaceAll("$", "%24")
    .replaceAll("/", "%2F")
    .replaceAll("[", "%5B")
    .replaceAll("]", "%5D");
}

export function decodeFirebaseKey(key: string) {
  return key
    .replaceAll("%2E", ".")
    .replaceAll("%23", "#")
    .replaceAll("%24", "$")
    .replaceAll("%2F", "/")
    .replaceAll("%5B", "[")
    .replaceAll("%5D", "]");
}
