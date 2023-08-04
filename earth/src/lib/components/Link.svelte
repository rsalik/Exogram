<script lang="ts">
  export let href: string;
  export let newTab = false;
  export let box = false;
</script>

<a
  class="link"
  {href}
  class:box
  target={newTab ? "_blank" : "_self"}
  rel="noopener noreferrer"
>
  <div class="content">
    <slot />
  </div>
</a>

<style lang="scss">
  .link {
    cursor: pointer;
    transition: $transition;
  }

  .link:not(.box) {
    text-decoration: underline;

    color: $primary;

    &:hover {
      color: $color;
    }
  }

  .link.box {
    position: relative;

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 0.3em 0.5em;

    border-radius: $border-radius;

    .content {
      z-index: 2;
    }

    &::before {
      position: absolute;
      top: 20%;
      right: 20%;
      bottom: 20%;
      left: 20%;

      content: "";
      transition: all 0.2s ease-in-out 0.1s, border 0.1s ease-in-out;

      border: 2px solid transparent;
      border-radius: 0;
      background-color: rgba($primary, 0);
    }

    &:hover::before {
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;

      transition: all 0.2s ease-in-out, border 0.1s ease-in-out;

      border: 2px solid $primary;
      border-radius: $border-radius;
      background-color: a($primary);
    }
  }
</style>
