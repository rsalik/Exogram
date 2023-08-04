import { stringToFixed } from "$lib/util";
import type { Saveable } from "$lib/client/saveables";
import type { Filters } from "./table";
import { TicShortPropertyNames } from "$lib/api/tics";

export const TicTableColumns = {
  id: "TIC ID",
  ...TicShortPropertyNames,
  "paperDisposition.disposition": "Paper Disp",
  dispositionCount: "# Disps",
};

export const TicTableFilters = {
  sectors: (s) => s.replaceAll(",", ", "),
  period: (s) => stringToFixed(s, 6),
  duration: (s) => stringToFixed(s, 2),
  depthPercent: (s) => stringToFixed(s, 3),
  rPlanet: (s) => stringToFixed(s, 2),
  rStar: (s) => stringToFixed(s, 2),
  deltaTmag: (s) => stringToFixed(s, 2),
} satisfies Filters;

export const TicTableSorters = {
  id: (a: string, b: string) => {
    return (
      parseFloat(a.replaceAll("(", ".").replaceAll(")", "")) -
      parseFloat(b.replaceAll("(", ".").replaceAll(")", ""))
    );
  },
};

export function getTicTableUrl(group: string | number, publishedOnly = false) {
  const url = new URL("/table", window.location.origin);

  if (group !== -1) {
    url.searchParams.set("group", group.toString());
  }

  if (publishedOnly) {
    url.searchParams.set("pub", "true");
  }

  return url.href;
}

export function getTicTableSaveable(
  group: string | number,
  groupName: string,
  publishedOnly = false
) {
  return {
    type: "propertied",
    link: getTicTableUrl(group, publishedOnly),
    data: {
      name: "TIC Table",
      properties: {
        Group: {
          value: groupName,
        },
        "Published Only": {
          value: publishedOnly,
        },
      },
    },
  } satisfies Omit<Saveable, "id">;
}
