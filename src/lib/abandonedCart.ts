import { supabase } from "@/integrations/supabase/client";

/**
 * Abandoned-cart capture: upsert the in-progress checkout for the current user.
 * Called debounced from Checkout so we can recover them later via WhatsApp.
 */
interface SaveArgs {
  userId: string;
  name: string;
  email: string;
  phone: string;
  items: { id: string; name: string; quantity: number; price: number }[];
  subtotal: number;
}

export async function saveAbandonedCart(args: SaveArgs) {
  if (!args.email || args.items.length === 0) return;
  const payload = {
    user_id: args.userId,
    customer_name: args.name || null,
    customer_email: args.email,
    customer_phone: args.phone || null,
    items: args.items,
    subtotal: args.subtotal,
    status: "active",
    last_activity_at: new Date().toISOString(),
  };
  const { error } = await supabase
    .from("abandoned_carts")
    .upsert(payload as never, { onConflict: "user_id" });
  if (error) console.warn("Abandoned-cart save failed:", error.message);
}

export async function markCartOrdered(userId: string) {
  await supabase
    .from("abandoned_carts")
    .update({ status: "ordered", recovered_at: new Date().toISOString() } as never)
    .eq("user_id", userId);
}