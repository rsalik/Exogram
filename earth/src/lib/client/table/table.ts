import type { SvelteComponent } from "svelte";

export type Filters = Record<string, (s: string) => string | SvelteComponent>;

export enum Highlight {
  NONE,
  HIGH,
  LOW,
}
