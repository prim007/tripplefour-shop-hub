import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Source of truth for Lëf Labs wholesale prices (ZAR).
// Frontend src/data/leflabsProducts.ts must mirror these.
const PRODUCT_PRICES: Record<string, { name: string; price: number }> = {
  "lef-ind-animal-runtz": { name: "Animal Runtz", price: 120 },
  "lef-ind-lemon-silver-haze": { name: "Lemon Silver Haze", price: 120 },
  "lef-ind-guava-bomba": { name: "Guava Bomba", price: 120 },
  "lef-ind-purple-ghost-candy": { name: "Purple Ghost Candy", price: 120 },
  "lef-tun-jack-herer": { name: "Jack Herer (Tunnel AAA)", price: 70 },
  "lef-tun-planet-grapes": { name: "Planet of the Grapes (Tunnel AAA)", price: 70 },
  "lef-tun-gorilla-skittles": { name: "Gorilla Skittles (Tunnel AAA)", price: 70 },
  "lef-pr-standard-1g": { name: "Standard Pre-Roll 1g", price: 35 },
  "lef-pr-premium-1g": { name: "Premium Pre-Roll 1g", price: 55 },
  "lef-pr-moon-stick": { name: "Moon Stick Pre-Roll (infused)", price: 85 },
  "lef-vp-liquid-gold-1ml": { name: "Liquid Gold Disposable 1ml", price: 390 },
  "lef-vp-pure-leaf-1ml": { name: "Pure Leaf 510 Cartridge 1ml", price: 320 },
  "lef-dist-thc-1g": { name: "THC Distillate 1g", price: 280 },
  "lef-dist-cbd-1g": { name: "CBD Distillate 1g", price: 180 },
  "lef-dist-live-resin-1g": { name: "Live Resin 1g", price: 320 },
};

// Flat wholesale delivery fee (ZAR). Set to 0 if customer arranges courier.
const DELIVERY_FEE = 0;

// Switch to "https://www.payfast.co.za/eng/process" when going live.
const PAYFAST_PROCESS_URL = "https://sandbox.payfast.co.za/eng/process";

function urlEncodePayfast(value: string): string {
  // PayFast expects + for spaces and uppercase percent-encoding.
  return encodeURIComponent(value).replace(/%20/g, "+");
}

async function md5(input: string): Promise<string> {
  // Tiny MD5 implementation (PayFast signature requires MD5).
  // Uses crypto-js style — but Deno's WebCrypto does not support MD5,
  // so we implement it inline.
  function rotateLeft(x: number, n: number) {
    return (x << n) | (x >>> (32 - n));
  }
  function addUnsigned(a: number, b: number) {
    const x4 = (a & 0x40000000) + (b & 0x40000000);
    const y4 = (a & 0x80000000) ^ (b & 0x80000000);
    const lsw = (a & 0x3fffffff) + (b & 0x3fffffff);
    if (x4 & 0x40000000) return (lsw ^ 0x80000000 ^ y4 ^ 0x40000000);
    if (x4) return (lsw ^ 0xc0000000 ^ y4);
    return (lsw ^ y4);
  }
  function F(x: number, y: number, z: number) { return (x & y) | ((~x) & z); }
  function G(x: number, y: number, z: number) { return (x & z) | (y & (~z)); }
  function H(x: number, y: number, z: number) { return x ^ y ^ z; }
  function I(x: number, y: number, z: number) { return y ^ (x | (~z)); }
  function FF(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function GG(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function HH(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function II(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function convertToWordArray(str: string) {
    let lWordCount: number;
    const lMessageLength = str.length;
    const lNumberOfWordsTempOne = lMessageLength + 8;
    const lNumberOfWordsTempTwo = (lNumberOfWordsTempOne - (lNumberOfWordsTempOne % 64)) / 64;
    const lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16;
    const lWordArray = new Array(lNumberOfWords - 1).fill(0);
    let lBytePosition = 0;
    let lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  }
  function wordToHex(lValue: number) {
    let WordToHexValue = "", WordToHexValueTemp = "", lByte: number, lCount: number;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      WordToHexValueTemp = "0" + lByte.toString(16);
      WordToHexValue = WordToHexValue + WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2);
    }
    return WordToHexValue;
  }
  function utf8Encode(str: string) {
    str = str.replace(/\r\n/g, "\n");
    let utftext = "";
    for (let n = 0; n < str.length; n++) {
      const c = str.charCodeAt(n);
      if (c < 128) utftext += String.fromCharCode(c);
      else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }
    return utftext;
  }

  const x = convertToWordArray(utf8Encode(input));
  let a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476;
  const S11 = 7, S12 = 12, S13 = 17, S14 = 22;
  const S21 = 5, S22 = 9, S23 = 14, S24 = 20;
  const S31 = 4, S32 = 11, S33 = 16, S34 = 23;
  const S41 = 6, S42 = 10, S43 = 15, S44 = 21;

  for (let k = 0; k < x.length; k += 16) {
    const AA = a, BB = b, CC = c, DD = d;
    a = FF(a, b, c, d, x[k + 0], S11, 0xd76aa478);
    d = FF(d, a, b, c, x[k + 1], S12, 0xe8c7b756);
    c = FF(c, d, a, b, x[k + 2], S13, 0x242070db);
    b = FF(b, c, d, a, x[k + 3], S14, 0xc1bdceee);
    a = FF(a, b, c, d, x[k + 4], S11, 0xf57c0faf);
    d = FF(d, a, b, c, x[k + 5], S12, 0x4787c62a);
    c = FF(c, d, a, b, x[k + 6], S13, 0xa8304613);
    b = FF(b, c, d, a, x[k + 7], S14, 0xfd469501);
    a = FF(a, b, c, d, x[k + 8], S11, 0x698098d8);
    d = FF(d, a, b, c, x[k + 9], S12, 0x8b44f7af);
    c = FF(c, d, a, b, x[k + 10], S13, 0xffff5bb1);
    b = FF(b, c, d, a, x[k + 11], S14, 0x895cd7be);
    a = FF(a, b, c, d, x[k + 12], S11, 0x6b901122);
    d = FF(d, a, b, c, x[k + 13], S12, 0xfd987193);
    c = FF(c, d, a, b, x[k + 14], S13, 0xa679438e);
    b = FF(b, c, d, a, x[k + 15], S14, 0x49b40821);
    a = GG(a, b, c, d, x[k + 1], S21, 0xf61e2562);
    d = GG(d, a, b, c, x[k + 6], S22, 0xc040b340);
    c = GG(c, d, a, b, x[k + 11], S23, 0x265e5a51);
    b = GG(b, c, d, a, x[k + 0], S24, 0xe9b6c7aa);
    a = GG(a, b, c, d, x[k + 5], S21, 0xd62f105d);
    d = GG(d, a, b, c, x[k + 10], S22, 0x02441453);
    c = GG(c, d, a, b, x[k + 15], S23, 0xd8a1e681);
    b = GG(b, c, d, a, x[k + 4], S24, 0xe7d3fbc8);
    a = GG(a, b, c, d, x[k + 9], S21, 0x21e1cde6);
    d = GG(d, a, b, c, x[k + 14], S22, 0xc33707d6);
    c = GG(c, d, a, b, x[k + 3], S23, 0xf4d50d87);
    b = GG(b, c, d, a, x[k + 8], S24, 0x455a14ed);
    a = GG(a, b, c, d, x[k + 13], S21, 0xa9e3e905);
    d = GG(d, a, b, c, x[k + 2], S22, 0xfcefa3f8);
    c = GG(c, d, a, b, x[k + 7], S23, 0x676f02d9);
    b = GG(b, c, d, a, x[k + 12], S24, 0x8d2a4c8a);
    a = HH(a, b, c, d, x[k + 5], S31, 0xfffa3942);
    d = HH(d, a, b, c, x[k + 8], S32, 0x8771f681);
    c = HH(c, d, a, b, x[k + 11], S33, 0x6d9d6122);
    b = HH(b, c, d, a, x[k + 14], S34, 0xfde5380c);
    a = HH(a, b, c, d, x[k + 1], S31, 0xa4beea44);
    d = HH(d, a, b, c, x[k + 4], S32, 0x4bdecfa9);
    c = HH(c, d, a, b, x[k + 7], S33, 0xf6bb4b60);
    b = HH(b, c, d, a, x[k + 10], S34, 0xbebfbc70);
    a = HH(a, b, c, d, x[k + 13], S31, 0x289b7ec6);
    d = HH(d, a, b, c, x[k + 0], S32, 0xeaa127fa);
    c = HH(c, d, a, b, x[k + 3], S33, 0xd4ef3085);
    b = HH(b, c, d, a, x[k + 6], S34, 0x04881d05);
    a = HH(a, b, c, d, x[k + 9], S31, 0xd9d4d039);
    d = HH(d, a, b, c, x[k + 12], S32, 0xe6db99e5);
    c = HH(c, d, a, b, x[k + 15], S33, 0x1fa27cf8);
    b = HH(b, c, d, a, x[k + 2], S34, 0xc4ac5665);
    a = II(a, b, c, d, x[k + 0], S41, 0xf4292244);
    d = II(d, a, b, c, x[k + 7], S42, 0x432aff97);
    c = II(c, d, a, b, x[k + 14], S43, 0xab9423a7);
    b = II(b, c, d, a, x[k + 5], S44, 0xfc93a039);
    a = II(a, b, c, d, x[k + 12], S41, 0x655b59c3);
    d = II(d, a, b, c, x[k + 3], S42, 0x8f0ccc92);
    c = II(c, d, a, b, x[k + 10], S43, 0xffeff47d);
    b = II(b, c, d, a, x[k + 1], S44, 0x85845dd1);
    a = II(a, b, c, d, x[k + 8], S41, 0x6fa87e4f);
    d = II(d, a, b, c, x[k + 15], S42, 0xfe2ce6e0);
    c = II(c, d, a, b, x[k + 6], S43, 0xa3014314);
    b = II(b, c, d, a, x[k + 13], S44, 0x4e0811a1);
    a = II(a, b, c, d, x[k + 4], S41, 0xf7537e82);
    d = II(d, a, b, c, x[k + 11], S42, 0xbd3af235);
    c = II(c, d, a, b, x[k + 2], S43, 0x2ad7d2bb);
    b = II(b, c, d, a, x[k + 9], S44, 0xeb86d391);
    a = addUnsigned(a, AA);
    b = addUnsigned(b, BB);
    c = addUnsigned(c, CC);
    d = addUnsigned(d, DD);
  }
  return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
}

function buildSignature(fields: Record<string, string>, passphrase: string | null): Promise<string> {
  // PayFast: sign in the order fields are submitted; exclude empty values; URL-encode values.
  const parts: string[] = [];
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null || value === "") continue;
    parts.push(`${key}=${urlEncodePayfast(String(value).trim())}`);
  }
  let signatureString = parts.join("&");
  if (passphrase && passphrase.trim()) {
    signatureString += `&passphrase=${urlEncodePayfast(passphrase.trim())}`;
  }
  return md5(signatureString);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const {
      business_name,
      contact_name,
      email,
      phone,
      delivery_address,
      items,
      notes,
      return_url,
      cancel_url,
    } = body;

    if (!business_name || !contact_name || !email || !phone || !delivery_address || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (business_name.length > 120 || contact_name.length > 100 || email.length > 255 || phone.length > 25 || delivery_address.length > 500) {
      return new Response(JSON.stringify({ error: "Input too long" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const phoneClean = phone.replace(/[\s\-()]/g, "");
    if (!/^\+?\d{9,15}$/.test(phoneClean)) {
      return new Response(JSON.stringify({ error: "Invalid phone number" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate items + recompute subtotal server-side.
    let subtotal = 0;
    const validatedItems: { id: string; name: string; price: number; quantity: number }[] = [];
    for (const item of items) {
      const product = PRODUCT_PRICES[String(item?.id)];
      if (!product) {
        return new Response(JSON.stringify({ error: `Unknown product: ${item?.id}` }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const quantity = Math.max(1, Math.min(500, Math.floor(Number(item.quantity) || 1)));
      subtotal += product.price * quantity;
      validatedItems.push({ id: String(item.id), name: product.name, price: product.price, quantity });
    }

    const total = subtotal + DELIVERY_FEE;
    const orderRef = `LEF-${crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase()}`;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Persist order. We reuse the existing `orders` table — the LEF- prefix
    // on order_ref is what distinguishes Lëf Labs wholesale orders.
    // delivery_zone_id is nullable; we leave it null. The B2B notes (business
    // name + notes) are appended to delivery_address so the existing admin
    // dashboard surfaces them without schema changes.
    const composedAddress = [
      `[Business] ${business_name.trim()}`,
      delivery_address.trim(),
      notes ? `[Notes] ${String(notes).trim().slice(0, 300)}` : null,
    ].filter(Boolean).join("\n");

    const { data: order, error: insertError } = await supabase
      .from("orders")
      .insert({
        order_ref: orderRef,
        customer_name: contact_name.trim(),
        customer_email: email.trim(),
        customer_phone: phone.trim(),
        delivery_address: composedAddress,
        delivery_zone_id: null,
        delivery_fee: DELIVERY_FEE,
        subtotal,
        total,
        items: validatedItems,
        payment_method: "payfast",
        payment_status: "pending",
        status: "pending",
      })
      .select("id, order_ref, total")
      .single();

    if (insertError || !order) {
      console.error("Lëf Labs order insert failed:", insertError);
      return new Response(JSON.stringify({ error: "Failed to create order" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const merchantId = Deno.env.get("PAYFAST_MERCHANT_ID");
    const merchantKey = Deno.env.get("PAYFAST_MERCHANT_KEY");
    const passphrase = Deno.env.get("PAYFAST_PASSPHRASE") || null;

    if (!merchantId || !merchantKey) {
      console.error("PayFast credentials missing");
      return new Response(JSON.stringify({ error: "Payment gateway not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const origin = req.headers.get("origin") || "https://tripplefourshophub.online";
    const itnUrl = `${supabaseUrl}/functions/v1/payfast-leflabs-itn`;

    // Field order matters for PayFast signature.
    const fields: Record<string, string> = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: return_url || `${origin}/partners/lef-labs/order-complete?ref=${orderRef}&status=success`,
      cancel_url: cancel_url || `${origin}/partners/lef-labs/order-complete?ref=${orderRef}&status=cancel`,
      notify_url: itnUrl,
      name_first: contact_name.trim().split(" ")[0].slice(0, 50),
      name_last: contact_name.trim().split(" ").slice(1).join(" ").slice(0, 50) || "-",
      email_address: email.trim(),
      m_payment_id: orderRef,
      amount: total.toFixed(2),
      item_name: `Lëf Labs Wholesale ${orderRef}`.slice(0, 100),
      item_description: `${validatedItems.length} line item(s)`.slice(0, 255),
    };

    const signature = await buildSignature(fields, passphrase);
    const fieldsWithSig = { ...fields, signature };

    return new Response(JSON.stringify({
      order_ref: orderRef,
      total,
      payfast_action: PAYFAST_PROCESS_URL,
      payfast_fields: fieldsWithSig,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error("create-leflabs-order error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});