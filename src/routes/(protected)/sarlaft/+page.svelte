<script lang="ts">
  import StepperForm from "$lib/components/organisms/stepper-form/StepperForm.svelte";
  import {
    accountTypesArray,
    activitySectorsArray,
    citysArray,
    documentTypesArray,
    entityAccountFinancialsArray,
    typesForeignCurrencyArray,
    typesPersonArray,
  } from "$lib/constants";
  import type { FormDataType } from "$lib/types";
  import { getValues } from "$lib/utils/forms";

  // Funciones para manejo de datos SARLAFT
  // async function loadFormData(userId?: string): Promise<FormDataType | null> {
  //   try {
  //     const response = await fetch(
  //       `/api/sarlaft${userId ? `?userId=${userId}` : ""}`,
  //       {
  //         method: "GET",
  //       },
  //     );

  //     if (response.ok) {
  //       const data = await response.json();
  //       return data;
  //     }
  //   } catch (error) {
  //     console.error("Error loading form data:", error);
  //   }
  //   return null;
  // }
  let formDataState = $state<Record<number, Record<string, FormDataType>>>({});
  let formData: FormDataType = getValues(formDataState) as FormDataType;
  async function saveFormData(formData: FormDataType): Promise<boolean> {
    try {
      console.log("Saving form data:", formData);
      const response = await fetch("/sarlaft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const res = await response.json();
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
    if (formData.id || hasChanges()) {
      formData.status = "draft";
      await saveFormData(formData);
    }
  }

  function hasChanges(): boolean {
    return (
      formData.naturalPerson.firstName.length > 0 ||
      formData.naturalPerson.docNumber.length > 0 ||
      formData.representative.firstName.length > 0
    );
  }

  // Auto-guardar cada 30 segundos
  let autoSaveInterval: any;

  // onMount(() => {
  //   // Función async interna
  //   const initializeForm = async () => {
  //     // Cargar datos existentes si los hay
  //     const existingData = await loadFormData();
  //     if (existingData) {
  //       form = existingData;
  //     }
  //   };

  //   // Ejecutar la inicialización
  //   initializeForm();

  //   // Configurar auto-guardado
  //   autoSaveInterval = setInterval(autoSave, 30000);

  //   return () => {
  //     if (autoSaveInterval) {
  //       clearInterval(autoSaveInterval);
  //     }
  //   };
  // });
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

  export const sarlaftCategories = [
    // ============================================================
    // 1.1 INFORMACIÓN GENERAL
    // ============================================================F
    {
      label: "INFORMACIÓN GENERAL",
      fields: [
        {
          id: "dateAggrement",
          name: "dateAggrement",
          type: "date",
          label: "Fecha",
          required: true,
          placeholder: "",
          value: new Date().toISOString().split("T")[0],
        },
        {
          id: "cityAggrement",
          name: "cityAggrement",
          type: "select",
          label: "Ciudad",
          required: true,
          options: citysArray,
          placeholder: "Seleccione una ciudad",
          value: "",
        },
        {
          id: "typePersonAggrement",
          name: "typePersonAggrement",
          placeholder: "Seleccione un tipo de persona",
          type: "select",
          label: "Tipo de persona",
          required: true,
          options: typesPersonArray,
        },
      ],
    },
    // ============================================================
    // 2. REPRESENTANTE LEGAL
    // ============================================================
    {
      label: "DATOS DEL REPRESENTANTE LEGAL Y/O APODERADO",
      isVisible: (v) => v.typePersonAggrement === "LGL",
      fields: [
        {
          id: "repFirstName",
          name: "representative.firstName",
          type: "text",
          label: "Nombres",
          required: false,
          value: "",
        },
        {
          id: "repLastName1",
          name: "representative.lastName1",
          type: "text",
          label: "Apellido 1",
          required: false,
          value: "",
        },
        {
          id: "repLastName2",
          name: "representative.lastName2",
          type: "text",
          label: "Apellido 2",
          required: false,
          value: "",
        },
        {
          id: "repTypeDoc",
          name: "representative.typeDoc",
          type: "select",
          label: "Tipo de documento",
          required: false,
          options: documentTypesArray,
          placeholder: "Seleccione un tipo de documento",
          value: "",
        },
        {
          id: "repDocNumber",
          name: "representative.docNumber",
          type: "text",
          label: "Número de documento",
          required: false,
          value: "",
        },
        {
          id: "repPhone",
          name: "representative.phone",
          type: "text",
          label: "Teléfono",
          required: false,
          value: "",
        },
        {
          id: "repEmail",
          name: "representative.email",
          type: "text",
          label: "Email",
          required: false,
          value: "",
        },
        {
          id: "repCity",
          name: "representative.city",
          type: "select",
          label: "Ciudad",
          placeholder: "Seleccione una ciudad",
          options: citysArray,
          required: false,
          value: "",
        },
        {
          id: "repActivity",
          name: "representative.activitySector",
          type: "select",
          label: "Sector de actividad",
          placeholder: "Seleccione un sector de actividad",
          required: false,
          options: activitySectorsArray,
          value: "",
        },
        {
          id: "repAddress",
          name: "representative.address",
          type: "text",
          label: "Dirección",
          required: false,
          value: "",
        },
      ],
    },

    // ============================================================
    // 3. PERSONA NATURAL
    // ============================================================
    {
      label: "IDENTIFICACIÓN PERSONA NATURAL O EXTRANJERA",
      isVisible: (v) => v.typePersonAggrement === "NAT",
      fields: [
        {
          id: "natFirstName",
          name: "naturalPerson.firstName",
          type: "text",
          label: "Nombres",
          required: true,
          value: "",
        },
        {
          id: "natLast1",
          name: "naturalPerson.lastName1",
          type: "text",
          label: "Apellido 1",
          required: false,
          value: "",
        },
        {
          id: "natLast2",
          name: "naturalPerson.lastName2",
          type: "text",
          label: "Apellido 2",
          required: false,
          value: "",
        },
        {
          id: "natTypeDoc",
          name: "naturalPerson.typeDoc",
          type: "select",
          label: "Tipo de documento",
          options: documentTypesArray,
          placeholder: "Seleccione un tipo de documento",
          required: false,
          value: "",
        },
        {
          id: "natDocNumber",
          name: "naturalPerson.docNumber",
          type: "text",
          label: "Número de documento",
          required: false,
          value: "",
        },
        {
          id: "natBirth",
          name: "naturalPerson.dateOfBirth",
          type: "date",
          label: "Fecha de nacimiento",
          placeholder: "MM/DD/AAAA",
          required: false,
          value: "",
        },
        {
          id: "natBirthPlace",
          name: "naturalPerson.placeOfBirth",
          type: "text",
          label: "Lugar de nacimiento",
          required: false,
          value: "",
        },
        {
          id: "natPhone",
          name: "naturalPerson.phone",
          type: "text",
          label: "Teléfono",
          required: false,
          value: "",
        },
        {
          id: "natEmail",
          name: "naturalPerson.email",
          type: "text",
          label: "Email",
          required: false,
          value: "",
        },
        {
          id: "natCity",
          name: "naturalPerson.city",
          type: "select",
          label: "Ciudad",
          placeholder: "Seleccione una ciudad",
          options: citysArray,
          required: false,
          value: "",
        },
        {
          id: "natAddress",
          name: "naturalPerson.address",
          type: "text",
          label: "Dirección",
          required: false,
          value: "",
        },
        {
          id: "natActivity",
          name: "naturalPerson.activitySector",
          type: "select",
          label: "Sector de actividad",
          options: activitySectorsArray,
          placeholder: "Seleccione un sector de actividad",
          required: false,
          value: "",
        },
      ],
    },

    // ============================================================
    // 4. PERSONA JURÍDICA
    // ============================================================
    {
      label: "IDENTIFICACIÓN PERSONA JURÍDICA",
      isVisible: (v) => v.typePersonAggrement === "JUR",
      fields: [
        {
          id: "jurName",
          name: "juridicalPerson.businessName",
          type: "text",
          label: "Razón Social",
          required: false,
          value: "",
        },
        {
          id: "jurNit",
          name: "juridicalPerson.nit",
          type: "text",
          label: "NIT",
          required: false,
          value: "",
        },
        {
          id: "jurPhone",
          name: "juridicalPerson.phone",
          type: "text",
          label: "Teléfono",
          required: false,
          value: "",
        },
        {
          id: "jurEmail",
          name: "juridicalPerson.email",
          type: "text",
          label: "Email 1",
          required: false,
          value: "",
        },
        {
          id: "jurEmail2",
          name: "juridicalPerson.email2",
          type: "text",
          label: "Email 2",
          required: false,
          value: "",
        },
        {
          id: "jurCity",
          name: "juridicalPerson.city",
          type: "select",
          label: "Ciudad",
          placeholder: "Seleccione una ciudad",
          options: citysArray,
          required: false,
          value: "",
        },
        {
          id: "jurPhone2",
          name: "juridicalPerson.phone2",
          type: "text",
          label: "Teléfono 2",
          required: false,
          value: "",
        },
        {
          id: "jurAddress",
          name: "juridicalPerson.address",
          type: "text",
          label: "Dirección",
          required: false,
          value: "",
        },
        {
          id: "jurAddress2",
          name: "juridicalPerson.address2",
          type: "text",
          label: "Dirección 2",
          required: false,
          value: "",
        },
        {
          id: "jurActivity",
          name: "juridicalPerson.activitySector",
          type: "text",
          label: "Sector de actividad",
          required: false,
          value: "",
        },
      ],
    },
    // ============================================================
    // INFORMACIÓN FINANCIERA SARLAFT
    // ============================================================
    // {
    //   label: "Información Financiera",
    //   fields: [
    //     {
    //       id: "finMonthlyIncome",
    //       name: "financialInfo.monthlyIncome",
    //       type: "number",
    //       label: "Ingresos mensuales (COP)",
    //       required: false,
    //       value: 0,
    //     },
    //     {
    //       id: "finOtherIncome",
    //       name: "financialInfo.otherIncome",
    //       type: "number",
    //       label: "Otros ingresos mensuales (COP)",
    //       required: false,
    //       value: 0,
    //     },
    //     {
    //       id: "finMonthlyExpenses",
    //       name: "financialInfo.monthlyExpenses",
    //       type: "number",
    //       label: "Egresos mensuales (COP)",
    //       required: false,
    //       value: 0,
    //     },
    //     {
    //       id: "finAssets",
    //       name: "financialInfo.assets",
    //       type: "number",
    //       label: "Activos totales (COP)",
    //       required: false,
    //       value: 0,
    //     },
    //     {
    //       id: "finLiabilities",
    //       name: "financialInfo.liabilities",
    //       type: "number",
    //       label: "Pasivos totales (COP)",
    //       required: false,
    //       value: 0,
    //     },
    //     {
    //       id: "finPatrimony",
    //       name: "financialInfo.patrimony",
    //       type: "number",
    //       label: "Patrimonio (COP)",
    //       required: false,
    //       value: 0,
    //     },
    //     {
    //       id: "finIncomeSource",
    //       name: "financialInfo.incomeSource",
    //       type: "select",
    //       label: "Origen de los ingresos",
    //       options: [
    //         { value: "salario", label: "Salario" },
    //         { value: "honorarios", label: "Honorarios profesionales" },
    //         { value: "pension", label: "Pensión" },
    //         { value: "negocios", label: "Negocios propios" },
    //         { value: "inversiones", label: "Inversiones" },
    //         { value: "arriendos", label: "Arriendos" },
    //         { value: "otros", label: "Otros" },
    //       ],
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: "finIncomeDescription",
    //       name: "financialInfo.incomeSourceDescription",
    //       type: "textarea",
    //       label: "Descripción del origen de ingresos",
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: "finCurrency",
    //       name: "financialInfo.operationCurrency",
    //       type: "select",
    //       label: "Moneda de operación",
    //       options: [
    //         { value: "COP", label: "Peso colombiano" },
    //         { value: "USD", label: "Dólar estadounidense" },
    //         { value: "EUR", label: "Euro" },
    //       ],
    //       required: false,
    //       value: "COP",
    //     },
    //   ],
    // },

    // ============================================================
    // INFORMACIÓN LABORAL SARLAFT
    // ============================================================
    // {
    //   label: "Información Laboral",
    //   fields: [
    //     {
    //       id: "labCompany",
    //       name: "laboralInfo.company",
    //       type: "text",
    //       label: "Empresa donde labora",
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: "labPosition",
    //       name: "laboralInfo.position",
    //       type: "text",
    //       label: "Cargo",
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: "labWorkTime",
    //       name: "laboralInfo.workTime",
    //       type: "select",
    //       label: "Tiempo en el cargo",
    //       options: [
    //         { value: "menos_1", label: "Menos de 1 año" },
    //         { value: "1_3", label: "Entre 1 y 3 años" },
    //         { value: "3_5", label: "Entre 3 y 5 años" },
    //         { value: "mas_5", label: "Más de 5 años" },
    //       ],
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: "labAddress",
    //       name: "laboralInfo.companyAddress",
    //       type: "text",
    //       label: "Dirección de la empresa",
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: "labCity",
    //       name: "laboralInfo.companyCity",
    //       type: "text",
    //       label: "Ciudad de la empresa",
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: "labCountry",
    //       name: "laboralInfo.companyCountry",
    //       type: "text",
    //       label: "País de la empresa",
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: "labPhone",
    //       name: "laboralInfo.companyPhone",
    //       type: "text",
    //       label: "Teléfono de la empresa",
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: "labActivity",
    //       name: "laboralInfo.economicActivity",
    //       type: "select",
    //       label: "Actividad económica",
    //       options: activitySectorsArray,
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: "labTaxRegime",
    //       name: "laboralInfo.taxRegime",
    //       type: "select",
    //       label: "Régimen tributario",
    //       options: [
    //         { value: "comun", label: "Régimen común" },
    //         { value: "simplificado", label: "Régimen simplificado" },
    //         { value: "no_responsable", label: "No responsable" },
    //       ],
    //       required: false,
    //       value: "",
    //     },
    //   ],
    // },

    // ============================================================
    // 5. RELACIONES (8 ACCIONISTAS)
    // ============================================================
    ...Array.from({ length: 8 }).map((_, i) => ({
      label: `Accionista / Relación ${i + 1}`,
      fields: [
        {
          id: `relTypeDoc_${i}`,
          name: `relations[${i}].typeDoc`,
          type: "select",
          placeholder: "Seleccione un tipo de documento",
          label: "Tipo documento",
          options: documentTypesArray,
          required: false,
          value: "",
        },
        {
          id: `relDoc_${i}`,
          name: `relations[${i}].docNumber`,
          type: "text",
          label: "Número documento",
          required: false,
          value: "",
        },
        {
          id: `relName_${i}`,
          name: `relations[${i}].socialName`,
          type: "text",
          label: "Nombre / Razón social",
          required: false,
          value: "",
        },
        {
          id: `relPercent_${i}`,
          name: `relations[${i}].percentageParticipation`,
          type: "text",
          label: "% Participación",
          required: false,
          value: "",
        },
        {
          id: `relActAdmin_${i}`,
          name: `relations[${i}].activityAdminResource`,
          type: "text",
          label: "Actividad recursos admin.",
          required: false,
          value: "",
        },
        {
          id: `relRepGrade_${i}`,
          name: `relations[${i}].activityReputationGradePublic`,
          type: "text",
          label: "Grado reputación pública",
          required: false,
          value: "",
        },
      ],
    })),

    // ============================================================
    // 6. CUENTAS FINANCIERAS (3)
    // ============================================================
    ...Array.from({ length: 3 }).map((_, i) => ({
      label: `Cuenta financiera ${i + 1}`,
      fields: [
        {
          id: `accType_${i}`,
          name: `accountEntityFinancials[${i}].accountType`,
          type: "select",
          label: "Tipo de cuenta",
          required: false,
          value: "",
          placeholder: "Seleccione un tipo de cuenta",
          options: accountTypesArray,
        },
        {
          id: `accNumber_${i}`,
          name: `accountEntityFinancials[${i}].accountNumber`,
          type: "text",
          label: "Número de cuenta",
          required: false,
          value: "",
        },
        {
          id: `accEntity_${i}`,
          name: `accountEntityFinancials[${i}].accountNameEntity`,
          type: "select",
          label: "Entidad financiera",
          required: false,
          value: "",
          placeholder: "Seleccione una entidad financiera",
          options: entityAccountFinancialsArray,
        },
      ],
    })),

    // ============================================================
    // 7. PEP - AMPLIADO PARA SARLAFT
    // ============================================================
    {
      label: "Preguntas PEP",
      fields: [
        {
          id: "pepPublic",
          name: "pep.managePublicResources",
          type: "checkbox",
          label: "¿Maneja recursos públicos? (SI/NO)",
          required: false,
          value: "",
        },
        {
          id: "pepPower",
          name: "pep.publicPower",
          type: "checkbox",
          label: "¿Ejerce poder público? (SI/NO)",
          required: false,
          value: "",
        },
        {
          id: "pepRelation",
          name: "pep.relation",
          type: "checkbox",
          label: "¿Tiene relación con persona PEP? (SI/NO)",
          required: false,
          value: "",
        },
        {
          id: "pepRelationName",
          name: "pep.relationName",
          type: "text",
          label: "Nombre del PEP (si aplica)",
          required: false,
          value: "",
        },
        {
          id: "pepTax",
          name: "pep.taxObligations",
          type: "checkbox",
          label: "¿Tiene obligaciones tributarias en otro país? (SI/NO)",
          required: false,
          value: "",
        },
      ],
    },

    // ============================================================
    // 8. MONEDA EXTRANJERA
    // ============================================================
    {
      label: "Moneda Extranjera / Activos Virtuales",
      fields: [
        {
          id: "fxManage",
          name: "foreignCurrency.management",
          type: "checkbox",
          label:
            "¿Maneja productos financieros en moneda extranjera o activos virtuales? (SI/NO)",
          required: false,
          value: "",
        },
      ],
    },

    ...Array.from({ length: 2 }).map((_, i) => ({
      label: `Producto en moneda extranjera ${i + 1}`,
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

    // ============================================================
    // 9. FIRMA SOLICITANTE
    // ============================================================
    {
      label: "Firma del Solicitante",
      fields: [
        {
          id: "signName",
          name: "signature.name",
          type: "text",
          label: "Nombre",
          required: false,
          value: "",
        },
        {
          id: "signDoc",
          name: "signature.document",
          type: "text",
          label: "Documento",
          required: false,
          value: "",
        },
        {
          id: "signSignature",
          name: "signature.signature",
          type: "signature",
          label: "Firma",
          required: false,
          value: "",
        },
      ],
    },

    // ============================================================
    // 10. VERIFICACIÓN INTERNA 1 Y 2
    // ============================================================
    {
      label: "Verificación Interna — Comercial",
      fields: [
        {
          id: "ver1Name",
          name: "verification.block1.name",
          type: "text",
          label: "Nombre",
          required: false,
          value: "",
        },
        {
          id: "ver1Sign",
          name: "verification.block1.signature",
          type: "text",
          label: "Firma",
          required: false,
          value: "",
        },
        {
          id: "ver1Date",
          name: "verification.block1.date",
          type: "text",
          label: "Fecha",
          required: false,
          value: "",
        },
        {
          id: "ver1Time",
          name: "verification.block1.time",
          type: "text",
          label: "Hora",
          required: false,
          value: "",
        },
        {
          id: "ver1Auth",
          name: "verification.block1.auth",
          type: "checkbox",
          label: "Autorización (SI/NO)",
          required: false,
          value: "",
        },
      ],
    },

    {
      label: "Verificación Interna — Cumplimiento",
      fields: [
        {
          id: "ver2Name",
          name: "verification.block2.name",
          type: "text",
          label: "Nombre",
          required: false,
          value: "",
        },
        {
          id: "ver2Sign",
          name: "verification.block2.signature",
          type: "text",
          label: "Firma",
          required: false,
          value: "",
        },
        {
          id: "ver2Date",
          name: "verification.block2.date",
          type: "text",
          label: "Fecha",
          required: false,
          value: "",
        },
        {
          id: "ver2Time",
          name: "verification.block2.time",
          type: "text",
          label: "Hora",
          required: false,
          value: "",
        },
        {
          id: "ver2Auth",
          name: "verification.block2.auth",
          type: "checkbox",
          label: "Autorización (SI/NO)",
          required: false,
          value: "",
        },
      ],
    },

    // ============================================================
    // 11. AUTORIZACIÓN PEP INTERNA
    // ============================================================
    {
      label: "Autorización PEP — Gerente Administrativa",
      fields: [
        {
          id: "pepA1Name",
          name: "pepAuthorization.block1.name",
          type: "text",
          label: "Nombre",
          required: false,
          value: "",
        },
        {
          id: "pepA1Sign",
          name: "pepAuthorization.block1.signature",
          type: "text",
          label: "Firma",
          required: false,
          value: "",
        },
        {
          id: "pepA1Date",
          name: "pepAuthorization.block1.date",
          type: "text",
          label: "Fecha",
          required: false,
          value: "",
        },
        {
          id: "pepA1Time",
          name: "pepAuthorization.block1.time",
          type: "text",
          label: "Hora",
          required: false,
          value: "",
        },
        {
          id: "pepA1Auth",
          name: "pepAuthorization.block1.auth",
          type: "checkbox",
          label: "Autorización (SI/NO)",
          required: false,
          value: "",
        },
      ],
    },

    {
      label: "Autorización PEP — Oficial de Cumplimiento",
      fields: [
        {
          id: "pepA2Name",
          name: "pepAuthorization.block2.name",
          type: "text",
          label: "Nombre",
          required: false,
          value: "",
        },
        {
          id: "pepA2Sign",
          name: "pepAuthorization.block2.signature",
          type: "text",
          label: "Firma",
          required: false,
          value: "",
        },
        {
          id: "pepA2Date",
          name: "pepAuthorization.block2.date",
          type: "date",
          label: "Fecha",
          placeholder: "MM/DD/AAAA",
          required: false,
          value: "",
        },
        {
          id: "pepA2Time",
          name: "pepAuthorization.block2.time",
          type: "text",
          label: "Hora",
          placeholder: "HH:MM",
          required: false,
          value: "",
        },
        {
          id: "pepA2Auth",
          name: "pepAuthorization.block2.auth",
          type: "checkbox",
          label: "Autorización (SI/NO)",
          required: false,
          value: "",
        },
      ],
    },

    // ============================================================
    // AUTORIZACIONES SARLAFT
    // ============================================================
    {
      label: "Autorizaciones y Declaraciones",
      fields: [
        {
          id: "authDataProcessing",
          name: "authorizations.dataProcessing",
          type: "checkbox",
          label: "Autorizo el tratamiento de datos personales",
          required: true,
          value: false,
        },
        {
          id: "authDataDate",
          name: "authorizations.dataProcessingDate",
          type: "date",
          label: "Fecha de autorización de datos",
          required: false,
          value: "",
        },
        {
          id: "authCentral",
          name: "authorizations.centralConsultation",
          type: "checkbox",
          label: "Autorizo consulta en centrales de riesgo",
          required: false,
          value: false,
        },
        {
          id: "authCentralDate",
          name: "authorizations.centralConsultationDate",
          type: "date",
          label: "Fecha de autorización centrales",
          required: false,
          value: "",
        },
        {
          id: "authEmail",
          name: "authorizations.emailCommunication",
          type: "checkbox",
          label: "Acepto comunicaciones por email",
          required: false,
          value: false,
        },
        {
          id: "authTruth",
          name: "authorizations.truthDeclaration",
          type: "checkbox",
          label: "Declaro que la información es verdadera",
          required: true,
          value: false,
        },
        {
          id: "authTruthDate",
          name: "authorizations.truthDeclarationDate",
          type: "date",
          label: "Fecha de declaración",
          required: false,
          value: "",
        },
      ],
    },
  ];
</script>

<section class="prose max-w-full h-full overflow-y-auto overflow-x-hidden p-4">
  <!-- <ButtonWithIcon
    iconButton="arrow-down-circle"
    label="Iniciar Tour"
    variant="primary"
    size="small"
  /> -->

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
        // Auto-guardar cuando se envía el formulario
        autoSave();
      }}
    />
  </div>
</section>
