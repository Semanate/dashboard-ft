<script lang="ts">
  import FormField from "../form-field/FormField.svelte";
  import type { OptionsSelects } from "$lib/types";

  interface Props {
    title?: string;
    fields: Array<{
      id: string;
      type:
        | "text"
        | "select"
        | "date"
        | "file"
        | "textarea"
        | "checkbox"
        | "password"
        | "email"
        | "signature";
      label: string;
      placeholder?: string;
      options?: Array<OptionsSelects<any>>;
      error?: string;
      value: any;
      onchange?: (value: any) => void;
      accept?: string;
    }>;
  }

  const { title = "", fields }: Props = $props();
</script>

<div class="space-y-4">
  {#if title}
    <h3 class="text-lg font-semibold text-gray-800">{title}</h3>
  {/if}

  {#each fields as field}
    <FormField {field} />
  {/each}
</div>
