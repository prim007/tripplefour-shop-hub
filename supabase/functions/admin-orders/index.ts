import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const rateLimitMap = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (isRateLimited(clientIp)) {
    return new Response(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    // Admin key check
    const adminKey = req.headers.get("x-admin-key");
    const expectedKey = Deno.env.get("ADMIN_SECRET_KEY");
    if (!expectedKey || adminKey !== expectedKey) {
      // Add delay on failed auth to slow brute-force
      await new Promise((r) => setTimeout(r, 1000));
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "list") {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "confirm-payment") {
      const { order_id } = await req.json();
      if (!order_id) {
        return new Response(JSON.stringify({ error: "order_id required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data, error } = await supabase
        .from("orders")
        .update({ payment_status: "confirmed", status: "processing" })
        .eq("id", order_id)
        .select()
        .single();

      if (error) throw error;

      // When the order is paid, mark its referral as confirmed
      await supabase
        .from("affiliate_referrals")
        .update({ status: "confirmed" })
        .eq("order_id", order_id)
        .eq("status", "pending");

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ===== Affiliates =====
    if (action === "list-affiliates") {
      const { data: affiliates, error } = await supabase
        .from("affiliates")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;

      const { data: referrals } = await supabase
        .from("affiliate_referrals")
        .select("affiliate_id, commission_amount, status");

      const stats: Record<string, { sales: number; pending: number; confirmed: number; paid: number }> = {};
      for (const r of referrals ?? []) {
        const s = stats[r.affiliate_id] ??= { sales: 0, pending: 0, confirmed: 0, paid: 0 };
        s.sales += 1;
        const amt = Number(r.commission_amount);
        if (r.status === "pending") s.pending += amt;
        if (r.status === "confirmed") s.confirmed += amt;
        if (r.status === "paid") s.paid += amt;
      }

      return new Response(
        JSON.stringify((affiliates ?? []).map((a) => ({ ...a, stats: stats[a.id] ?? { sales: 0, pending: 0, confirmed: 0, paid: 0 } }))),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (action === "create-affiliate") {
      const body = await req.json();
      const code = String(body.code || "").trim().toUpperCase().slice(0, 32);
      const name = String(body.name || "").trim().slice(0, 100);
      const email = body.email ? String(body.email).trim().slice(0, 255) : null;
      const phone = body.phone ? String(body.phone).trim().slice(0, 30) : null;
      const social_handle = body.social_handle ? String(body.social_handle).trim().slice(0, 100) : null;
      const commission_percent = Math.min(Math.max(Number(body.commission_percent) || 15, 0), 50);

      if (!code || !/^[A-Z0-9_-]{2,32}$/.test(code) || !name) {
        return new Response(JSON.stringify({ error: "Invalid code or name" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const { data, error } = await supabase
        .from("affiliates")
        .insert({ code, name, email, phone, social_handle, commission_percent })
        .select()
        .single();
      if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "toggle-affiliate") {
      const { id, active } = await req.json();
      if (!id) return new Response(JSON.stringify({ error: "id required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const { data, error } = await supabase.from("affiliates").update({ active: Boolean(active) }).eq("id", id).select().single();
      if (error) throw error;
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "mark-payouts-paid") {
      const { affiliate_id } = await req.json();
      if (!affiliate_id) return new Response(JSON.stringify({ error: "affiliate_id required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const { data, error } = await supabase
        .from("affiliate_referrals")
        .update({ status: "paid", paid_at: new Date().toISOString() })
        .eq("affiliate_id", affiliate_id)
        .eq("status", "confirmed")
        .select();
      if (error) throw error;
      return new Response(JSON.stringify({ count: data?.length ?? 0 }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // ===== Abandoned carts =====
    if (action === "list-abandoned-carts") {
      const cutoff = new Date(Date.now() - 30 * 60 * 1000).toISOString(); // 30 min idle = abandoned
      const { data, error } = await supabase
        .from("abandoned_carts")
        .select("*")
        .eq("status", "active")
        .lt("last_activity_at", cutoff)
        .order("last_activity_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return new Response(JSON.stringify(data ?? []), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "dismiss-abandoned-cart") {
      const { id } = await req.json();
      if (!id) return new Response(JSON.stringify({ error: "id required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const { error } = await supabase
        .from("abandoned_carts")
        .update({ status: "dismissed" })
        .eq("id", id);
      if (error) throw error;
      return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("admin-orders error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
