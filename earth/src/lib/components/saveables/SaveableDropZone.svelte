<script lang="ts">
	import {
		forceSaveableDrawerShowing,
		isSaveableCardDragging,
		isSaveableDragging,
		isSaveableDrawerShowing,
		saveables
	} from '$lib/client/saveables';

	export let remove = false;

	let enterCount = 0;
	$: dropping = enterCount > 0;

	function onDragEnter(e: DragEvent) {
		e.preventDefault();

		enterCount++;
	}

	function onDragLeave(e: DragEvent) {
		e.preventDefault();

		enterCount--;
	}

	function onDrop(e: DragEvent) {
		e.preventDefault();

		if (remove) {
			saveables.update((s) =>
				s.filter((s) => s.id !== parseInt(e.dataTransfer?.getData('text/json') || '-1'))
			);

			$isSaveableCardDragging = false;
		} else {
			$isSaveableDragging = false;

			const id = Date.now();
			const newSaveables = [
				...$saveables,
				{ id, ...JSON.parse(e.dataTransfer?.getData('text/json') || '') }
			];

			setTimeout(() => {
				$saveables = newSaveables;
			}, 150);

			if (!$isSaveableDrawerShowing) {
				setTimeout(() => {
					$forceSaveableDrawerShowing = false;
				}, 600);

				$forceSaveableDrawerShowing = true;
			}
		}

		enterCount = 0;
	}
</script>

<div
	on:dragenter={onDragEnter}
	on:dragleave={onDragLeave}
	on:dragover={(e) => e.preventDefault()}
	on:drop={onDrop}
	style:display="contents"
	role="button"
	tabindex="0"
>
	<slot {dropping} />
</div>
