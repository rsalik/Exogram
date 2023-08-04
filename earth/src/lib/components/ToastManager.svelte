<script lang="ts">
  import { toasts } from "$lib/client/toasts";
    import { flip } from "svelte/animate";
  import Toast from "./Toast.svelte";
</script>

{#if $toasts.length > 0}
  <div class="toasts">
    {#each $toasts.sort((a, b) => a.id - b.id) as toast (toast.id)}
      <div animate:flip={{ duration: 200}}>
        <Toast data={toast} />
      </div>
    {/each}
  </div>
{/if}

<style>
  .toasts {
  	position: fixed;
  	z-index: 3000;
  	bottom: 0;
  	left: 0;

  	display: flex;
  	align-items: flex-end;
  	flex-direction: column;

  	padding: 1rem;
  }
</style>
