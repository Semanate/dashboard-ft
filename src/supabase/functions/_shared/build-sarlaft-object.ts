/* eslint-disable @typescript-eslint/no-explicit-any */
export function buildSarlaftObject(row: any) {
    return {
        ...row.payload,

        relations: (row.sarlaft_relations ?? [])
            .sort((a, b) => a.position - b.position)
            .map((r: any) => ({
                typeDoc: r.type_doc,
                docNumber: r.doc_number,
                socialName: r.social_name,
                percentageParticipation: r.percentage_participation,
                activityAdminResource: r.activity_admin_resource,
                activityReputationGradePublic: r.activity_reputation_grade_public,
            })),

        accountEntityFinancials: (row.sarlaft_account_entity_financials ?? [])
            .sort((a, b) => a.position - b.position)
            .map((a: any) => ({
                accountType: a.account_type,
                accountNumber: a.account_number,
                accountNameEntity: a.account_name_entity,
            })),

        foreignCurrency: {
            ...(row.payload?.foreignCurrency ?? {}),
            products: (row.sarlaft_foreign_products ?? [])
                .sort((a, b) => a.position - b.position)
                .map((p: any) => ({
                    type: p.type,
                    entity: p.entity,
                    country: p.country,
                    currency: p.currency,
                })),
        },
    };
}
