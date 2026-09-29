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
PRODUCT CATALOG (use these exact IDs when recommending):
PRE-ROLLS:
- [PRODUCT:pr-4gh] 4 Prerolls Greenhouse — R165 — Pack of 4 greenhouse pre-rolls
- [PRODUCT:pr-1in] Indoor Preroll — R90 — Single indoor pre-roll, premium quality
- [PRODUCT:pr-1gh] 1 Preroll Greenhouse — R75 — Single greenhouse pre-roll
- [PRODUCT:pr-out] Outdoor Pre-roll — R50 — Single outdoor pre-roll, great value

SMALL BANKY BAGS:
- [PRODUCT:sb-out5] Small Banky Bag Outdoor 5G — R80 — 5 grams of outdoor
- [PRODUCT:sb-swazi] Small Banky Bag Swazi — R60 — Swazi strain

GREENHOUSE STRAINS:
- [PRODUCT:ghs-50] Greenhouse Strains 50G — R1,085 — Top-shelf, 50 gram pack
- [PRODUCT:ghs-20] Greenhouse Strains 20G — R735 — Top-shelf, 20 gram pack
- [PRODUCT:ghs-2] Greenhouse Strains 2G — R260 — Top-shelf, 2 gram pack

INDOOR DUST:
- [PRODUCT:ind-10] Indoor Dust 10G — R500 — Premium indoor-grown, 10 gram pack
- [PRODUCT:ind-2] Indoor Dust 2G — R315 — Premium indoor-grown, 2 gram pack
- [PRODUCT:ind-1] Indoor Dust 1G — R255 — Premium indoor-grown, 1 gram pack

EDIBLES:
- [PRODUCT:ed-cube40] Edible Cube 40mg — R60 — Cannabis-infused edible cube

VAPES:

DAB:
- [PRODUCT:dab-1] Dab Concentrate — R350 — Premium cannabis dab concentrate

OTHER:
- [PRODUCT:ot-moon] Moon Sticks — R125 — Premium moon sticks
`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(clientIp)) {
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
- If someone asks about sleep → recommend Indica pre-rolls or edibles WITH the product tags
- If someone asks about socializing → recommend Sativa options WITH product tags
- If someone asks about vaping → recommend specific vape products WITH product tags
- If someone is a beginner → recommend a small/affordable option WITH product tags
- End conversations with a product suggestion when possible

${PRODUCT_CATALOG}

EXAMPLE RESPONSE FORMAT:
"For deep relaxation and sleep, I'd recommend trying our Indoor Pre-roll 🌙 It's premium quality and perfect for winding down!

[PRODUCT:pr-1in]

If you want something lighter, the Edible Cube is great for a mellow evening:

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
