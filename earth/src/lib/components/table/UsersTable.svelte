<script lang="ts">
  import { adminSetIsUserSuperUser } from "$lib/client/firebase/database";
  import {
    UsersTableColumns,
    UsersTableSorters,
  } from "$lib/client/table/usersTable";
  import Button from "../Button.svelte";
  import Table from "../Table.svelte";
  import UserPhoto from "../UserPhoto.svelte";

  export let data: Record<string, string>[];
</script>

<Table
  {data}
  columns={UsersTableColumns}
  sorters={UsersTableSorters}
  longColumns={["id"]}
  monoColumns={["id"]}
  let:col
  let:row
  let:val
>
  {#if col === "pfp"}
    <UserPhoto uid={row.id} pfp={row.pfp} name={row.name} />
  {:else if col === "superuser"}
    <Button on:click={() => adminSetIsUserSuperUser(row.id, !val)}>
      <div class="superuser" class:active={val}>
        {val ? "SuperUser" : "User"}
      </div>
    </Button>
  {:else}
    {val}
  {/if}
</Table>
