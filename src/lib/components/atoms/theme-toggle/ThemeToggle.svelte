<script lang="ts">
    import { themeState } from "$lib/stores/theme.svelte";
    import Icon from "$lib/components/atoms/icon/Icon.svelte";
    import { onMount } from "svelte";

    let mounted = $state(false);

    onMount(() => {
        themeState.init();
        mounted = true;
    });

    let isDark = $derived(themeState.current === "dark");

    function toggleTheme() {
        themeState.toggle();
    }
</script>

<button
    type="button"
    onclick={toggleTheme}
    class="p-2 rounded-lg transition-colors
           {isDark
        ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400'
        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}"
    title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
>
    {#if mounted}
        {#if isDark}
            <Icon name="Sun" size={20} />
        {:else}
            <Icon name="Moon" size={20} />
        {/if}
    {:else}
        <Icon name="Moon" size={20} />
    {/if}
</button>
