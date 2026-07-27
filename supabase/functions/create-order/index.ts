import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ORDER_STATUS_TOKEN_TTL_MS = 2 * 24 * 60 * 60 * 1000; // 2 days
const encoder = new TextEncoder();

// Free delivery threshold — must match src/pages/Cart.tsx and Checkout.tsx.
const FREE_SHIPPING_THRESHOLD = 1200;

// Server-authoritative promo code table. Max discount is capped at 90% below.
const PROMO_CODES: Record<string, number> = {
  WELCOME10: 10,
};

const PRODUCT_CATALOG: Record<string, { name: string; price: number }> = {
  "pr-4gh": { name: "4-Pack Greenhouse Pre-Roll", price: 165 },
  "pr-1in": { name: "Indoor Pre-Roll", price: 90 },
  "pr-1gh": { name: "Greenhouse Pre-Roll", price: 75 },
  "pr-out": { name: "Outdoor Pre-Roll", price: 50 },
  "sb-out5": { name: "Outdoor 5g Stash Bag", price: 80 },
  "sb-swazi": { name: "Swazi Stash Bag", price: 60 },
  "ghs-50": { name: "Greenhouse Flower 50g", price: 1085 },
  "ghs-20": { name: "Greenhouse Flower 20g", price: 735 },
  "ghs-2": { name: "Greenhouse Flower 2g", price: 260 },
  "ind-10": { name: "Indoor Flower 10g", price: 500 },
  "ind-2": { name: "Indoor Flower 2g", price: 315 },
  "ind-1": { name: "Indoor Flower 1g", price: 255 },
  "ed-cube40": { name: "Edible Cube 40mg", price: 60 },
  "ed-chocchip-cookies": { name: "Tripple444 ChocChip Cookies (10 Pack)", price: 165 },
  "dab-1": { name: "Dab Concentrate", price: 350 },
  "ot-moon": { name: "Moon Rock", price: 125 },
  "acc-airbuzz-shisha": { name: "AirBuzz Dubai Fusion Premium Shisha", price: 100 },
  "acc-t444-cones": { name: "TRIPPLE444 108mm Rolling Papers (100 per barrel)", price: 150 },
  "acc-hornet-tips": { name: "HORNET Natural Hemp & Cotton Rolling Tips and Rolling Paper (50 leaves)", price: 165 },
  "acc-hp-cherry-pig": { name: "HoneyPuff Hemp Wraps — Honey Cherry Pig", price: 175 },
  "acc-fruitors-ashtray": { name: "Fruitors Skull-Shaped Ashtray Set", price: 650 },
  "acc-rickmorty-ashtray": { name: "Rick and Morty Round Ashtray Set", price: 650 },
  "acc-dot-lighter-50": { name: "DOT Lighter Box (50pcs)", price: 100 },
  "acc-psych-small-pkg": { name: "Psychedelic Graphic Small Packages", price: 95 },
  "acc-hp-rolling-tray": { name: "HoneyPuff Rolling Tray", price: 100 },
  "vp-thalia-ice-cola": { name: "Thalia 8000 Puffs 2% Vape — Ice Cola", price: 100 },
};

function toBase64Url(input: string): string {
  return btoa(input).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToText(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return atob(padded);
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

async function verifyAgeToken(token: string, secret: string): Promise<boolean> {
  const [payloadPart, signaturePart] = token.split(".");
  if (!payloadPart || !signaturePart) return false;

  const expectedSignature = await signValue(payloadPart, secret);
  if (expectedSignature !== signaturePart) return false;

  const payload = JSON.parse(base64UrlToText(payloadPart)) as { type?: string; exp?: number };
  if (payload.type !== "age") return false;
  if (typeof payload.exp !== "number" || payload.exp <= Date.now()) return false;

  return true;
}

async function createOrderStatusToken(orderRef: string, secret: string): Promise<string> {
  const payload = {
    type: "order_status",
    order_ref: orderRef,
    exp: Date.now() + ORDER_STATUS_TOKEN_TTL_MS,
    iat: Date.now(),
  };

  const payloadPart = toBase64Url(JSON.stringify(payload));
  const signaturePart = await signValue(payloadPart, secret);

  return `${payloadPart}.${signaturePart}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const {
      customer_name,
      customer_email,
      customer_phone,
      delivery_address,
      delivery_zone_id,
      items,
      promo_code,
      age_token,
      affiliate_code,
    } = body;

    if (!customer_name || !customer_email || !customer_phone || !delivery_address || !delivery_zone_id || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!age_token || typeof age_token !== "string") {
      return new Response(JSON.stringify({ error: "Age verification required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (customer_name.length > 100 || customer_email.length > 255 || customer_phone.length > 20 || delivery_address.length > 300) {
      return new Response(JSON.stringify({ error: "Input too long" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer_email)) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const phoneClean = customer_phone.replace(/[\s\-()]/g, "");
    if (!/^\+?\d{9,15}$/.test(phoneClean)) {
      return new Response(JSON.stringify({ error: "Invalid phone number" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const signingSecret = Deno.env.get("ADMIN_SECRET_KEY") || serviceRoleKey;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const ageTokenValid = await verifyAgeToken(age_token, signingSecret);
    if (!ageTokenValid) {
      return new Response(JSON.stringify({ error: "Age verification expired. Please verify again." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let subtotal = 0;
    const validatedItems: { id: string; name: string; price: number; quantity: number }[] = [];

    for (const item of items) {
      const product = PRODUCT_CATALOG[item.id];
      if (!product) {
        return new Response(JSON.stringify({ error: `Unknown product: ${item.id}` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const quantity = Math.max(1, Math.min(100, Math.floor(Number(item.quantity) || 1)));
      subtotal += product.price * quantity;
      validatedItems.push({ id: item.id, name: product.name, price: product.price, quantity });
    }

    const { data: zone, error: zoneError } = await supabase
      .from("delivery_zones")
      .select("id, fee, zone_name")
      .eq("id", delivery_zone_id)
      .single();

    if (zoneError || !zone) {
      return new Response(JSON.stringify({ error: "Invalid delivery zone" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Server-authoritative promo validation. Discount capped at 90%.
    let discountAmount = 0;
    let appliedPromoCode: string | null = null;
    if (promo_code && typeof promo_code === "string" && promo_code.trim()) {
      const code = promo_code.trim().toUpperCase().slice(0, 32);
      const pct = PROMO_CODES[code];
      if (pct && pct > 0 && pct <= 90) {
        discountAmount = Math.round((subtotal * pct) / 100);
        appliedPromoCode = code;
      } else {
        console.warn("Rejected unknown promo code:", code);
      }
    }

    const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
    const rawDeliveryFee = Number(zone.fee);
    const deliveryFee = subtotalAfterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : rawDeliveryFee;
    const total = Math.max(0, subtotalAfterDiscount + deliveryFee);
    const orderRef = `TF-${crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase()}`;

    // Validate affiliate code (optional)
    let affiliate: { id: string; code: string; commission_percent: number } | null = null;
    if (affiliate_code && typeof affiliate_code === "string") {
      const cleanCode = affiliate_code.trim().toUpperCase().slice(0, 32);
      if (/^[A-Z0-9_-]{2,32}$/.test(cleanCode)) {
        const { data: aff } = await supabase
          .from("affiliates")
          .select("id, code, commission_percent, active")
          .eq("code", cleanCode)
          .eq("active", true)
          .maybeSingle();
        if (aff) affiliate = { id: aff.id, code: aff.code, commission_percent: Number(aff.commission_percent) };
      }
    }

    const { data: order, error: insertError } = await supabase
      .from("orders")
      .insert({
        order_ref: orderRef,
        customer_name: customer_name.trim(),
        customer_email: customer_email.trim(),
        customer_phone: customer_phone.trim(),
        delivery_address: delivery_address.trim(),
        delivery_zone_id: zone.id,
        delivery_fee: deliveryFee,
        subtotal,
        total,
        items: validatedItems,
        payment_method: "eft",
        payment_status: "pending",
        status: "pending",
        affiliate_code: affiliate?.code ?? null,
      })
      .select("id, order_ref, subtotal, total, delivery_fee")
      .single();

    if (insertError) {
      console.error("Order insert error:", insertError);
      return new Response(JSON.stringify({ error: "Failed to create order" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Record affiliate referral
    if (affiliate) {
      const commissionAmount = Math.round((subtotal * affiliate.commission_percent) / 100 * 100) / 100;
      await supabase.from("affiliate_referrals").insert({
        affiliate_id: affiliate.id,
        order_id: order.id,
        order_ref: order.order_ref,
        order_subtotal: subtotal,
        commission_percent: affiliate.commission_percent,
        commission_amount: commissionAmount,
        status: "pending",
      });
    }

    const statusToken = await createOrderStatusToken(order.order_ref, signingSecret);

    fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceRoleKey}`,
        apikey: serviceRoleKey,
      },
      body: JSON.stringify({
        templateName: "order-confirmation",
        recipientEmail: customer_email.trim(),
        idempotencyKey: `order-confirm-${order.id}`,
        templateData: {
          customerName: customer_name.trim(),
          orderRef,
          items: validatedItems,
          subtotal,
          discount: discountAmount,
          deliveryFee,
          total,
          deliveryZone: zone.zone_name,
        },
      }),
    }).catch((err) => console.error("Order confirmation email enqueue failed:", err));

    fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceRoleKey}`,
        apikey: serviceRoleKey,
      },
      body: JSON.stringify({
        templateName: "admin-order-alert",
        idempotencyKey: `admin-alert-${order.id}`,
        templateData: {
          orderRef,
          source: "Tripplefour Shop",
          paymentMethod: "eft",
          customerName: customer_name.trim(),
          customerEmail: customer_email.trim(),
          customerPhone: customer_phone.trim(),
          deliveryAddress: delivery_address.trim(),
          deliveryZone: zone.zone_name,
          items: validatedItems,
          subtotal,
          deliveryFee,
          total,
        },
      }),
    }).catch((err) => console.error("Admin order alert enqueue failed:", err));

    return new Response(JSON.stringify({
      id: order.id,
      order_ref: order.order_ref,
      subtotal: order.subtotal,
      total: order.total,
      delivery_fee: order.delivery_fee,
      discount: discountAmount,
      delivery_zone_name: zone.zone_name,
      status_token: statusToken,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("create-order error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
