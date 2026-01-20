/* eslint-disable @typescript-eslint/no-explicit-any */

export interface FormDataType {
    // Identificación del formulario
    id?: string;
    userId?: string;
    createdAt?: string;
    updatedAt?: string;
    status?: 'draft' | 'completed' | 'validated';
    typePersonAggrement: 'Natural' | 'Juridica' | 'Representante Legal';
    date: string;
    city: string;
    typeDocument: string;

    representative: {
        firstName: string;
        lastName1: string;
        lastName2: string;
        phone: string;
        email: string;
        typeDoc: string;
        docNumber: string;
        city: string;
        activitySector: string;
        address: string;
    };

    naturalPerson: {
        typeDoc: string;
        docNumber: string;
        firstName: string;
        lastName1: string;
        lastName2: string;
        activitySector: string;
        phone: string;
        email: string;
        city: string;
        address: string;
        dateOfBirth: string;
        placeOfBirth: string;

        // Campos adicionales SARLAFT
        nationality?: string;
        gender?: string;
        civilStatus?: string;
        cellPhone?: string;
        country?: string;
        postalCode?: string;
    };

    // Información financiera SARLAFT
    financialInfo?: {
        monthlyIncome: number;
        otherIncome: number;
        monthlyExpenses: number;
        assets: number;
        liabilities: number;
        patrimony: number;
        incomeSource: string;
        incomeSourceDescription?: string;
        operationCurrency: string;
    };

    // Información laboral SARLAFT
    laboralInfo?: {
        company: string;
        position: string;
        workTime: string;
        companyAddress: string;
        companyCity: string;
        companyCountry: string;
        companyPhone: string;
        economicActivity: string;
        taxRegime: string;
    };

    juridicalPerson: {
        businessName: string;
        nit: string;
        phone: string;
        email: string;
        email2: string;
        city: string;
        phone2: string;
        address: string;
        address2: string;
        activitySector: string;
    };

    relations: Array<{
        typeDoc: string;
        docNumber: string;
        socialName: string;
        percentageParticipation: string;
        activityAdminResource: string;
        activityReputationGradePublic: string;
    }>;

    accountEntityFinancials: Array<{
        accountType: string;
        accountNumber: string;
        accountNameEntity: string;
    }>;

    pep: {
        managePublicResources: string;
        publicPower: string;
        publicPowerName?: string;
        relation: string;
        relationName: string;
        taxObligations: string;
        taxCountries?: string;

        // Campos adicionales SARLAFT
        isPep?: boolean;
        pepRelated?: boolean;
        pepDetails?: string;
        criminalInvestigations?: boolean;
        investigationDetails?: string;
        taxHavenOperations?: boolean;
        taxHavenDetails?: string;
        thirdPartyResources?: boolean;
        thirdPartyDetails?: string;
        uifReports?: boolean;
        uifDetails?: string;
        highRiskActivities?: boolean;
        riskDetails?: string;
    };

    foreignCurrency: {
        management: string;
        products: Array<{
            type: string;
            entity: string;
            country: string;
            currency: string;
            purpose?: string;
        }>;
    };

    // Transacciones en efectivo
    cashTransactions?: {
        handlesCash: boolean;
        maxAmount?: number;
        frequency?: string;
    };

    // Referencias comerciales
    commercialReferences?: Array<{
        entity: string;
        phone: string;
        productType: string;
        relationshipTime: string;
    }>;

    // Referencias personales
    personalReferences?: Array<{
        name: string;
        phone: string;
        relationship: string;
        knowledgeTime: string;
    }>;

    signature: {
        name: string;
        document: string;
        signature: string;
        signatureDate?: string;
    };

    // Autorizaciones SARLAFT
    authorizations?: {
        dataProcessing: boolean;
        dataProcessingDate?: string;
        centralConsultation: boolean;
        centralConsultationDate?: string;
        emailCommunication: boolean;
        truthDeclaration: boolean;
        truthDeclarationDate?: string;
    };

    verification: {
        block1: {
            name: string;
            signature: string;
            date: string;
            time: string;
            auth: string;
        };
        block2: {
            name: string;
            signature: string;
            date: string;
            time: string;
            auth: string;
        };
    };

    pepAuthorization: {
        block1: {
            name: string;
            signature: string;
            date: string;
            time: string;
            auth: string;
        };
        block2: {
            name: string;
            signature: string;
            date: string;
            time: string;
            auth: string;
        };
    };
}


export interface OptionsSelects<T> {
    label: string;
    value: T[] | string | T;
}

// Re-export news types
export type { NewsItem, CreateNewsData, UpdateNewsData, NewsStatus } from './news.js';

// Re-export SARLAFT types
export type { SarlaftForm, SarlaftListItem, SarlaftValidation, SarlaftExportOptions } from './sarlaft.js';

export interface StepActive {
    step: number;
    isActive: boolean;
    label: string;
  }