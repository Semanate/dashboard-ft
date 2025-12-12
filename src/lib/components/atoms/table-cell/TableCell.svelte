<script lang="ts">
    interface Props {
        as?: "td" | "th";
        children?: any;
        onclick?: () => void;
        class?: string;
    }
    const { as = "td", children, onclick, class: className = "" }: Props = $props();
</script>

<svelte:element this={as} class={"px-4 py-2 text-left border-b border-gray-200 " + className} onclick={onclick} role={onclick ? "button" : undefined} >
    {@render children()}
</svelte:element>
