import { serve } from "https://deno.land/std/http/server.ts";
import { jsonResponse } from "../_shared/response.ts";
import { createUserClient } from "../_shared/supabase.ts";

function toDateOnly(iso: string | undefined): string | null {
    if (!iso) return null;
    // "2025-12-02T05:00:00.000Z" -> "2025-12-02"
    return iso.slice(0, 10);
}

serve(async (req) => {
    const jwt = req.headers.get("Authorization")?.replace("Bearer ", "");
    const supabase = createUserClient(jwt);

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        return jsonResponse({ success: false, data: null, error: "Unauthorized" }, 401);
    }

    const payload = await req.json();

    // Mapea campos top-level desde el JSON (con defaults razonables)
    const date_agreement = toDateOnly(payload?.dateAggrement) ?? toDateOnly(payload?.dateAgreement) ?? null;

    const city_agreement = payload?.cityAggrement ?? payload?.cityAggrement ?? payload?.cityAggrement ?? payload?.cityAggrement ?? payload?.cityAggrement;
    // Tu JSON tiene "cityAggrement" (ojo el typo). Ajusto directo:
    const cityAgreement = payload?.cityAggrement ?? payload?.cityAgreement ?? null;

    const city = payload?.city ?? null;
    const type_document = payload?.typeDocument ?? null;
    const document_number = payload?.documentNumber ?? null;

    if (!date_agreement || !cityAgreement || !city || !type_document || !document_number) {
        return jsonResponse(
            { success: false, data: null, error: "Missing required fields" },
            400
        );
    }

    const upsertData = {
        user_id: user.id,
        date_agreement,
        city_agreement: cityAgreement,
        city,
        type_document,
        document_number,
        payload,
        status: "draft",
    };

    const { data, error } = await supabase
        .from("sarlaft_forms")
        .upsert(upsertData, { onConflict: "user_id" })
        .select("id")
        .single();

    if (error) {
        return jsonResponse({ success: false, data: null, error: error.message }, 400);
    }

    return jsonResponse({ success: true, data: { id: data.id }, error: null });
});
