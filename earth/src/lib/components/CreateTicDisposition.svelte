<script lang="ts">
  import Check from "svelte-material-icons/Check.svelte";
  import Delete from "svelte-material-icons/Delete.svelte";
  import Button from "./Button.svelte";
  import type { TicDisposition } from "$lib/api/tics";
  import { createEventDispatcher } from "svelte";

  const dispositions = ["PC", "FP", "pFP"];

  export let userDisposition: TicDisposition | undefined = undefined;

  export let quickAdds: string[];
  let disposition = userDisposition?.disposition || "PC";
  let comments = userDisposition?.comments || "";

  const dispatch = createEventDispatcher();

  function set() {
    dispatch("set", { disposition, comments });
    disposition = "PC";
    comments = "";
  }

  function del() {
    dispatch("delete");
    disposition = "PC";
    comments = "";
  }
</script>

<form on:submit|preventDefault={set}>
  <select name="disposition" bind:value={disposition}>
    {#each dispositions as d}
      <option value={d}>{d}</option>
    {/each}
  </select>
  <input
    type="text"
    name="comments"
    placeholder="Comments"
    bind:value={comments}
  />
  <button><Check /></button>
  {#if userDisposition}
    <button class="delete" on:click|preventDefault={del}><Delete /></button>
  {/if}
</form>

{#if quickAdds}
  <div class="quick-adds">
    {#each quickAdds as q}
      <Button
        on:click={() => {
          comments += comments.length ? ", " + q : q;
        }}><div class="quick-add">{q}</div></Button
      >
    {/each}
  </div>
{/if}

<style lang="scss">
  $h: 3rem;

  form {
    font-size: 1.5em;

    display: flex;
    align-items: stretch;
    justify-content: center;

    height: $h;
    margin: 0.25em auto;

    select {
      font-size: 1em;
      font-weight: $fw-bold;
    }

    input {
      width: 20em;
    }

    button {
      font-size: 1.25em;

      display: flex;
      align-items: center;
      justify-content: center;

      width: $h;
      height: $h;
      margin: 0 0.55rem;

      cursor: pointer;
      transition: $transition;

      color: $bkg;
      border: none;
      border-radius: $border-radius-small;
      background: $secondary;

      &.delete {
        margin: 0;

        background: $red;

        &:hover {
          background: d($red);
        }
      }

      &:hover {
        background: d($secondary);
      }
    }
  }

  .quick-adds {
    display: grid;

    margin: 2em 5em 0;

    border-radius: $border-radius-small;
    background: d($secondary, 3);

    grid-template-columns: repeat(5, 1fr);

    .quick-add {
      font-size: 1.3em;

      display: flex;
      justify-content: center;

      padding: 0.75em 0;

      cursor: pointer;
      transition: $transition;

      border-radius: $border-radius-small;

      &:hover {
        color: $bkg;
        background: d($secondary);
      }
    }
  }
</style>
