import { serve } from "https://deno.land/std/http/server.ts";
import { jsonResponse } from "../_shared/response.ts";
import { createUserClient } from "../_shared/supabase.ts";
import { validateAndNormalizeSarlaft } from "../_shared/sarlaft-validate.ts";

serve(async (req) => {
  const jwt = req.headers.get("Authorization")?.replace("Bearer ", "");
  const supabase = createUserClient(jwt);

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return jsonResponse({ success: false, data: null, error: "Unauthorized" }, 401);
  }

  const payload = await req.json();

  const validation = validateAndNormalizeSarlaft(payload);

  if (!validation.ok) {
    return jsonResponse({ success: false, data: null, error: validation.errors }, 400);
  }

  const { data, error } = await supabase.rpc("save_sarlaft_v2", { p_payload: payload });
  if (error) {
    return jsonResponse({ success: false, data: null, error: error.message }, 400);
  }

  return jsonResponse({ success: true, data: { id: data }, error: null });
});
