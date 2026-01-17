/* eslint-disable @typescript-eslint/no-explicit-any */
// excelMappings.ts

function deepGet(obj: any, path: string) {
    return path
        .replace(/\[(\d+)\]/g, ".$1")
        .split(".")
        .reduce((acc, key) => acc?.[key], obj);
}

/**
 * Citys Constants
 */

const citys: Record<string, string> = {
    BGT: "Bogotá",
    MDL: "Medellín",
    CAL: "Cali",
};



/**
 * Citys Array for Select Options
 */
const citysArray = Object.values(citys).map((city) => ({
    label: city,
    value: Object.keys(citys).find((key) => citys[key] === city) || city,
}));

/**
 * Documents Types Constants
 */


const documentTypes: Record<string, string> = {
    CC: "Cédula de Ciudadanía",
    CE: "Cédula de Extranjería",
    NIT: "Número de Identificación Tributaria",
    PS: "Pasaporte",
};

const documentTypesArray = Object.entries(documentTypes).map(([key, value]) => ({
    label: value,
    value: key,
}));

const activitySectors: Record<string, string> = {
    AGR: "Agricultura",
    IND: "Industria",
    SRV: "Servicios",
    TEC: "Tecnología",
    EDU: "Educación",
    SAL: "Salud",
    COM: "Comercio",
};

const activitySectorsArray = Object.entries(activitySectors).map(([key, value]) => ({
    label: value,
    value: key,
}));

const accountTypes: Record<string, string> = {
    SAV: "Ahorros",
    CHK: "Corriente",
    // BUS: "Negocios",
    // INV: "Inversión",
};

const accountTypesArray = Object.entries(accountTypes).map(([key, value]) => ({
    label: value,
    value: key,
}));

const entityAccountFinancials: Record<string, string> = {
    BOG: "Banco de Bogotá",
    BAN: "Bancolombia",
    DAV: "Davivienda",
    CIT: "Citibank",
    BBV: "BBVA",
    NEQ: "Nequi",
    NU: "Nubank",
    FAL: "Banco Falabella",
    OCC: "Banco de Occidente",

    // Bancos adicionales
    AVV: "Banco AV Villas",
    COLP: "Colpatria (Scotiabank Colpatria)",
    GNB: "GNB Sudameris",
    POP: "Banco Popular",
    AGR: "Banco Agrario",
    ITA: "Itaú",
    COOP: "CoopCentral",
    SERF: "Serfinanza",
    COOPF: "Banco Cooperativo Coopcentral",
    MFB: "Banco Mundo Mujer",
    FIN: "Finandina",

    // Bancos 100% digitales
    LULO: "Lulo Bank",
    IRIS: "Iris Bank (Finandina wallet)",
    DALE: "Dale! (Grupo Aval)",

    // Billeteras y medios de pago
    MOV: "Movii",
    POW: "Powwi",
    DDD: "Daviplata",

    // Cooperativas and entities 
    JUR: "Juriscoop",
    CFIN: "Cooperativa Financiera",
    CRED: "Crediflores",

    //   Companies of financial services
    RCI: "RCI Colombia",
    JEP: "JEP Colombia",
    TEF: "Tuya S.A.",
    OTH: "Otro",
};

const entityAccountFinancialsArray = Object.entries(entityAccountFinancials).map(([key, value]) => ({
    label: value,
    value: key,
}));



const typesForeignCurrency: Record<string, string> = {
    SAV: "Cuenta de Ahorros",
    CHK: "Cuenta Corriente",
    FIX: "Depósito a Plazo Fijo",
    TRF: "Transferencia Internacional",
    CRD: "Crédito en Moneda Extranjera",
    OTH: "Otro",
};

const typesForeignCurrencyArray = Object.entries(typesForeignCurrency).map(([key, value]) => ({
    label: value,
    value: key,
}));

const typesPerson: Record<string, string> = {
    NAT: "Persona Natural",
    JUR: "Persona Jurídica",
    // LGL: "Representante Legal",
};

const typesPersonArray = Object.entries(typesPerson).map(([key, value]) => ({
    label: value,
    value: key,
}));


export const foreignCurrencyBaseSection = {
    label: "Moneda Extranjera y Activos Virtuales",
    isVisible: () => true,
    fields: [
        {
            id: "fxManage",
            name: "foreignCurrency.management",
            type: "checkbox",
            label: "¿Maneja productos financieros en moneda extranjera?",
            required: false,
            value: false,
        },
        {
            id: "fxInfo",
            name: "foreignCurrency.infoVirtualAssets",
            type: "checkbox",
            label: "¿Maneja activos virtuales o criptomonedas?",
            required: false,
            value: false,
        },
    ],
};


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
                value: new Date(),
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
    // 3. PERSONA NATURAL
    // ============================================================
    {
        label: "Persona Natural - Identificación",
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
                label: "Primer Apellido",
                required: false,
                value: "",
            },
            {
                id: "natLast2",
                name: "naturalPerson.lastName2",
                type: "text",
                label: "Segundo Apellido",
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
                type: "number",
                label: "Número de documento",
                required: false,
                value: "",
            },
            {
                id: "natBirth",
                name: "naturalPerson.dateOfBirth",
                type: "date",
                label: "Fecha de nacimiento",
                mode: "birthdate",
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
                type: "number",
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
                type: "text",
                label: "Codigo CIIU - Principal actividad económica",
                placeholder: "Ej: CIIU 4711 - Comercio al por mayor de vehículos automotores",
                required: false,
                value: "",
            },
            {
                id: "natActivitySecondary",
                name: "naturalPerson.activitySectorSecondary",
                type: "text",
                label: "Codigo CIIU - Secundario",
                placeholder: "Ej: CIIU 4791 - Comercio al por menor de prendas de vestir y calzado en establecimientos especializados",
                required: false,
                value: "",
            },
        ],
    },

    // ============================================================
    // 4. PERSONA JURÍDICA
    // ============================================================
    {
        label: "Persona Jurídica - Identificación",
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
                type: "number",
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
                label: "Celular",
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
    // 7. PEP - AMPLIADO PARA SARLAFT
    // ============================================================
    {
        label: "Preguntas PEP",
        fields: [
            {
                id: "pepPublic",
                name: "pep.managePublicResources",
                type: "checkbox",
                label: "¿Maneja recursos públicos?",
                required: false,
                value: "",
            },
            {
                id: "pepPower",
                name: "pep.publicPower",
                type: "checkbox",
                label: "¿Ejerce poder público?",
                required: false,
                value: "",
            },
            {
                id: "pepRelation",
                name: "pep.relation",
                type: "checkbox",
                label: "¿Tiene relación con persona PEP?",
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
                label: "¿Tiene obligaciones tributarias en otro país?",
                required: false,
                value: "",
            },
        ],
    },

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
    // 10. VERIFICACIÓN INTERNA OFICIAL DE CUMPLIMIENTO
    // ============================================================

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
                type: "signature",
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
                value: new Date().toLocaleDateString(),
            },
            {
                id: "ver2Time",
                name: "verification.block2.time",
                type: "text",
                label: "Hora",
                required: false,
                value: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
            {
                id: "ver2Auth",
                name: "verification.block2.auth",
                type: "checkbox",
                label: "Autorización Cumplimiento LAFT",
                required: false,
                value: false,
            },
        ],
    },

    {
        label: "Autorización PEP — Oficial de Cumplimiento",
        fields: [
            {
                id: "pepA2Name",
                name: "pepAuthorization.block.name",
                type: "text",
                label: "Nombre",
                required: false,
                value: "",
            },
            {
                id: "pepA2Sign",
                name: "pepAuthorization.block.signature",
                type: "signature",
                label: "Firma",
                required: false,
                value: "",
            },
            {
                id: "pepA2Date",
                name: "pepAuthorization.block.date",
                type: "date",
                label: "Fecha",
                placeholder: "MM/DD/AAAA",
                required: false,
                value: new Date().toLocaleDateString(),
            },
            {
                id: "pepA2Time",
                name: "pepAuthorization.block.time",
                type: "text",
                label: "Hora",
                placeholder: "HH:MM",
                required: false,
                value: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            },
            {
                id: "pepA2Auth",
                name: "pepAuthorization.block.auth",
                type: "checkbox",
                label: "Autorización Cumplimiento LAFT",
                required: false,
                value: false,
            },
        ],
    },

    // ============================================================
    // AUTORIZACIONES SARLAFT
    // ============================================================
    // {
    //   label: "Autorizaciones y Declaraciones",
    //   fields: [
    //     {
    //       id: "authDataProcessing",
    //       name: "authorizations.dataProcessing",
    //       type: "checkbox",
    //       label: "Autorizo el tratamiento de datos personales",
    //       required: true,
    //       value: false,
    //     },
    //     {
    //       id: "authDataDate",
    //       name: "authorizations.dataProcessingDate",
    //       type: "date",
    //       label: "Fecha de autorización de datos",
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: "authCentral",
    //       name: "authorizations.centralConsultation",
    //       type: "checkbox",
    //       label: "Autorizo consulta en centrales de riesgo",
    //       required: false,
    //       value: false,
    //     },
    //     {
    //       id: "authCentralDate",
    //       name: "authorizations.centralConsultationDate",
    //       type: "date",
    //       label: "Fecha de autorización centrales",
    //       required: false,
    //       value: "",
    //     },
    //     {
    //       id: "authEmail",
    //       name: "authorizations.emailCommunication",
    //       type: "checkbox",
    //       label: "Acepto comunicaciones por email",
    //       required: false,
    //       value: false,
    //     },
    //     {
    //       id: "authTruth",
    //       name: "authorizations.truthDeclaration",
    //       type: "checkbox",
    //       label: "Declaro que la información es verdadera",
    //       required: true,
    //       value: false,
    //     },
    //     {
    //       id: "authTruthDate",
    //       name: "authorizations.truthDeclarationDate",
    //       type: "date",
    //       label: "Fecha de declaración",
    //       required: false,
    //       value: "",
    //     },
    //   ],
    // },
];
export { typesPersonArray, deepGet, typesForeignCurrencyArray, entityAccountFinancialsArray, activitySectorsArray, citys, citysArray, documentTypes, documentTypesArray, accountTypes, accountTypesArray };


