<script lang="ts">
  import ButtonWithIcon from "$lib/components/atoms/button/ButtonWithIcon.svelte";
  import StepperForm from "$lib/components/organisms/stepper-form/StepperForm.svelte";
  import {
    accountTypesArray,
    documentTypesArray,
    entityAccountFinancialsArray,
    foreignCurrencyBaseSection,
    sarlaftCategories,
    typesForeignCurrencyArray,
  } from "$lib/constants";
  import type { FormDataType, StepActive } from "$lib/types";
  import { getValues, getValuesRobust, toFormData } from "$lib/utils/forms";
  import { goto } from "$app/navigation";
  import {
    createAccountFinancials,
    createProductForeignCurrency,
    createRelation,
  } from "$lib/utils/object";

  let showSuccessModal = $state(false);
  let showLoadingModal = $state(false);
  let successMessage = $state("");

  let activeStep = $state<StepActive>({ step: 0, isActive: false, label: "" });

  let formDataState = $state<Record<number, Record<string, FormDataType>>>({});

  async function saveFormData(formData: FormDataType): Promise<boolean> {
    try {
      const fd = toFormData(formData);

      const response = await fetch("/sarlaft", {
        method: "POST",
        body: fd,
      });

      const res = await response.json();

      if (res.success) {
        formData.id = res.data.id;
        formData.updatedAt = res.data.updatedAt;
        return true;
      }

      return true;
    } catch (error) {
      console.error("❌ Error saving form data:", error);
    }
    return false;
  }

  async function autoSave() {
    const formData: FormDataType = getValuesRobust(
      formDataState,
    ) as FormDataType;
    console.log("🔄 Auto-saving form data...", formData);

    if (formData.id || hasChanges()) {
      formData.status = "draft";
      const save = await saveFormData(formData);
      if (save) {
        console.log("✅ Auto-guardado exitoso");

        successMessage = "Formulario guardado correctamente.";
        showSuccessModal = true;

        setTimeout(() => {
          showSuccessModal = false;
          goto("/sarlaft/");
        }, 1800);
      }
    }
  }

  function hasChanges(): boolean {
    const formData: FormDataType = getValuesRobust(
      formDataState,
    ) as FormDataType;
    return (
      formData.naturalPerson?.firstName?.length > 0 ||
      formData.naturalPerson?.docNumber?.length > 0 ||
      formData.representative?.firstName?.length > 0
    );
  }

  async function descargar() {
    const rest = await fetch("/excel");
    const { data } = await rest.json();
    const blob = await rest.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "SARLAFT.xlsx";
    a.click();
  }

  async function generateExcel() {
    const formData = getValuesRobust(formDataState) as FormDataType;

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

  let relations = $state([createRelation()]);
  let accountsFinancials = $state([createAccountFinancials()]);
  let productsForeignCurrency = $state([createProductForeignCurrency()]);

  const relationsSections = $derived.by(() =>
    relations.map((_, i) => ({
      label: `Accionista / Relación ${i + 1}`,
      isVisible: () => true,
      fields: [
        {
          id: `relTypeDoc_${i}`,
          name: `relations[${i}].typeDoc`,
          type: "select",
          label: "Tipo documento",
          options: documentTypesArray,
          placeholder: "Seleccione el tipo de documento",
          value: "",
        },
        {
          id: `relDoc_${i}`,
          name: `relations[${i}].docNumber`,
          type: "number",
          label: "Número documento",
          value: "",
        },
        {
          id: `relName_${i}`,
          name: `relations[${i}].socialName`,
          type: "text",
          label: "Nombre / Razón social",
          placeholder: "Ingrese el nombre o razón social",
          value: "",
        },
        {
          id: `relPercent_${i}`,
          name: `relations[${i}].percentageParticipation`,
          type: "number",
          label: "% Participación",
          placeholder: "Ingrese el porcentaje de participación",
          value: "",
        },
        {
          id: `relActAdmin_${i}`,
          name: `relations[${i}].activityAdminResource`,
          type: "text",
          label: "Origen de fondos / actividad económica",
          placeholder:
            "Describa la actividad económica o el origen de los fondos",
          value: "",
        },
        {
          id: `relRepGrade_${i}`,
          name: `relations[${i}].activityReputationGradePublic`,
          type: "select",
          label: "Grado reputación pública",
          placeholder: "Seleccione el grado de reputación pública",
          options: [
            { label: "Bajo", value: "low" },
            { label: "Medio", value: "medium" },
            { label: "Alto", value: "high" },
          ],
          value: "",
        },
      ],
    })),
  );

  const accountsFinancialsSections = $derived.by(() =>
    accountsFinancials.map((_, i) => ({
      label: `Cuenta Financiera ${i + 1}`,
      isVisible: () => true,
      fields: [
        {
          id: `accType_${i}`,
          name: `accountsFinancials[${i}].accountType`,
          type: "select",
          label: "Tipo de cuenta",
          placeholder: "Seleccione el tipo de cuenta",
          options: accountTypesArray,
          value: "",
        },
        {
          id: `accNumber_${i}`,
          name: `accountsFinancials[${i}].accountNumber`,
          type: "text",
          label: "Número de cuenta",
          value: "",
        },
        {
          id: `accNameEntity_${i}`,
          name: `accountsFinancials[${i}].accountNameEntity`,
          type: "select",
          label: "Nombre de la entidad",
          placeholder: "Seleccione la entidad financiera",
          options: entityAccountFinancialsArray,
          value: "",
        },
      ],
    })),
  );

  const productsForeignCurrencySections = $derived.by(() =>
    productsForeignCurrency.map((_, i) => ({
      isVisible: (v) => v.foreignCurrency?.management === true,
      label: `Producto de Divisas ${i + 1}`,
      fields: [
        {
          id: `fxType_${i}`,
          name: `foreignCurrency.products[${i}].type`,
          type: "select",
          placeholder: "Seleccione un tipo de producto",
          options: typesForeignCurrencyArray,
          label: "Tipo de producto",
          required: false,
          value: "",
        },
        {
          id: `fxEntity_${i}`,
          name: `foreignCurrency.products[${i}].entity`,
          type: "select",
          placeholder: "Seleccione una entidad",
          label: "Entidad",
          required: false,
          options: entityAccountFinancialsArray,
          value: "",
        },
        {
          id: `fxCountry_${i}`,
          name: `foreignCurrency.products[${i}].country`,
          type: "text",
          label: "País",
          required: false,
          value: "",
        },
        {
          id: `fxCurrency_${i}`,
          name: `foreignCurrency.products[${i}].currency`,
          type: "text",
          label: "Moneda",
          required: false,
          value: "",
        },
      ],
    })),
  );

  const filesSarlaftSection = {
    label: "Cargar Documentos Soporte",
    isVisible: () => true,
    fields: [
      {
        id: "legalRepresentativeId",
        name: "supportingDocuments.legalRepresentativeId",
        type: "file",
        label: "Cédula del Representante Legal",
        required: true,
        accept: ".pdf,.jpg,.png",
        placeholder: "Seleccione la cédula del representante legal",
        value: null,
      },
      {
        id: "chamberOfCommerceCertificate",
        name: "supportingDocuments.chamberOfCommerceCertificate",
        type: "file",
        label:
          "Certificado de Existencia y Representación Legal (Cámara de Comercio)",
        required: true,
        accept: ".pdf,.jpg,.png",
        placeholder: "Seleccione el certificado de Cámara de Comercio",
        value: null,
      },
      {
        id: "shareholdingCompositionCertificate",
        name: "supportingDocuments.shareholdingCompositionCertificate",
        type: "file",
        label: "Certificado de Composición Accionaria",
        required: true,
        placeholder: "Seleccione el certificado de composición accionaria",
        value: null,
        accept: ".pdf,.jpg,.png",
      },
      {
        id: "companyRut",
        name: "supportingDocuments.companyRut",
        type: "file",
        label: "RUT de la Empresa",
        required: true,
        placeholder: "Seleccione el RUT de la empresa",
        value: null,
        accept: ".pdf,.jpg,.png",
      },
    ],
  };

  const fieldsSarlaft = $derived.by(() => [
    ...sarlaftCategories,
    ...relationsSections,
    ...accountsFinancialsSections,
    foreignCurrencyBaseSection,
    ...productsForeignCurrencySections,
    filesSarlaftSection,
  ]);

  let totalPercentage = $derived.by(() => {
    const data: FormDataType = getValuesRobust(formDataState) as FormDataType;

    console.log("📥 Calculando porcentaje total con data:", data);
    const total = data.relations
      ? data.relations.reduce(
          (sum, rel) => sum + Number(rel.percentageParticipation || 0),
          0,
        )
      : 0;

    console.log("🔢 Calculando porcentaje total:", total);
    console.log("📊 Relations data:", data.relations);
    return total;
  });

  const handleSubmit = async (data: FormDataType) => {
    showLoadingModal = true;

    const success = await saveFormData(data);
    showLoadingModal = false;

    if (success) {
      successMessage = "Formulario guardado correctamente.";
      showSuccessModal = true;

      setTimeout(() => {
        showSuccessModal = false;
        goto("/sarlaft/");
      }, 1800);
    } else {
      alert("Error al guardar el formulario");
    }
  };
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
            //   formDataState = res.data.payload;
            // } else {
            //   alert("No se encontraron datos guardados.");
            // }
          }}
        />
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          onclick={async () => {
            const formData = getValuesRobust(formDataState) as FormDataType;
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
            const formData = getValuesRobust(formDataState) as FormDataType;
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

    <!-- {@const currentFormData = getValuesRobust(formDataState)}
    {#if currentFormData.updatedAt}
      <div class="mb-4 text-sm text-gray-500">
        Última actualización: {new Date(
          currentFormData.updatedAt,
        ).toLocaleString("es-CO")}
      </div>
    {/if} -->

    {#if showLoadingModal}
      <div
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      >
        <div
          class="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm text-center"
        >
          <h2 class="text-lg font-semibold text-gray-900 mb-2">
            ⏳ Guardando...
          </h2>

          <p class="text-gray-600 mb-4">
            Por favor, espere mientras se guarda el formulario.
          </p>
        </div>
      </div>
    {/if}

    {#if showSuccessModal}
      <div
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      >
        <div
          class="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm text-center"
        >
          <h2 class="text-lg font-semibold text-gray-900 mb-2">
            ✔ Operación exitosa
          </h2>

          <p class="text-gray-600 mb-4">
            {successMessage}
          </p>

          <p class="text-sm text-gray-400">Redirigiendo…</p>
        </div>
      </div>
    {/if}

    <StepperForm
      bind:formData={formDataState}
      bind:activeStep
      categories={fieldsSarlaft}
      callbackOnSubmit={handleSubmit}
    >
      <div class="flex">
        <ButtonWithIcon
          hidden={totalPercentage < 100 &&
          activeStep.label.includes("Accionista")
            ? false
            : true}
          label="Agregar Accionistas"
          iconButton="PlusCircle"
          variant="ghost"
          size="medium"
          onclick={async () => {
            relations = [...relations, createRelation()];
          }}
        />
        <ButtonWithIcon
          hidden={activeStep.label.includes("Cuenta Financiera") ? false : true}
          label="Agregar Cuenta Financiera"
          iconButton="PlusCircle"
          variant="ghost"
          size="medium"
          onclick={() => {
            accountsFinancials = [
              ...accountsFinancials,
              createAccountFinancials(),
            ];
          }}
        />
      </div>

      {#if totalPercentage < 100 && activeStep.label.includes("Accionista")}
        <p class="text-yellow-600 text-sm">
          El porcentaje total es {totalPercentage}%. Falta completar el 100%.
        </p>
      {/if}

      {#if totalPercentage > 100 && activeStep.label.includes("Accionista")}
        <p class="text-red-600 text-sm">
          El porcentaje supera el 100%. Verifique los valores.
        </p>
      {/if}

      {#if totalPercentage === 100 && activeStep.label.includes("Accionista")}
        <p class="text-green-600 text-sm">
          El porcentaje accionarial está completo.
        </p>
      {/if}
    </StepperForm>
  </div>
</section>