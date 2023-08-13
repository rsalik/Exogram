<script lang="ts">
  import { signOut, user } from "$lib/client/firebase/auth";
  import Button from "$lib/components/Button.svelte";
</script>

<svelte:head>
  <title>Exogram - Profile</title>
</svelte:head>

<div class="title">
  Profile <Button on:click={signOut}
    ><div class="sign-out">Sign Out</div></Button
  >
</div>
<div class="user-info">
	<div class="name">{$user?.displayName}</div>
</div>

<style lang="scss">

.title {
	display: flex;
	align-items: center;
}
.sign-out {
	font-size: 0.5em;

	display: inline-block;

	margin-left: 1.5rem;
	padding: 0.25em 0.5em;

	cursor: pointer;
	transition: $transition;

	color: $red;
	border: 2px solid $red;
	border-radius: $border-radius;

	&:hover {
		color: $bkg;
		background: $red;
	}
}
</style>
