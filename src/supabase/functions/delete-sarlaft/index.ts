
/* eslint-disable @typescript-eslint/no-explicit-any */
import { serve } from "https://deno.land/std/http/server.ts";
import { jsonResponse } from "../_shared/response.ts";
import { createUserClient } from "../_shared/supabase.ts";
import { AuthMiddleware } from "../_shared/jwt/default.ts";

serve(async (req) => {
    if (req.method !== "DELETE") {
        return jsonResponse({ success: false, error: "Method not allowed" }, 405);
    }

    const jwt = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!jwt) {
        return jsonResponse({ success: false, error: "Unauthorized" }, 401);
    }

    const supabase = createUserClient(jwt);

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
        message: "SARLAFT form deleted successfully",
    });
});
