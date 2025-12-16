import { serve } from 'https://deno.land/std/http/server.ts'
import { jsonResponse } from "../_shared/response.ts";
import { createUserClient } from "../_shared/supabase.ts";

serve(async (req) => {
    const jwt = req.headers.get("Authorization")?.replace("Bearer ", "");
    console.log("JWT received in create-sarlaft:", jwt);
    const supabase = createUserClient(jwt);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return jsonResponse(
            { success: false, data: null, error: 'Unauthorized' },
            401
        )
    }

    const payload = await req.json();
    console.log("Payload received in create-sarlaft:", payload);

    const { data: existing } = await supabase
        .from("sarlaft_forms")
        .select("id")
        .eq("user_id", user.id)
        .single();

    if (existing) {
        await supabase
            .from("sarlaft_forms")
            .update({ data: payload })
            .eq("user_id", user.id);
    } else {
        await supabase
            .from("sarlaft_forms")
            .insert({
                user_id: user.id,
                data: payload,
            });
    }

    return jsonResponse({ success: true, data: null, error: null });
});
