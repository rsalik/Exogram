<script lang="ts">
  import { page } from "$app/stores";
  import { saveable } from "$lib/client/saveables.js";

  export let data;
</script>

<div class="title">Dictionary</div>
<div class="terms">
  {#each Object.keys(data.dictionary) as term}
    <div
      class="term"
      use:saveable={{
        type: "propertied",
        link: $page.url.href,
        data: {
          name: "Definition",
          properties: {
            Term: { value: term },
            Definition: { value: data.dictionary[term] },
          },
        },
      }}
    >
      <div class="name">{term}</div>
      <div class="definition">{data.dictionary[term]}</div>
    </div>
  {/each}
</div>

<style lang="scss">
  .terms {
  	display: grid;

  	grid-template-columns: auto auto auto;
  	gap: 1em;
  }

  .term {
  	font-size: 1.2em;

  	display: flex;
  	align-items: center;
  	flex-direction: column;
  	justify-content: center;

  	box-sizing: border-box;
  	height: 12rem;
  	padding: 2rem;

  	transition: $transition;

  	border-radius: $border-radius;
  	background: d($primary, 7);

  	&:hover {
  		background: d($primary, 5);
  	}

  	.name {
  		font-size: 1.8em;
  		font-weight: $fw-bold;
  	}

  	.definition {
  		text-align: center;
  	}
  }
</style>
