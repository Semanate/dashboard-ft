<script lang="ts">
  import Stepper from "$lib/components/molecules/stepper/Stepper.svelte";
  import FormSection from "$lib/components/molecules/form-section/FormSection.svelte";
  import Button from "$lib/components/atoms/button/Button.svelte";
  import type { OptionsSelects, StepActive } from "$lib/types";
  import { getValuesRobust, isValid, validateStep } from "$lib/utils/forms";
  import ButtonWithIcon from "$lib/components/atoms/button/ButtonWithIcon.svelte";

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
      | "email"
      | "number";
    label: string;
    id: string;
    placeholder?: string;
    options?: Array<OptionsSelects<any>>;
    value: any;
    required?: boolean;
    error?: string;
  }

  interface SubsectionItem {
    subtitle?: string;
    fields: CategoryFormField[];
  }

  interface Subsection {
    title: string;
    items: SubsectionItem[];
    addButton?: {
      label: string;
      show: () => boolean;
      action: () => void;
    };
  }

  interface Category {
    label: string;
    isVisible: (values: Record<string, any>) => boolean;
    fields?: CategoryFormField[];
    subsections?: Subsection[];
  }

  interface Props {
    formData?: Record<string, any>;
    categories: Category[];
    callbackOnSubmit?: (data: Record<string, any>) => void;
    isVisible?: boolean;
    updateNext?: () => void;
    children?: any;
    activeStep: StepActive;
  }

  let activeVisible = $state(0);
  let fieldErrors = $state<Record<number, Record<string, string>>>({});
  let hasAttemptedNext = $state(false);
  let didInit = $state(false);
  let attemptedSteps = $state<Record<number, boolean>>({});

  let {
    categories: items,
    callbackOnSubmit,
    isVisible = true,
    formData = $bindable({}),
    updateNext,
    children,
    activeStep = $bindable({
      step: 0,
      isActive: false,
      label: "",
    }),
  }: Props = $props();

  let values = $derived.by(() => getValuesRobust(formData));

  let categories = $derived.by(() => items);

  /**
   * Obtener todos los campos de una categoría (incluyendo subsecciones)
   */
  function getAllFields(category: Category): CategoryFormField[] {
    const fields: CategoryFormField[] = [];

    // Campos directos
    if (category.fields) {
      fields.push(...category.fields);
    }

    // Campos de subsecciones
    if (category.subsections) {
      category.subsections.forEach((subsection) => {
        subsection.items.forEach((item) => {
          fields.push(...item.fields);
        });
      });
    }

    return fields;
  }

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

  $effect(() => {
    activeStep.isActive = true;
    activeStep.step = activeVisible;
    activeStep.label = categories[active]?.label || "";
  });

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
      attemptedSteps[i] = false;

      const allFields = getAllFields(cat);
      allFields.forEach((field) => {
        initial[i][field.name] = field.value ?? "";
        initialErrors[i][field.name] = "";
      });
    });

    Object.assign(formData, initial);
    Object.assign(fieldErrors, initialErrors);
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
    const { isValid } = validateStep(
      active,
      categories,
      formData,
      resolveVisibility,
      fieldErrors,
    );
    return isValid;
  }

  /**
   * Actualizar campo correctamente
   * y revalidar el step si ya intentamos avanzar
   */
  function updateField(categoryIndex: number, fieldName: string, value: any) {
    if (!formData[categoryIndex]) {
      formData[categoryIndex] = {};
    }

    formData[categoryIndex][fieldName] = value;

    formData = { ...formData };

    if (attemptedSteps[categoryIndex]) {
      validateStep(
        categoryIndex,
        categories,
        formData,
        resolveVisibility,
        fieldErrors,
      );
      fieldErrors = { ...fieldErrors };
    }
  }

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
    attemptedSteps[active] = true;
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

  /**
   * Submit Of the form - SOLO debe dispararse en el último paso
   */
  function handleSubmit(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    console.log("Submit attempt - Current step:", activeVisible, "of", visibleIndexes.length - 1);

    // CRÍTICO: Solo procesar el submit si estamos en el último paso
    if (activeVisible !== visibleIndexes.length - 1) {
      console.log("❌ Not on last step, ignoring submit");
      return;
    }

    console.log("✅ On last step, processing submit...");

    visibleIndexes.forEach((i) => {
      attemptedSteps[i] = true;
    });

    if (
      validateCurrentStep() &&
      isValid(
        visibleIndexes,
        categories,
        formData,
        resolveVisibility,
        fieldErrors,
      ) &&
      callbackOnSubmit
    ) {
      console.log("✅ Form is valid, calling callback");
      callbackOnSubmit(getValuesRobust(formData));
    } else {
      console.log("❌ Form validation failed");
    }
  }

  /**
   * Prevenir submit con Enter en inputs/selects
   */
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" && activeVisible !== visibleIndexes.length - 1) {
      const target = event.target as HTMLElement;
      // Permitir Enter solo en textareas
      if (target.tagName !== "TEXTAREA") {
        event.preventDefault();
        console.log("🚫 Enter key blocked - not on last step");
      }
    }
  }
</script>

{#if isVisible}
  <form 
    onsubmit={handleSubmit} 
    onkeydown={handleKeyDown}
    class="w-full space-y-6"
  >
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
            {@const category = categories[realI]}

            {#if category.subsections}
              <div class="space-y-8">
                {#each category.subsections as subsection}
                  <div class="border-l-4 border-primary-500 pl-6 space-y-6">
                    <h3 class="text-xl font-semibold text-gray-800 mb-4">
                      {subsection.title}
                    </h3>

                    {#each subsection.items as item, itemIndex}
                      <div class="bg-gray-50 p-6 rounded-lg space-y-4">
                        {#if item.subtitle}
                          <h4
                            class="text-lg font-medium text-gray-700 mb-3 border-b pb-2"
                          >
                            {item.subtitle}
                          </h4>
                        {/if}

                        <FormSection
                          title=""
                          fields={item.fields.map((field) => ({
                            id: field.id,
                            type: field.type,
                            label: field.label,
                            placeholder: field.placeholder,
                            options: field.options,
                            error: attemptedSteps[realI]
                              ? fieldErrors[realI]?.[field.name] || ""
                              : "",
                            value: formData[realI]?.[field.name] ?? "",
                            onchange: (value: any) => {
                              updateField(realI, field.name, value);
                            },
                            accept:
                              field.type === "file"
                                ? (field as any).accept
                                : undefined,
                          }))}
                        />
                      </div>
                    {/each}

                    {#if subsection.addButton && subsection.addButton.show()}
                      <div class="flex justify-end mt-4">
                        <ButtonWithIcon
                          type="button"
                          iconButton="BadgePlus"
                          onclick={subsection.addButton.action}
                          label={subsection.addButton.label}
                        />
                      </div>
                    {/if}
                  </div>
                {/each}
              </div>
            {:else}
              <FormSection
                title={category.label}
                fields={category.fields?.map((field) => ({
                  id: field.id,
                  type: field.type,
                  label: field.label,
                  placeholder: field.placeholder,
                  options: field.options,
                  error: attemptedSteps[realI]
                    ? fieldErrors[realI]?.[field.name] || ""
                    : "",
                  value: formData[realI]?.[field.name] ?? "",
                  onchange: (value: any) => {
                    updateField(realI, field.name, value);
                  },
                  accept:
                    field.type === "file" ? (field as any).accept : undefined,
                })) || []}
              />
            {/if}
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
        type="button"
      />

      {#if activeVisible < visibleIndexes.length - 1}
        <Button
          onclick={next}
          label="Siguiente"
          variant="ghost"
          type="button"
        />
      {/if}

      {#if activeVisible === visibleIndexes.length - 1 && visibleIndexes.length > 0}
        <Button label="Enviar" variant="primary" type="submit" />
      {/if}
    </div>
  </form>
{/if}