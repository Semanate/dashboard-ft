import { serve } from "https://deno.land/std/http/server.ts";
import { jsonResponse } from "../_shared/response.ts";
import { createUserClient } from "../_shared/supabase.ts";
import { excelMappings } from "../_shared/excel-mappings.ts";
import { mapPayloadToFlatObject } from "../_shared/map-payload.ts";
import { buildSarlaftObject } from "../_shared/build-sarlaft-object.ts";

serve(async (req) => {
    if (req.method !== "GET") {
        return jsonResponse({ success: false, error: "Method not allowed" }, 405);
    }

    const jwt = req.headers.get("Authorization")?.replace("Bearer ", "");
    const supabase = createUserClient(jwt);

    const sarlaftId = req.headers.get("x-sarlaft-id");

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        return jsonResponse({ success: false, error: "Unauthorized" }, 401);
    }

    let query = supabase
        .from("sarlaft_forms")
        .select(`
      id,
      status,
      created_at,
      payload,

      sarlaft_relations (
        position,
        type_doc,
        doc_number,
        social_name,
        percentage_participation,
        activity_admin_resource,
        activity_reputation_grade_public
      ),

      sarlaft_account_entity_financials (
        position,
        account_type,
        account_number,
        account_name_entity
      ),

      sarlaft_foreign_products (
        position,
        type,
        entity,
        country,
        currency
      )
    `)
        .order("created_at", { ascending: false });

    if (sarlaftId) {
        query = query.eq("id", sarlaftId).single();
    }

    const { data, error } = await query;

    if (error) {
        return jsonResponse({ success: false, error: error.message }, 400);
    }

    const rows = sarlaftId ? [data] : data;

    const mapped = rows.map((row: any) => {
        const fullPayload = buildSarlaftObject(row);

        return {
            id: row.id,
            status: row.status,
            createdAt: row.created_at,
            values: mapPayloadToFlatObject(fullPayload, excelMappings),
        };
    });

    return jsonResponse({
        success: true,
        data: sarlaftId ? mapped[0] : mapped,
    });
});

