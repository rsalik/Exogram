<script lang="ts">
  import {
    isSaveableCardDragging,
    isSaveableDragging,
    isSaveableDrawerShowing,
    saveables,
    type Saveable,
    forceSaveableDrawerShowing,
  } from "$lib/client/saveables";
  import { fly, fade } from "svelte/transition";
  import SaveableDropZone from "./SaveableDropZone.svelte";
  import SaveableCard from "./SaveableCard.svelte";
  import { flip } from "svelte/animate";

  import Delete from "svelte-material-icons/DeleteAlert.svelte";
  import Button from "../Button.svelte";

  let currentSaveables: Saveable[] = [];
  let prevSaveables: Saveable[] = [];

  isSaveableDrawerShowing.subscribe((v) => {
    if (v) {
      currentSaveables = [...$saveables];
    }
  });

  let ref: HTMLDivElement;

  saveables.subscribe((v) => {
    if (ref && v.length > prevSaveables.length) {
      setTimeout(() => {
        if (ref) ref.scrollTop = ref.scrollHeight;
      }, 100);
    }

    prevSaveables = v;
  });

  let offsetTop = 0,
    offsetLeft = 0;

  $: innerWidth, (offsetLeft = ref?.offsetLeft ?? 0);
  $: innerHeight, (offsetTop = ref?.offsetTop ?? 0);

  let innerWidth = 0;
  let innerHeight = 0;
</script>

<svelte:window bind:innerWidth bind:innerHeight />

{#if $isSaveableDrawerShowing || $isSaveableDragging || $isSaveableCardDragging || $forceSaveableDrawerShowing}
  <div
    class="drawer"
    in:fly={{ x: 500, duration: 350 }}
    out:fly={{ x: 500, duration: 350 }}
  >
    <div class="scroller" bind:this={ref}>
      <div class="title" in:fade={{ duration: 150, delay: 250 }}>Saved</div>
      <div class="sub" in:fade={{ duration: 150, delay: 250 }}>
        Right Click a Card to Share
      </div>
      {#if $saveables.length > 0}
        <div
          in:fade|global={{
            duration: 150,
            delay: $saveables.length === currentSaveables.length ? 250 : 0,
          }}
          out:fade|global={{ duration: 150 }}
        >
          <Button on:click={() => ($saveables = [])}>
            <div class="btn delete">
              <div class="icon"><Delete /></div>
              Remove All
            </div>
          </Button>
        </div>
      {/if}

      {#each $saveables as saveable, i (saveable.id)}
        {@const iDelay =
          $isSaveableDragging ||
          !currentSaveables.find((s) => s.id === saveable.id)
            ? 0
            : 400 + 80 * i}
        {@const oDelay = 50 * i}
        <div
          in:fade|global={{
            duration: 200,
            delay: iDelay > 1200 ? 1200 : iDelay,
          }}
          out:fade|global={{
            duration: 100,
            delay: $isSaveableCardDragging ? 0 : oDelay,
          }}
          animate:flip={{ duration: 500 }}
        >
          <SaveableCard {saveable} {offsetTop} {offsetLeft} />
        </div>
      {/each}
    </div>

    {#if $isSaveableDragging}
      <SaveableDropZone let:dropping>
        <div
          class="drop-zone"
          class:dropping
          transition:fade={{ duration: 200 }}
        >
          <div class="text">Drag to Save</div>
        </div>
      </SaveableDropZone>
    {/if}
  </div>

  {#if $isSaveableCardDragging}
    <SaveableDropZone let:dropping remove>
      <div
        class="remove-zone"
        class:dropping
        transition:fade={{ duration: 200 }}
      >
        <div class="text">Drop to Remove</div>
      </div>
    </SaveableDropZone>
  {/if}
{/if}

<style lang="scss">
  $d-bkg: d($primary, 7);
  $d-width: 37%;

  $margin: 0.5em;

  .sub {
  	margin: -1em 0 0;
  }

  .drawer {
  	position: fixed;
  	z-index: 1000;
  	top: 0;
  	right: 0;
  	bottom: 0;

  	width: $d-width;

  	color: $color;
  	box-shadow: $box-shadow;

  	@include blur($d-bkg, false);

  	.btn {
  		font-size: 1.5em;

  		display: flex;
  		align-items: center;
  		justify-content: center;

  		margin: 0.3em 0 0.5em;
  		padding: 0.5em;

  		cursor: pointer;
  		transition: $transition;

  		color: $red;
  		border: 2px solid $red;
  		border-radius: $border-radius-small;

  		.icon {
  			font-size: 1.2em;

  			display: flex;
  			align-items: center;
  			justify-content: center;

  			margin-right: 0.25em;
  		}

  		&:hover {
  			color: $bkg;
  			background: $red;
  		}
  	}
  }

  // Perhaps the greatest 5am hack of my career
  .scroller {
  	display: flex;
  	overflow: scroll;
  	align-items: center;
  	flex-direction: column;

  	box-sizing: border-box;
  	width: 100%;
  	height: 100%;
  	padding: 1em;
  }

  .drop-zone,
  .remove-zone {
  	z-index: 1010;
  	top: $margin;
  	bottom: $margin;

  	display: flex;
  	align-items: center;
  	justify-content: center;

  	transition: $transition;

  	border-radius: $border-radius;

  	.text {
  		font-size: 3em;
  		font-weight: $fw-black;
  	}
  }

  .drop-zone {
  	position: fixed;
  	right: $margin;
  	left: $margin;

  	box-sizing: border-box;
  	//width: calc($d-width - $margin * 2);

  	color: $primary;
  	border: $primary dashed 2px;

  	@include blur($d-bkg, false);

  	&.dropping {
  		border: $primary solid 2px;

  		@include blur(d($primary, 3), false);
  	}
  }

  .remove-zone {
  	position: fixed;
  	right: calc($d-width + $margin);
  	left: $margin;

  	color: $red;
  	border: $red dashed 2px;

  	@include blur($bkg, false);

  	&.dropping {
  		border: $red solid 2px;

  		@include blur(d($red, 3), false);
  	}
  }
</style>
