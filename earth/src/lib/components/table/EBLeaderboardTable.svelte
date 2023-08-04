<script lang="ts">
  import { EBLeaderboardTable } from "$lib/client/table/ebLeaderboardTable";
  import Table from "../Table.svelte";

  export let data: Record<string, number>;
  export let usernames: Record<string, string>;

  $: tableData = Object.keys(data)
    .sort((a, b) => data[b] - data[a])
    .map((uid, i) => ({
      name: usernames[uid],
      count: data[uid],
      rank: i + 1,
    })).splice(0, 10);
</script>

<Table columns={EBLeaderboardTable} data={tableData} />
