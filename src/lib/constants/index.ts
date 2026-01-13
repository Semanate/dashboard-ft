/* eslint-disable @typescript-eslint/no-explicit-any */
// excelMappings.ts
type DocType = "CC" | "CE" | "X" | "PS";

const getDocTypeString = (docType: DocType): string => {
    switch (docType) {
        case "CC":
            return "CC.   X   CE.          PS.";
        case "CE":
            return "CC.       CE.    X     PS.";
        case "PS":
            return "CC.       CE.          PS.  X";
    }
};

export const excelMappings = {
    // Document info
    DATE: "date",
    CITY: "city",
    TYPE_DOCUMENT: "typeDocument",

    // Legal representative
    REPRESENTATIVELEGALFIRSTNAME: "representative.firstName",
    REPRESENTATIVELEGALLASTNAME1: "representative.lastName1",
    REPRESENTATIVELEGALLASTNAME2: "representative.lastName2",
    REPRESENTATIVELEGALTYPEDOC: (docType: DocType) => getDocTypeString(docType),
    REPRESENTATIVELEGALDOCNUMBER: "representative.docNumber",
    REPRESENTATIVELEGALPHONE: "representative.phone",
    REPRESENTATIVELEGALEMAIL: "representative.email",
    REPRESENTATIVELEGALACTIVITYSECTOR: "representative.activitySector",
    REPRESENTATIVELEGALCITY: "representative.city",
    REPRESENTATIVELEGALADDRESS: "representative.address",

    // Natural person
    NATURALPERSONFIRSTNAME: "naturalPerson.firstName",
    NATURALPERSONLASTNAME1: "naturalPerson.lastName1",
    NATURALPERSONLASTNAME2: "naturalPerson.lastName2",
    NATURALPERSONTYPEDOC: (docType: DocType) => getDocTypeString(docType),
    NATURALPERSONDOCNUMBER: "naturalPerson.docNumber",
    NATURALPERSONDATEOFBIRTH: "naturalPerson.dateOfBirth",
    NATURALPERSONACTIVITYSECTOR: "naturalPerson.activitySector",
    NATURALPERSONPLACEOFBIRTH: "naturalPerson.placeOfBirth",
    NATURALPERSONPHONE: "naturalPerson.phone",
    NATURALPERSONADDRESS: "naturalPerson.address",

    // Juridical person
    JURIDICALPERSONBUSINESSNAME: "juridicalPerson.businessName",
    JURIDICALPERSONNIT: "juridicalPerson.nit",
    JURIDICALPERSONPHONE: "juridicalPerson.phone",
    JURIDICALPERSONEMAIL: "juridicalPerson.email",
    JURIDICALPERSONEMAIL2: "juridicalPerson.email2",
    JURIDICALPERSONADDRESS: "juridicalPerson.address",
    JURIDICALPERSONADDRESS2: "juridicalPerson.address2",
    JURIDICALPERSONPHONE2: "juridicalPerson.phone2",
    JURIDICALPERSONCITY: "juridicalPerson.city",

    //Relations 
    // TYPEDOC1: (docType: DocType) => getDocTypeString(docType),
    // TYPEDOC2: (docType: DocType) => getDocTypeString(docType),
    // TYPEDOC3: (docType: DocType) => getDocTypeString(docType),
    // TYPEDOC4: (docType: DocType) => getDocTypeString(docType),
    // TYPEDOC5: (docType: DocType) => getDocTypeString(docType),
    // TYPEDOC6: (docType: DocType) => getDocTypeString(docType),
    // TYPEDOC7: (docType: DocType) => getDocTypeString(docType),
    // TYPEDOC8: (docType: DocType) => getDocTypeString(docType),
    TYPEDOC1: "relations[0].typeDoc",
    TYPEDOC2: "relations[1].typeDoc",
    TYPEDOC3: "relations[2].typeDoc",
    TYPEDOC4: "relations[3].typeDoc",
    TYPEDOC5: "relations[4].typeDoc",
    TYPEDOC6: "relations[5].typeDoc",
    TYPEDOC7: "relations[6].typeDoc",
    TYPEDOC8: "relations[7].typeDoc",
    DOCNUMBER1: "relations[0].docNumber",
    DOCNUMBER2: "relations[1].docNumber",
    DOCNUMBER3: "relations[2].docNumber",
    DOCNUMBER4: "relations[3].docNumber",
    DOCNUMBER5: "relations[4].docNumber",
    DOCNUMBER6: "relations[5].docNumber",
    DOCNUMBER7: "relations[6].docNumber",
    DOCNUMBER8: "relations[7].docNumber",
    SOCIALNAME1: "relations[0].socialName",
    SOCIALNAME2: "relations[1].socialName",
    SOCIALNAME3: "relations[2].socialName",
    SOCIALNAME4: "relations[3].socialName",
    SOCIALNAME5: "relations[4].socialName",
    SOCIALNAME6: "relations[5].socialName",
    SOCIALNAME7: "relations[6].socialName",
    SOCIALNAME8: "relations[7].socialName",
    PORCENTAGEPARTICIPATION1: "relations[0].percentageParticipation",
    PORCENTAGEPARTICIPATION2: "relations[1].percentageParticipation",
    PORCENTAGEPARTICIPATION3: "relations[2].percentageParticipation",
    PORCENTAGEPARTICIPATION4: "relations[3].percentageParticipation",
    PORCENTAGEPARTICIPATION5: "relations[4].percentageParticipation",
    PORCENTAGEPARTICIPATION6: "relations[5].percentageParticipation",
    PORCENTAGEPARTICIPATION7: "relations[6].percentageParticipation",
    PORCENTAGEPARTICIPATION8: "relations[7].percentageParticipation",
    ACTIVITYADMINRESOURCE1: "relations[0].activityAdminResource",
    ACTIVITYADMINRESOURCE2: "relations[1].activityAdminResource",
    ACTIVITYADMINRESOURCE3: "relations[2].activityAdminResource",
    ACTIVITYADMINRESOURCE4: "relations[3].activityAdminResource",
    ACTIVITYADMINRESOURCE5: "relations[4].activityAdminResource",
    ACTIVITYADMINRESOURCE6: "relations[5].activityAdminResource",
    ACTIVITYADMINRESOURCE7: "relations[6].activityAdminResource",
    ACTIVITYADMINRESOURCE8: "relations[7].activityAdminResource",
    ACTIVITYREPUTATIONGRADEPUBLIC1: "relations[0].activityReputationGradePublic",
    ACTIVITYREPUTATIONGRADEPUBLIC2: "relations[1].activityReputationGradePublic",
    ACTIVITYREPUTATIONGRADEPUBLIC3: "relations[2].activityReputationGradePublic",
    ACTIVITYREPUTATIONGRADEPUBLIC4: "relations[3].activityReputationGradePublic",
    ACTIVITYREPUTATIONGRADEPUBLIC5: "relations[4].activityReputationGradePublic",
    ACTIVITYREPUTATIONGRADEPUBLIC6: "relations[5].activityReputationGradePublic",
    ACTIVITYREPUTATIONGRADEPUBLIC7: "relations[6].activityReputationGradePublic",
    ACTIVITYREPUTATIONGRADEPUBLIC8: "relations[7].activityReputationGradePublic",

    //Account Entity Financials
    ACCOUNTTYPE1: "accountEntityFinancials[0].accountType",
    ACCOUNTTYPE2: "accountEntityFinancials[1].accountType",
    ACCOUNTTYPE3: "accountEntityFinancials[2].accountType",
    ACCOUNTNUMBER1: "accountEntityFinancials[0].accountNumber",
    ACCOUNTNUMBER2: "accountEntityFinancials[1].accountNumber",
    ACCOUNTNUMBER3: "accountEntityFinancials[2].accountNumber",
    ACCOUNTNAMEENTITY1: "accountEntityFinancials[0].accountNameEntity",
    ACCOUNTNAMEENTITY2: "accountEntityFinancials[1].accountNameEntity",
    ACCOUNTNAMEENTITY3: "accountEntityFinancials[2].accountNameEntity",

    // === PEP SECTION ===
    PEP_MANAGE_PUBLIC_RESOURCES: "pep.managePublicResources",
    PEP_PUBLIC_POWER: "pep.publicPower",
    PEP_PUBLIC_POWER_NAME: "pep.publicPowerName",

    PEP_RELATION: "pep.relation",
    PEP_RELATION_NAME: "pep.relationName",

    PEP_TAX_OBLIGATIONS: "pep.taxObligations",
    PEP_TAX_COUNTRIES: "pep.taxCountries",

    // === FOREIGN CURRENCY SECTION ===
    FOREIGN_CURRENCY_MANAGEMENT: "foreignCurrency.management",

    // Row 1
    FOREIGN_PRODUCT_TYPE1: "foreignCurrency.products[0].type",
    FOREIGN_ENTITY1: "foreignCurrency.products[0].entity",
    FOREIGN_COUNTRY1: "foreignCurrency.products[0].country",
    FOREIGN_CURRENCY1: "foreignCurrency.products[0].currency",

    // Row 2
    FOREIGN_PRODUCT_TYPE2: "foreignCurrency.products[1].type",
    FOREIGN_ENTITY2: "foreignCurrency.products[1].entity",
    FOREIGN_COUNTRY2: "foreignCurrency.products[1].country",
    FOREIGN_CURRENCY2: "foreignCurrency.products[1].currency",

    // === SIGNATURE SECTION ===
    SIGN_NAME: "signature.name",
    SIGN_DOCUMENT: "signature.document",
    SIGN_SIGNATURE: "signature.signature",


    // === VERIFICACIÓN 1 (Comercial / Suministros) ===
    VERIF1_NAME: "verification.block1.name",
    VERIF1_SIGNATURE: "verification.block1.signature",
    VERIF1_DATE: "verification.block1.date",
    VERIF1_TIME: "verification.block1.time",
    VERIF1_AUTH: "verification.block1.auth",

    // === VERIFICACIÓN 2 (Oficial de Cumplimiento) ===
    VERIF2_NAME: "verification.block2.name",
    VERIF2_SIGNATURE: "verification.block2.signature",
    VERIF2_DATE: "verification.block2.date",
    VERIF2_TIME: "verification.block2.time",
    VERIF2_AUTH: "verification.block2.auth",

    // === AUTORIZACIÓN PEP 1 (Gerente Administrativa) ===
    PEP_AUTH1_NAME: "pepAuthorization.block1.name",
    PEP_AUTH1_SIGNATURE: "pepAuthorization.block1.signature",
    PEP_AUTH1_DATE: "pepAuthorization.block1.date",
    PEP_AUTH1_TIME: "pepAuthorization.block1.time",
    PEP_AUTH1_AUTH: "pepAuthorization.block1.auth",

    // === AUTORIZACIÓN PEP 2 (Oficial de Cumplimiento) ===
    PEP_AUTH2_NAME: "pepAuthorization.block2.name",
    PEP_AUTH2_SIGNATURE: "pepAuthorization.block2.signature",
    PEP_AUTH2_DATE: "pepAuthorization.block2.date",
    PEP_AUTH2_TIME: "pepAuthorization.block2.time",
    PEP_AUTH2_AUTH: "pepAuthorization.block2.auth",
};

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
                value: false,
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
                type: "signature",
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
                value: new Date().toLocaleDateString(),
            },
            {
                id: "ver1Time",
                name: "verification.block1.time",
                type: "text",
                label: "Hora",
                required: false,
                value: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
            {
                id: "ver1Auth",
                name: "verification.block1.auth",
                type: "checkbox",
                label: "Autorización (SI/NO)",
                required: false,
                value: false,
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
                label: "Autorización (SI/NO)",
                required: false,
                value: false,
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
                type: "signature",
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
                value: new Date().toLocaleDateString(),
            },
            {
                id: "pepA1Time",
                name: "pepAuthorization.block1.time",
                type: "text",
                label: "Hora",
                required: false,
                value: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
            {
                id: "pepA1Auth",
                name: "pepAuthorization.block1.auth",
                type: "checkbox",
                label: "Autorización (SI/NO)",
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
                name: "pepAuthorization.block2.name",
                type: "text",
                label: "Nombre",
                required: false,
                value: "",
            },
            {
                id: "pepA2Sign",
                name: "pepAuthorization.block2.signature",
                type: "signature",
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
                value: new Date().toLocaleDateString(),
            },
            {
                id: "pepA2Time",
                name: "pepAuthorization.block2.time",
                type: "text",
                label: "Hora",
                placeholder: "HH:MM",
                required: false,
                value: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            },
            {
                id: "pepA2Auth",
                name: "pepAuthorization.block2.auth",
                type: "checkbox",
                label: "Autorización (SI/NO)",
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


