<script lang="ts">
  import { browser } from "$app/environment";
  import { setIsEBSaved, useIsEBSaved } from "$lib/client/firebase/database.js";
  import { saveable, type Saveable } from "$lib/client/saveables.js";
  import Button from "$lib/components/Button.svelte";
  import Link from "$lib/components/Link.svelte";
  import Star from "svelte-material-icons/Star.svelte";

  export let data;
  let link = "";

  $: {
    if (browser) link = window.location.host + "/ebs/lookup/" + data.id;
  }

  const starred = useIsEBSaved(data.group.id, data.id);

  const saveableObj = {
    link: "/ebs/lookup/" + data.id,
    type: "image",
    data: {
      name: "<span>EB</span> TIC " + data.id,
      img: data.file?.webContentLink || "",
    },
  } as Saveable;
</script>

<svelte:head>
  <title>Exogram - EB TIC {data.id}</title>
</svelte:head>

<div class="main">
  <div class="img" use:saveable={saveableObj}>
    <img src={data.file.webContentLink} alt="EB" />
  </div>
  <div class="panel content">
    <div class="top">
      <div class="title" use:saveable={saveableObj}>
        TIC {data.id}
        <Button on:click={() => setIsEBSaved(data.group.id, data.id, !$starred)}
          ><div class="star" class:active={$starred}><Star /></div></Button
        >
      </div>

      <div class="properties">
        <div class="property">
          <div class="name">File</div>
          <div class="value" title={data.file.name}>
            <span class="auto-highlight">{data.file.name}</span>
          </div>
        </div>
        <div class="spacer" />
        <div class="property">
          <div class="name">Group</div>
          <div class="value">{data.group.name}</div>
        </div>
        <div class="spacer" />
        <div class="property">
          <div class="name">Is Validation Complete</div>
          <div class="value">{data.done ? "Yes" : "No"}</div>
        </div>
        <div class="spacer" />
        <div class="property">
          <div class="name">Permalink</div>
          <div class="value">
            <Link href={link}>{link}</Link>
          </div>
        </div>
        {#if data.disposition}
          <div class="spacer" />
          <div class="property">
            <div class="name">My Disposition</div>
            <div class="value disp">
              {@html `${
                data.disposition.isEB
                  ? '<span class="yes">Is EB</span>'
                  : '<span class="no">Not EB</span>'
              }; ${
                data.disposition.isPeriodCorrect
                  ? '<span class="yes">Period Good</span>'
                  : '<span class="no">Period Bad</span>'
              }; ${
                data.disposition.comments
                  ? `<span class="comments">${data.disposition.comments}</span>`
                  : "No Comments"
              }`}
            </div>
          </div>
        {/if}
      </div>
    </div>
    <a href={`/ebs/validate/${data.group.id}/${data.id}`} class="btn"
      >Go To Validation</a
    >
  </div>
</div>

<style lang="scss">
  .main {
    display: flex;
    justify-content: space-between;
  }

  .content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .title {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .star {
    font-size: 0.9em;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 1.1em;
    height: 1.1em;
    margin-left: 0.25em;

    cursor: pointer;
    transition: $transition;

    border-radius: $border-radius-small;
    background: d($primary, 5);

    &:hover {
      background: d($primary, 4);
    }

    &.active {
      color: $bkg;
      background: $primary;
    }
  }

  img {
    box-sizing: border-box;
    width: 45vw;
    height: 100%;
    margin-right: 1em;
    padding: 2em 0;

    border-radius: $border-radius;
    background: white;

    object-fit: cover;
  }

  .properties {
    font-size: 1.5em;

    margin: 0.5em 0 1em;

    .property {
      display: flex;
      justify-content: space-between;

      .name {
        font-weight: $fw-bold;
      }

      .value {
        overflow: hidden;

        max-width: 70%;

        text-align: right;
        text-overflow: ellipsis;

        &.disp {
          :global(.yes) {
            color: $green;
          }

          :global(.no) {
            color: $red;
          }

          :global(.comments) {
            color: $secondary;
          }
        }
      }

      .auto-highlight {
        cursor: pointer;
        user-select: all;
        text-decoration: dotted underline;
      }
    }

    .spacer {
      height: 3px;
      margin: 0.3em 0;

      border-radius: $border-radius;
      background: d($primary, 5);
    }
  }

  .btn {
    font-size: 1.5em;

    box-sizing: border-box;
    width: 100%;
    padding: 0.5em;

    transition: $transition;
    text-align: center;

    color: $green;
    border: 2px solid $green;
    border-radius: $border-radius;

    &:hover {
      color: $bkg;
      background: $green;
    }
  }
</style>
