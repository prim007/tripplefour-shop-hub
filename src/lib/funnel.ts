import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "tf_funnel_session";

function getSessionId(): string {
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

type FunnelEvent = "view_product" | "add_to_cart" | "begin_checkout" | "purchase";

export function trackFunnel(
  event: FunnelEvent,
  productId?: string,
  meta: Record<string, unknown> = {},
) {
  const session_id = getSessionId();

  // Fire-and-forget — don't block UI
  supabase
    .from("funnel_events")
    .insert({
      session_id,
      event,
      product_id: productId ?? null,
      meta,
    } as never)
    .then(({ error }) => {
      if (error) console.warn("Funnel track error:", error.message);
    });
}
