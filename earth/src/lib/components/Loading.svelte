<!-- <script lang="ts">
  export let waitFor: any[] | any;
  export let hidden = false;

  $: arr = Array.isArray(waitFor) ? waitFor : [waitFor];


  $: error = arr.filter((w) => w === null).length;
  $: loading = arr.filter((w) => w === undefined).length;
</script>

{#if error && !hidden}
  {#if $$slots.error}
    <slot name="error" />
  {:else}
    <div class="panel error">Error Loading</div>
  {/if}
{:else if loading && !hidden}
  {#if $$slots.loading}
    <slot name="loading" />
  {:else}
    <div class="panel info">Loading...</div>
  {/if}
{:else if !error && !loading}
  <slot />
{/if} -->

<div class="panel full info">Loading...</div>