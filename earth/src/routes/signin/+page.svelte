<script>
    import { goto } from "$app/navigation";
  import SignIn from "$lib/components/SignIn.svelte";

  import "firebaseui/dist/firebaseui.css";
    import { onMount } from "svelte";

  onMount(() => {
    goto('/profile');
  });
</script>

<div class="panel">
  <div class="title">Sign In</div>
  <SignIn />
</div>
