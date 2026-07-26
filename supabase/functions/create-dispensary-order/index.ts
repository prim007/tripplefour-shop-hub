import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Server-authoritative catalog — must match src/data/products.ts and create-order.
const PRODUCT_CATALOG: Record<string, { name: string; price: number }> = {
  "acc-t444-cones": { name: "TRIPPLE444 108mm Rolling Papers (100 per barrel)", price: 150 },
  "acc-hornet-tips": { name: "HORNET Natural Hemp & Cotton Rolling Tips (50 leaves)", price: 165 },
  "acc-hp-cherry-pig": { name: "HoneyPuff Hemp Wraps — Honey Cherry Pig", price: 145 },
  "acc-fruitors-ashtray": { name: "Fruitors Skull-Shaped Ashtray Set", price: 480 },
  "acc-rickmorty-ashtray": { name: "Rick and Morty Round Ashtray Set", price: 650 },
  "acc-dot-lighter-50": { name: "DOT Lighter Box (50pcs)", price: 100 },
  "acc-psych-small-pkg": { name: "Psychedelic Graphic Small Packages", price: 95 },
  "acc-hp-rolling-tray": { name: "HoneyPuff Rolling Tray", price: 100 },
  "acc-hp-100bill": { name: "HoneyPuff $100 Bill Rolling Papers (Box of 24)", price: 55 },
  "acc-airbuzz-shisha": { name: "AirBuzz Dubai Fusion Premium Shisha", price: 100 },
  "vp-thalia-ice-cola": { name: "Thalia 8000 Puffs 2% Vape — Ice Cola", price: 100 },
  "ed-cube40": { name: "Edible Cube 40mg", price: 60 },
  "ed-chocchip-cookies": { name: "Tripple444 ChocChip Cookies (10 Pack)", price: 165 },
  "dab-1": { name: "Dab Concentrate", price: 350 },
  "dv-edibles-100mg": { name: "Dirty Vapes Edibles Tub 100mg", price: 150 },
  "dv-cart-1ml": { name: "Dirty Vapes 1ML Cart", price: 350 },
  "dv-switch-2ml": { name: "Dirty Vapes 2ML SWITCH", price: 900 },
  "dv-disposable-1ml": { name: "Dirty Vapes 1ML Disposable", price: 450 },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const body = await req.json();
    const {
      business_name,
      contact_name,
      email,
      phone,
      delivery_address,
      items,
      custom_requests,
      notes,
      delivery_zone_id,
    } = body ?? {};

    if (!business_name || !contact_name || !email || !phone || !delivery_address) {
      return json({ error: "Missing required business details" }, 400);
    }

    const hasItems = Array.isArray(items) && items.length > 0;
    const customText = typeof custom_requests === "string" ? custom_requests.trim().slice(0, 1000) : "";
    if (!hasItems && !customText) {
      return json({ error: "Add at least one product or a custom request" }, 400);
    }

    if (
      String(business_name).length > 120 ||
      String(contact_name).length > 100 ||
      String(email).length > 255 ||
      String(phone).length > 25 ||
      String(delivery_address).length > 500
    ) {
      return json({ error: "Input too long" }, 400);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return json({ error: "Invalid email" }, 400);
    }
    if (!/^\+?\d{9,15}$/.test(String(phone).replace(/[\s\-()]/g, ""))) {
      return json({ error: "Invalid phone number" }, 400);
    }

    let subtotal = 0;
    const validatedItems: { id: string; name: string; price: number; quantity: number }[] = [];

    if (hasItems) {
      for (const item of items) {
        const product = PRODUCT_CATALOG[item?.id];
        if (!product) return json({ error: `Unknown product: ${item?.id}` }, 400);
        const quantity = Math.max(1, Math.min(1000, Math.floor(Number(item.quantity) || 1)));
        subtotal += product.price * quantity;
        validatedItems.push({ id: item.id, name: product.name, price: product.price, quantity });
      }
    }

    if (customText) {
      validatedItems.push({
        id: "custom-request",
        name: `Custom request (quote to follow): ${customText}`,
        price: 0,
        quantity: 1,
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Server-authoritative delivery fee based on the selected delivery zone
    let deliveryFee = 0;
    let zoneName = "Not selected";
    let zoneId: string | null = null;
    if (delivery_zone_id) {
      const { data: zone, error: zoneError } = await supabase
        .from("delivery_zones")
        .select("id, zone_name, fee")
        .eq("id", delivery_zone_id)
        .maybeSingle();
      if (zoneError || !zone) {
        return json({ error: "Invalid delivery zone" }, 400);
      }
      deliveryFee = Number(zone.fee);
      zoneName = zone.zone_name;
      zoneId = zone.id;
    }
    const total = subtotal + deliveryFee;

    const orderRef = `DISP-${crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`;
    const noteText = typeof notes === "string" ? notes.trim().slice(0, 300) : "";

    const { data: order, error: insertError } = await supabase
      .from("orders")
      .insert({
        order_ref: orderRef,
        customer_name: `${String(business_name).trim()} — ${String(contact_name).trim()}`.slice(0, 100),
        customer_email: String(email).trim(),
        customer_phone: String(phone).trim(),
        delivery_address: noteText
          ? `${String(delivery_address).trim()}\n\nNotes: ${noteText}`.slice(0, 300)
          : String(delivery_address).trim().slice(0, 300),
        delivery_zone_id: zoneId,
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
      console.error("Dispensary order insert error:", insertError);
      return json({ error: "Failed to create order" }, 500);
    }

    // Notify admin of the new wholesale order
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
          source: "Dispensary Wholesale Portal",
          paymentMethod: "eft",
          customerName: `${String(business_name).trim()} — ${String(contact_name).trim()}`,
          customerEmail: String(email).trim(),
          customerPhone: String(phone).trim(),
          deliveryAddress: noteText
            ? `${String(delivery_address).trim()}\n\nNotes: ${noteText}`
            : String(delivery_address).trim(),
          deliveryZone: `Wholesale — ${zoneName}`,
          items: validatedItems,
          subtotal,
          deliveryFee,
          total,
        },
      }),
    }).catch((err) => console.error("Wholesale admin alert enqueue failed:", err));

    return json({
      order_ref: order.order_ref,
      subtotal: Number(order.subtotal),
      total: Number(order.total),
      delivery_fee: Number(order.delivery_fee),
      delivery_zone_name: zoneName,
      items: validatedItems,
    });
  } catch (err) {
    console.error("create-dispensary-order failed:", err);
    return json({ error: "Unexpected error" }, 500);
  }
});