<script lang="ts">
  import { ToastType, type Toast } from "$lib/client/toasts";

  import CheckCircle from "svelte-material-icons/CheckCircle.svelte";
  import Information from "svelte-material-icons/InformationVariant.svelte";
  import AlertCircle from "svelte-material-icons/AlertCircle.svelte";
  import { fade } from "svelte/transition";

  export let data: Toast;
</script>

<div
  class={`toast ${data.type.toString()}`}
  transition:fade|global={{ duration: 200 }}
>
  <div class="icon">
    {#if data.type === ToastType.SUCCESS}
      <CheckCircle />
    {:else if data.type === ToastType.INFO}
      <Information />
    {:else if data.type === ToastType.ERROR}
      <AlertCircle />
    {/if}
  </div>
  <div class="text">
    <div class="name">{data.name}</div>
    <div class="message">{@html data.message}</div>
  </div>
</div>

<style lang="scss">
  .toast {
  	font-size: 1.2em;

  	display: flex;

  	width: 20em;
  	margin-top: 0.5em;
  	padding: 0.75em 1em;

  	border-radius: $border-radius;
  	box-shadow: $box-shadow;

  	&.info {
  		@include blur(d($primary, 5));
  	}

  	&.success {
  		color: $bkg;

  		@include blur($green);
  	}

  	&.error {
  		color: $bkg;

  		@include blur($red);
  	}

  	.icon {
  		font-size: 3em;

  		display: flex;
  		align-items: center;

  		margin-right: 0.25em;
  	}

  	.text {
  		display: flex;
  		flex-direction: column;

  		.name {
  			font-size: 1.3em;
  			font-weight: $fw-bold;
  		}

  		.message {
  			line-height: 1.2em;

  			:global(span) {
  				font-weight: $fw-bold;

  				white-space: nowrap;
  			}
  		}
  	}
  }
</style>
