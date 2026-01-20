export type YesNo = "SI" | "NO";

export interface PersonDocument {
  typeDoc: string;
  docNumber: string;
}

export interface AddressInfo {
  city: string;
  address: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
}

export interface NaturalPerson extends PersonDocument, ContactInfo, AddressInfo {
  firstName: string;
  lastName1: string;
  lastName2: string;
  activitySector: string;
  dateOfBirth: string; // ISO string
  placeOfBirth: string;
}

export interface JuridicalPerson extends AddressInfo {
  businessName: string;
  nit: string;
  phone: string;
  phone2?: string;
  email: string;
  email2?: string;
  address2?: string;
  activitySector: string;
}

export interface LegalRepresentative extends PersonDocument, ContactInfo, AddressInfo {
    firstName: string;
    lastName1: string;
    lastName2: string;
    activitySector: string;
}

export interface Relation {
    typeDoc: string;
    docNumber: string;
    socialName: string;
    percentageParticipation: string;
    activityAdminResource: string;
    activityReputationGradePublic: string;
}

export interface AccountEntityFinancial {
    accountType: string;
    accountNumber: string;
    accountNameEntity: string;
}

export interface Pep {
    managePublicResources: YesNo;
    publicPower: YesNo;
    relation: YesNo;
    relationName: string;
    taxObligations: YesNo;
}

export interface ForeignCurrencyProduct {
    type: string;
    entity: string;
    country: string;
    currency: string;
}

export interface ForeignCurrency {
    management: YesNo;
    products: ForeignCurrencyProduct[];
}


export interface Signature {
    name: string;
    document: string;
    signature: string;
}


export interface VerificationBlock {
    name: string;
    signature: string;
    date: string;
    time: string;
    auth: YesNo;
}

export interface Verification {
    block1: VerificationBlock;
    block2: VerificationBlock;
}

export interface PepAuthorization {
    block1: VerificationBlock;
    block2: VerificationBlock;
}


export interface SarlaftForm {
    id: string;
    date: string;
    city: string;
    typeDocument: string;

    status: 'draft' | 'completed' | 'validated';
    representative: LegalRepresentative;

    naturalPerson: NaturalPerson;
    juridicalPerson: JuridicalPerson;

    relations: Relation[];

    accountEntityFinancials: AccountEntityFinancial[];

    pep: Pep;

    foreignCurrency: ForeignCurrency;

    signature: Signature;

    verification: Verification;

    pepAuthorization: PepAuthorization;
    typePersonAggrement: 'NAT' | 'JUR';
    updated_at: string;
    created_at: string;
    supportingDocuments: {
        chamberOfCommerceCertificate: string;
        companyRut: string;
        legalRepresentativeId: string;
        shareholdingCompositionCertificate: string;
    }
}


export interface SarlaftListItem {
    id: string;
    userId: string;
    dateCompleted: string;
    naturalPerson: {
        primerNombre: string;
        primerApellido: string;
        numeroDocumento: string;
    };
    createdAt: string;
    updatedAt: string;
    status: 'draft' | 'completed' | 'validated';
}

export interface SarlaftValidation {
    field: string;
    message: string;
    type: 'error' | 'warning' | 'info';
}

export interface SarlaftExportOptions {
    format: 'excel' | 'pdf';
    includeSignatures: boolean;
    templateVersion: string;
}