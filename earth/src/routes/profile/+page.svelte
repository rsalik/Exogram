<script lang="ts">
  import { signOut } from "$lib/client/firebase/auth";
</script>

<div class="sign-out" role="button" on:click={() => signOut()}>Sign Out</div>