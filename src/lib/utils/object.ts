
/**
 * 
 * Creates an empty Relation object.
 * @description This function initializes and returns an empty Relation object with default values for its properties.sss
 * @returns Relation Empty
 */
export function createRelation() {
    return {
        typeDoc: "",
        docNumber: "",
        socialName: "",
        percentageParticipation: "",
        activityAdminResource: "",
        activityReputationGradePublic: "",
    };
}

export function createAccountFinancials() {
    return {
        accountType: "",
        accountNumber: "",
        accountNameEntity: "",
    };
}

export function createProductForeignCurrency() {
    return {
        type: "",
        entity: "",
        country: "",
        currency: "",
    }
}

export function createCryptoWallet() {
    return {
        platform: "",
        walletAddress: "",
        cryptoType: "",
    };
}