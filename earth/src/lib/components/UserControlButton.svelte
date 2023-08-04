<script lang="ts">
  import { user } from "$lib/client/firebase/auth";
  import Link from "./Link.svelte";
</script>

<div class="user-control">
  {#if $user}
    <a class="user-image" href="/profile">
      <img src={$user.photoURL} alt="Profile" />
    </a>
  {:else}
    <Link box href="/signin">Sign In</Link>
  {/if}
</div>

<style lang="scss">
  .user-control {
  	display: flex;
  	align-items: center;
  	justify-content: center;

  	img {
  		width: 1.7em;
  		height: 1.7em;

  		border: 3px solid $primary;
  		border-radius: 50%;
  	}

  	a {
  		display: contents;
  	}
  }
</style>
