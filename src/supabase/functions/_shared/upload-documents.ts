import { createAdminClient } from "./supabase.ts";

type UploadedDocs = Record<string, string>;

export async function uploadDocuments(
    formData: FormData
): Promise<UploadedDocs> {
    const supabase = createAdminClient();

    const uploadedDocs: UploadedDocs = {};

    const FILE_FIELDS = [
        "supportingDocuments.legalRepresentativeId",
        "supportingDocuments.chamberOfCommerceCertificate",
        "supportingDocuments.shareholdingCompositionCertificate",
        "supportingDocuments.companyRut",
    ];

    for (const field of FILE_FIELDS) {
        const file = formData.get(field);

        if (!(file instanceof File)) continue;

        if (file.size === 0) continue;

        const extension = file.name.split(".").pop();
        const path = `sarlaft/${crypto.randomUUID()}.${extension}`;

        const { error } = await supabase.storage
            .from("sarlaft")
            .upload(path, file, {
                contentType: file.type,
                upsert: false,
            });

        if (error) {
            throw new Error(
                `Error subiendo ${field}: ${error.message}`
            );
        }

        const { data } = supabase.storage
            .from("sarlaft")
            .getPublicUrl(path);

        uploadedDocs[field.split(".").pop()!] = data.publicUrl;
    }

    return uploadedDocs;
}
