<script lang="ts">
  import Table from "$lib/components/Table.svelte";
  import {
    TicTableFilters,
    TicTableColumns,
    TicTableSorters,
    getTicTableUrl,
  } from "$lib/client/table/ticTable";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import type { Tic, TicGroup } from "$lib/api/tics";
  import Button from "../Button.svelte";
  import { saveable } from "$lib/client/saveables";
  import { filterTics, type WithId } from "$lib/util";
  import { getTicTableSaveable } from "$lib/client/table/ticTable";

  export let title = "TIC Table";

  export let tics: Tic[];
  export let ticGroups: WithId<TicGroup>[];

  let ticGroup = $page.url.searchParams.get("group") || -1;
  let publishedOnly = Boolean($page.url.searchParams.get("pub")) || false;

  $: groups = [{ name: "All TICs", id: -1 }, ...(ticGroups || [])];

  $: filteredTics = tics
    ? filterTics(tics, {
        group: Number(ticGroup) >= 0 ? ticGroup : undefined,
        publishedOnly,
      })
    : [];

  $: {
    if (browser) {
      goto(getTicTableUrl(ticGroup, publishedOnly), { replaceState: true });
    }
  }
</script>

<div class="heading">
  <div class="title">{title}</div>

  <div class="settings">
    <div class="setting">
      <div class="name">TIC Group</div>
      <select bind:value={ticGroup}>
        {#each groups as g}
          <option value={g.id}>{g.name}</option>
        {/each}
      </select>
    </div>
    <div class="sep">//</div>

    <div class="setting">
      <Button on:click={() => (publishedOnly = false)}>
        <div class="toggle" class:active={!publishedOnly}>All</div>
      </Button>
      <div class="sep">or</div>
      <Button on:click={() => (publishedOnly = true)}>
        <div class="toggle" class:active={publishedOnly}>Published Only</div>
      </Button>
    </div>
  </div>
</div>

<div
  use:saveable={getTicTableSaveable(
    Number(ticGroup),
    groups.find((g) => g.id === Number(ticGroup))?.name || "",
    publishedOnly
  )}
>
  <Table
    columns={TicTableColumns}
    filters={TicTableFilters}
    sorters={TicTableSorters}
    data={filteredTics}
    useLink
    saveableData={(d) => {
      return {
        type: "plain",
        link: `/tic/${d.id}`,
        data: { name: `TIC ${d.id}` },
      };
    }}
  />
</div>

<style lang="scss">
  .heading {
  	display: flex;
  	align-items: baseline;
  	justify-content: space-between;
  }
  .settings {
  	font-size: 1.5em;

  	display: inline-flex;

  	.setting {
  		display: flex;

  		margin: 0 0.3em;

  		.name {
  			margin-right: 0.5em;
  		}

  		.toggle {
  			padding: 0 0.35em;

  			cursor: pointer;
  			transition: $transition;

  			border-radius: $border-radius-small;
  			&.active,
  			&:hover {
  				color: $bkg;
  				background: $color;
  			}
  		}
  	}
  }
</style>
