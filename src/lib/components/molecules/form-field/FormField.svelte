<script lang="ts">
  import InputText from "$lib/components/atoms/input/InputText.svelte";
  import InputSelect from "$lib/components/atoms/input/InputSelect.svelte";
  import InputDate from "$lib/components/atoms/input/InputDate.svelte";
  import InputFile from "$lib/components/atoms/input/InputFile.svelte";
  import InputTextarea from "$lib/components/atoms/input/InputTextarea.svelte";
  interface Field {
    type: "text" | "select" | "date" | "file" | "textarea";
    label: string;
    placeholder?: string;
    options?: Array<{ label: string; value: any }>;
    error?: string;
    value: any;
    onChange: (value: any) => void;
  }

  const { field }: { field: Field } = $props();
  let value = $state(field.value || null);

  function handleChange(v: any) {
    value = v;
    if (typeof field?.onChange === "function") field.onChange(v);
  }
</script>

<div class="w-full">
  {#if field.type === "text"}
    <InputText
      label={field.label}
      placeholder={field.placeholder}
      error={field.error}
      bind:value
    />
  {:else if field.type === "select" && field.options}
    <InputSelect
      label={field.label}
      options={field.options}
      bind:value
      error={field.error}
    />
  {:else if field.type === "date"}
    <InputDate label={field.label} bind:value error={field.error} />
  {:else if field.type === "file"}
    <InputFile label={field.label} bind:value error={field.error} />
  {:else if field.type === "textarea"}
    <InputTextarea
      label={field.label}
      placeholder={field.placeholder}
      error={field.error}
      bind:value
    />
  {:else}
    <div class="text-red-500 text-sm">
      ❌ Field type "{field.type}" not supported
    </div>
  {/if}
</div>
