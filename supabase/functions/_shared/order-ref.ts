// Cryptographically strong, unguessable order reference generator.
// Uses Crockford-style base32 over 80 bits of CSPRNG entropy (16 chars),
// which is ~1.2e24 possibilities — not enumerable or predictable.
const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"; // no I, L, O, U (ambiguity)

export function randomRef(prefix: string, length = 16): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = "";
  for (const b of bytes) out += ALPHABET[b % ALPHABET.length];
  return `${prefix}-${out}`;
}

// Generates a reference guaranteed unique against the orders table.
// The unique index on orders.order_ref is the final authority; this loop
// avoids surfacing a collision error to the customer.
export async function generateOrderRef(
  supabase: { from: (t: string) => any },
  prefix: string,
  attempts = 5,
): Promise<string> {
  for (let i = 0; i < attempts; i++) {
    const ref = randomRef(prefix);
    const { data } = await supabase
      .from("orders")
      .select("order_ref")
      .eq("order_ref", ref)
      .maybeSingle();
    if (!data) return ref;
  }
  return randomRef(prefix, 24);
}
