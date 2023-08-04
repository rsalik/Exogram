<script lang="ts">
  import { updateUserNotificationsRead } from "$lib/client/firebase/database";
  import {
    isNotificationPanelShowing,
    type UserNotificationData,
  } from "$lib/client/saveables";
  import { flip } from "svelte/animate";
  import Button from "./Button.svelte";
  import SaveableCard from "./saveables/SaveableCard.svelte";
  import Close from "svelte-material-icons/Close.svelte";
  import { fade } from "svelte/transition";
  import type { UserData } from "$lib/client/firebase/auth";
  import UserPhoto from "./UserPhoto.svelte";

  export let notifications: UserNotificationData | null | undefined;
  export let userData: Record<string, Record<keyof UserData, string>> = {};

  $: {
    if ($isNotificationPanelShowing) updateUserNotificationsRead();
  }

  function onClickOff(e: MouseEvent) {
    if (
      $isNotificationPanelShowing &&
      !(e.target as HTMLElement).closest(".notifications-panel")
    )
      $isNotificationPanelShowing = false;
  }
</script>

<svelte:document on:click={onClickOff} />

{#if $isNotificationPanelShowing}
  <div class="notifications-panel" transition:fade={{ duration: 100 }}>
    {#if notifications && notifications.value}
      <div class="title">Notifications</div>
      {#each notifications.value as notification (notification.id)}
        <div class="notification" animate:flip={{ duration: 200 }}>
          <div class="from">
            From <div class="pfp">
              <UserPhoto
                {...userData[notification.from]}
                uid={notification.from}
              />
            </div>
            <span>{userData[notification.from].name}</span>
          </div>
          <Button
            on:click={() => {
              fetch("/api/notification/" + notification.id, {
                method: "DELETE",
              });
            }}
          >
            <div class="delete">
              <Close />
            </div>
          </Button>
          <div class="card">
            <SaveableCard
              offsetLeft={0}
              offsetTop={0}
              notification
              saveable={notification}
            />
          </div>
        </div>
      {/each}
    {:else}
      <div class="none">No Notifications</div>
    {/if}
  </div>
{/if}

<style lang="scss">
  .notifications-panel {
  	position: fixed;
  	z-index: 999;
  	top: 6em;
  	right: 6em;

  	overflow: scroll;

  	box-sizing: border-box;
  	width: 25em;
  	height: 25em;
  	padding: 0 1em;

  	border-radius: $border-radius;

  	@include blur($bkg);
  }

  .title {
  	font-size: 3em;

  	margin: 0.25em 0;

  	text-align: center;
  }

  .none {
  	font-size: 2em;
  	font-weight: $fw-bold;

  	display: flex;
  	align-items: center;
  	justify-content: center;

  	height: 100%;
  }

  .notification {
  	position: relative;

  	margin: 0.75em 0;
  	padding: 0.5em;

  	border-radius: $border-radius;
  	background: d($primary, 7);

  	.pfp {
  		font-size: 0.5em;

  		display: inline-block;

  		margin: 0 0.5em 0 0.75em;
  	}

  	.from {
  		display: flex;
  		align-items: center;

  		margin-left: 0.5em;


  		span {
  			font-weight: $fw-bold;
  		}
  	}

  	&:hover {
  		.delete {
  			visibility: visible;

  			opacity: 1;
  		}
  	}

  	.delete {
  		font-size: 1.5em;

  		position: absolute;
  		top: -0.5em;
  		right: -0.25em;

  		display: flex;
  		visibility: hidden;
  		align-items: center;
  		justify-content: center;

  		width: 1.25em;
  		height: 1.25em;

  		cursor: pointer;
  		transition: $transition;

  		opacity: 0;
  		color: $bkg;
  		border-radius: 50%;
  		background: $red;

  		&:hover {
  			background: d($red, 2);
  		}
  	}
  }
</style>
