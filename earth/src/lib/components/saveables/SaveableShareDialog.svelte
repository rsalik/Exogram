<script lang="ts">
  import { saveableCrossfade, sharingSaveable } from "$lib/client/saveables";
  import { fade } from "svelte/transition";
  import SaveableCard from "./SaveableCard.svelte";
  import UserPicker from "../UserPicker.svelte";
  import { useAllUserData } from "$lib/client/firebase/database";
  import type { Readable } from "svelte/store";
  import type { UserData } from "$lib/client/firebase/auth";
  import UserPhoto from "../UserPhoto.svelte";
  import Button from "../Button.svelte";
  import { flip } from "svelte/animate";
  import { ToastType, createToast } from "$lib/client/toasts";

  function onClickOff() {
    $sharingSaveable = null;
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.shiftKey && e.key === "Enter") submit();

    if (e.key === "Escape") onClickOff();
  }

  async function submit() {
    if ($sharingSaveable && selectedUsers.length) {
      const res = await fetch("/api/notify", {
        method: "POST",
        body: JSON.stringify({
          saveable: $sharingSaveable,
          users: selectedUsers.map((u) => u.uid),
        }),
      });

      if (res.ok) {
        createToast(
          ToastType.SUCCESS,
          "Shared",
          `Successfully shared <span>${
            $sharingSaveable?.data.name
          }</span> with <span>${
            selectedUsers.length === 1
              ? selectedUsers[0].name + "</span>"
              : `${selectedUsers.length} users</span>`
          }`
        );
        $sharingSaveable = null;
      } else {
        createToast(
          ToastType.ERROR,
          "Error",
          `Failed to share <span>${$sharingSaveable?.data.name}</span>`
        );
      }
    }
  }

  let users: Readable<Record<keyof UserData | "uid", string>[]>;
  let selectedUsers: Record<keyof UserData | "uid", string>[] = [];

  $: selectedUsers = selectedUsers.filter(
    (u, i) => selectedUsers.indexOf(u) === i
  );

  $: {
    if ($sharingSaveable) {
      if (!users) users = useAllUserData();

      selectedUsers = [];
    }
  }
</script>

<svelte:document on:keydown={onKeyDown} />
<svelte:body style:overflow={$sharingSaveable !== null ? "hidden" : ""} />

{#if $sharingSaveable}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="wrapper"
    on:mousedown={onClickOff}
    transition:fade={{ duration: 200 }}
  >
    <div class="share">
      <div class="title" tabindex="-1">Share</div>
      <div class="main" tabindex="-1" on:mousedown={(e) => e.stopPropagation()}>
        <div class="card" transition:saveableCrossfade={{ duration: 300 }}>
          <SaveableCard
            saveable={$sharingSaveable}
            offsetLeft={0}
            offsetTop={0}
            noDrag
          />
        </div>
        <div class="sep" />
        <div class="users-card">
          {#if selectedUsers.length}
            <div>
              <div class="title">
                Recepients
                <div class="sub">Click to remove</div>
              </div>
              <div class="users">
                {#each selectedUsers as user (user.uid)}
                  <div
                    animate:flip={{ duration: 300 }}
                    transition:fade={{ duration: 200 }}
                  >
                    <Button
                      on:click={() =>
                        (selectedUsers = selectedUsers.filter(
                          (u) => u.uid !== user.uid
                        ))}
                    >
                      <div class="user">
                        <UserPhoto {...user} />
                      </div>
                    </Button>
                  </div>
                {/each}
              </div>
            </div>

            <Button on:click={submit}>
              <div class="btn">
                Share
                <div class="keys">
                  <kbd class="shift">Shift</kbd>
                  <kbd>
                    <span class="enter">↵</span>
                  </kbd>
                </div>
              </div>
            </Button>
          {:else}
            <div class="none">Select Users</div>
          {/if}
        </div>
      </div>
      <div class="user-picker" on:mousedown={(e) => e.stopPropagation()}>
        <UserPicker
          users={$users.filter(
            (u) => !selectedUsers.find((u2) => u2.uid === u.uid)
          )}
          on:enter={(e) => (selectedUsers = [...selectedUsers, e.detail])}
          placeholder="Share with..."
        />
      </div>
    </div>

    <div class="instr">Click anywhere or press ESC to close</div>
  </div>
{/if}

<style lang="scss">
  .wrapper {
  	position: fixed;
  	z-index: 2001;
  	top: 0;
  	right: 0;
  	bottom: 0;
  	left: 0;

  	display: flex;
  	align-items: center;
  	justify-content: center;

  	background: linear-gradient(45deg, a($primary, 5), a($quaternary, 5));

  	backdrop-filter: blur(30px) brightness(0.8);

  	.share {
  		display: flex;
  		align-items: center;
  		flex-direction: column;
  		justify-content: center;

  		margin-top: -5em;

  		:global(.card) {
  			margin: 0;
  		}
  	}

  	.title {
  		width: 100%;

  		text-align: left;

  		color: $bkg;
  	}

  	.main {
  		display: flex;
  	}

  	.card {
  		display: flex;
  		align-items: center;
  		flex-direction: column;
  	}

  	.users-card {
  		display: flex;
  		flex-direction: column;
  		flex-wrap: wrap;
  		justify-content: space-between;

  		width: 20em;
  		padding: 1em;

  		transition: $transition;

  		border: 1px solid rgba(255, 255, 255, 0.18);
  		border-radius: $border-radius;
  		background: a($color, 1);

  		.title {
  			font-size: 2em;

  			margin-bottom: 0.25em;

  			color: $color;

  			mix-blend-mode: darken;

  			.sub {
  				font-size: 0.5em;
  				font-weight: $fw-semi;

  				margin: -0.5em 0 0.5em;
  			}
  		}

  		.users {
  			display: flex;
  			align-items: center;
  			flex-wrap: wrap;

  			width: 100%;

  			:global(.user-photo) {
  				margin: 0.125em;
  			}
  		}

  		.user {
  			display: flex;
  			align-items: center;
  			justify-content: center;
  		}

  		.btn {
  			font-size: 1.5em;

  			position: relative;

  			display: flex;
  			align-items: center;
  			justify-content: center;

  			box-sizing: border-box;
  			width: 100%;
  			margin-top: 2em;
  			padding: 0.25em;

  			cursor: pointer;
  			transition: $transition;

  			color: $primary;
  			border: 2px solid $primary;
  			border-radius: $border-radius-small;

  			&:hover {
  				color: $bkg;
  				background: $primary;

  				kbd {
  					opacity: 0;
  				}
  			}

  			.keys {
  				position: absolute;
  				top: 0;
  				right: 0.25em;
  				bottom: 0;

  				display: flex;
  				align-items: center;

  				kbd {
  					font-size: 0.75em;

  					width: 1.5em;
  					height: 1.5em;

  					transition: $transition;

  					&.shift {
  						width: 3em;
  						margin-right: 0.25em;
  					}
  				}
  			}
  		}

  		.none {
  			font-size: 2em;
  			font-weight: $fw-bold;

  			display: flex;
  			align-items: center;
  			justify-content: center;

  			width: 100%;
  			height: 100%;

  			color: white;

  			mix-blend-mode: darken;
  		}
  	}

  	.user-picker {
  		width: 100%;
  		margin-top: 0.5em;
  	}

  	.instr {
  		font-size: 1.6em;
  		font-weight: $fw-bold;

  		position: absolute;
  		right: 0;
  		bottom: 1em;
  		left: 0;

  		text-align: center;

  		color: a($bkg, 4);

  		mix-blend-mode: luminosity;
  	}
  }
</style>
