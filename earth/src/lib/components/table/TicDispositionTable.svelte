<script lang="ts">
  import type { TicDisposition } from "$lib/api/tics";
  import { user } from "$lib/client/firebase/auth";
  import {
    DispositionTableColumns,
    DispositionTableFilters,
    getDispositionTableSaveable,
  } from "$lib/client/table/dispositionTable";
  import { Highlight } from "$lib/client/table/table";
  import type { WithId } from "$lib/util";
  import DefinableString from "../DefinableString.svelte";
  import Table from "../Table.svelte";

  export let id: string;

  export let dispositions: WithId<TicDisposition>[] | undefined | null;
  export let paperDisposition: TicDisposition | undefined;
  export let usernames: Record<string, string> = {};
  export let dictionary: Record<string, string>;

  $: tableData = [
    ...(dispositions
      ? dispositions.map((d) => {
          return {
            ...d,
            name: usernames[d.id] || d.id,
          };
        })
      : []),
    ...(paperDisposition ? [{name: "paper", ...paperDisposition}] : []),
  ];

  $: console.log(usernames)
</script>

<div class="disp-table">
  <Table
    secondary
    columns={DispositionTableColumns}
    filters={{
      ...DispositionTableFilters,
    }}
    highlighter={(d) => {
      if (d.name === "paper") return true;
      if (d.id === $user?.uid) return Highlight.LOW;
      return false;
    }}
    data={tableData}
    saveableData={(d) => getDispositionTableSaveable(d, id)}
    let:val
    let:col
  >
    {#if col === "name"}
      {val}
    {:else if val}
      <DefinableString str={val} {dictionary} />
    {/if}
  </Table>
</div>

<style lang="scss">
  .disp-table :global(table) {
    font-size: 1.4em;
  }
</style>
