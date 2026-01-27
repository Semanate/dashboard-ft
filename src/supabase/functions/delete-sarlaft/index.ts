
/* eslint-disable @typescript-eslint/no-explicit-any */
import { serve } from "https://deno.land/std/http/server.ts";
import { jsonResponse } from "../_shared/response.ts";
import { createUserClient, createAdminClient } from "../_shared/supabase.ts";

serve(async (req) => {
    if (req.method !== "DELETE") {
        return jsonResponse({ success: false, error: "Method not allowed" }, 405);
    }

    const jwt = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!jwt) {
        return jsonResponse({ success: false, error: "Unauthorized" }, 401);
    }

    const supabase = createUserClient(jwt);
    const admin = createAdminClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        return jsonResponse({ success: false, error: "Unauthorized" }, 401);
    }

    const sarlaftId = req.headers.get("x-sarlaft-id");
    if (!sarlaftId) {
        return jsonResponse(
            { success: false, error: "x-sarlaft-id header is required" },
            400
        );
    }

    // First, get the form to retrieve document URLs before deleting
    const { data: formData, error: fetchError } = await supabase
        .from("sarlaft_forms")
        .select("payload")
        .eq("id", sarlaftId)
        .single();

    if (fetchError) {
        return jsonResponse(
            { success: false, error: fetchError.message },
            400
        );
    }

    // Extract document URLs from payload and delete from storage
    if (formData?.payload?.supportingDocuments) {
        const docs = formData.payload.supportingDocuments;
        const filesToDelete: string[] = [];

        // Get all document URLs
        const docFields = [
            'legalRepresentativeId',
            'chamberOfCommerceCertificate', 
            'shareholdingCompositionCertificate',
            'companyRut'
        ];

        for (const field of docFields) {
            const url = docs[field];
            if (url && typeof url === 'string') {
                // Extract path from URL: .../storage/v1/object/public/sarlaft/sarlaft/uuid.ext
                const match = url.match(/\/sarlaft\/(sarlaft\/[^?]+)/);
                if (match) {
                    filesToDelete.push(match[1]);
                }
            }
        }

        // Delete files from storage using admin client
        if (filesToDelete.length > 0) {
            const { error: storageError } = await admin.storage
                .from("sarlaft")
                .remove(filesToDelete);

            if (storageError) {
                console.error("Error deleting files from storage:", storageError);
                // Continue with form deletion even if storage deletion fails
            }
        }
    }

    // Delete the form (RLS only allows deleting drafts owned by user)
    const { error } = await supabase
        .from("sarlaft_forms")
        .delete()
        .eq("id", sarlaftId);

    if (error) {
        return jsonResponse(
            { success: false, error: error.message },
            400
        );
    }

    return jsonResponse({
        success: true,
        message: "SARLAFT form and associated documents deleted successfully",
    });
});
