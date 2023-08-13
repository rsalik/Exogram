<script lang="ts">
  import UsersTable from "$lib/components/table/UsersTable.svelte";

  export let data;
</script>

<UsersTable data={data.users} />
