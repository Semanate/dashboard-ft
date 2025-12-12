<script lang="ts">
    interface Props {
        header?: boolean;
        children?: any;
    }

    const { header = false, children }: Props = $props();
</script>

<tr class={header ? "bg-gray-100 font-semibold" : "hover:bg-gray-50"}>
    {@render children()}
</tr>
