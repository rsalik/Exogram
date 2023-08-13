<script lang="ts">
  import { fade } from "svelte/transition";

  const defaultColorBackgrounds = [
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#5f81f5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
    "#ffeb3b",
    "#ffc107",
    "#ff9800",
    "#ff5722",
  ];

  export let name: string;
  export let pfp: string | undefined = undefined;
  export let uid: string;

  let hovering = false;

  $: color =
    defaultColorBackgrounds[hash(uid || "") % defaultColorBackgrounds.length];

  function hash(str: string) {
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    return Math.abs(hash);
  }
</script>

<div class="user-photo">
  {#if hovering}
    <div
      class="tooltip"
      in:fade={{ duration: 200, delay: 500 }}
      out:fade={{ duration: 200 }}
    >
      {name}
    </div>
  {/if}
  <div
    class="img-wrapper"
    on:mouseenter={() => (hovering = true)}
    on:mouseleave={() => (hovering = false)}
    role="definition"
  >
    {#if pfp}
      <img src={pfp} alt={name} referrerPolicy="no-referrer" />
    {:else}
      <div class="img" style:background={color}>{name[0]}</div>
    {/if}
  </div>
</div>

<style lang="scss">
  .user-photo {
  	position: relative;

  	display: inline-block;

  	margin: 0.05em 0.15em;

  	cursor: pointer;
  }

  .tooltip {
  	font-size: 1.2em;

  	position: absolute;
  	z-index: 1000;
  	bottom: 110%;
  	left: 50%;

  	width: max-content;
  	//max-width: 20em;
  	margin: auto;
  	padding: 0.5em 0.75em;

  	transform: translate(-50%, 0);

  	color: $color;
  	border-radius: $border-radius;

  	@include blur(d($primary, 7), false);

  	&:after {
  		position: absolute;
  		top: 100%;
  		left: 50%;

  		margin-left: -0.5em;

  		content: '';

  		border-width: 0.5em;
  		border-style: solid;
  		border-color: rgba(d($primary, 7), 0.8) transparent transparent
  		transparent;
  	}
  }

  .img-wrapper {
  	display: flex;
  	align-items: center;
  	justify-content: center;
  }

  img {
  	width: 3em;
  	height: 3em;

  	border-radius: 50%;

  	object-fit: cover;
  }

  .img {
  	font-size: 1.5em;
  	font-weight: $fw-semi;

  	display: flex;
  	align-items: center;
  	justify-content: center;

  	width: 2em;
  	height: 2em;

  	color: $bkg;
  	border-radius: 50%;
  }
</style>
