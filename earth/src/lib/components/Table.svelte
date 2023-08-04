<script lang="ts">
  import { Highlight } from "$lib/client/table/table";

  import { goto } from "$app/navigation";

  import type { SvelteComponent } from "svelte";

  import { saveable, type Saveable } from "$lib/client/saveables";
  import { isValue, nestedGet } from "$lib/util";
  import ArrowUp from "svelte-material-icons/ArrowUp.svelte";

  type T = $$Generic<Record<string, string>>;

  export let columns: T;

  export let data: any[];
  export let filters: {
    [P in keyof T]?: (s: string) => string | SvelteComponent;
  } & Record<string, (s: string) => string | SvelteComponent> = {};

  export let sorters: {
    [P in keyof T]?: ((a: any, b: any) => number) | null;
  } & Record<string, ((a: any, b: any) => number) | null> = {};

  export let highlighter:
    | ((
        row: { [P in keyof T]: any } & { [key: string]: any }
      ) => boolean | Highlight)
    | undefined = undefined;
  export let secondary = false;

  export let useLink: typeof saveableData extends undefined ? false : boolean =
    false;
  export let saveableData: undefined | ((data: any) => Omit<Saveable, "id">) =
    undefined;

  let sortColumn: keyof T = Object.keys(columns)[0];
  let sortReverse = false;

  const monoColumns = Object.keys(columns).filter((c) => {
    return data.find(isValue) && !data.find(
      (d) =>
        nestedGet(d, c) && !/^[\d().]+$/.test(nestedGet(d, c).toString().trim())
    );
  });

  let sort = (arr: any[]) => {
    const newArr = arr.sort((dataA, dataB) => {
      let a = nestedGet(dataA, sortColumn);
      let b = nestedGet(dataB, sortColumn);

      let s = sorters[sortColumn]
      if (s) {
        return s(a, b);
      }

      if (!isValue(a) && !isValue(b)) return 0;
      if (!isValue(b)) return 1;
      if (!isValue(a)) return -1;

      if (!isNaN(a) && !isNaN(b)) {
        return +a - +b;
      }

      return a.localeCompare(b);
    });

    return sortReverse ? newArr.reverse() : newArr;
  };

  let sortedData: any[] = [];
  $: highlightedData = data.filter(
    (d) =>
      highlighter &&
      (highlighter(d) === true || highlighter(d) === Highlight.HIGH)
  );
  $: regularData = data.filter(
    (d) => !highlighter || !highlighter(d) || highlighter(d) === Highlight.LOW
  );

  $: sortColumn,
    sortReverse,
    (sortedData = [...sort([...highlightedData]), ...sort([...regularData])]);
</script>

<table class:secondary>
  <thead>
    <tr>
      {#each Object.keys(columns) as c}
        <th
          class:sorter={sortColumn === c}
          on:click={() => {
            if (sorters[c] === null) return;
            if (sortColumn === c) sortReverse = !sortReverse;
            else {
              sortReverse = false;
              sortColumn = c;
            }
          }}
        >
          <div class="wrapper">
            <div>{@html columns[c]}</div>
            {#if sorters[c] !== null}
              <span
                class="sorter"
                class:reverse={sortReverse && sortColumn === c}
              >
                <ArrowUp />
              </span>
            {/if}
          </div>
        </th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each sortedData as d}
      {@const highlight = highlighter ? highlighter(d) : false}
      <tr
        use:saveable={saveableData?.(d)}
        on:click={() => {
          if (useLink && saveableData) goto(saveableData(d).link);
        }}
        class:highlight={highlight === true || highlight === Highlight.HIGH}
        class:highlight-low={highlight === Highlight.LOW}
      >
        {#each Object.keys(columns) as c}
          {@const v = nestedGet(d, c)}
          <td class:mono={monoColumns.includes(c)}>
            {#if isValue(v)}
              {@const filtered = filters && filters[c] ? filters[c]?.(v) : v}
              {#if $$slots.default}
                <slot val={filtered} col={c} />
              {:else}
                {@html filtered}
              {/if}
            {/if}
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

{#if !data.length}
  <div class="empty panel full secondary">This Table is Empty</div>
{/if}

<style lang="scss">
  table {
  	font-size: 1.1rem;

  	width: 100%;
  	margin: 0 auto;

  	border-collapse: collapse;

  	tr {
  		td:first-of-type,
  		th:first-of-type {
  			border-top-left-radius: $border-radius-small;
  			border-bottom-left-radius: $border-radius-small;
  		}

  		td:last-of-type,
  		th:last-of-type {
  			border-top-right-radius: $border-radius-small;
  			border-bottom-right-radius: $border-radius-small;
  		}

  		&:nth-of-type(even) {
  			background: d($primary, 6);
  		}
  	}

  	tbody tr {
  		&:hover {
  			background: d($primary, 3) !important;
  		}

  		&:nth-of-type(odd) {
  			background: $bkg;
  		}
  	}

  	td {
  		box-sizing: border-box;
  		max-width: 10em;
  		padding: 0.45em 1em;

  		text-align: center;
  		word-wrap: break-word;
  	}

  	thead tr {
  		position: sticky;
  		z-index: 2;
  		top: 0;

  		color: $bkg;
  		border-radius: $border-radius;
  		background: $secondary;

  		th {
  			padding: 0.5em;

  			cursor: pointer;
  			user-select: none;
  			transition: $transition;

  			.wrapper {
  				display: flex;
  				align-items: center;
  				justify-content: center;

  				.sorter {
  					font-size: 1.2em;

  					display: flex;
  					align-items: center;
  					justify-content: center;

  					margin-left: 0.25em;

  					transition: $transition;

  					opacity: 0;

  					&.reverse {
  						transform: rotate(180deg);
  					}
  				}
  			}

  			&.sorter {
  				background: $tertiary;
  			}

  			&.sorter,
  			&:hover {
  				.sorter {
  					opacity: 1;
  				}
  			}
  		}
  	}

  	&.secondary {
  		tr:nth-of-type(even) {
  			background: d($secondary, 5);
  		}

  		tbody tr {
  			&:hover {
  				background: d($tertiary, 3) !important;
  			}

  			&:nth-of-type(odd) {
  				background: transparent;
  			}

  			&.highlight {
  				color: $bkg;
  				background: $quaternary;

  				&:hover {
  					background: d($quaternary, 2) !important;
  				}
  			}

  			&.highlight-low {
  				color: $bkg;
  				background: $secondary;

  				&:hover {
  					background: d($secondary, 2) !important;
  				}
  			}
  		}
  	}
  }

  .empty {
  	font-size: 6em;

  	margin-top: -0.5rem;
  	padding: 2em 0;

  	border-top-left-radius: 0;
  	border-top-right-radius: 0;
  }
</style>
