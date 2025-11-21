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
    TYPEDOC1: (docType: DocType) => getDocTypeString(docType),
    TYPEDOC2: (docType: DocType) => getDocTypeString(docType),
    TYPEDOC3: (docType: DocType) => getDocTypeString(docType),
    TYPEDOC4: (docType: DocType) => getDocTypeString(docType),
    TYPEDOC5: (docType: DocType) => getDocTypeString(docType),
    TYPEDOC6: (docType: DocType) => getDocTypeString(docType),
    TYPEDOC7: (docType: DocType) => getDocTypeString(docType),
    TYPEDOC8: (docType: DocType) => getDocTypeString(docType),
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
    // 
};
