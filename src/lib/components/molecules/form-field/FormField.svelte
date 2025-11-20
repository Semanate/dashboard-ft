<script lang="ts">
  import InputText from "$lib/components/atoms/input/InputText.svelte";
  import InputSelect from "$lib/components/atoms/input/InputSelect.svelte";
  import InputDate from "$lib/components/atoms/input/InputDate.svelte";
  import InputFile from "$lib/components/atoms/input/InputFile.svelte";
  import InputTextarea from "$lib/components/atoms/input/InputTextarea.svelte";
  interface Field {
    id: string;
    type:
      | "text"
      | "select"
      | "date"
      | "email"
      | "file"
      | "textarea"
      | "checkbox"
      | "password";
    label: string;
    required?: boolean;
    placeholder?: string;
    options?: Array<{ label: string; value: any }>;
    error?: string;
    value: any;
    onchange: (value: any) => void;
  }

  interface Props {
    field: Field;
  }
  const { field }: Props = $props();
</script>

<div class="w-full">
  {#if field.type === "text" || field.type === "password" || field.type === "email"}
    <InputText {...field} />
  {:else if field.type === "select" && field.options}
    <InputSelect {...field} />
  {:else if field.type === "date"}
    <InputDate {...field} />
  {:else if field.type === "file"}
    <InputFile {...field} />
  {:else if field.type === "textarea"}
    <InputTextarea {...field} />
  {:else}
    <div class="text-red-500 text-sm">
      ❌ Field type "{field.type}" not supported
    </div>
  {/if}
</div>
