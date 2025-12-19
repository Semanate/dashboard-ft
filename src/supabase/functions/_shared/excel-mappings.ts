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
    DATE: "dateAggrement",
    CITY: "cityAggrement",
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