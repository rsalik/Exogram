<script lang="ts">
  import {
    isSaveableCardDragging,
    SaveableCardType,
    type Saveable,
    saveableContextMenu,
    isSaveableDragging,
  } from "$lib/client/saveables";
  import Button from "$lib/components/Button.svelte";

  export let saveable: Saveable;
  $: data = saveable.data as any;

  let dragging = false;
  export let noDrag = false;
  export let notification = false;

  export let offsetTop = 0,
    offsetLeft = 0;

  function onDragStart(e: DragEvent) {
    if (noDrag) return;

    dragging = true;
    if (notification) {
      $isSaveableDragging = true;
      e.dataTransfer?.setData(
        "text/json",
        JSON.stringify({ ...saveable, id: Date.now() })
      );
      return;
    }

    $isSaveableCardDragging = true;

    e.dataTransfer?.setData("text/plain", saveable.link);
    e.dataTransfer?.setData("text/json", saveable.id.toString());
  }

  function onDragEnd() {
    if (noDrag) return;

    if (notification) $isSaveableDragging = false;
    else $isSaveableCardDragging = false;

    dragging = false;
  }
</script>

<Button
  on:click={() => {
    window.open(saveable.link, "_blank");
  }}
>
  <div
    class="card"
    class:dragging
    draggable={!noDrag}
    on:dragstart={onDragStart}
    on:dragend={onDragEnd}
    use:saveableContextMenu={{ saveable, notification, offsetTop, offsetLeft, card: true }}
    tabindex="0"
    role="link"
  >
    <svelte:component this={SaveableCardType[saveable.type]} {data} />
  </div>
</Button>

<style lang="scss">
  .card {
  	display: flex;
  	align-items: center;
  	flex-direction: column;
  	justify-content: center;

  	min-width: 15em;
  	max-width: 28em;
  	margin: 0.25em;
  	padding: 1em;

  	cursor: grab;
  	user-select: none;

  	border-radius: $border-radius;
  	background: d($primary, 5);

  	&.dragging {
  		opacity: 0.4;
  	}
  }
</style>
