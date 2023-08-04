import type { Saveable } from "$lib/client/saveables";

export const StarredEBTableSignedInColumns = {
  id: "TIC ID",
  group: "Group",
  isEB: `My Response to "Is Eclipsing Binary?`,
  isPeriodCorrect: `My Response to "Is Measured Period Correct?`,
  comments: `My Comments`,
  users: "Saved By",
};

export const StarredEBTableColumns = {
  id: "TIC ID",
  group: "Group",
  users: "Saved By",
};

export const StarredEBTableSorters = {
  users: null,
};

export function getStarredEBTableSaveable() {
  return {
    type: "plain",
    link: "/ebs/starred",
    data: {
      name: "Starred EB Table",
    },
  } satisfies Omit<Saveable, "id">;
}
