<script lang="ts">
  import Search from "svelte-material-icons/Magnify.svelte";
  import ChevronRight from "svelte-material-icons/ChevronRight.svelte";
  import { goto } from "$app/navigation";
  import Button from "$lib/components/Button.svelte";
  import { navigating } from "$app/stores";
    import { sharingSaveable } from "$lib/client/saveables";

  let searchText = "";

  $: searchText = searchText.replaceAll(/[^\d]/gm, "");

  function search() {
    goto(`/ebs/lookup/${searchText}`);
    searchText = "";
  }

  function keydown(e: KeyboardEvent) {
		if ($sharingSaveable) return;

    if (e.key === "Enter") {
      search();
    }
  }

  $: loading = $navigating && $navigating.to?.url.pathname.startsWith("/ebs");
</script>

<div class="title">
  <div class="text">EB Lookup</div>
  <div class="input-sec">
    <div class="input">
      <div class="icon"><Search /></div>
      <input
        type="text"
        placeholder="TIC ID"
        bind:value={searchText}
        on:keydown={keydown}
      />
      <kbd>
        <span class="enter">↵</span>
      </kbd>
    </div>
    <Button on:click={search}>
      <div class="btn">
        <ChevronRight />
      </div>
    </Button>
  </div>
</div>

{#if loading}
  <div class="panel full">Loading</div>
{:else}
  <slot />
{/if}

<style lang="scss">
  .title {
  	display: flex;
  	align-items: center;
  	justify-content: space-between;

  	.input-sec {
  		font-size: 0.5em;

  		position: relative;

  		display: flex;

  		height: 2em;

  		.icon {
  			font-size: 1.5em;

  			position: absolute;
  			top: 0;
  			bottom: 0;
  			left: 0.15em;

  			display: flex;
  			align-items: center;

  			color: $bkg;
  		}

  		.input {
  			position: relative;

  			kbd {
  				position: absolute;
  				top: 0.125em;
  				right: 0.125em;
  				bottom: 0;

  				display: inline-flex;
  				align-items: center;
  				justify-content: center;

  				width: 1.6em;
  				height: 1.6em;

  				user-select: none;

  				color: $bkg;
  				border-radius: $border-radius-small;
  				background: $primary;

  				filter: drop-shadow(0 0.15em 0 d($primary, 4));
  			}
  		}

  		.btn {
  			font-size: 2em;

  			display: flex;
  			align-items: center;
  			justify-content: center;

  			width: 1em;
  			height: 1em;
  			margin-left: 0.1em;

  			cursor: pointer;
  			transition: $transition;

  			color: $bkg;
  			border-radius: $border-radius-small;
  			background: $secondary;

  			&:hover {
  				background: d($secondary);
  			}
  		}

  		input {
  			padding-left: 2em;
  		}
  	}
  }

  .panel.full {
  	height: 85%;
  	margin-top: 1rem;
  }
</style>
