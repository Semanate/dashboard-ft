/* eslint-disable @typescript-eslint/no-explicit-any */
// import type { SupabaseClient } from "@supabase/supabase-js";

type UploadedDocs = Record<string, string>;

export async function uploadDocuments(
    formData: FormData, supabaseClient: any
): Promise<UploadedDocs> {
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

        if (!file.type) continue;

        const allowedTypes = [
            "application/pdf",
            "image/png",
            "image/jpeg"
        ];

        if (!allowedTypes.includes(file.type)) {
            throw new Error(`Tipo de archivo no permitido: ${file.type}`);
        }

        const extension = file.name.split(".").pop();
        const path = `sarlaft/${crypto.randomUUID()}.${extension}`;

        const { error } = await supabaseClient.storage
            .from("sarlaft")
            .upload(path, file, {
                upsert: false,
            });

        if (error) {
            throw new Error(`Error subiendo ${field}: ${error.message}`);
        }

        const { data } = supabaseClient.storage
            .from("sarlaft")
            .getPublicUrl(path);

        uploadedDocs[field.split(".").pop()!] = data.publicUrl;
    }

    return uploadedDocs;
}
