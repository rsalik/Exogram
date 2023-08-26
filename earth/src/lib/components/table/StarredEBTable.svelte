<script lang="ts">
  import type { EBDisposition, EBGroup } from "$lib/api/ebs";
  import {  user, type UserData } from "$lib/client/firebase/auth";
  import { saveable } from "$lib/client/saveables";
  import {
    StarredEBTableColumns,
    StarredEBTableSignedInColumns,
    StarredEBTableSorters,
    getStarredEBTableSaveable,
  } from "$lib/client/table/starredEBTable";
  import Button from "../Button.svelte";
  import Table from "../Table.svelte";
  import UserPhoto from "../UserPhoto.svelte";

  export let groups: Record<string, EBGroup>;
  export let ebs: Record<string, { group: string, uids: string[] }>;
  export let userDispositions: Record<string, EBDisposition> | undefined =
    undefined;
  export let userData: Record<
    string,
    UserData
  > = {};

  let tableData: any[] = [];

  function mapper(id: string) {
    return {
      id,
      users: ebs[id].uids,
      group: groups[ebs[id].group].name,
      ...(userDispositions?.[id] ?? {}),
    };
  }

  $: userDispositions,
    (tableData = global
      ? Object.keys(ebs).map(mapper)
      : Object.keys(ebs)
          .map(mapper)
          .filter((d) => d.users.includes($user?.uid || "")));

  let global = false;
</script>

<div class="header">
  <div class="title">Starred EBs</div>

  {#if $user}
    <div class="toggles">
      <Button on:click={() => (global = false)}
        ><div class="toggle" class:active={!global}>My Saved EBs</div></Button
      >
      <div class="sep">or</div>
      <Button on:click={() => (global = true)}
        ><div class="toggle" class:active={global}>
          Globally Saved EBs
        </div></Button
      >
    </div>
  {/if}
</div>

<div use:saveable={getStarredEBTableSaveable()}>
  <Table
    columns={$user ? StarredEBTableSignedInColumns : StarredEBTableColumns}
    data={tableData}
    sorters={StarredEBTableSorters}
    useLink
    saveableData={(d) => ({
      type: "plain",
      link: "/ebs/lookup/" + d.id,
      data: {
        name: "<span>EB</span> TIC " + d.id,
      },
    })}
    let:col
    let:val
  >
    {#if col === "users"}
      <div class="users">
        {#each val as uid}
          <UserPhoto
            name={userData[uid]?.["name"]}
            pfp={userData[uid]?.["pfp"]}
            {uid}
          />
        {/each}
      </div>
    {:else if col === "isEB" || col === "isPeriodCorrect"}
      {#if val}
        <div class="yes">Yes</div>
      {:else if val === false}
        <div class="no">No</div>
      {/if}
    {:else}
      <div class="val">{val || ""}</div>
    {/if}
  </Table>
</div>

<style lang="scss">
  .header {
  	display: flex;
  	align-items: center;
  	justify-content: space-between;

  	.toggles {
  		font-size: 1.5em;

  		display: flex;

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

  .yes,
  .no {
  	font-weight: $fw-semi;
  }

  .yes,
  .no,
  .val {
  	font-size: 1.1em;
  }

  .yes {
  	color: $green;
  }

  .no {
  	color: $red;
  }
</style>
