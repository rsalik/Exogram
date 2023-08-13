<script lang="ts">
  import { page } from "$app/stores";

  const tabs = [
    {
      name: "Users",
      path: "/admin/users",
    },
    {
      name: "TICs",
      path: "/admin/tics",
    },
    {
      name: "EBs",
      path: "/admin/ebs",
    },
  ];
</script>

<div class="wrapper">
<div class="title">Admin Settings</div>

<div class="admin">
  <div class="tabs">
    {#each tabs as tab, i}
      <a
        href={tab.path}
        class="tab"
        class:active={tab.path === $page.url.pathname}
      >
        {tab.name}
      </a>
      {#if i < tabs.length - 1}
        <div class="sep" />
      {/if}
    {/each}
  </div>

  <div class="content">
    <slot />
  </div>
</div>
</div>

<style lang="scss">
  .wrapper {
  	display: flex;
  	flex-direction: column;

  	height: 100%;
  }

  .admin {
  	display: flex;
  	flex-direction: column;
  	flex-grow: 1;
  }

  .tabs {
  	display: flex;
  	float: left;
  	align-items: center;

  	box-sizing: border-box;
  	width: 100%;
  	margin: 0.5em 0 1em;

  	.tab {
  		font-size: 2em;

  		flex-grow: 1;

  		box-sizing: border-box;
  		width: 100%;
  		padding: 0.25em 1em;

  		transition: $transition;

  		border: 2px solid $color;
  		border-radius: $border-radius;

  		&:hover,
  		&.active {
  			color: $bkg;
  			background: $color;
  		}
  	}
  }

  .content {
  	flex-grow: 1;
  }
</style>
