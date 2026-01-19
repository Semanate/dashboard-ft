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


function parseValue(value: string) {
    if (value === "true") return true;
    if (value === "false") return false;
    if (value === "") return null;

    // number secure
    // if (!isNaN(Number(value)) && value.trim() !== "") {
    //     return Number(value);
    // }

    return value;
}

function setDeep(obj: any, path: string, value: any) {
    const keys = path
        .replace(/\[(\d+)\]/g, ".$1")
        .split(".");

    let current = obj;

    keys.forEach((key, index) => {
        const isLast = index === keys.length - 1;
        const nextKey = keys[index + 1];

        if (isLast) {
            current[key] = value;
            return;
        }

        if (!(key in current)) {

            // Determine if the next key indicates an array
            current[key] = isNumeric(nextKey) ? [] : {};
        }

        current = current[key];
    });
}

function isNumeric(value: string | undefined) {
    return value !== undefined && !isNaN(Number(value));
}


type UploadedDocs = Record<string, string>;

export function buildSarlaftPayload(
    formData: FormData,
    uploadedDocs: UploadedDocs
) {
    const payload: Record<string, any> = {};

    for (const [rawKey, value] of formData.entries()) {
        if (value instanceof File) continue;

        const parsedValue = parseValue(value);
        setDeep(payload, rawKey, parsedValue);
    }

    payload.supportingDocuments = uploadedDocs;
    payload.updatedAt = new Date().toISOString();

    return payload;
}
