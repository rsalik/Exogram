<script lang="ts">
  import { beforeNavigate } from "$app/navigation";
  import Button from "$lib/components/Button.svelte";
  import { onDestroy, onMount } from "svelte";
  import { fade } from "svelte/transition";

  const emojis = ["🪐", "☄️", "🔭", "🚀", "🌑", "🌎", "🛰️", "💫", "☀️"];

  let confetti = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    x: Math.random() * 90 + 5,
    y: -20 + Math.random() * 10,
    size: Math.random() * 6 + 1,
    emoji: emojis[Math.floor(Math.random() * emojis.length)],
  }));

  let motion = true;

  let intervals: any[] = [];

  onMount(() => {
    confetti.forEach((p) => {
      intervals.push(
        setInterval(() => {
          if (!motion) return;

          confetti[p.id].y += p.size * 0.3;
          if (p.y > 105) {
            confetti[p.id].y = -20;
            confetti[p.id].x = Math.random() * 90 + 5;
            confetti[p.id].emoji =
              emojis[Math.floor(Math.random() * emojis.length)];
          }
        }, 1000 / 60)
      );
    });
  });

  beforeNavigate(() => {
    intervals.forEach((i) => clearInterval(i));
  });

  onDestroy(() => {
    intervals.forEach((i) => clearInterval(i));
  });
</script>

<svelte:head>
  <title>Exogram</title>
</svelte:head>

<!-- Display Emojis at Random Position and Size -->
<div class="page">
  {#if motion}
    {#each confetti as con}
      {#if con.y < 110}
        <div
          transition:fade|global={{ duration: 200 }}
          class="emoji"
          style:top={`${con.y}%`}
          style:left={`${con.x}%`}
          style:font-size={`${con.size}em`}
          style:z-index={Math.floor(con.size * 100)}
        >
          {con.emoji}
        </div>
      {/if}
    {/each}
  {/if}

  <div class="title" transition:fade={{ duration: 200 }}>
    Welcome to Exogram!
  </div>

  <Button on:click={() => (motion = !motion)}>
    <div class="motion-toggle">
      {motion ? "Stop" : "Start"} Motion
    </div>
  </Button>
</div>

<style lang="scss">
  .page {
  	position: relative;

  	width: 100%;
  	height: 100%;

  	.emoji {
  		position: absolute;

  		user-select: none;
  		pointer-events: none;
  	}

  	.motion-toggle {
  		font-size: 2em;
  		font-weight: $fw-bold;

  		position: absolute;
  		z-index: 1000;
  		bottom: 0rem;
  		left: 0rem;

  		padding: 0.5em;

  		cursor: pointer;
  		transition: $transition;

  		color: $red;
  		border: 2px solid $red;
  		border-radius: $border-radius;
  		background: $bkg;

  		&:hover {
  			color: $bkg;
  			border-color: $red;
  			background: $red;
  		}
  	}
  }
</style>
