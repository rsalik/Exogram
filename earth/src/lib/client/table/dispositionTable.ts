import type { Saveable } from "../saveables";
import type { Filters } from "./table";

export const DispositionTableColumns = {
  name: "Name",
  disposition: "Disposition",
  comments: "Comments",
};

export const DispositionTableFilters = {
  name: (name) =>
    name === "group" ? "Group" : name === "paper" ? "Paper" : name,
} satisfies Filters;

export function getDispositionTableSaveable(
  d: any,
  id: string
): Omit<Saveable, "id"> {
  return d.name === "paper"
    ? {
        type: "propertied",
        link: `/tic/${id}`,
        data: {
          name: `Paper Disposition`,
          properties: {
            TIC: { value: id, highlight: true },
            Disposition: { value: d.disposition },
            Comments: { value: d.comments },
          },
        },
      }
    : {
        type: "propertied",
        link: `/tic/${id}`,
        data: {
          name: `Disposition`,
          properties: {
            User: { value: d.name === "group" ? "Group" : d.name },
            TIC: { value: id, highlight: true },
            Disposition: { value: d.disposition },
            Comments: { value: d.comments },
          },
        },
      };
}
