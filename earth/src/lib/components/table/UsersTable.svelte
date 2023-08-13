<script lang="ts">
  import { adminSetIsUserSuperUser } from "$lib/client/firebase/database";
  import {
    UsersTableColumns,
    UsersTableSorters,
  } from "$lib/client/table/usersTable";
  import Button from "../Button.svelte";
  import Table from "../Table.svelte";
  import UserPhoto from "../UserPhoto.svelte";

  import { adminUseUsers } from "$lib/client/firebase/database";

  const users = adminUseUsers();
</script>

{#if $users}
  <Table
    data={$users}
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
{/if}

<style lang="scss">
  .superuser {
  	display: flex;
  	align-items: center;
  	justify-content: center;

  	padding: 0.5rem 1rem;

  	cursor: pointer;
  	transition: $transition;

  	border: 2px solid $color;
  	border-radius: $border-radius;

  	&:hover {
  		color: $bkg;
  		background: $color;
  	}

  	&.active {
  		color: $secondary;
  		border-color: $secondary;

  		&:hover {
  			color: $bkg;
  			background: $secondary;
  		}
  	}
  }
</style>
