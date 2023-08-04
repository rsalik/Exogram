<script lang="ts">
  export let data;
</script>

<svelte:head>
  <title>Exogram - EB Validation Home</title>
</svelte:head>

<div class="title">EB Validation</div>
<div class="sub">Select a group to begin validating</div>

<div class="groups">
  {#each data.groups as group}
    {@const progress = data.progress[group.id]}
    <a href="/ebs/validate/{group.id}" class="group">
      <div class="name">{group.name}</div>
      {#if progress}
        <div class="progress" class:complete={progress.ratio === 1}>
          {#if progress.ratio === 1}
            <div class="label">Complete!</div>
          {:else}
            <div class="label">
              <strong>{progress.active}</strong> left of {progress.total}
            </div>
          {/if}
          <div class="bar">
            <div class="percent">
              {(data.progress[group.id].ratio * 100).toFixed(2)}%
            </div>

            <progress
              value={data.progress[group.id].ratio}
              class:zero={data.progress[group.id].ratio === 0}
            />
          </div>
        </div>
      {:else}
        <div class="progress caching">
          <div class="label">Caching</div>
          <div class="bar">
            <div class="loading-bar" />
          </div>
        </div>
      {/if}
    </a>
  {/each}
</div>

<style lang="scss">
  .sub {
    font-size: 2em;
    font-weight: $fw-reg;
  }

  .groups {
    width: 100%;
    margin-top: 1em;
  }

  .group {
    font-size: 3em;
    font-weight: $fw-semi;

    justify-content: space-between;

    padding: 0.7em;

    transition: $transition;

    border-radius: $border-radius;

    &:nth-of-type(even) {
      background: d($primary, 5);
    }

    &:nth-of-type(odd) {
      background: d($primary, 6);
    }

    &:hover {
      background: d($primary, 4);
    }

    .progress {
      display: flex;
      align-items: center;

      .label {
        font-size: 2rem;
        font-weight: $fw-reg;
      }

      &.complete {
        progress {
          &[value]::-webkit-progress-value {
            background-color: $green;
          }
        }

        .bar {
          .percent {
            display: none;
          }
        }
      }

      .bar {
        position: relative;

        display: flex;
        align-items: center;
        justify-content: center;

        .percent {
          font-size: 0.6em;
          font-weight: $fw-reg;

          position: absolute;
          top: 0;
          bottom: 0;
          left: 1.17em;

          display: flex;
          align-items: center;

          color: $primary;

          mix-blend-mode: difference;
        }

        progress,
        .loading-bar {
          width: 10em;
          height: 1.2em;
          margin-left: 0.5em;
        }

        .loading-bar {
          animation: flowing-progress-bar 1s linear infinite;

          border-radius: $border-radius;
          background: linear-gradient(
            -45deg,
            d($secondary, 2) 25%,
            d($secondary) 25%,
            d($secondary) 50%,
            d($secondary, 2) 50%,
            d($secondary, 2) 75%,
            d($secondary) 75%,
            d($secondary)
          );
          background-size: 80px 80px;
        }

        progress {
          -webkit-appearance: none;
          appearance: none;

          &[value]::-webkit-progress-bar {
            border-radius: $border-radius;
            background-color: d($primary, 7);
          }

          &:not(.zero)::-webkit-progress-value {
            padding-left: 1.9rem;
          }

          &[value]::-webkit-progress-value {
            border-radius: $border-radius;
            background-color: $primary;
          }
        }
      }
    }
  }

  @keyframes flowing-progress-bar {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 40px 40px;
    }
  }

  .group,
  .progress {
    display: flex;
  }
</style>
