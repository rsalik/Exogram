<script lang="ts">
  import { EmailAuthProvider, GoogleAuthProvider } from "firebase/auth";
  import * as firebaseui from "firebaseui";
  import { auth } from "$lib/firebase";
  import { onMount } from "svelte";

  let ref: HTMLDivElement;

  const uiConfig = {
    signInFlow: "popup",
    signInSuccessUrl: "/profile",
    signInOptions: [
      GoogleAuthProvider.PROVIDER_ID,
      EmailAuthProvider.PROVIDER_ID,
    ],
  };

  onMount(() => {
    const firebaseUiWidget =
      firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
    if (uiConfig.signInFlow === "popup") firebaseUiWidget.reset();

    firebaseUiWidget.start(ref, uiConfig);
  });
</script>

<div bind:this={ref} />
