<script lang="ts">
  import Stepper from "$lib/components/molecules/stepper/Stepper.svelte";
  import FormSection from "$lib/components/molecules/form-section/FormSection.svelte";
  import Button from "$lib/components/atoms/button/Button.svelte";
  import type { OptionsSelects } from "$lib/types";
  import { getValues, isValid, validateStep } from "$lib/utils/forms";

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
    required?: boolean;
    error?: string;
  }

  interface Category {
    label: string;
    isVisible: (values: Record<string, any>) => boolean;
    fields: CategoryFormField[];
  }

  interface Props {
    formData?: Record<string, any>;
    categories: Category[];
    callbackOnSubmit?: (data: Record<string, any>) => void;
    isVisible?: boolean;
    updateNext?: () => void;
    children?: any;
  }

  let activeVisible = $state(0);
  let fieldErrors = $state<Record<number, Record<string, string>>>({});
  let hasAttemptedNext = $state(false);
  let didInit = $state(false);

  const {
    categories: items,
    callbackOnSubmit,
    isVisible = true,
    formData = $bindable({}),
    updateNext,
    children,
  }: Props = $props();

  let values = $derived.by(() => getValues(formData));

  let categories = $derived.by(() => items);
  /**
   * Índices reales de categories que están visibles
   */
  let visibleIndexes = $derived.by(() =>
    categories
      .map((cat, i) => (resolveVisibility(cat) ? i : -1))
      .filter((i) => i !== -1),
  );

  /**
   * Índice real activo dentro de categories
   */
  let active = $derived.by(() => visibleIndexes[activeVisible] ?? 0);

  /**
   * Si cambia la visibilidad y el activeVisible queda fuera de rango, lo ajustamos
   */
  $effect(() => {
    const last = visibleIndexes.length - 1;
    if (last < 0) {
      activeVisible = 0;
      return;
    }
    if (activeVisible > last) {
      activeVisible = last;
    }
  });
  function replaceRecord(target: Record<any, any>, next: Record<any, any>) {
    for (const k in target) delete target[k];
    Object.assign(target, next);
  }
  /**
   * Inicializar formData y fieldErrors una vez con base en categories
   */
  $effect(() => {
    if (didInit) return;
    didInit = true;
    const initial: Record<number, Record<string, any>> = {};
    const initialErrors: Record<number, Record<string, string>> = {};

    categories.forEach((cat, i) => {
      initial[i] = {};
      initialErrors[i] = {};

      cat.fields.forEach((field) => {
        initial[i][field.name] = field.value ?? "";
        initialErrors[i][field.name] = "";
      });
    });

    replaceRecord(formData, initial);
    replaceRecord(fieldErrors, initialErrors);
    // formData = initial;
    // fieldErrors = initialErrors;
  });
  function resolveVisibility(category: Category): boolean {
    if (typeof category.isVisible === "function") {
      return category.isVisible(values);
    }

    if (typeof category.isVisible === "boolean") {
      return category.isVisible;
    }

    return true; // default visible
  }



  /**
   * Valid Step Active
   */
  function validateCurrentStep() {
    const { isValid } = validateStep(active, categories, formData, resolveVisibility, fieldErrors);
    return isValid;
  }

  /**
   * Actualizar campo correctamente
   * y revalidar el step si ya intentamos avanzar
   */
  function updateField(categoryIndex: number, fieldName: string, value: any) {
    formData[categoryIndex][fieldName] = value;
    if (hasAttemptedNext && categoryIndex === active) {
      validateStep(categoryIndex, categories, formData, resolveVisibility, fieldErrors);
    }
  }

  /**
   * Cambiar step desde el stepper (recibe índice VISIBLE)
   */
  export const onchange = (visibleI: number) => {
    if (visibleI < activeVisible) {
      activeVisible = visibleI;
      hasAttemptedNext = false;
      return;
    }

    hasAttemptedNext = true;

    if (validateCurrentStep()) {
      activeVisible = visibleI;
      hasAttemptedNext = false;
    }
  };

  function next() {
    hasAttemptedNext = true;
    if (updateNext) {
      updateNext();
    }

    if (validateCurrentStep() && activeVisible < visibleIndexes.length - 1) {
      activeVisible++;
      hasAttemptedNext = false;
    }
  }

  function prev() {
    if (activeVisible > 0) {
      activeVisible--;
      hasAttemptedNext = false;
    }
  }
</script>

{#if isVisible}
  <div class="w-full space-y-6">
    <div class="h-14">
      <Stepper
        steps={visibleIndexes.map((i) => ({
          label: categories[i].label as string,
          completed: false,
          isVisible: true,
        }))}
        active={activeVisible}
        {onchange}
      />
    </div>

    <div>
      {#if children}
        <div class="mb-4">
          {@render children()}
        </div>
      {/if}
      {#if visibleIndexes.length === 0}
        <div class="text-gray-600">No hay secciones visibles.</div>
      {:else}
        {#each visibleIndexes as realI (realI)}
          {#if active === realI}
            <FormSection
              title={categories[realI].label}
              fields={categories[realI].fields.map((field) => ({
                id: field.id,
                type: field.type,
                label: field.label,
                placeholder: field.placeholder,
                options: field.options,
                error: fieldErrors[realI]?.[field.name] || "",
                value: formData[realI]?.[field.name] ?? "",
                onchange: (value: any) => {
                  updateField(realI, field.name, value);
                },
                accept: field.type === "file" ? (field as any).accept : undefined,
              }))}
            />
          {/if}
        {/each}
      {/if}
    </div>

    <div class="flex justify-between pt-4">
      <Button
        label="Anterior"
        onclick={prev}
        disabled={activeVisible === 0}
        variant="ghost"
      />

      {#if activeVisible < visibleIndexes.length - 1}
        <Button onclick={next} label="Siguiente" variant="ghost" />
      {/if}

      {#if activeVisible === visibleIndexes.length - 1 && visibleIndexes.length > 0}
        <Button
          onclick={() => {
            hasAttemptedNext = true;
            if (validateCurrentStep() && isValid(visibleIndexes, categories, formData, resolveVisibility, fieldErrors) && callbackOnSubmit) {
              callbackOnSubmit(getValues(formData));
            }
          }}
          label="Enviar"
          variant="primary"
        />
      {/if}
    </div>
  </div>
{/if}
