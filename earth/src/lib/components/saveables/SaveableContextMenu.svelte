<script lang="ts">
  import {
    sharingSaveable,
    type Saveable,
    saveableTransitionOrigin,
    saveables,
  } from "$lib/client/saveables";
  import Share from "svelte-material-icons/ShareVariant.svelte";
  import Remove from "svelte-material-icons/Delete.svelte";
  import Button from "../Button.svelte";

  export let x: number;
  export let y: number;

  export let node: HTMLElement;

  export let saveable: Omit<Saveable, "id"> & { id?: number };
  export let id: number;
  export let notification = false;

  let ref: HTMLElement;

  function share() {
    $sharingSaveable = {
      ...saveable,
      id: saveable.id ?? Date.now(),
    } as Saveable;

    const b = node.getBoundingClientRect();
    $saveableTransitionOrigin = {
      x: b.left,
      y: b.top,
    };
  }

  function remove() {
    $saveables = $saveables.filter((s) => s.id !== saveable.id);
  }
</script>

<div
  class="context-menu"
  id={"$$SAVEABLECM/" + id}
  style:top={`${y}px`}
  style:left={`${x}px`}
  bind:this={ref}
>
  <div class="name">{@html saveable.data.name}</div>
  <Button on:click={share}>
    <div class="action">
      <Share />
      <div class="text">Share</div>
    </div>
  </Button>
  {#if saveable.id && !notification}
    <Button on:click={remove}>
      <div class="action">
        <Remove />
        <div class="text">Remove</div>
      </div>
    </Button>
  {/if}
</div>

<style lang="scss">
  .context-menu {
  	font-size: 1.7em;
  	font-weight: $fw-semi;

  	position: fixed;
  	z-index: 2000;

  	display: flex;
  	align-items: center;
  	flex-direction: column;
  	justify-content: center;

  	padding: 0.2em;

  	border-radius: $border-radius;

  	@include blur(d($tertiary, 5));

  	.name {
  		font-size: 0.6em;
  		font-weight: $fw-bold;

  		padding: 0.15em 1.5em;

  		white-space: nowrap;
  	}

  	.action {
  		display: flex;
  		align-items: center;

  		box-sizing: border-box;
  		width: 100%;
  		padding: 0.3em 0.4em;

  		cursor: pointer;
  		transition: $transition;

  		border-radius: $border-radius;

  		.text {
  			margin-left: 0.3em;
  		}

  		&:hover {
  			background: d($tertiary, 3);
  		}
  	}
  }
</style>
