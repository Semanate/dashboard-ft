<script lang="ts">
    interface Props {
        children?: any;
    }
    const { children }: Props = $props();
</script>

<table class="w-full border-collapse rounded-lg overflow-hidden">
    {@render children()}
</table>
