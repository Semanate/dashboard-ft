<script lang="ts">
  import ButtonWithIcon from "$lib/components/atoms/button/ButtonWithIcon.svelte";
  import StepperForm from "$lib/components/organisms/stepper-form/StepperForm.svelte";
  import { sarlaftCategories } from "$lib/constants";
  import type { FormDataType } from "$lib/types";
  import { getValues } from "$lib/utils/forms";

  let formDataState = $state<Record<number, Record<string, FormDataType>>>({});
  let formData: FormDataType = getValues(formDataState) as FormDataType;

  async function saveFormData(formData: FormDataType): Promise<boolean> {
    try {
      const response = await fetch("/sarlaft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const res = await response.json();
      console.log(res, "SAVE RESPONSE");
      if (res.success) {
        formData.id = res.data.id;
        formData.updatedAt = res.data.updatedAt;
        return true;
      }
    } catch (error) {
      console.error("Error saving form data:", error);
    }
    return false;
  }

  async function autoSave() {
    let formData: FormDataType = getValues(formDataState) as FormDataType;
    if (formData.id || hasChanges()) {
      formData.status = "draft";
      const save = await saveFormData(formData);
      if (save) {
        console.log("Auto-guardado exitoso");
      }
    }
  }

  function hasChanges(): boolean {
    let formData: FormDataType = getValues(formDataState) as FormDataType;
    return (
      formData.naturalPerson.firstName.length > 0 ||
      formData.naturalPerson.docNumber.length > 0 ||
      formData.representative.firstName.length > 0
    );
  }

  async function descargar() {
    const rest = await fetch("/excel");
    const { data } = await rest.json();
    console.log(data);
    // const blob = await res.blob();
    // const url = URL.createObjectURL(blob);

    // const a = document.createElement("a");
    // a.href = url;
    // a.download = "SARLAFT.xlsx";
    // a.click();
  }

  async function generateExcel() {
    const res = await fetch("/excel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "Formulario_Llenado.xlsx";
    a.click();
  }
</script>

<section class="prose max-w-full h-full overflow-y-auto overflow-x-hidden p-4">
  <div class="prose max-w-full h-full overflow-y-auto overflow-x-hidden p-4">
    <div class="mb-6 flex flex-wrap gap-4 items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">
          Formulario SARLAFT
        </h1>
        <p class="text-gray-600">
          Sistema de Administración del Riesgo de Lavado de Activos y de la
          Financiación del Terrorismo
        </p>
        {#if formData.status ?? false}
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            {formData.status === 'completed'
              ? 'bg-green-100 text-green-800'
              : formData.status === 'validated'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-yellow-100 text-yellow-800'}"
          >
            {formData.status === "completed"
              ? "Completado"
              : formData.status === "validated"
                ? "Validado"
                : "Borrador"}
          </span>
        {/if}
      </div>

      <div class="flex gap-2">
        <ButtonWithIcon
          label="Cargar Datos"
          iconButton="Upload"
          variant="secondary"
          size="medium"
          onclick={async () => {
            const response = await fetch("/sarlaft", {
              method: "GET",
            });
            const res = await response.json();
            console.log(res, "CARGAR DATOS");
            // if (res.success && res.data.payload) {
            //   formDataState = $state(res.data.payload);
            // } else {
            //   alert("No se encontraron datos guardados.");
            // }
          }}
        />
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          onclick={async () => {
            formData.status = "draft";
            const success = await saveFormData(formData);
            if (success) {
              alert("Formulario guardado como borrador");
            } else {
              alert("Error al guardar el formulario");
            }
          }}
        >
          💾 Guardar Borrador
        </button>

        <button
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          onclick={async () => {
            formData.status = "completed";
            const success = await saveFormData(formData);
            if (success) {
              alert("Formulario marcado como completado");
            } else {
              alert("Error al completar el formulario");
            }
          }}
        >
          ✅ Completar
        </button>

        <button
          class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
          onclick={generateExcel}
        >
          📄 Exportar Excel
        </button>

        <button
          class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
          onclick={descargar}
        >
          📥 Descargar Plantilla
        </button>
      </div>
    </div>

    {#if getValues(formData).length > 0 && getValues(formData).updatedAt}
      <div class="mb-4 text-sm text-gray-500">
        Última actualización: {new Date(
          getValues<FormDataType>(formData).updatedAt,
        ).toLocaleString("es-CO")}
      </div>
    {/if}

    <StepperForm
      bind:formData={formDataState}
      categories={sarlaftCategories}
      callbackOnSubmit={(data) => {
        console.log(data, "FORM DATA");
        autoSave();
      }}
    />
  </div>
</section>
