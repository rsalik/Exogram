<script lang="ts">
  export let links: Record<string, string>;
</script>

<div class="links">
  {#each Object.keys(links) as link}
    <a href={links[link]} class="link">
      <div class="content">
        {link}
      </div>
    </a>
  {/each}
</div>

<style lang="scss">
  .links {
  	font-size: 1.5rem;

  	display: flex;
  	align-items: center;
  	justify-content: center;

  	width: 100%;

  	.link {
  		display: flex;
  		align-items: center;
  		flex-grow: 1;
  		justify-content: center;

  		margin: 0 0.2em;
  		padding: 0.2em 0.5em;

  		cursor: pointer;
  		transition: $transition;

  		border: 2px solid $color;
  		border-radius: $border-radius-small;

  		&:hover {
  			color: $bkg;
  			background: $color;
  		}
  	}
  }
</style>
