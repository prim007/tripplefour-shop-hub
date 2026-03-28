import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ORDER_STATUS_TOKEN_TTL_MS = 2 * 24 * 60 * 60 * 1000; // 2 days
const encoder = new TextEncoder();

const PRODUCT_PRICES: Record<string, number> = {
  "pr-4gh": 165, "pr-1in": 90, "pr-1gh": 75, "pr-out": 50,
  "sb-out5": 80, "sb-swazi": 60,
  "ghs-50": 1085, "ghs-20": 735, "ghs-2": 260,
  "ind-10": 500, "ind-2": 315, "ind-1": 255,
  "ed-cube40": 60, "ed-soda": 60,
  "vp-disp": 290,
  "vp-lz-toffee": 370, "vp-lz-cherry": 370, "vp-lz-peach": 370,
  "vp-lz-blueberry": 370, "vp-lz-greenapple": 370, "vp-lz-oil": 290,
  "dab-1": 350,
  "ot-moon": 125,
  "ot-papers": 1,
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
      const price = PRODUCT_PRICES[item.id];
      if (price === undefined) {
        return new Response(JSON.stringify({ error: `Unknown product: ${item.id}` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const quantity = Math.max(1, Math.min(100, Math.floor(Number(item.quantity) || 1)));
      subtotal += price * quantity;
      validatedItems.push({ id: item.id, name: item.name || item.id, price, quantity });
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

    const deliveryFee = Number(zone.fee);

    let discountAmount = 0;
    if (promo_code && typeof promo_code === "string" && promo_code.trim()) {
      try {
        const promoRes = await fetch("https://rcigcarkcpinnniddxcm.supabase.co/functions/v1/validate-promo-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: promo_code.trim(), action: "validate" }),
        });

        const promoResult = await promoRes.json();
        if (promoResult.valid && typeof promoResult.discount_percent === "number") {
          const discountPercent = Math.min(Math.max(0, promoResult.discount_percent), 90);
          discountAmount = Math.round(subtotal * (discountPercent / 100));

          await fetch("https://rcigcarkcpinnniddxcm.supabase.co/functions/v1/validate-promo-code", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: promo_code.trim(), action: "redeem" }),
          });
        }
      } catch (e) {
        console.error("Promo validation failed:", e);
      }
    }

    const total = Math.max(deliveryFee, subtotal - discountAmount + deliveryFee);
    const orderRef = `TF-${crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase()}`;

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
