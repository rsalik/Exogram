<script lang="ts">
  import { browser } from "$app/environment";
  import { goto, invalidate } from "$app/navigation";
  import { navigating } from "$app/stores";
  import { onMount } from "svelte";

  export let data;

  let interval: any;

  onMount(() => {
    interval = setInterval(() => {
      invalidate("data:cache");
    }, 1000);
  });

  $: if (!$navigating && browser) {
    if (!data.caching) {
      if (interval) clearInterval(interval);

      goto("/ebs/validate/" + data.group);
    }
  }
</script>

<div class="panel semi">
  Loading EB...
  <div class="sub">Please allow a minute for the cache to update</div>
</div>
