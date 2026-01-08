import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment");
}

const adminClient = createClient(supabaseUrl!, serviceRoleKey!);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const {
      email,
      password,
      first_name = "",
      last_name = "",
      role = "physician",
    } = body || {};

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create the user and mark email as confirmed so they can log in immediately
    const { data: created, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { first_name, last_name, role },
    });

    if (createError) {
      const msg = (createError.message || "").toLowerCase();
      const code = (createError as any).code || "";
      
      // If user already exists, treat as success so the client can sign in
      if (code === "email_exists" || msg.includes("already registered") || msg.includes("user already exists")) {
        return new Response(JSON.stringify({ ok: true, message: "User already exists" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Improve diagnostics for common internal DB issues
      const diagnostic = {
        code: createError.code || "unexpected_failure",
        status: createError.status || 500,
        message: createError.message,
        hint:
          msg.includes("database error creating new user")
            ? "Auth admin.createUser failed in the backend. If you recently added DB triggers/functions that reference other tables (e.g. hospitals), ensure those tables exist and functions don’t error."
            : undefined,
      };
      console.error("Create user error:", diagnostic);
      return new Response(JSON.stringify({ error: diagnostic }), {
        status: diagnostic.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = created.user?.id;

    // Ensure a profile exists and assign a default hospital if possible
    try {
      // Get a default hospital (first available)
      const { data: hospitals } = await adminClient
        .from("hospitals")
        .select("id")
        .limit(1);

      const defaultHospitalId = hospitals?.[0]?.id || null;

      if (userId) {
        // Upsert the profile
        await adminClient.from("profiles").upsert(
          {
            id: userId,
            email,
            first_name,
            last_name,
            role,
            hospital_id: defaultHospitalId,
          },
          { onConflict: "id" }
        );

        // Also insert into user_roles table for proper RBAC
        await adminClient.from("user_roles").upsert(
          {
            user_id: userId,
            role: role,
            hospital_id: defaultHospitalId,
            granted_at: new Date().toISOString(),
          },
          { onConflict: "user_id,role,hospital_id" }
        );
      }
    } catch (profileErr) {
      console.warn("Profile/role upsert warning:", profileErr);
      // Non-fatal
    }

    return new Response(
      JSON.stringify({ ok: true, user_id: userId }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Unhandled error in admin-create-user:", err);
    return new Response(JSON.stringify({ error: err?.message || "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
