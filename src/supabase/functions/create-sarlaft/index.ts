import { serve } from "https://deno.land/std/http/server.ts";
import { jsonResponse } from "../_shared/response.ts";
import { createUserClient } from "../_shared/supabase.ts";
import { validateAndNormalizeSarlaft } from "../_shared/sarlaft-validate.ts";
import { buildSarlaftPayload } from "../_shared/build-sarlaft-object.ts";
import { uploadDocuments } from "../_shared/upload-documents.ts";

serve(async (req) => {
  const jwt = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!jwt) {
    return jsonResponse({ success: false, data: null, error: "Unauthorized" }, 401);
  }
  const supabase = createUserClient(jwt);

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return jsonResponse({ success: false, data: null, error: "Unauthorized" }, 401);
  }

  const formData = await req.formData();
  const uploadedDocs = await uploadDocuments(formData, supabase);
  const payload = await buildSarlaftPayload(formData, uploadedDocs);
  const validation = validateAndNormalizeSarlaft(payload);

  if (!validation.ok) {
    return jsonResponse({ success: false, data: null, error: validation.errors }, 400);
  }

  const { data, error } = await supabase.rpc("save_sarlaft_v2", { p_payload: payload });
  if (error) {
    return jsonResponse({ success: false, data: null, error: error.message }, 400);
  }

  console.log("SARLAFT form saved with ID:", data);
  return jsonResponse({ success: true, data: { id: data }, error: null });
});