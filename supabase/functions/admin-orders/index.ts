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
        .update({
          payment_status: "confirmed",
          status: "processing",
          invoice_status: "paid",
          invoice_paid_at: new Date().toISOString(),
        })
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

    if (action === "set-invoice-status") {
      const body = await req.json();
      const order_id = String(body.order_id || "");
      const invoice_status = String(body.invoice_status || "");
      const ALLOWED = ["unpaid", "paid", "overdue"];
      if (!order_id || !ALLOWED.includes(invoice_status)) {
        return new Response(JSON.stringify({ error: "order_id and a valid invoice_status are required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const patch: Record<string, unknown> = {
        invoice_status,
        invoice_paid_at: invoice_status === "paid" ? new Date().toISOString() : null,
      };
      if (invoice_status === "paid") {
        patch.payment_status = "confirmed";
        patch.status = "processing";
      }

      const { data, error } = await supabase
        .from("orders")
        .update(patch)
        .eq("id", order_id)
        .select()
        .single();
      if (error) throw error;

      if (invoice_status === "paid") {
        await supabase
          .from("affiliate_referrals")
          .update({ status: "confirmed" })
          .eq("order_id", order_id)
          .eq("status", "pending");
      }

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


    // ===== Partner inquiry email delivery test =====
    if (action === "test-partner-inquiry") {
      // The test never accepts a caller-chosen recipient: it submits a test inquiry
      // from the fixed support address, and the only email sent is the internal alert.
      const SUPPORT_EMAIL = "support@tripplefourshophub.online";
      const startedAt = new Date().toISOString();

      const res = await fetch(`${supabaseUrl}/functions/v1/submit-partner-inquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${serviceRoleKey}`,
          apikey: serviceRoleKey,
        },
        body: JSON.stringify({
          company_name: "TEST — Email delivery check",
          contact_name: "Tripplefour Admin",
          contact_email: SUPPORT_EMAIL,
          website_url: "https://tripplefourshophub.online",
          product_description:
            "Automated delivery test triggered from the Tripplefour admin dashboard to confirm partner inquiry emails are sending.",
          placement_interest: "other",
          message: `Delivery test started at ${startedAt}.`,
        }),
      });

      if (!res.ok) {
        const detail = await res.text();
        console.error("test-partner-inquiry submit failed", res.status, detail);
        return new Response(JSON.stringify({ error: "Inquiry submission failed" }), {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const finalStatuses = ["sent", "dlq", "failed", "suppressed", "bounced", "complained"];
      let latestRow: any = null;
      for (let i = 0; i < 12; i++) {
        await new Promise((r) => setTimeout(r, 2500));
        const { data } = await supabase
          .from("email_send_log")
          .select("message_id, template_name, recipient_email, status, error_message, created_at")
          .eq("template_name", "partner-inquiry-alert")
          .gte("created_at", startedAt)
          .order("created_at", { ascending: false })
          .limit(1);
        latestRow = data?.[0] ?? null;
        if (latestRow && finalStatuses.includes(latestRow.status)) break;
      }

      const support = latestRow
        ? { recipient: latestRow.recipient_email, status: latestRow.status, error: latestRow.error_message ?? null, at: latestRow.created_at }
        : { recipient: SUPPORT_EMAIL, status: "no_log", error: null, at: null };

      return new Response(
        JSON.stringify({ startedAt, support, delivered: support.status === "sent" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
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
