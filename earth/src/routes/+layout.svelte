<script lang="ts">
  import { page } from "$app/stores";
  import Footer from "$lib/components/Footer.svelte";
  import Header from "$lib/components/Header.svelte";
  import SaveableDrawer from "$lib/components/saveables/SaveableDrawer.svelte";
  import SaveableFloatingButton from "$lib/components/saveables/SaveableFloatingButton.svelte";

  import "../styles/style.scss";
  import ToastManager from "$lib/components/ToastManager.svelte";
  import { onMount } from "svelte";
  import { saveables } from "$lib/client/saveables";
  import SaveableShareDialog from "$lib/components/saveables/SaveableShareDialog.svelte";
  import {
    useUserData,
    useUserNotifications,
  } from "$lib/client/firebase/database";
  import { derived } from "svelte/store";
  import Notifications from "$lib/components/Notifications.svelte";

  onMount(() => {
    const ls = localStorage.getItem("saveables");
    if (ls) $saveables = JSON.parse(ls);

    saveables.subscribe((saveables) => {
      localStorage.setItem("saveables", JSON.stringify(saveables));
    });
  });

  const notifications = useUserNotifications();

  const uids = derived(notifications, ($notifications) => {
    if (!$notifications || !$notifications.value) return [];

    return Object.values($notifications.value).map((n) => n.from);
  });

  const userData = useUserData(uids, ["name", "pfp"]);
</script>

<Header notifications={$notifications} />
<div class="content">
  <div class="padder">
    <slot />
  </div>
</div>
<Footer />

{#if !$page.error}
  <SaveableDrawer />
  <SaveableFloatingButton />
  <ToastManager />
  <SaveableShareDialog />
  <Notifications notifications={$notifications} userData={$userData} />
{/if}

<style lang="scss">
  .content {
  	position: relative;

  	display: flex;

  	box-sizing: border-box;
  	min-height: 100%;
  	padding-top: $header-height;

  	.padder {
  		flex-grow: 1;

  		padding: 2em;
  	}
  }
</style>
