<script lang="ts">
    import SignaturePad from "$lib/components/molecules/signature-pad/SignaturePad.svelte";

    interface Props {
        label?: string;
        placeholder?: string;
        error?: string;
        disabled?: boolean;
        value?: string;
        id: string;
        onchange?: (value: string) => void;
        variant?: "default";
        size?: "small" | "medium" | "large";
    }

    const {
        label = "",
        placeholder = "Sign here",
        error = "",
        id = "",
        disabled = false,
        value = "",
        onchange,
    }: Props = $props();
</script>

<div class="w-full">
    {#if label}
        <label for={id} class="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
    {/if}
    <input type="hidden" {id} {value} />
    <SignaturePad width={300} height={150} onChange={onchange} />
</div>
