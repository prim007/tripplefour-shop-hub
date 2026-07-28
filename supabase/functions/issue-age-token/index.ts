const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AGE_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const MINIMUM_AGE = 21;
const encoder = new TextEncoder();

function calculateAge(dob: Date, now: Date): number {
  let age = now.getUTCFullYear() - dob.getUTCFullYear();
  const monthDiff = now.getUTCMonth() - dob.getUTCMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getUTCDate() < dob.getUTCDate())) {
    age -= 1;
  }
  return age;
}

function toBase64Url(input: string): string {
  return btoa(input).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function signValue(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return bytesToBase64Url(new Uint8Array(signature));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const signingSecret = Deno.env.get("ADMIN_SECRET_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!signingSecret) {
      return new Response(JSON.stringify({ error: "Server configuration error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Server-side age check. The caller must supply a full date of birth; the
    // frontend confirmation dialog alone is NOT sufficient.
    let body: unknown = null;
    try {
      body = await req.json();
    } catch {
      body = null;
    }

    const dobRaw = (body as { date_of_birth?: unknown } | null)?.date_of_birth;
    if (typeof dobRaw !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dobRaw)) {
      return new Response(
        JSON.stringify({ error: "A valid date of birth (YYYY-MM-DD) is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const dob = new Date(`${dobRaw}T00:00:00Z`);
    const now = new Date();
    if (Number.isNaN(dob.getTime()) || dob > now || dob.getUTCFullYear() < 1900) {
      return new Response(
        JSON.stringify({ error: "A valid date of birth (YYYY-MM-DD) is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const age = calculateAge(dob, now);
    if (age < MINIMUM_AGE) {
      return new Response(
        JSON.stringify({ error: `You must be at least ${MINIMUM_AGE} years old to use this site.` }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const payload = {
      type: "age",
      age_verified: true,
      min_age: MINIMUM_AGE,
      exp: Date.now() + AGE_TOKEN_TTL_MS,
      iat: Date.now(),
    };

    const payloadPart = toBase64Url(JSON.stringify(payload));
    const signaturePart = await signValue(payloadPart, signingSecret);

    return new Response(JSON.stringify({ token: `${payloadPart}.${signaturePart}` }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("issue-age-token error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
