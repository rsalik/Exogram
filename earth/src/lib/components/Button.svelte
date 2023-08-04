<script lang="ts">
  import { createEventDispatcher } from "svelte";

  interface $$Events {
    click: MouseEvent | KeyboardEvent;
  }

  const dispatch = createEventDispatcher<$$Events>();
</script>

<div
  class="wrapper"
  on:click={(e) => {
    e.stopPropagation();
    dispatch("click", e);
  }}
  on:keydown={(e) => {
    if (e.key === "Enter") {
      dispatch("click", e);
    }
  }}
  role="button"
  tabindex="0"
>
  <slot />
</div>

<style lang="scss">
  .wrapper {
  	display: contents;
  }
</style>
