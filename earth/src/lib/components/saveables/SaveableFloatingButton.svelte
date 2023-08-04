<script lang="ts">
	import {
		isSaveableDragging,
		isSaveableDrawerShowing,
		isSaveableCardDragging
	} from '$lib/client/saveables';
	import Bookmark from 'svelte-material-icons/Bookmark.svelte';
	import Close from 'svelte-material-icons/Close.svelte';
	import Button from '$lib/components/Button.svelte';
	import { fade } from 'svelte/transition';
</script>

{#if !$isSaveableDragging && !$isSaveableCardDragging}
	<Button on:click={() => isSaveableDrawerShowing.set(!$isSaveableDrawerShowing)}>
		<div
			transition:fade={{ duration: 200 }}
			class="drop-zone"
			class:close={$isSaveableDrawerShowing}
		>
			{#if $isSaveableDrawerShowing}
				<Close />
			{:else}
				<Bookmark />
			{/if}
		</div>
	</Button>
{/if}

<style lang="scss">
	.drop-zone {
		@extend %floating-button;

		&.close {
			@include btn($red);
		}
	}
</style>
