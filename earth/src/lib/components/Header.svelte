<script lang="ts">
  import { user } from "$lib/client/firebase/auth";
  import {
    isNotificationPanelShowing,
    type UserNotificationData,
  } from "$lib/client/saveables";
  import Button from "./Button.svelte";
  import Link from "./Link.svelte";
  import UserControlButton from "./UserControlButton.svelte";
  import Bell from "svelte-material-icons/Bell.svelte";

  export let notifications: UserNotificationData | null | undefined;
</script>

<div class="header">
  <a href="/"><div class="logo">Exo<span>gram</span></div></a>

  <div class="links">
    <Link box href="/table">TICs</Link>
    <div class="sep" />
    <Link box href="/ebs">EBs</Link>
    <div class="sep" />
    <Link box href="/dictionary">Dictionary</Link>
    {#if $user && $user.admin}
      <div class="sep" />
      <Link box href="/admin">Admin</Link>
    {/if}
  </div>
  <div class="space" style:flex-grow="1" />
  {#if $user}
    <Button
      on:click={() =>
        ($isNotificationPanelShowing = !$isNotificationPanelShowing)}
    >
      <div class="notifications">
        {#if notifications && ((!notifications.read && notifications.value?.length) || (notifications.read && notifications.read < notifications.latest))}
          <div class="dot" />
        {/if}
        <Bell />
      </div>
    </Button>
  {/if}

  <div class="user">
    <UserControlButton />
  </div>
</div>

<style lang="scss">
  .header {
  	position: fixed;
  	z-index: 999;
  	top: 0;
  	right: 0;
  	left: 0;

  	display: flex;
  	align-items: center;

  	height: $header-height;
  	padding: 0 0.5rem;

  	background: d($primary, 8);

  	.links {
  		font-size: 2em;

  		display: flex;
  	}

  	.logo {
  		font-size: 3em;
  		font-weight: $fw-black;

  		margin: 0 1rem;

  		span {
  			margin: 0 0.1em;
  			padding: 0 0.2em;

  			color: $bkg;
  			border-radius: $border-radius;
  			background: $primary;
  		}
  	}

  	.user {
  		font-size: 2em;

  		margin-right: 0.5em;
  	}
  }

  .notifications {
  	font-size: 2.25em;

  	position: relative;

  	display: flex;
  	align-items: center;
  	justify-content: center;

  	margin-right: 0.5em;
  	padding: 0.25em;

  	cursor: pointer;
  	user-select: none;
  	transition: $transition;

  	border-radius: 50%;

  	.dot {
  		position: absolute;
  		top: 0.6rem;
  		right: 0.6rem;

  		width: 0.7rem;
  		height: 0.7rem;

  		transition: $transition;

  		border: 3px solid d($primary, 8);
  		border-radius: 50%;
  		background: $red;
  	}

  	&:hover {
  		background: d($primary, 5);

  		.dot {
  			border-color: d($primary, 5);
  		}
  	}

  	&:active {
  		background: d($primary, 6);

  		.dot {
  			border-color: d($primary, 6);
  		}
  	}
  }
</style>
