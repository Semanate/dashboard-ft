<script lang="ts">
    interface Props {
        as?: "td" | "th";
        children?: any;
        class?: string;
    }
    const { as = "td", children, class: className = "" }: Props = $props();
</script>

<svelte:element this={as} class={"px-4 py-2 text-left border-b border-gray-200 " + className}>
    {@render children()}
</svelte:element>
