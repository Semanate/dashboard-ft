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

export const cryptoPlatformsArray = [
    { label: "Binance", value: "binance" },
    { label: "Coinbase", value: "coinbase" },
    { label: "Kraken", value: "kraken" },
    { label: "Bitso", value: "bitso" },
    { label: "Buda", value: "buda" },
    { label: "Trust Wallet", value: "trust_wallet" },
    { label: "MetaMask", value: "metamask" },
    { label: "Ledger", value: "ledger" },
    { label: "Trezor", value: "trezor" },
    { label: "Otra", value: "other" },
];

export const cryptoTypesArray = [
    { label: "Bitcoin (BTC)", value: "btc" },
    { label: "Ethereum (ETH)", value: "eth" },
    { label: "Tether (USDT)", value: "usdt" },
    { label: "Binance Coin (BNB)", value: "bnb" },
    { label: "USD Coin (USDC)", value: "usdc" },
    { label: "Cardano (ADA)", value: "ada" },
    { label: "Solana (SOL)", value: "sol" },
    { label: "Polkadot (DOT)", value: "dot" },
    { label: "Ripple (XRP)", value: "xrp" },
    { label: "Otra", value: "other" },
];

export const foreignCurrencyBaseSection = {
    label: "Información General de Divisas",
    isVisible: () => true,
    fields: [
        {
            id: "foreignCurrencyManagement",
            name: "foreignCurrency.management",
            type: "checkbox",
            label: "¿Maneja productos financieros en moneda extranjera?",
            value: false,
        },
        {
            id: "hasCrypto",
            name: "virtualAssets.hasCrypto",
            type: "checkbox",
            label: "¿Maneja activos virtuales o criptomonedas?",
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
                required: true,
                value: "",
            },
            {
                id: "natLast2",
                name: "naturalPerson.lastName2",
                type: "text",
                label: "Segundo Apellido",
                required: true,
                value: "",
            },
            {
                id: "natTypeDoc",
                name: "naturalPerson.typeDoc",
                type: "select",
                label: "Tipo de documento",
                options: documentTypesArray,
                placeholder: "Seleccione un tipo de documento",
                required: true,
                value: "",
            },
            {
                id: "natDocNumber",
                name: "naturalPerson.docNumber",
                type: "number",
                label: "Número de documento",
                required: true,
                value: "",
            },
            {
                id: "natBirth",
                name: "naturalPerson.dateOfBirth",
                type: "date",
                label: "Fecha de nacimiento",
                mode: "birthdate",
                placeholder: "MM/DD/AAAA",
                required: true,
                value: "",
            },
            {
                id: "natBirthPlace",
                name: "naturalPerson.placeOfBirth",
                type: "text",
                label: "Lugar de nacimiento",
                required: true,
                value: "",
            },
            {
                id: "natPhone",
                name: "naturalPerson.phone",
                type: "number",
                label: "Teléfono",
                required: true,
                value: "",
            },
            {
                id: "natEmail",
                name: "naturalPerson.email",
                type: "text",
                label: "Email",
                required: true,
                value: "",
            },
            {
                id: "natCity",
                name: "naturalPerson.city",
                type: "select",
                label: "Ciudad",
                placeholder: "Seleccione una ciudad",
                options: citysArray,
                required: true,
                value: "",
            },
            {
                id: "natAddress",
                name: "naturalPerson.address",
                type: "text",
                label: "Dirección",
                required: true,
                value: "",
            },

            {
                id: "natActivity",
                name: "naturalPerson.activitySector",
                type: "text",
                label: "Codigo CIIU - Principal actividad económica",
                placeholder: "Ej: CIIU 4711 - Comercio al por mayor de vehículos automotores",
                required: true,
                value: "",
            },
            {
                id: "natActivitySecondary",
                name: "naturalPerson.activitySectorSecondary",
                type: "text",
                label: "Codigo CIIU - Secundario",
                placeholder: "Ej: CIIU 4791 - Comercio al por menor de prendas de vestir y calzado en establecimientos especializados",
                required: true,
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
                required: true,
                value: "",
            },
            {
                id: "jurNit",
                name: "juridicalPerson.nit",
                type: "text",
                label: "NIT",
                required: true,
                value: "",
            },
            {
                id: "jurPhone",
                name: "juridicalPerson.phone",
                type: "number",
                label: "Teléfono",
                required: true,
                value: "",
            },
            {
                id: "jurEmail",
                name: "juridicalPerson.email",
                type: "text",
                label: "Email Persona Jurídica",
                required: true,
                value: "",
            },
            {
                id: "jurEmail2",
                name: "juridicalPerson.email2",
                type: "text",
                label: "Email Corporativo",
                required: true,
                value: "",
            },
            {
                id: "jurCity",
                name: "juridicalPerson.city",
                type: "select",
                label: "Ciudad",
                placeholder: "Seleccione una ciudad",
                options: citysArray,
                required: true,
                value: "",
            },
            {
                id: "jurPhone2",
                name: "juridicalPerson.phone2",
                type: "text",
                label: "Celular",
                required: true,
                value: "",
            },
            {
                id: "jurAddress",
                name: "juridicalPerson.address",
                type: "text",
                label: "Dirección Persona Jurídica",
                required: true,
                value: "",
            },
            {
                id: "jurAddress2",
                name: "juridicalPerson.address2",
                type: "text",
                label: "Dirección Corporativa",
                required: true,
                value: "",
            },
            {
                id: "jurActivity",
                name: "juridicalPerson.activitySector",
                type: "text",
                label: "Sector de actividad",
                required: true,
                value: "",
            },
        ],
    },

    // ============================================================
    // 5. PEP - AMPLIADO PARA SARLAFT
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

];
const COMPANY_NAME = "La Empresa S.A.S.";
export const declarationsSection = {
    label: "Declaraciones y Autorizaciones",
    isVisible: () => true,
    fields: [
        {
            id: "assetsDeclaration",
            name: "declarations.assetsDeclaration",
            type: "checkbox",
            label: `DECLARACIÓN DE LOS BIENES Y/O FONDOS: Declaro que todos los recursos y/o bienes que poseemos han sido obtenidos lícitamente a través del desarrollo de nuestro objeto social o de las actividades autorizadas por las autoridades competentes.`,
            value: false,
            required: true,
        },
        {
            id: "terrorismDeclaration",
            name: "declarations.terrorismDeclaration",
            type: "checkbox",
            label: `Declaro que los recursos que se deriven del desarrollo de este contrato no se destinarán a la financiación del terrorismo, grupos terroristas o actividades terroristas.`,
            value: false,
            required: true,
        },
        {
            id: "informationVeracity",
            name: "declarations.informationVeracity",
            type: "checkbox",
            label: `Declaro que toda la información que he suministrado y suministraré a través de cualquier medio es veraz, actual, exacta, comprobable y pertinente, y me comprometo a actualizarla anualmente.`,
            value: false,
            required: true,
        },
        // {
        //   id: "fundsOrigin",
        //   name: "declarations.fundsOrigin",
        //   type: "textarea",
        //   label: "Detalle el origen de los fondos (ocupación, oficio, actividad o negocio)",
        //   placeholder:
        //     "Describa en detalle las fuentes de los recursos que administra la persona natural o jurídica...",
        //   value: "",
        //   required: true,
        // },
        {
            id: "listsAuthorization",
            name: "authorizations.listsAuthorization",
            type: "checkbox",
            label: `AUTORIZACIÓN PARA CONSULTA LISTAS NACIONALES E INTERNACIONALES: Autorizo a ${COMPANY_NAME} para que verifique, solicite y/o consulte ante los organismos de seguridad del Estado, listas vinculantes/restrictivas toda la información referente a los antecedentes legales, penales y financieros.`,
            value: false,
            required: true,
        },
        {
            id: "dataProcessingAuth1",
            name: "authorizations.dataProcessing.informed",
            type: "checkbox",
            label: `AUTORIZACIÓN DE TRATAMIENTO DE DATOS PERSONALES: He sido informado por ${COMPANY_NAME} sobre las disposiciones para el tratamiento de datos personales conforme a la Ley 1581 de 2012.`,
            value: false,
            required: true,
        },
        {
            id: "dataProcessingAuth2",
            name: "authorizations.dataProcessing.purposeKnown",
            type: "checkbox",
            label: `Conozco las finalidades de la recolección de datos: prestación de servicios, fines comerciales, consulta a terceros (centrales de riesgo, listas restrictivas, etc.).`,
            value: false,
            required: true,
        },
        {
            id: "dataProcessingAuth3",
            name: "authorizations.dataProcessing.rightsKnown",
            type: "checkbox",
            label: `Conozco mis derechos como titular: conocer, actualizar, rectificar, suprimir y revocar el consentimiento sobre mis datos personales.`,
            value: false,
            required: true,
        },
        {
            id: "dataProcessingAuth4",
            name: "authorizations.dataProcessing.voluntaryConsent",
            type: "checkbox",
            label: `Autorizo de manera voluntaria, previa, explícita, informada e inequívoca a ${COMPANY_NAME} para tratar mis datos personales de acuerdo con su Política de Tratamiento de Datos Personales.`,
            value: false,
            required: true,
        },
        {
            id: "dataProcessingAuth5",
            name: "authorizations.dataProcessing.veracityConfirmation",
            type: "checkbox",
            label: `La información obtenida para el tratamiento de datos personales la he suministrado de forma voluntaria y es verídica.`,
            value: false,
            required: true,
        },
    ],
};

export const signaturesSarlaftSection = [
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
        isVisible: () => false,
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

    // {
    //     label: "Autorización PEP — Oficial de Cumplimiento",
    //     fields: [
    //         {
    //             id: "pepA2Name",
    //             name: "pepAuthorization.block.name",
    //             type: "text",
    //             label: "Nombre",
    //             required: false,
    //             value: "",
    //         },
    //         {
    //             id: "pepA2Sign",
    //             name: "pepAuthorization.block.signature",
    //             type: "signature",
    //             label: "Firma",
    //             required: false,
    //             value: "",
    //         },
    //         {
    //             id: "pepA2Date",
    //             name: "pepAuthorization.block.date",
    //             type: "date",
    //             label: "Fecha",
    //             placeholder: "MM/DD/AAAA",
    //             required: false,
    //             value: new Date().toLocaleDateString(),
    //         },
    //         {
    //             id: "pepA2Time",
    //             name: "pepAuthorization.block.time",
    //             type: "text",
    //             label: "Hora",
    //             placeholder: "HH:MM",
    //             required: false,
    //             value: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    //         },
    //         {
    //             id: "pepA2Auth",
    //             name: "pepAuthorization.block.auth",
    //             type: "checkbox",
    //             label: "Autorización Cumplimiento LAFT",
    //             required: false,
    //             value: false,
    //         },
    //     ],
    // },
];

export const filesSarlaftSection = {
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

export { typesPersonArray, deepGet, typesForeignCurrencyArray, entityAccountFinancialsArray, activitySectorsArray, citys, citysArray, documentTypes, documentTypesArray, accountTypes, accountTypesArray };


