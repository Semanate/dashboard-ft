<script lang="ts">
    interface Props {
        as?: "td" | "th";
        children?: any;
    }
    const { as = "td", children }: Props = $props();
</script>

<svelte:element this={as} class="px-4 py-2 text-left border-b border-gray-200">
    {@render children()}
</svelte:element>
