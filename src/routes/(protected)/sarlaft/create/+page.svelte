<script lang="ts">
  import {
    ButtonWithIcon,
    Modal,
    StepperForm,
    Button,
    Icon,
  } from "$lib/components";
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

  // Load data modal state
  let showLoadDataModal = $state(false);
  let draftForms = $state<any[]>([]);
  let isLoadingDrafts = $state(false);
  let currentFormId = $state<string | null>(null);

  // Saving state
  let isSaving = $state(false);

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

  // Load draft forms for selection
  async function loadDraftForms() {
    isLoadingDrafts = true;
    try {
      const response = await fetch("/sarlaft?status=draft", {
        method: "GET",
      });
      const res = await response.json();
      if (res.success) {
        draftForms = res.data.items || [];
      }
    } catch (error) {
      console.error("Error loading draft forms:", error);
    } finally {
      isLoadingDrafts = false;
    }
  }

  // Open load data modal
  async function openLoadDataModal() {
    showLoadDataModal = true;
    await loadDraftForms();
  }

  // Load selected form data into the current form
  function loadFormData(form: any) {
    currentFormId = form.id;

    // Populate formDataState with the loaded data
    // The form structure is stored in the payload
    const payload = form;

    // Build the formDataState structure
    formDataState = {
      0: {
        dateAggrement: payload.dateAggrement || "",
        cityAggrement: payload.cityAggrement || "",
        typePersonAggrement: payload.typePersonAggrement || "",
      },
      1: payload.naturalPerson || {},
      2: payload.juridicalPerson || {},
      3: payload.representative || {},
      4: payload.financialInformation || {},
      5: {}, // Relations and accounts will be handled separately
      6: payload.foreignCurrency || {},
      7: payload.cryptoCurrency || {},
      8: payload.declarations || {},
      9: payload.supportingDocuments || {},
      10: payload.signatures || {},
    };

    // Load relations if present
    if (payload.relations && Array.isArray(payload.relations)) {
      relations =
        payload.relations.length > 0 ? payload.relations : [createRelation()];
    }

    // Load account financials if present
    if (
      payload.accountEntityFinancials &&
      Array.isArray(payload.accountEntityFinancials)
    ) {
      accountsFinancials =
        payload.accountEntityFinancials.length > 0
          ? payload.accountEntityFinancials
          : [createAccountFinancials()];
    }

    // Load foreign currency products if present
    if (
      payload.foreignCurrency?.products &&
      Array.isArray(payload.foreignCurrency.products)
    ) {
      productsForeignCurrency =
        payload.foreignCurrency.products.length > 0
          ? payload.foreignCurrency.products
          : [createProductForeignCurrency()];
    }

    // Load crypto wallets if present
    if (
      payload.cryptoCurrency?.wallets &&
      Array.isArray(payload.cryptoCurrency.wallets)
    ) {
      cryptoWallets =
        payload.cryptoCurrency.wallets.length > 0
          ? payload.cryptoCurrency.wallets
          : [createCryptoWallet()];
    }

    showLoadDataModal = false;
    successMessage = "Datos del borrador cargados correctamente.";
    showSuccessModal = true;
    setTimeout(() => {
      showSuccessModal = false;
    }, 2000);
  }

  // Save as draft with improved feedback
  async function saveDraft() {
    isSaving = true;
    showLoadingModal = true;

    try {
      const formData = getValuesRobust(formDataState) as FormDataType;
      formData.status = "draft";

      // Include current form ID if editing existing draft
      if (currentFormId) {
        formData.id = currentFormId;
      }

      const success = await saveFormData(formData);

      if (success) {
        successMessage = "Formulario guardado como borrador exitosamente.";
        showLoadingModal = false;
        showSuccessModal = true;

        setTimeout(() => {
          showSuccessModal = false;
          goto("/sarlaft");
        }, 1800);
      } else {
        showLoadingModal = false;
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      showLoadingModal = false;
      errorMessage = "Error al guardar el borrador.";
      showErrorModal = true;
    } finally {
      isSaving = false;
    }
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

    const success = await saveFormData({
      ...data,
      status: "submitted",
    });
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
          label="Cargar Borrador"
          iconButton="FolderOpen"
          variant="secondary"
          size="medium"
          onclick={openLoadDataModal}
        />
        <ButtonWithIcon
          variant="info"
          size="medium"
          label="Guardar Borrador"
          iconButton="Save"
          onclick={saveDraft}
          disabled={isSaving}
        />

        <ButtonWithIcon
          variant="primary"
          size="medium"
          label="Exportar Excel"
          iconButton="FileSpreadsheet"
          onclick={generateExcel}
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
    <Modal
      isOpen={showSuccessModal}
      title="Operación exitosa"
      onClose={() => {}}
    >
      <p class="text-gray-600 mb-4">
        {successMessage}
      </p>
      <p class="text-sm text-gray-400">Redirigiendo…</p>
    </Modal>

    <!-- Modal de Error -->
    <Modal
      isOpen={showErrorModal}
      title="Error"
      onClose={() => (showErrorModal = false)}
    >
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

    <!-- Modal de Cargar Borrador -->
    <Modal
      isOpen={showLoadDataModal}
      title="Cargar Borrador"
      onClose={() => (showLoadDataModal = false)}
      size="lg"
    >
      <div class="p-4">
        <p class="text-gray-600 mb-4">
          Selecciona un formulario borrador para continuar editándolo.
        </p>

        {#if isLoadingDrafts}
          <div class="flex items-center justify-center py-8">
            <Icon
              name="Loader2"
              class="w-8 h-8 animate-spin text-primary-500"
            />
            <span class="ml-2 text-gray-600">Cargando borradores...</span>
          </div>
        {:else if draftForms.length === 0}
          <div class="text-center py-8">
            <Icon name="FileX" class="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p class="text-gray-500">No hay borradores guardados.</p>
            <p class="text-sm text-gray-400 mt-1">
              Los formularios que guardes como borrador aparecerán aquí.
            </p>
          </div>
        {:else}
          <div class="space-y-2 max-h-80 overflow-y-auto">
            {#each draftForms as form}
              <button
                type="button"
                class="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary-300 transition-colors text-left"
                onclick={() => loadFormData(form)}
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium text-gray-900">
                      {form.typePersonAggrement === "NAT"
                        ? (form.naturalPerson?.firstName || "Sin nombre") +
                          " " +
                          (form.naturalPerson?.lastName || "")
                        : form.juridicalPerson?.businessName ||
                          "Sin razón social"}
                    </p>
                    <p class="text-sm text-gray-500">
                      {form.typePersonAggrement === "NAT"
                        ? "Persona Natural"
                        : "Persona Jurídica"}
                      {#if form.naturalPerson?.docNumber || form.juridicalPerson?.docNumber}
                        • Doc: {form.naturalPerson?.docNumber ||
                          form.juridicalPerson?.docNumber}
                      {/if}
                    </p>
                    <p class="text-xs text-gray-400 mt-1">
                      Actualizado: {new Date(form.updated_at).toLocaleString()}
                    </p>
                  </div>
                  <Icon name="ChevronRight" class="w-5 h-5 text-gray-400" />
                </div>
              </button>
            {/each}
          </div>
        {/if}

        <div class="flex justify-end mt-4 pt-4 border-t">
          <Button
            label="Cancelar"
            variant="secondary"
            onclick={() => (showLoadDataModal = false)}
          />
        </div>
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
            <p
              class="text-yellow-600 text-sm font-medium flex items-center gap-1"
            >
              <Icon name="AlertTriangle" size={14} /> El porcentaje total es {totalPercentage}%.
              Falta completar el 100%.
            </p>
          {/if}

          {#if totalPercentage > 100}
            <p class="text-red-600 text-sm font-medium flex items-center gap-1">
              <Icon name="X" size={14} /> El porcentaje supera el 100%. Verifique
              los valores.
            </p>
          {/if}

          {#if totalPercentage === 100}
            <p
              class="text-green-600 text-sm font-medium flex items-center gap-1"
            >
              <Icon name="Check" size={14} /> El porcentaje accionarial está completo.
            </p>
          {/if}
        </div>
      {/if}
    </StepperForm>
  </div>
</section>
