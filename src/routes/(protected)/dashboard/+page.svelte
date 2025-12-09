<script lang="ts">
  import ButtonWithIcon from "$lib/components/atoms/button/ButtonWithIcon.svelte";
  import CategoryForm from "$lib/components/organisms/category-form/CategoryForm.svelte";
  import StepperForm from "$lib/components/organisms/stepper-form/StepperForm.svelte";
  import {
    accountTypesArray,
    activitySectorsArray,
    citys,
    citysArray,
    documentTypesArray,
    entityAccountFinancialsArray,
  } from "$lib/constants";
  import type { FormDataType } from "$lib/types";
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

  let form: FormDataType = {
    date: "2023-10-10",
    city: "asdasd",
    typeDocument: "asdasd",
    representative: {
      firstName: "test",
      lastName1: "asdasd",
      lastName2: "asdasd",
      phone: "aasdasd",
      email: "asdasd",
      typeDoc: "CC",
      docNumber: "123456789",
      city: "asdsad",
      activitySector: "asdasd",
      address: "asdasdsad",
    },
    naturalPerson: {
      typeDoc: "CC",
      docNumber: "123456789",
      firstName: "test",
      lastName1: "asdasd",
      activitySector: "asdasd",
      lastName2: "asdasd",
      phone: "aasdasd",
      email: "asdasd",
      city: "asdsad",
      address: "asdasdsad",
      dateOfBirth: "1990-01-01",
      placeOfBirth: "asdasd",
    },
    juridicalPerson: {
      businessName: "asdasd",
      nit: "123456789",
      phone: "aasdasd",
      email: "asdasd",
      email2: "asdasd",
      city: "asdsad",
      phone2: "aasdasd",
      address: "asdasdsad",
      address2: "asdasdsad",
      activitySector: "asdasd",
    },
    relations: [
      {
        typeDoc: "  CC.       CE.        NIT.       PS.",
        docNumber: "123456789",
        socialName: "asdasd",
        percentageParticipation: "50",
        activityAdminResource: "asdasd",
        activityReputationGradePublic: "asdasd",
      },
      {
        typeDoc: "  CC.       CE.        NIT.       PS.",
        docNumber: "123456789",
        socialName: "asdasd",
        percentageParticipation: "50",
        activityAdminResource: "asdasd",
        activityReputationGradePublic: "asdasd",
      },
      {
        typeDoc: "  CC.       CE.        NIT.       PS.",
        docNumber: "123456789",
        socialName: "asdasd",
        percentageParticipation: "50",
        activityAdminResource: "asdasd",
        activityReputationGradePublic: "asdasd",
      },
      {
        typeDoc: "  CC.       CE.        NIT.       PS.",
        docNumber: "123456789",
        socialName: "asdasd",
        percentageParticipation: "50",
        activityAdminResource: "asdasd",
        activityReputationGradePublic: "asdasd",
      },
      {
        typeDoc: "  CC.       CE.        NIT.       PS.",
        docNumber: "123456789",
        socialName: "asdasd",
        percentageParticipation: "50",
        activityAdminResource: "asdasd",
        activityReputationGradePublic: "asdasd",
      },
      {
        typeDoc: "  CC.       CE.        NIT.       PS.",
        docNumber: "123456789",
        socialName: "asdasd",
        percentageParticipation: "50",
        activityAdminResource: "asdasd",
        activityReputationGradePublic: "asdasd",
      },
      {
        typeDoc: "  CC.       CE.        NIT.       PS.",
        docNumber: "123456789",
        socialName: "asdasd",
        percentageParticipation: "50",
        activityAdminResource: "asdasd",
        activityReputationGradePublic: "asdasd",
      },
      {
        typeDoc: "  CC.       CE.        NIT.       PS.",
        docNumber: "123456789",
        socialName: "asdasd",
        percentageParticipation: "50",
        activityAdminResource: "asdasd",
        activityReputationGradePublic: "asdasd",
      },
    ],

    accountEntityFinancials: [
      {
        accountType: "Ahorros",
        accountNumber: "123456789",
        accountNameEntity: "asdasd",
      },
      {
        accountType: "Ahorros",
        accountNumber: "123456789",
        accountNameEntity: "asdasd",
      },
      {
        accountType: "Ahorros",
        accountNumber: "123456789",
        accountNameEntity: "asdasd",
      },
      {
        accountType: "Ahorros",
        accountNumber: "123456789",
        accountNameEntity: "asdasd",
      },
      {
        accountType: "Ahorros",
        accountNumber: "123456789",
        accountNameEntity: "asdasd",
      },
      {
        accountType: "Ahorros",
        accountNumber: "123456789",
        accountNameEntity: "asdasd",
      },
      {
        accountType: "Ahorros",
        accountNumber: "123456789",
        accountNameEntity: "asdasd",
      },
      {
        accountType: "Ahorros",
        accountNumber: "123456789",
        accountNameEntity: "asdasd",
      },
    ],

    pep: {
      managePublicResources: "SI",
      publicPower: "NO",
      // publicPowerName: "N/A",

      relation: "NO",
      relationName: "N/A",

      taxObligations: "NO",
      // taxCountries: "",
    },

    foreignCurrency: {
      management: "SI",
      products: [
        {
          type: "Cuenta en el exterior",
          entity: "Bank of America",
          country: "USA",
          currency: "USD",
        },
        {
          type: "Criptoactivos",
          entity: "Binance",
          country: "Global",
          currency: "USDT",
        },
      ],
    },

    signature: {
      name: "Kevin Alvear",
      document: "123456789",
      signature: "FIRMA_DIGITAL_O_VACÍO",
    },

    verification: {
      block1: {
        name: "ASDSDASDA",
        signature: "ASDDSASADSDA",
        date: "212313231",
        time: "23123213",
        auth: "SI", // o NO
      },
      block2: {
        name: "ASDSADSAD",
        signature: "C123123",
        date: "12312323",
        time: "23123213",
        auth: "NO",
      },
    },

    pepAuthorization: {
      block1: {
        name: "CCCCC",
        signature: "CCC",
        date: "AAA22",
        time: "223123231",
        auth: "SI",
      },
      block2: {
        name: "CASDASDAD",
        signature: "ASC123123",
        date: "ASDASDASD",
        time: "1213123",
        auth: "NO",
      },
    },
  };

  async function generateExcel() {
    const res = await fetch("/excel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
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
    // {
    //   label: "Información Inicial",
    //   fields: [
    //     {
    //       id: "dateAggrement",
    //       name: "dateAggrement",
    //       type: "date",
    //       label: "Fecha",
    //       required: true,
    //       placeholder: "",
    //       value: new Date().toISOString().split("T")[0],
    //     },
    //     {
    //       id: "cityAggrement",
    //       name: "cityAggrement",
    //       type: "select",
    //       label: "Ciudad",
    //       required: true,
    //       options: citysArray,
    //       placeholder: "Seleccione una ciudad",
    //       value: "",
    //     },
    //   ],
    // },
    // ============================================================
    // 1.1 INFORMACIÓN GENERAL
    // ============================================================
    // {
    //   label: "Información General",
    //   fields: [
    //     {
    //       id: "city",
    //       name: "city",
    //       type: "select",
    //       label: "Ciudad",
    //       required: true,
    //       options: citysArray,
    //       placeholder: "Seleccione una ciudad",
    //       value: "",
    //     },
    //     {
    //       id: "typeDocument",
    //       name: "typeDocument",
    //       type: "select",
    //       label: "Tipo de Documento",
    //       required: true,
    //       options: documentTypesArray,
    //       placeholder: "Seleccione un tipo de documento",
    //       value: "",
    //     },

    //     {
    //       id: "documentNumber",
    //       name: "documentNumber",
    //       type: "text",
    //       label: "Número de Documento",
    //       required: true,
    //       value: "",
    //     },
    //   ],
    // },

    // ============================================================
    // 2. REPRESENTANTE LEGAL
    // ============================================================
    // {
    //   label: "Representante Legal",
    //   fields: [
    //     {
    //       id: "repFirstName",
    //       name: "representative.firstName",
    //       type: "text",
    //       label: "Nombres",
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: "repLastName1",
    //       name: "representative.lastName1",
    //       type: "text",
    //       label: "Apellido 1",
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: "repLastName2",
    //       name: "representative.lastName2",
    //       type: "text",
    //       label: "Apellido 2",
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: "repTypeDoc",
    //       name: "representative.typeDoc",
    //       type: "select",
    //       label: "Tipo de documento",
    //       required: false,
    //       options: documentTypesArray,
    //       placeholder: "Seleccione un tipo de documento",
    //       value: "",
    //     },
    //     {
    //       id: "repDocNumber",
    //       name: "representative.docNumber",
    //       type: "text",
    //       label: "Número de documento",
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: "repPhone",
    //       name: "representative.phone",
    //       type: "text",
    //       label: "Teléfono",
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: "repEmail",
    //       name: "representative.email",
    //       type: "text",
    //       label: "Email",
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: "repCity",
    //       name: "representative.city",
    //       type: "select",
    //       label: "Ciudad",
    //       placeholder: "Seleccione una ciudad",
    //       options: citysArray,
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: "repActivity",
    //       name: "representative.activitySector",
    //       type: "select",
    //       label: "Sector de actividad",
    //       placeholder: "Seleccione un sector de actividad",
    //       required: false,
    //       options: activitySectorsArray,
    //       value: "",
    //     },
    //     {
    //       id: "repAddress",
    //       name: "representative.address",
    //       type: "text",
    //       label: "Dirección",
    //       required: false,
    //       value: "",
    //     },
    //   ],
    // },

    // ============================================================
    // 3. PERSONA NATURAL
    // ============================================================
    // {
    //   label: "Información Persona Natural",
    //   fields: [
    //     {
    //       id: "natFirstName",
    //       name: "naturalPerson.firstName",
    //       type: "text",
    //       label: "Nombres",
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: "natLast1",
    //       name: "naturalPerson.lastName1",
    //       type: "text",
    //       label: "Apellido 1",
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: "natLast2",
    //       name: "naturalPerson.lastName2",
    //       type: "text",
    //       label: "Apellido 2",
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: "natTypeDoc",
    //       name: "naturalPerson.typeDoc",
    //       type: "select",
    //       label: "Tipo de documento",
    //       options: documentTypesArray,
    //       placeholder: "Seleccione un tipo de documento",
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: "natDocNumber",
    //       name: "naturalPerson.docNumber",
    //       type: "text",
    //       label: "Número de documento",
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: "natBirth",
    //       name: "naturalPerson.dateOfBirth",
    //       type: "date",
    //       label: "Fecha de nacimiento",
    //       placeholder: "MM/DD/AAAA",
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: "natBirthPlace",
    //       name: "naturalPerson.placeOfBirth",
    //       type: "text",
    //       label: "Lugar de nacimiento",
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: "natPhone",
    //       name: "naturalPerson.phone",
    //       type: "text",
    //       label: "Teléfono",
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: "natEmail",
    //       name: "naturalPerson.email",
    //       type: "text",
    //       label: "Email",
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: "natCity",
    //       name: "naturalPerson.city",
    //       type: "select",
    //       label: "Ciudad",
    //       placeholder: "Seleccione una ciudad",
    //       options: citysArray,
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: "natAddress",
    //       name: "naturalPerson.address",
    //       type: "text",
    //       label: "Dirección",
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: "natActivity",
    //       name: "naturalPerson.activitySector",
    //       type: "select",
    //       label: "Sector de actividad",
    //       options: activitySectorsArray,
    //       placeholder: "Seleccione un sector de actividad",
    //       required: false,
    //       value: "",
    //     },
    //   ],
    // },

    // ============================================================
    // 4. PERSONA JURÍDICA
    // ============================================================
    // {
    //   label: "Información Persona Jurídica",
    //   fields: [
    //     {
    //       id: "jurName",
    //       name: "juridicalPerson.businessName",
    //       type: "text",
    //       label: "Razón Social",
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: "jurNit",
    //       name: "juridicalPerson.nit",
    //       type: "text",
    //       label: "NIT",
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: "jurPhone",
    //       name: "juridicalPerson.phone",
    //       type: "text",
    //       label: "Teléfono",
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: "jurEmail",
    //       name: "juridicalPerson.email",
    //       type: "text",
    //       label: "Email 1",
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: "jurEmail2",
    //       name: "juridicalPerson.email2",
    //       type: "text",
    //       label: "Email 2",
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: "jurCity",
    //       name: "juridicalPerson.city",
    //       type: "select",
    //       label: "Ciudad",
    //       placeholder: "Seleccione una ciudad",
    //       options: citysArray,
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: "jurPhone2",
    //       name: "juridicalPerson.phone2",
    //       type: "text",
    //       label: "Teléfono 2",
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: "jurAddress",
    //       name: "juridicalPerson.address",
    //       type: "text",
    //       label: "Dirección",
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: "jurAddress2",
    //       name: "juridicalPerson.address2",
    //       type: "text",
    //       label: "Dirección 2",
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: "jurActivity",
    //       name: "juridicalPerson.activitySector",
    //       type: "text",
    //       label: "Sector de actividad",
    //       required: false,
    //       value: "",
    //     },
    //   ],
    // },

    // ============================================================
    // 5. RELACIONES (8 ACCIONISTAS)
    // ============================================================
    // ...Array.from({ length: 8 }).map((_, i) => ({
    //   label: `Accionista / Relación ${i + 1}`,
    //   fields: [
    //     {
    //       id: `relTypeDoc_${i}`,
    //       name: `relations[${i}].typeDoc`,
    //       type: "select",
    //       placeholder: "Seleccione un tipo de documento",
    //       label: "Tipo documento",
    //       options: documentTypesArray,
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: `relDoc_${i}`,
    //       name: `relations[${i}].docNumber`,
    //       type: "text",
    //       label: "Número documento",
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: `relName_${i}`,
    //       name: `relations[${i}].socialName`,
    //       type: "text",
    //       label: "Nombre / Razón social",
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: `relPercent_${i}`,
    //       name: `relations[${i}].percentageParticipation`,
    //       type: "text",
    //       label: "% Participación",
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: `relActAdmin_${i}`,
    //       name: `relations[${i}].activityAdminResource`,
    //       type: "text",
    //       label: "Actividad recursos admin.",
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: `relRepGrade_${i}`,
    //       name: `relations[${i}].activityReputationGradePublic`,
    //       type: "text",
    //       label: "Grado reputación pública",
    //       required: false,
    //       value: "",
    //     },
    //   ],
    // })),

    // ============================================================
    // 6. CUENTAS FINANCIERAS (8)
    // ============================================================
    ...Array.from({ length: 8 }).map((_, i) => ({
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
    // 7. PEP
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
          type: "text",
          label: "¿Ejerce poder público? (SI/NO)",
          required: false,
          value: "",
        },
        {
          id: "pepRelation",
          name: "pep.relation",
          type: "text",
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
          type: "text",
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
          type: "text",
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
          type: "text",
          label: "Tipo de producto",
          required: false,
          value: "",
        },
        {
          id: `fxEntity_${i}`,
          name: `foreignCurrency.products[${i}].entity`,
          type: "text",
          label: "Entidad",
          required: false,
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
          type: "text",
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
          type: "text",
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
          type: "text",
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
          type: "text",
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
          type: "text",
          label: "Fecha",
          required: false,
          value: "",
        },
        {
          id: "pepA2Time",
          name: "pepAuthorization.block2.time",
          type: "text",
          label: "Hora",
          required: false,
          value: "",
        },
        {
          id: "pepA2Auth",
          name: "pepAuthorization.block2.auth",
          type: "text",
          label: "Autorización (SI/NO)",
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

  <StepperForm categories={sarlaftCategories} />
  <button onclick={descargar}> Descargar Excel SARLAFT </button>
  <button onclick={generateExcel}> Generar Excel Llenado </button>
</section>
