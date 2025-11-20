<script lang="ts">
  import Stepper from "$lib/components/molecules/stepper/Stepper.svelte";
  import FormSection from "$lib/components/molecules/form-section/FormSection.svelte";
  import Button from "$lib/components/atoms/button/Button.svelte";
  interface CategoryFormField {
    name: string;
    type: "text" | "select" | "date" | "file" | "textarea";
    label: string;
    id: string;
    placeholder?: string;
    options?: Array<{ label: string; value: any }>;
    value: any;
  }

  interface Category {
    label: string;
    fields: CategoryFormField[];
  }
  interface Props {
    categories: Category[];
  }

  let active = $state(0);

  let formData = $state<Record<number, Record<string, any>>>({});

  const { categories }: Props = $props();
  $effect.pre(() => {
    const initial: Record<number, Record<string, any>> = {};

    categories.forEach((cat, i) => {
      initial[i] = {};
      cat.fields.forEach((field) => {
        initial[i][field.name] = field.value ?? null;
      });
    });

    formData = initial;
  });

  function updateField(categoryIndex: number, fieldName: string, value: any) {
    formData[categoryIndex][fieldName] = value;
  }
  const onchange = (i: number) => (active = i);

  function next() {
    if (active < categories.length - 1) active++;
    onchange(active);
  }

  function prev() {
    if (active > 0) active--;
    onchange(active);
  }

  export function getValues() {
    return structuredClone(formData);
  }
</script>

<div class="w-full space-y-6">
  <Stepper
    steps={categories.map((cat) => ({ label: cat.label }))}
    {active}
    {onchange}
  />
  <div class="bg-white border rounded-md p-5 shadow-sm">
    {#each categories as cat, i}
      {#if active === i}
        <FormSection
          title={cat.label}
          fields={cat.fields.map((field) => ({
            id: field.id,
            type: field.type,
            label: field.label,
            placeholder: field.placeholder,
            options: field.options,
            value: formData[i][field.name],
            onChange: (value: any) => updateField(i, field.name, value),
          }))}
        />
      {/if}
    {/each}
  </div>

  <div class="flex justify-between pt-4">
    <Button
      label="Anterior"
      onclick={prev}
      disabled={active === 0}
      variant="ghost"
    />

    <Button
      onclick={next}
      disabled={active === categories.length - 1}
      label="Siguiente"
      variant="ghost"
    />
  </div>
</div>
