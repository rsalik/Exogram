<script lang="ts">
  import type { UserData } from "$lib/client/firebase/auth";
  import { createEventDispatcher } from "svelte";
  import UserPhoto from "./UserPhoto.svelte";
  import Button from "./Button.svelte";

  type User = UserData & { uid: string };

  export let users: User[];

  export let user: User | undefined = undefined;

  let value = "";

  let matches: User[] = [];
  let index = 0;

  export let placeholder = "";
  const dispatch = createEventDispatcher();

  let inputRef: HTMLInputElement;
  let completionRef: HTMLInputElement;
  let choicesRef: HTMLDivElement;

  $: {
    if (value.length > 0) {
      matches = users.filter((u) =>
        u.name.toLowerCase().startsWith(value.toLowerCase())
      );

      index = 0;

      if (matches.length > 0) {
        user = matches[0];
      } else {
        user = undefined;
      }
    } else {
      user = undefined;
      matches = [];
    }
  }

  $: user = matches[index];

  function scrollChoiceIntoView() {
    if (choicesRef) {
      const choice = choicesRef.children[
        index * 2 > choicesRef.children.length
          ? choicesRef.children.length
          : index * 2
      ] as HTMLDivElement;

      if (choice) {
        choice.children[0].scrollIntoView({ block: "nearest" });
      }
    }
  }

  function onChoiceClick() {
    dispatch("enter", user);
    value = "";
  }

  function onKeyDown(e: KeyboardEvent) {
    if (user && e.key === "Enter") {
      e.preventDefault();
      dispatch("enter", user);
      value = "";
    }

    if (user && e.key === "Tab") {
      value += user?.name.slice(value.length) ?? "";
      e.preventDefault();
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      index = (index + 1) % matches.length;
      scrollChoiceIntoView();
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      index = (index - 1 + matches.length) % matches.length;
      scrollChoiceIntoView();
    }
  }

  function syncInputScrollLeft() {
    completionRef.scrollLeft = inputRef.scrollLeft;
  }
</script>

<div class="user-picker">
  <div class="input-sec">
    <div class="input-wrapper" class:completing={matches.length > 0}>
      <!-- svelte-ignore a11y-autofocus -->
      <input
        class="input"
        type="text"
        bind:value
        {placeholder}
        autofocus
        on:keydown={onKeyDown}
        bind:this={inputRef}
        on:scroll={syncInputScrollLeft}
      />
      {#if user}
        <input
          class="completion"
          value={value + user.name.slice(value.length)}
          bind:this={completionRef}
          disabled
        />
      {/if}
    </div>
  </div>
  {#if matches.length > 0}
    <div class="other-choices" bind:this={choicesRef}>
      {#each matches as u, i}
        <Button on:click={onChoiceClick}>
          <div
            class="choice"
            class:active={u.uid === user?.uid}
            on:mouseenter={() => {
              index = i;
            }}
            tabindex="0"
            role="button"
          >
            <div class="name">
              {u.name}
            </div>
            <div class="pfp">
              <UserPhoto {...u} />
            </div>
          </div>
        </Button>

        {#if u !== matches[matches.length - 1]}
          <div class="sep">&nbsp;</div>
        {/if}
      {/each}
    </div>
  {/if}
</div>

<style lang="scss">
  .user-picker {
  	position: relative;
  	.input-sec {
  		position: relative;

  		.input-wrapper {
  			font-size: 2em;

  			border-radius: $border-radius;
  			background: a($color, 3);

  			backdrop-filter: blur(20px);
  			mix-blend-mode: lighten;

  			&.completing {
  				border-bottom-right-radius: 0;
  				border-bottom-left-radius: 0;
  			}

  			.input {
  				position: relative;
  				z-index: 3;

  				color: black;
  				background: none;

  				&::placeholder {
  					color: rgba(black, 0.5);
  				}
  			}

  			.completion {
  				position: absolute;
  				z-index: 2;
  				left: 0;

  				user-select: none;

  				color: rgba(black, 0.5);
  				background: none;
  			}

  			input {
  				box-sizing: border-box;
  				width: 100%;
  			}
  		}
  	}

  	.other-choices {
  		font-size: 0.8em;

  		position: absolute;
  		z-index: 1;
  		top: calc(4rem - 2px);
  		right: 0;
  		left: 0;

  		display: flex;
  		overflow: scroll;
  		align-items: center;
  		flex-direction: column;

  		box-sizing: border-box;
  		max-height: 15em;

  		border: 1px solid rgba(255, 255, 255, 0.18);
  		border-top: none;
  		border-bottom-right-radius: $border-radius;
  		border-bottom-left-radius: $border-radius;
  		background: a($color, 1);

  		.choice {
  			position: relative;

  			display: flex;
  			align-items: center;
  			justify-content: space-between;

  			box-sizing: border-box;
  			width: 100%;

  			cursor: pointer;
  			transition: $transition;

  			background: transparent;

  			scroll-margin-top: 0;

  			&.active {
  				.name {
  					color: a($bkg, 6);
  					background: linear-gradient(
  					45deg,
  					a($primary, 6),
  					a($quaternary, 6)
  					);
  				}
  			}

  			.name {
  				font-size: 2em;

  				width: 100%;
  				padding: 0.5em;
  				padding-right: 1.5em;

  				color: rgba(255, 255, 255, 0.421);
  			}

  			.pfp {
  				position: absolute;
  				top: 0;
  				right: 0.5em;
  				bottom: 0;

  				display: flex;
  				align-items: center;
  				justify-content: center;
  			}
  		}

  		.sep {
  			width: 100%;
  			height: 1px;
  			margin: 0 auto;

  			background: rgba(255, 255, 255, 0.18);
  		}
  	}
  }
</style>
