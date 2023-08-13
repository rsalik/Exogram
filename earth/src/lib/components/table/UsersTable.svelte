<script lang="ts">
  import type { UserData } from "$lib/client/firebase/auth";
  import {
    UsersTableColumns,
    UsersTableSorters,
  } from "$lib/client/table/usersTable";
  import Table from "../Table.svelte";
  import UserPhoto from "../UserPhoto.svelte";

  export let data: Record<string, string>[];
</script>

<Table
  {data}
  columns={UsersTableColumns}
  sorters={UsersTableSorters}
  let:col
  let:row
  let:val
>
  {#if col === "pfp"}
    <UserPhoto uid={row.id} pfp={row.pfp} name={row.name} />
  {:else}
    {val}
  {/if}
</Table>
