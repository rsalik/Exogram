<script lang="ts">
  import { navigating } from "$app/stores";
  import type { EBDisposition } from "$lib/api/ebs.js";
  import { useUserEBDisposition } from "$lib/client/firebase/database.js";
  import Loading from "$lib/components/Loading.svelte";
  import StarredEBTable from "$lib/components/table/StarredEBTable.svelte";

  export let data;
  let userDispositions: Record<string, EBDisposition> = {};

  Object.keys(data.ebs).forEach((id) => {
    useUserEBDisposition(data.ebs[id].group, id).subscribe((d) => {
      if (d) userDispositions[id] = d;
    });
  });

  $: loading =
    $navigating && $navigating.to?.url.pathname.startsWith("/ebs/lookup");
</script>

<svelte:head>
  <title>Exogram - Starred EBs</title>
</svelte:head>

{#if loading}
  <Loading />
{:else}
  <StarredEBTable
    ebs={data.ebs}
    groups={data.groups}
    userData={data.userData}
    {userDispositions}
  />
{/if}
