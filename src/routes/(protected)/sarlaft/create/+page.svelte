<script lang="ts">
  import { ButtonWithIcon, Modal, StepperForm, Button, Icon } from "$lib/components";
  import {
    accountTypesArray,
    cryptoPlatformsArray,
    documentTypesArray,
    entityAccountFinancialsArray,
    filesSarlaftSection,
    foreignCurrencyBaseSection,
    sarlaftCategories,
    cryptoTypesArray,
    signaturesSarlaftSection,
    typesForeignCurrencyArray,
    declarationsSection,
  } from "$lib/constants";
  import type { FormDataType, StepActive } from "$lib/types";
  import { getValuesRobust, toFormData } from "$lib/utils/forms";
  import { goto } from "$app/navigation";
  import {
    createAccountFinancials,
    createProductForeignCurrency,
    createRelation,
    createCryptoWallet,
  } from "$lib/utils/object";

  let showSuccessModal = $state(false);
  let showLoadingModal = $state(false);
  let successMessage = $state("");
  let errorMessage = $state("");
  let showErrorModal = $state(false);

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
        return true;
      } else {
        errorMessage = "Error al guardar el formulario.";
        showErrorModal = true;
        return false;
      }
    } catch (error) {
      console.error("Error saving form data:", error);
    }
    return false;
  }

  async function autoSave() {
    const formData: FormDataType = getValuesRobust(
      formDataState,
    ) as FormDataType;

    if (formData.id || hasChanges()) {
      formData.status = "draft";
      const save = await saveFormData(formData);
      if (save) {
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
  let cryptoWallets = $state([createCryptoWallet()]);

  let relationsAndAccountsSection = $derived.by(() => ({
    label: "Accionistas y Cuentas Financieras",
    isVisible: () => true,
    subsections: [
      {
        title: "Accionistas / Relaciones",
        items: relations.map((_, i) => ({
          subtitle: `Accionista ${i + 1}`,
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
        addButton: {
          label: "Agregar Accionista",
          show: () => totalPercentage < 100,
          action: () => {
            relations = [...relations, createRelation()];
          },
        },
      },
      {
        title: "Cuentas Financieras",
        items: accountsFinancials.map((_, i) => ({
          subtitle: `Cuenta Financiera ${i + 1}`,
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
        addButton: {
          label: "Agregar Cuenta Financiera",
          show: () => true,
          action: () => {
            accountsFinancials = [
              ...accountsFinancials,
              createAccountFinancials(),
            ];
          },
        },
      },
    ],
  }));

  let foreignCurrencySection = $derived.by(() => {
    const formData: FormDataType = getValuesRobust(
      formDataState,
    ) as FormDataType;
    const shouldShowProducts = formData.foreignCurrency?.management === true;
    const shouldShowCrypto = formData.virtualAssets?.hasCrypto === true;

    return {
      label: "Gestión de Divisas y Activos Virtuales",
      isVisible: () => true,
      subsections: [
        {
          title: "Información General de Divisas",
          items: [
            {
              subtitle: "",
              fields: foreignCurrencyBaseSection.fields || [],
            },
          ],
        },
        ...(shouldShowProducts
          ? [
              {
                title: "Productos de Divisas",
                items: productsForeignCurrency.map((_, i) => ({
                  subtitle: `Producto ${i + 1}`,
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
                addButton: {
                  label: "Agregar Producto de Divisas",
                  show: () => shouldShowProducts,
                  action: () => {
                    productsForeignCurrency = [
                      ...productsForeignCurrency,
                      createProductForeignCurrency(),
                    ];
                  },
                },
              },
            ]
          : []),
        ...(shouldShowCrypto
          ? [
              {
                title: "Billeteras de Criptomonedas",
                items: cryptoWallets.map((_, i) => ({
                  subtitle: `Billetera ${i + 1}`,
                  fields: [
                    {
                      id: `cryptoPlatform_${i}`,
                      name: `virtualAssets.wallets[${i}].platform`,
                      type: "select",
                      label: "Plataforma / Exchange",
                      placeholder: "Seleccione la plataforma",
                      options: cryptoPlatformsArray,
                      value: "",
                      required: false,
                    },
                    {
                      id: `cryptoType_${i}`,
                      name: `virtualAssets.wallets[${i}].cryptoType`,
                      type: "select",
                      label: "Tipo de Criptomoneda",
                      placeholder: "Seleccione el tipo de criptomoneda",
                      options: cryptoTypesArray,
                      value: "",
                      required: false,
                    },
                    {
                      id: `walletAddress_${i}`,
                      name: `virtualAssets.wallets[${i}].walletAddress`,
                      type: "text",
                      label: "Dirección de Billetera / ID de Cuenta",
                      placeholder:
                        "Ingrese la dirección de la billetera o ID de cuenta",
                      value: "",
                      required: false,
                    },
                  ],
                })),
                addButton: {
                  label: "Agregar Billetera",
                  show: () => shouldShowCrypto,
                  action: () => {
                    cryptoWallets = [...cryptoWallets, createCryptoWallet()];
                  },
                },
              },
            ]
          : []),
      ],
    };
  });

  const fieldsSarlaft = $derived.by(() => [
    ...sarlaftCategories,
    relationsAndAccountsSection,
    foreignCurrencySection,
    declarationsSection,
    filesSarlaftSection,
    ...signaturesSarlaftSection,
  ]);

  let totalPercentage = $derived.by(() => {
    const data: FormDataType = getValuesRobust(formDataState) as FormDataType;
    const total = data.relations
      ? data.relations.reduce(
          (sum, rel) => sum + Number(rel.percentageParticipation || 0),
          0,
        )
      : 0;
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
      showLoadingModal = false;
      showErrorModal = true;
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
          }}
        />
        <ButtonWithIcon
          variant="info"
          size="small"
          label="Guardar Borrador"
          iconButton="Save"
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
        />

        <ButtonWithIcon
          variant="success"
          size="small"
          label="Completar"
          iconButton="Check"
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
        />

        <ButtonWithIcon
          variant="primary"
          size="small"
          label="Exportar Excel"
          iconButton="FileSpreadsheet"
          onclick={generateExcel}
        />

        <ButtonWithIcon
          variant="secondary"
          size="small"
          label="Descargar Plantilla"
          iconButton="Download"
          onclick={descargar}
        />
      </div>
    </div>

    <!-- Modal de Cargando -->
    <Modal isOpen={showLoadingModal} title="Guardando..." onClose={() => {}}>
      <p class="text-gray-600">
        Por favor, espere mientras se guarda el formulario.
      </p>
    </Modal>

    <!-- Modal de Éxito -->
    <Modal isOpen={showSuccessModal} title="Operación exitosa" onClose={() => {}}>
      <p class="text-gray-600 mb-4">
        {successMessage}
      </p>
      <p class="text-sm text-gray-400">Redirigiendo…</p>
    </Modal>

    <!-- Modal de Error -->
    <Modal isOpen={showErrorModal} title="Error" onClose={() => showErrorModal = false}>
      <p class="text-gray-600 mb-4">
        {errorMessage}
      </p>
      <div class="flex justify-end">
        <Button
          label="Cerrar"
          variant="danger"
          onclick={() => (showErrorModal = false)}
        />
      </div>
    </Modal>

    <StepperForm
      bind:formData={formDataState}
      bind:activeStep
      categories={fieldsSarlaft}
      callbackOnSubmit={handleSubmit}
    >
      {#if activeStep.label === "Accionistas y Cuentas Financieras"}
        <div class="mb-4 space-y-2">
          {#if totalPercentage < 100}
            <p class="text-yellow-600 text-sm font-medium flex items-center gap-1">
              <Icon name="AlertTriangle" size={14} /> El porcentaje total es {totalPercentage}%. Falta completar el
              100%.
            </p>
          {/if}

          {#if totalPercentage > 100}
            <p class="text-red-600 text-sm font-medium flex items-center gap-1">
              <Icon name="X" size={14} /> El porcentaje supera el 100%. Verifique los valores.
            </p>
          {/if}

          {#if totalPercentage === 100}
            <p class="text-green-600 text-sm font-medium flex items-center gap-1">
              <Icon name="Check" size={14} /> El porcentaje accionarial está completo.
            </p>
          {/if}
        </div>
      {/if}
    </StepperForm>
  </div>
</section>
