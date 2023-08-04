<script lang="ts">
  import { page } from "$app/stores";
</script>

<div class="panel semi error">
  <div class="text">{@html $page.error?.message}</div>
</div>

<style lang="scss">
  .panel.semi {
  	height: 85%;
  	margin-top: 1rem;

  	:global(span) {
  		color: $secondary;
  	}
  }
</style>
