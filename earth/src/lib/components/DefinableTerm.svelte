<script lang="ts">
  import { fade } from "svelte/transition";

  export let str: string;
  export let term: string;
  export let definition: string | undefined = undefined;

  let hovering = false;
</script>

<div class="d-term">
  <div
    class="text"
    on:mouseenter={() => (hovering = true)}
    on:mouseleave={() => (hovering = false)}
    role="definition"
  >
    {str}
  </div>

  {#if hovering}
    <div
      class="definition"
      in:fade={{ duration: 200, delay: 500 }}
      out:fade={{ duration: 200 }}
    >
      <div class="term">
        {term}
      </div>
      {#if definition}
        <div class="value">
          {definition}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style lang="scss">
  .d-term {
  	position: relative;

  	display: inline-block;

  	cursor: help;

  	.text {
  		text-decoration: dotted underline;
  	}

  	.definition {
  		font-size: 0.7em;

  		position: absolute;
  		z-index: 1000;
  		bottom: 100%;
  		left: 50%;

  		width: max-content;
  		max-width: 20em;
  		margin: auto;
  		padding: 1em;

  		transform: translate(-50%, 0);

  		color: $color;
  		border-radius: $border-radius;

  		@include blur($bkg);

  		.term {
  			font-size: 1.7em;
  			font-weight: $fw-bold;
  		}
  	}
  }
</style>
