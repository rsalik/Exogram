<script lang="ts">
  import DefinableTerm from "./DefinableTerm.svelte";

  export let str: string;
  export let dictionary: Record<string, string>;

  $: arr = str
    .replaceAll(/,(?=[^\s])/g, ", ") // Add spaces to commas w/o spaces so that terms are seperated
    .split(" ")
    .map((s) => s.trim());
</script>

{#each arr as s}
  {@const v = Object.keys(dictionary).find((d) => {
    const dL = d.toLowerCase().trim();
    const sL = s.replaceAll(",", "").toLowerCase().trim();

    return (
      dL === sL ||
      dL.replaceAll("(p)", "p") === sL ||
      dL.replaceAll("(p)", "") === sL
    );
  })}
  {#if v}
    <DefinableTerm str={s} term={v} definition={dictionary[v]} />&nbsp;
  {:else}
    {s}&nbsp;
  {/if}
{/each}
