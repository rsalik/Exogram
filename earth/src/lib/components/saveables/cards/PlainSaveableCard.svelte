<script lang="ts">
  export let data: {
    name: string;
  };
</script>

<div class="name">{@html data.name}</div>

<style lang="scss">
  .name {
  	font-size: 2em;
  	font-weight: $fw-bold;

  	:global(span) {
  		color: $secondary;
  	}
  }
</style>
