<script lang="ts">
  import { page } from "$app/stores";
  import LinkLine from "$lib/components/LinkLine.svelte";
  import { saveable } from "$lib/client/saveables";
  import { getTicTableSaveable } from "$lib/client/table/ticTable.js";
  import { exofopLinkOf, fliLinkOf, isValue } from "$lib/util";
  import { type Tic, TicLongPropertyNames } from "$lib/api/tics.js";
  import { onMount } from "svelte";
  import { getTicFiles } from "$lib/client/api.js";
  import Link from "$lib/components/Link.svelte";
  import DispositionTable from "$lib/components/table/TicDispositionTable.svelte";
  import {
    useDispositions,
    useUserData,
  } from "$lib/client/firebase/database.js";
  import { derived } from "svelte/store";
  import CreateDisposition from "$lib/components/CreateTicDisposition.svelte";
  import { user } from "$lib/client/firebase/auth.js";

  export let data;

  const { tic, ticGroups } = data;

  const propKeys = Object.keys(TicLongPropertyNames) as (keyof Tic &
    keyof typeof TicLongPropertyNames)[];

  let files: Awaited<ReturnType<typeof getTicFiles>>;

  const dispositions = useDispositions(tic.id);

  const uids = derived(dispositions, ($dispositions) => {
    return $dispositions?.map((d) => d.id) || [];
  });

  const usernames = useUserData(uids, "name");

  $: flatUsernames = Object.entries($usernames).reduce((acc, [uid, o]) => {
    acc[uid] = o.name;
    return acc;
  }, {} as Record<string, string>);

  onMount(async () => {
    files = await getTicFiles(tic.id);
  });
</script>

<svelte:head>
  <title>Exogram - TIC {tic.id}</title>
</svelte:head>

<div class="page">
  <div class="heading">
    <div class="row">
      <div
        class="title"
        use:saveable={{
          type: "plain",
          link: $page.url.href,
          data: { name: "TIC " + tic.id || "" },
        }}
      >
        TIC {tic.id}
      </div>

      {#if isValue(tic.group) && ticGroups}
        <div
          class="group"
          use:saveable={getTicTableSaveable(
            Number(tic.group),
            ticGroups[Number(tic.group)].name || ""
          )}
        >
          {ticGroups[Number(tic.group)].name}
        </div>
      {/if}
    </div>

    <LinkLine
      newTab
      links={{
        ExoFOP: exofopLinkOf(tic.id),
        FLI: fliLinkOf(tic.id),
        CSV: `/api/get/tic-csv/${tic.id}`
      }}
    />
  </div>

  {#if !isValue(tic.group)}
    <br />
    <div class="panel full error">No Data.</div>
  {:else}
    <div class="properties">
      {#each propKeys as property}
        {#if tic[property]}
          <div
            class="property"
            use:saveable={{
              type: "propertied",
              link: $page.url.href,
              data: {
                name: "TIC " + tic.id,
                properties: {
                  [TicLongPropertyNames[property]]: {
                    value: tic[property],
                    highlight: true,
                  },
                },
              },
            }}
          >
            <div class="name">{@html TicLongPropertyNames[property]}</div>
            <div class="value">
              {(property === "sectors"
                ? tic[property].replaceAll(",", ", ")
                : tic[property]) || ""}
            </div>
          </div>
        {/if}
      {/each}
    </div>

    {#if files}
      {#if files.length}
        <div class="panel">
          <div class="title">Files</div>

          <div class="files">
            {#each files as file}
              {#if file.webViewLink && file.name}
                <div
                  class="file"
                  use:saveable={{
                    type: "propertied",
                    link: file.webViewLink,
                    data: {
                      name: "TIC " + tic.id,
                      properties: {
                        File: { value: file.name, highlight: true },
                      },
                    },
                  }}
                >
                  <Link href={file.webViewLink} newTab>
                    {file.name}
                  </Link>
                </div>
              {/if}
            {/each}
          </div>
        </div>
      {:else}
        <div class="panel secondary">
          <div class="title">No Files Found</div>
        </div>
      {/if}
    {:else}
      <div class="panel info">
        <div class="title">Loading Files</div>
      </div>
    {/if}

    <br />

    {#if $dispositions}
      <div class="panel secondary">
        <div class="title">Dispositions</div>
        <br />
        <DispositionTable
          id={tic.id}
          dispositions={[
            ...$dispositions,
            { id: "paper", ...tic.paperDisposition },
          ]}
          usernames={flatUsernames}
          dictionary={data.dictionary}
        />
        <br />
        {#if $user && ticGroups[Number(tic.group)].write}
          {@const userDisp =
            $dispositions.find((d) => d.id === $user?.uid) || undefined}
          <div class="panel secondary">
            <div class="title">
              {#if userDisp}
                Update Disposition
              {:else}
                Create Disposition
              {/if}
            </div>
            <CreateDisposition
              quickAdds={Object.keys(data.dictionary).map((s) =>
                s.replaceAll(/[()]/gm, "")
              )}
              userDisposition={userDisp}
              on:set={(v) =>
                fetch(`/api/set/tic-disp/${tic.id}`, {
                  method: "POST",
                  body: JSON.stringify({ disposition: v.detail }),
                })}
              on:delete={() =>
                fetch(`/api/set/tic-disp/${tic.id}`, {
                  method: "DELETE",
                })}
            />
          </div>
        {/if}
      </div>
    {:else if $dispositions === null}
      <div class="panel semi error">
        No Access
        <div class="sub">These dispositions are not public.</div>
      </div>
    {:else}
      <div class="panel semi secondary">Loading Dispositions</div>
    {/if}
  {/if}
</div>

<style lang="scss">
  .page {
    display: flex;
    align-items: center;
    flex-direction: column;

    width: 100%;
    height: 100%;
  }

  .heading {
    display: flex;
    align-items: center;
    flex-direction: column;

    .row {
      display: flex;
      align-items: center;
    }

    .group {
      font-size: 1.6em;
      font-weight: $fw-reg;

      display: flex;
      align-items: center;
      justify-content: center;

      margin-left: 0.5em;
      padding: 0.4em 0.5em;

      color: $bkg;
      border-radius: $border-radius-small;
      background: $secondary;
    }
  }

  .properties {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    margin: 1em 0;

    .property {
      font-size: 1.6em;

      display: flex;
      flex-direction: column;

      width: 9.7em;
      margin: 0.25em;

      .name,
      .value {
        padding: 0.2em;
      }

      .name {
        font-weight: $fw-bold;

        height: 1.37em;

        text-align: center;

        color: $bkg;
        border-top-left-radius: $border-radius-small;
        border-top-right-radius: $border-radius-small;
        background: d($primary);

        :global(.unit) {
          font-weight: $fw-semi;

          color: d($primary, 7);
        }
      }

      .value {
        display: flex;
        align-items: center;
        flex-grow: 1;
        justify-content: center;

        text-align: center;

        border-bottom-right-radius: $border-radius-small;
        border-bottom-left-radius: $border-radius-small;
        background: d($primary, 5);
      }
    }
  }

  .files {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;

    .file {
      font-size: 1.3em;

      display: flex;
      align-items: center;
      justify-content: center;

      width: 100%;
      padding: 0.5em;

      border-radius: $border-radius-small;

      &:nth-of-type(even) {
        background: d($primary, 4);
      }
    }
  }
</style>
