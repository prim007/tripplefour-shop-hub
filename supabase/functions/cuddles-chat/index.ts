import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MAX_MESSAGES = 10;
const MAX_CONTENT_LENGTH = 1000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 15;

const rateLimitMap = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(clientIp: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(clientIp);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(clientIp, { count: 1, windowStart: now });
    return false;
  }
  entry.count++;
  return entry.count > MAX_REQUESTS_PER_WINDOW;
}

// Full product catalog for AI context
const PRODUCT_CATALOG = `
PRODUCT CATALOG (the ONLY products in stock — use these exact IDs and prices):
ACCESSORIES:
- [PRODUCT:acc-t444-cones] TRIPPLE444 108mm Rolling Papers (100 per barrel) — R150
- [PRODUCT:acc-owlfit-kit] OwlFit Rolling Kit (Hard Case) — R650 — complete rolling kit
- [PRODUCT:acc-siho-grinder] SIHO Wood-Finish 4-Piece Grinder — R105
- [PRODUCT:acc-q6-lighter-25] Q6 MR.RAM Lighter Box (25pcs) — R250
- [PRODUCT:acc-hornet-tips] HORNET Hemp & Cotton Rolling Tips and Paper (50 leaves) — R165
- [PRODUCT:acc-hp-cherry-pig] HoneyPuff Hemp Wraps — Honey Cherry Pig — R175 — tobacco/nicotine free
- [PRODUCT:acc-fruitors-ashtray] Fruitors Skull-Shaped Ashtray Set — R650
- [PRODUCT:acc-rickmorty-ashtray] Rick and Morty Round Ashtray Set — R650
- [PRODUCT:acc-dot-lighter-50] DOT Lighter Box (50pcs) — R100
- [PRODUCT:acc-psych-small-pkg] Psychedelic Graphic Small Packages — R95
- [PRODUCT:acc-hp-rolling-tray] HoneyPuff Rolling Tray — R100
- [PRODUCT:acc-airbuzz-shisha] AirBuzz Dubai Fusion CBD Herbal Shisha — R100
VAPES:
- [PRODUCT:vp-thalia-ice-cola] Thalia 8000 Puffs 2% Vape — Ice Cola — R100
- [PRODUCT:dv-cart-1ml] Dirty Vapes 1ML Cart (510 thread) — R350
- [PRODUCT:dv-disposable-1ml] Dirty Vapes 1ML Disposable — R450
- [PRODUCT:dv-switch-2ml] Dirty Vapes 2ML SWITCH (Sativa/Indica dual mode) — R900
EDIBLES:
- [PRODUCT:ed-cube40] Edible Cube 40mg — R60 — great for beginners
- [PRODUCT:dv-edibles-100mg] Dirty Vapes Edibles Tub 100mg — R150
DAB:
- [PRODUCT:dab-1] Dab Concentrate — R350
`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Chat is open to everyone (no sign-in required). Abuse is limited per
    // signed-in user when available, otherwise per client IP.
    const authHeader = req.headers.get("Authorization") ?? "";
    const accessToken = authHeader.toLowerCase().startsWith("bearer ") ? authHeader.slice(7).trim() : "";
    let rateKey = "";
    if (accessToken) {
      const authClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!);
      const { data: authData } = await authClient.auth.getUser(accessToken);
      if (authData?.user) rateKey = `user:${authData.user.id}`;
    }
    if (!rateKey) {
      const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
      rateKey = `ip:${ip}`;
    }
    if (isRateLimited(rateKey)) {
      return new Response(JSON.stringify({ error: "Too many requests. Please wait a moment before trying again 🌿" }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }


    const body = await req.json();
    const { messages } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const trimmedMessages = messages.slice(-MAX_MESSAGES);
    // Only "user" and "assistant" are accepted (anything else, incl. "system", becomes
    // "user"). Consecutive same-role turns — e.g. after a failed reply — are merged,
    // leading assistant turns dropped, and the newest turn must be the shopper's.
    const sanitizedMessages: { role: "user" | "assistant"; content: string }[] = [];
    for (const msg of trimmedMessages as any[]) {
      const role = msg?.role === "assistant" ? "assistant" : "user";
      const content = typeof msg?.content === "string" ? msg.content.slice(0, MAX_CONTENT_LENGTH) : "";
      if (!content.trim()) continue;
      if (sanitizedMessages.length === 0 && role === "assistant") continue;
      const prev = sanitizedMessages[sanitizedMessages.length - 1];
      if (prev && prev.role === role) {
        prev.content = `${prev.content}\n\n${content}`.slice(0, MAX_CONTENT_LENGTH * 2);
      } else {
        sanitizedMessages.push({ role, content });
      }
    }
    if (sanitizedMessages.length === 0 || sanitizedMessages[sanitizedMessages.length - 1].role !== "user") {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are Cuddles, the friendly AI budtender for Tripplefour — a premium cannabis dispensary in South Africa that delivers nationwide. You have a chill, hippie vibe and use emojis occasionally.

YOUR #1 GOAL: Help customers find products AND get them to add items to their cart. You are a salesperson first, educator second.

CRITICAL RULES FOR PRODUCT RECOMMENDATIONS:
- Whenever you recommend a product, you MUST include the [PRODUCT:id] tag exactly as shown in the catalog below. This creates a clickable product card with an "Add to Cart" button for the customer.
- Always recommend specific products from the catalog, not generic suggestions.
- After answering a question, ALWAYS suggest 1-3 relevant products.
- Use persuasive but friendly language: "This would be perfect for you!", "Customers love this one!", "Best seller for that vibe!"
- ONLY recommend products listed in the catalog. Never invent products, strains or prices. Always state the exact price in Rands.
- Put each [PRODUCT:id] tag on its own line.
- If someone asks about sleep/relaxing → recommend edibles or the SWITCH (Indica mode) WITH the product tags
- If someone asks about rolling → recommend papers, tips, wraps, grinder, tray or the OwlFit kit WITH product tags
- If someone asks about vaping → recommend specific vape products WITH product tags
- If someone is a beginner → recommend a small/affordable option WITH product tags
- End conversations with a product suggestion when possible

${PRODUCT_CATALOG}

EXAMPLE RESPONSE FORMAT:
"For deep relaxation and sleep, I'd recommend the Dirty Vapes Edibles Tub (R150) 🌙 Perfect for winding down!

[PRODUCT:dv-edibles-100mg]

If you want something lighter, the Edible Cube (R60) is great for a mellow evening:

[PRODUCT:ed-cube40]

Both are super popular with our chill-seekers! ✌️"

OTHER INFO:
- Delivery fees R50-R100, orders processed within 24 hours of payment
- Free delivery on orders over R500
- Payment: EFT or Cash
- Website: tripplefourshophub.online
- Keep answers concise and friendly
- Use peace signs ✌️ and leaf emojis 🌿 occasionally
- Never give medical advice — suggest consulting a doctor for health concerns
- If asked about something not in catalog, suggest browsing the shop page`
          },
          ...sanitizedMessages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Cuddles is taking a break 😴 Try again in a moment!" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("cuddles-chat error:", e);
    return new Response(JSON.stringify({ error: "Something went wrong. Please try again." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
