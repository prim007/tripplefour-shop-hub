import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Payfast ITN (Instant Transaction Notification) handler
// This endpoint receives POST callbacks from Payfast when payment status changes

const encoder = new TextEncoder();

function md5(input: string): string {
  const msgBuffer = encoder.encode(input);
  const s = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];
  const K = new Uint32Array(64);
  for (let i = 0; i < 64; i++) {
    K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000) >>> 0;
  }
  let a0 = 0x67452301 >>> 0, b0 = 0xefcdab89 >>> 0, c0 = 0x98badcfe >>> 0, d0 = 0x10325476 >>> 0;
  const msgLen = msgBuffer.length;
  const bitLen = msgLen * 8;
  const padLen = ((56 - (msgLen + 1) % 64) + 64) % 64;
  const totalLen = msgLen + 1 + padLen + 8;
  const padded = new Uint8Array(totalLen);
  padded.set(msgBuffer);
  padded[msgLen] = 0x80;
  const view = new DataView(padded.buffer);
  view.setUint32(totalLen - 8, bitLen >>> 0, true);
  view.setUint32(totalLen - 4, (bitLen / 0x100000000) >>> 0, true);
  for (let offset = 0; offset < totalLen; offset += 64) {
    const M = new Uint32Array(16);
    for (let j = 0; j < 16; j++) M[j] = view.getUint32(offset + j * 4, true);
    let A = a0, B = b0, C = c0, D = d0;
    for (let i = 0; i < 64; i++) {
      let F: number, g: number;
      if (i < 16) { F = (B & C) | (~B & D); g = i; }
      else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
      else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16; }
      else { F = C ^ (B | ~D); g = (7 * i) % 16; }
      F = (F + A + K[i] + M[g]) >>> 0;
      A = D; D = C; C = B;
      B = (B + ((F << s[i]) | (F >>> (32 - s[i])))) >>> 0;
    }
    a0 = (a0 + A) >>> 0; b0 = (b0 + B) >>> 0; c0 = (c0 + C) >>> 0; d0 = (d0 + D) >>> 0;
  }
  const result = new DataView(new ArrayBuffer(16));
  result.setUint32(0, a0, true); result.setUint32(4, b0, true);
  result.setUint32(8, c0, true); result.setUint32(12, d0, true);
  return Array.from(new Uint8Array(result.buffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function verifySignature(pfData: Record<string, string>, passphrase: string | null): boolean {
  const signatureReceived = pfData.signature;
  // Remove signature from data for verification
  const dataWithoutSig = { ...pfData };
  delete dataWithoutSig.signature;

  const paramString = Object.entries(dataWithoutSig)
    .filter(([, v]) => v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(v.trim()).replace(/%20/g, "+")}`)
    .join("&");

  const signatureString = passphrase
    ? `${paramString}&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, "+")}`
    : paramString;

  const calculatedSig = md5(signatureString);
  return calculatedSig === signatureReceived;
}

// Verify the payment amount matches our order
function verifyAmount(pfAmount: string, orderTotal: number): boolean {
  return Math.abs(parseFloat(pfAmount) - orderTotal) < 0.01;
}

// Verify that the request came from Payfast's servers
async function verifyServerConfirmation(pfParamString: string): Promise<boolean> {
  try {
    const response = await fetch("https://www.payfast.co.za/eng/query/validate", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: pfParamString,
    });
    const text = await response.text();
    return text.trim() === "VALID";
  } catch (err) {
    console.error("Server confirmation failed:", err);
    return false;
  }
}

Deno.serve(async (req) => {
  // ITN is always POST, no CORS needed (server-to-server)
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await req.text();
    const params = new URLSearchParams(body);
    const pfData: Record<string, string> = {};
    for (const [key, value] of params.entries()) {
      pfData[key] = value;
    }

    console.log("ITN received for payment:", pfData.m_payment_id);

    const passphrase = Deno.env.get("PAYFAST_PASSPHRASE") || null;

    // Step 1: Verify signature
    if (!verifySignature(pfData, passphrase)) {
      console.error("ITN signature verification failed");
      return new Response("Signature invalid", { status: 400 });
    }

    // Step 2: Lookup order
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const orderRef = pfData.m_payment_id;
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, total, payment_status")
      .eq("order_ref", orderRef)
      .single();

    if (orderError || !order) {
      console.error("ITN: Order not found:", orderRef);
      return new Response("Order not found", { status: 404 });
    }

    // Step 3: Verify amount
    if (!verifyAmount(pfData.amount_gross, Number(order.total))) {
      console.error("ITN: Amount mismatch", pfData.amount_gross, order.total);
      return new Response("Amount mismatch", { status: 400 });
    }

    // Step 4: Verify with Payfast server
    const pfParamString = Object.entries(pfData)
      .filter(([, v]) => v !== "")
      .map(([k, v]) => `${k}=${encodeURIComponent(v.trim()).replace(/%20/g, "+")}`)
      .join("&");

    const serverValid = await verifyServerConfirmation(pfParamString);
    if (!serverValid) {
      console.error("ITN: Server confirmation failed");
      return new Response("Server confirmation failed", { status: 400 });
    }

    // Step 5: Update order based on payment status
    const paymentStatus = pfData.payment_status;
    let newPaymentStatus = "pending";
    let newOrderStatus = "pending";

    if (paymentStatus === "COMPLETE") {
      newPaymentStatus = "confirmed";
      newOrderStatus = "processing";
    } else if (paymentStatus === "FAILED" || paymentStatus === "CANCELLED") {
      newPaymentStatus = "failed";
      newOrderStatus = "cancelled";
    }

    // Only update if not already confirmed (prevent double-processing)
    if (order.payment_status !== "confirmed") {
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          payment_status: newPaymentStatus,
          status: newOrderStatus,
          payment_method: "payfast",
        })
        .eq("id", order.id);

      if (updateError) {
        console.error("ITN: Failed to update order:", updateError);
        return new Response("Update failed", { status: 500 });
      }

      console.log(`ITN: Order ${orderRef} updated to ${newPaymentStatus}`);
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("ITN error:", err);
    return new Response("Internal error", { status: 500 });
  }
});
