<script lang="ts">
  import { onMount } from "svelte";
  import "$lib/styles/app.css";
  import favicon from "$lib/assets/favicon.svg";
  import { themeStore } from "$lib/stores/theme.store";

  let { children } = $props();

  onMount(() => {
    themeStore.init();
  });
</script>


<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
