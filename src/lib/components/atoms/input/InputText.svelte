<script lang="ts">
  interface Props {
    /** The label for the input field */
    label?: string;
    /** The placeholder text for the input field */
    placeholder?: string;
    /** The error message to display */
    error?: string;
    /** The value of the input field */
    value?: string;
  }

  const {
    label = "",
    placeholder = "",
    error = "",
    value = "",
  }: Props = $props();

  let mode = $derived("");
  let style = $derived("");
</script>

<div class="flex flex-col gap-1">
  {#if label}
    <label class="text-sm font-medium text-gray-700">{label}</label>
  {/if}

  <input
    aria-label={label}
    class="border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:bg-primary"
    class:error
    {placeholder}
  />

  {#if error}
    <p class="text-red-500 text-xs">{error}</p>
  {/if}
</div>
