<script lang="ts">
  import { signOut } from "$lib/client/firebase/auth";
</script>

<svelte:head>
  <title>Exogram - Profile</title>
</svelte:head>

<div class="sign-out" role="button" on:click={() => signOut()}>Sign Out</div>