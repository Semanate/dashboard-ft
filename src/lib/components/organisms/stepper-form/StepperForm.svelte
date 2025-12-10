<script lang="ts">
  import Stepper from "$lib/components/molecules/stepper/Stepper.svelte";
  import FormSection from "$lib/components/molecules/form-section/FormSection.svelte";
  import Button from "$lib/components/atoms/button/Button.svelte";
  import type { OptionsSelects } from "$lib/types";
    import { expand } from "$lib/utils/forms";

  interface CategoryFormField {
    name: string;
    type:
      | "text"
      | "select"
      | "date"
      | "file"
      | "textarea"
      | "checkbox"
      | "password"
      | "email";
    label: string;
    id: string;
    placeholder?: string;
    options?: Array<OptionsSelects<any>>;
    value: any;
    required?: boolean; // undefined => lo trato como requerido
    error?: string;
  }

  interface Category {
    label: string;
    fields: CategoryFormField[];
  }

  interface Props {
    categories: Category[];
    callbackOnSubmit?: (data: Record<string, any>) => void;
  }

  let active = $state(0);
  let formData = $state<Record<number, Record<string, any>>>({});
  let fieldErrors = $state<Record<number, Record<string, string>>>({});
  let hasAttemptedNext = $state(false);

  const { categories, callbackOnSubmit }: Props = $props();

  /**
   * Inicializar formData y fieldErrors una vez con base en categories
   */
  $effect(() => {
    const initial: Record<number, Record<string, any>> = {};
    const initialErrors: Record<number, Record<string, string>> = {};

    categories.forEach((cat, i) => {
      initial[i] = {};
      initialErrors[i] = {};

      cat.fields.forEach((field) => {
        // valor inicial
        initial[i][field.name] = field.value ?? "";
        // sin error al inicio
        initialErrors[i][field.name] = "";
      });
    });

    formData = initial;
    fieldErrors = initialErrors;
  });

  /**
   * Valida un step específico
   */
  function validateStep(index: number) {
    const currentCategory = categories[index];
    if (!currentCategory) {
      return { isValid: true, errors: {} as Record<string, string> };
    }

    let isValid = true;
    const newErrors: Record<string, string> = {};

    currentCategory.fields.forEach((field) => {
      if (field.required === false) {
        newErrors[field.name] = "";
        return;
      }

      const value = formData[index]?.[field.name];
      const isEmpty =
        value === null ||
        value === undefined ||
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0);

      if (isEmpty) {
        newErrors[field.name] = "Este campo es requerido";
        isValid = false;
      } else {
        newErrors[field.name] = "";
      }
    });

    // Como usamos $state, podemos mutar directamente
    fieldErrors[index] = newErrors;

    return { isValid, errors: newErrors };
  }

  /**
   * Valida el step activo
   */
  function validateCurrentStep() {
    const { isValid } = validateStep(active);
    return isValid;
  }

  /**
   * Actualizar campo correctamente
   * y revalidar el step si ya intentamos avanzar
   */
  function updateField(categoryIndex: number, fieldName: string, value: any) {
    formData[categoryIndex][fieldName] = value;
    if (hasAttemptedNext && categoryIndex === active) {
      validateStep(categoryIndex);
    }
  }

  /**
   * Cambiar step desde el stepper
   */
  export const onchange = (i: number) => {
    // Permitir volver atrás sin validar
    if (i < active) {
      active = i;
      hasAttemptedNext = false;
      return;
    }

    hasAttemptedNext = true;

    if (validateCurrentStep()) {
      active = i;
      hasAttemptedNext = false;
    }
  };

  function next() {
    hasAttemptedNext = true;
    if (validateCurrentStep() && active < categories.length - 1) {
      active++;
      hasAttemptedNext = false;
    }
  }

  function prev() {
    if (active > 0) {
      active--;
      hasAttemptedNext = false;
    }
  }



  export function getValues() {
    const arr = Object.values(formData);
    const clean = JSON.parse(JSON.stringify(arr));
    const merged = Object.assign({}, ...clean);
    const fullObject = expand(merged);

    return fullObject;
  }

  export function isValid() {
    return categories.every((_, i) => validateStep(i).isValid);
  }
</script>

<div class="w-full space-y-6">
  <div class="h-14">
    <Stepper
      steps={categories.map((cat) => ({
        label: cat.label as string,
        completed: false,
      }))}
      {active}
      {onchange}
    />
  </div>
  <div class="bg-white border rounded-md p-5 shadow-sm">
    {#each categories as cat, i (cat)}
      {#if active === i}
        <FormSection
          title={cat.label}
          fields={cat.fields.map((field) => ({
            id: field.id,
            type: field.type,
            label: field.label,
            placeholder: field.placeholder,
            options: field.options,
            error: fieldErrors[i]?.[field.name] || "",
            value: formData[i]?.[field.name] ?? "",
            onchange: (value: any) => {
              updateField(i, field.name, value);
            },
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

    {#if active < categories.length - 1}
      <Button
        onclick={next}
        disabled={active === categories.length - 1}
        label="Siguiente"
        variant="ghost"
      />
    {/if}
    <!-- Submit  -->

    {#if active === categories.length - 1}
      <Button
        onclick={() => {
          hasAttemptedNext = true;
          if (validateCurrentStep() && isValid() && callbackOnSubmit) {
            callbackOnSubmit(getValues());
          }
        }}
        label="Enviar"
        variant="primary"
      />
    {/if}
  </div>
</div>
