<script>
  import Link from "$lib/components/Link.svelte";
</script>

<div class="btns">
  <Link href="/api/admin/eb-csv" newTab box>Export All as CSV</Link>
</div>

<style lang="scss">
  .btns {
  	font-size: 1.5em;
  	font-weight: $fw-semi;

  	display: flex;
  	align-items: center;
  	flex-direction: column;

  	padding: 1em;
  }
</style>
