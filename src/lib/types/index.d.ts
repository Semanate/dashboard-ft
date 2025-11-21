
export interface FormDataType {
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
    };

    foreignCurrency: {
        management: string;
        products: Array<{
            type: string;
            entity: string;
            country: string;
            currency: string;
        }>;
    };

    signature: {
        name: string;
        document: string;
        signature: string;
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


interface CategoryField {
    name: string;
    type: string;
    label: string;
}