<script lang="ts">
  export let data: {
    name: string;
    img: string;
  };
</script>

<div class="name">{@html data.name}</div>
<img src={data.img} alt="EB" />

<style lang="scss">
  .name {
    font-size: 2em;
    font-weight: $fw-bold;

    :global(span) {
      color: $secondary;
    }
  }

  img {
    width: 20em;
    height: 20em;

    border-radius: $border-radius;

    object-fit: cover;
  }
</style>
