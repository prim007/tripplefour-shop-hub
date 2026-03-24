import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Authoritative product price list (must match src/data/products.ts)
const PRODUCT_PRICES: Record<string, number> = {
  "pr-4gh": 165, "pr-1in": 90, "pr-1gh": 75, "pr-out": 50,
  "sb-out5": 80, "sb-swazi": 60,
  "ghd-50": 945, "ghd-20": 595, "ghd-10": 445, "ghd-5": 325, "ghd-2": 255,
  "ghs-50": 1085, "ghs-20": 735, "ghs-2": 260,
  "ind-10": 500, "ind-2": 315, "ind-1": 255,
  "ed-cube40": 60, "ed-soda": 60,
  "vp-pen": 550, "vp-disp": 320,
  "dab-1": 350,
  "ot-moon": 125,
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { customer_name, customer_email, customer_phone, delivery_address, delivery_zone_id, items, promo_code } = body;

    // Validate required fields
    if (!customer_name || !customer_email || !customer_phone || !delivery_address || !delivery_zone_id || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate field lengths
    if (customer_name.length > 100 || customer_email.length > 255 || customer_phone.length > 20 || delivery_address.length > 300) {
      return new Response(JSON.stringify({ error: "Input too long" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer_email)) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate phone
    const phoneClean = customer_phone.replace(/[\s\-()]/g, "");
    if (!/^\+?\d{9,15}$/.test(phoneClean)) {
      return new Response(JSON.stringify({ error: "Invalid phone number" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Server-side price calculation
    let subtotal = 0;
    const validatedItems: { id: string; name: string; price: number; quantity: number }[] = [];

    for (const item of items) {
      const price = PRODUCT_PRICES[item.id];
      if (price === undefined) {
        return new Response(JSON.stringify({ error: `Unknown product: ${item.id}` }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const quantity = Math.max(1, Math.min(100, Math.floor(Number(item.quantity) || 1)));
      subtotal += price * quantity;
      validatedItems.push({ id: item.id, name: item.name || item.id, price, quantity });
    }

    // Look up delivery zone fee server-side
    const { data: zone, error: zoneError } = await supabase
      .from("delivery_zones")
      .select("id, fee, zone_name")
      .eq("id", delivery_zone_id)
      .single();

    if (zoneError || !zone) {
      return new Response(JSON.stringify({ error: "Invalid delivery zone" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const deliveryFee = Number(zone.fee);

    // Handle promo code server-side (optional)
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
          discountAmount = Math.round(subtotal * (promoResult.discount_percent / 100));
          
          // Redeem the promo
          await fetch("https://rcigcarkcpinnniddxcm.supabase.co/functions/v1/validate-promo-code", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: promo_code.trim(), action: "redeem" }),
          });
        }
      } catch (e) {
        console.error("Promo validation failed:", e);
        // Continue without discount
      }
    }

    const total = subtotal - discountAmount + deliveryFee;
    const orderRef = `TF-${Date.now().toString(36).toUpperCase()}`;

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
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      id: order.id,
      order_ref: order.order_ref,
      subtotal: order.subtotal,
      total: order.total,
      delivery_fee: order.delivery_fee,
      discount: discountAmount,
      delivery_zone_name: zone.zone_name,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("create-order error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
