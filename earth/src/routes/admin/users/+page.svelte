<script lang="ts">
  import UsersTable from "$lib/components/table/UsersTable.svelte";

  import { adminUseUsers } from "$lib/client/firebase/database";

  const users = adminUseUsers();
</script>

{#if $users}
  <UsersTable data={$users} />
{/if}
