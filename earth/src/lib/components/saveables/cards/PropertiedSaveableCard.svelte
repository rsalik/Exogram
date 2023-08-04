<script lang="ts">
  export let data: {
    name: string;
    properties: { [key: string]: { value: any; highlight?: boolean } };
  };
</script>

<div class="name">{@html data.name}</div>
<div class="properties">
  {#each Object.keys(data.properties) as key}
    {#if typeof data.properties[key].value === "boolean"}
      {#if data.properties[key].value}
        <div
          class="property bool"
          class:highlight={data.properties[key].highlight}
        >
          <div class="key">{@html key}</div>
        </div>
      {/if}
    {:else}
      <div class="property" class:highlight={data.properties[key].highlight}>
        <div class="key">{@html key}</div>
        <div class="value">{data.properties[key].value}</div>
      </div>
    {/if}
  {/each}
</div>

<style lang="scss">
  .name {
  	font-size: 2em;
  	font-weight: $fw-bold;

  	text-align: center;
  }

  .properties {
  	font-size: 1.1em;

  	display: flex;
  	flex-direction: column;

  	width: 100%;

  	border-radius: $border-radius;
  	background: d($primary, 4);

  	.property {
  		display: flex;
  		justify-content: space-between;

  		padding: 0.5em 0.8em;

  		border-radius: $border-radius;

  		.key {
  			font-weight: $fw-bold;

  			display: flex;
  			display: inline-block;
  			align-items: center;

  			margin-right: 0.75em;
  		}

  		.value {
  			text-align: right;
  		}

  		&.bool {
  			justify-content: center;
  		}

  		&.highlight {
  			color: $bkg;
  			background: $secondary !important;
  		}

  		&:nth-child(even) {
  			background: d($primary, 4);
  		}
  	}
  }
</style>
