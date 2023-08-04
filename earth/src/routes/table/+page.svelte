<script>
  import Loading from "$lib/components/Loading.svelte";
  import TicTable from "$lib/components/table/TicTable.svelte";

  export let data;
</script>

<svelte:head>
  <title>Exogram - TIC Table</title>
</svelte:head>

{#await data.streamed.tics}
  <Loading />
{:then tics}
  <TicTable ticGroups={data.ticGroups} {tics} />
{/await}
