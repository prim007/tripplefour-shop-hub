import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPPORT_EMAIL = "support@tripplefourshophub.online";

const PLACEMENTS: Record<string, string> = {
  banner: "Banner Ad",
  product_listing: "Sponsored Partner Listing",
  sponsored_post: "Sponsored Blog Article",
  other: "Full Bundle (All of the above)",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const str = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

// Simple per-IP rate limit so the public form can't be used to flood
// arbitrary inboxes with confirmation emails.
const RATE_WINDOW_MS = 60 * 60_000;
const MAX_PER_WINDOW = 5;
const rateMap = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now - entry.windowStart > RATE_WINDOW_MS) {
    rateMap.set(ip, { count: 1, windowStart: now });
    return false;
  }
  entry.count++;
  return entry.count > MAX_PER_WINDOW;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const clientIp =
    (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (isRateLimited(clientIp)) {
    return json({ error: "Too many requests. Please try again later." }, 429);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return json({ error: "Server configuration error" }, 500);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const companyName = str(body.company_name, 100);
  const contactName = str(body.contact_name, 100);
  const contactEmail = str(body.contact_email, 255).toLowerCase();
  const websiteUrl = str(body.website_url, 500);
  const productDescription = str(body.product_description, 2000);
  const placementInterest = str(body.placement_interest, 50);
  const message = str(body.message, 2000);

  if (
    !companyName ||
    !contactName ||
    !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contactEmail) ||
    productDescription.length < 10 ||
    !PLACEMENTS[placementInterest]
  ) {
    return json({ error: "Invalid inquiry details" }, 400);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // Only send a confirmation email the first time an address submits an
  // inquiry, so the public form can't be abused to spam arbitrary inboxes.
  const { count: priorCount } = await supabase
    .from("sponsor_inquiries")
    .select("id", { count: "exact", head: true })
    .eq("contact_email", contactEmail);
  const isFirstInquiry = (priorCount ?? 0) === 0;

  const { data: inquiry, error: insertError } = await supabase
    .from("sponsor_inquiries")
    .insert({
      company_name: companyName,
      contact_name: contactName,
      contact_email: contactEmail,
      website_url: websiteUrl || null,
      product_description: productDescription,
      placement_interest: placementInterest,
      message: message || null,
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("Sponsor inquiry insert error:", insertError);
    return json({ error: "Failed to save inquiry" }, 500);
  }

  const placementLabel = PLACEMENTS[placementInterest];
  const submittedAt = new Date().toISOString();

  const send = (
    templateName: string,
    recipientEmail: string,
    templateData: Record<string, unknown>,
  ) =>
    fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceRoleKey}`,
        apikey: serviceRoleKey,
      },
      body: JSON.stringify({
        templateName,
        recipientEmail,
        idempotencyKey: `${templateName}-${inquiry.id}`,
        templateData,
      }),
    }).then(async (res) => {
      if (!res.ok) {
        console.error(`${templateName} send failed`, res.status, await res.text());
      }
    }).catch((e) => console.error(`${templateName} send error`, e));

  // Only the internal support alert is sent. No email goes to the caller-supplied
  // contact address, so this public form cannot be used to email arbitrary people.
  await send("partner-inquiry-alert", SUPPORT_EMAIL, {
    companyName,
    contactName,
    contactEmail,
    websiteUrl,
    placementInterest: placementLabel,
    productDescription,
    message,
    submittedAt,
  });

  return json({ success: true });
});
