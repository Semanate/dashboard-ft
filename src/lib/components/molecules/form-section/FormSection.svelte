<script lang="ts">
  import FormField from "../form-field/FormField.svelte";

  interface Props {
    title?: string;
    fields: Array<{
      type: "text" | "select" | "date" | "file" | "textarea" | "checkbox" | "password" | "email";
      label: string;
      placeholder?: string;
      options?: Array<{ label: string; value: any }>;
      error?: string;
      value: any;
      onChange: (value: any) => void;
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
