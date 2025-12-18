import { serve } from "https://deno.land/std/http/server.ts";
import { jsonResponse } from "../_shared/response.ts";
import { createUserClient } from "../_shared/supabase.ts";

function toInt(value: string | null, fallback: number) {
    const n = Number(value);
    return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

serve(async (req) => {
    if (req.method !== "GET") {
        return jsonResponse({ success: false, data: null, error: "Method not allowed" }, 405);
    }

    const jwt = req.headers.get("Authorization")?.replace("Bearer ", "");
    const supabase = createUserClient(jwt);

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        return jsonResponse({ success: false, data: null, error: "Unauthorized" }, 401);
    }

    const url = new URL(req.url);

    const limitRaw = toInt(url.searchParams.get("limit"), 20);
    const offset = Math.max(0, toInt(url.searchParams.get("offset"), 0));
    const limit = Math.min(Math.max(1, limitRaw), 50);

    const status = url.searchParams.get("status"); // draft|submitted|approved|rejected
    const typePerson = url.searchParams.get("typePersonAggrement"); // NAT|JUR
    const includePayload = url.searchParams.get("includePayload") === "true";

    const baseSelect = [
        "id",
        "status",
        "date_agreement",
        "city_agreement",
        "type_person_agreement",
        "person_doc_type",
        "person_doc_number",
        "created_at",
        "updated_at",
    ].join(",");

    const selectStr = includePayload ? `${baseSelect},payload` : baseSelect;

    let query = supabase
        .from("sarlaft_forms")
        .select(selectStr, { count: "exact" })
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .range(offset, offset + limit - 1);

    if (status) query = query.eq("status", status);
    if (typePerson) query = query.eq("type_person_agreement", typePerson);

    const { data, error, count } = await query;

    if (error) {
        return jsonResponse({ success: false, data: null, error: error.message }, 400);
    }

    return jsonResponse({
        success: true,
        data: {
            items: data ?? [],
            pagination: {
                total: count ?? null,
                limit,
                offset,
                nextOffset: (data?.length ?? 0) === limit ? offset + limit : null,
            },
        },
        error: null,
    });
});
