import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { generateOrderRef } from "../_shared/order-ref.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Source of truth for Lëf Labs wholesale prices (ZAR) — NOVEMBER 2026 catalogue.
// Frontend src/data/leflabsProducts.ts must mirror these.
const PRODUCT_PRICES: Record<string, { name: string; price: number }> = {
  "lef-hy-steel-clamp": { name: "Steel Clamp", price: 45 },
  "lef-hy-sugar-syndicate": { name: "Sugar Syndicate", price: 45 },
  "lef-hy-crimson-limit": { name: "Crimson Limit", price: 45 },
  "lef-hy-cobalt-cellar": { name: "Cobalt Cellar", price: 45 },
  "lef-hy-walnut-splitter": { name: "Walnut Splitter", price: 45 },
  "lef-hy-glacier-rime": { name: "Glacier Rime", price: 45 },
  "lef-hy-amethyst-calm": { name: "Amethyst Calm", price: 45 },
  "lef-hy-cloud-spritz": { name: "Cloud Spritz", price: 45 },
  "lef-hy-nebula-rare": { name: "Nebula Rare", price: 45 },
  "lef-hy-chewy-taffy": { name: "Chewy Taffy", price: 45 },
  "lef-hy-natal-thunder": { name: "Natal Thunder", price: 45 },
  "lef-hy-satsuma-zest": { name: "Satsuma Zest", price: 45 },
  "lef-hy-spectrum-drops": { name: "Spectrum Drops", price: 45 },
  "lef-hy-tropic-grenade": { name: "Tropic Grenade", price: 45 },
  "lef-hy-obsidian-cherry": { name: "Obsidian Cherry", price: 45 },
  "lef-ind-fission-jam": { name: "Fission Jam", price: 35 },
  "lef-ind-moonstalker": { name: "Moonstalker", price: 35 },
  "lef-ind-affogato-14": { name: "Affogato 14", price: 35 },
  "lef-ind-orchard-split": { name: "Orchard Split", price: 35 },
  "lef-ind-bridal-layer": { name: "Bridal Layer", price: 35 },
  "lef-ind-plantain-bond": { name: "Plantain Bond", price: 35 },
  "lef-ind-cocoa-cantaloupe": { name: "Cocoa Cantaloupe", price: 35 },
  "lef-ind-monarch-chain": { name: "Monarch Chain", price: 35 },
  "lef-ind-lapis-lagoon": { name: "Lapis Lagoon", price: 35 },
  "lef-ind-pastel-pebbles": { name: "Pastel Pebbles", price: 35 },
  "lef-gd-fiesta-parade": { name: "Fiesta Parade", price: 27 },
  "lef-gd-twilight-sprint": { name: "Twilight Sprint", price: 27 },
  "lef-gd-bronze-delta": { name: "Bronze Delta", price: 27 },
  "lef-gd-spark-apricot": { name: "Spark Apricot", price: 27 },
  "lef-gd-voltage-crimson": { name: "Voltage Crimson", price: 27 },
  "lef-gd-aurora-path": { name: "Aurora Path", price: 27 },
  "lef-gd-the-pledge": { name: "The Pledge", price: 27 },
  "lef-ex-sable-cherry-tart": { name: "Sable Cherry Tart", price: 24 },
  "lef-ex-interval-breath": { name: "Interval Breath", price: 24 },
  "lef-ex-fruitburst-pop": { name: "Fruitburst Pop", price: 24 },
  "lef-ex-mach-seven": { name: "Mach Seven", price: 24 },
  "lef-ex-allium-blend": { name: "Allium Blend", price: 24 },
  "lef-ex-titan-glue": { name: "Titan Glue", price: 24 },
  "lef-ex-pawpaw-punch": { name: "Pawpaw Punch", price: 24 },
  "lef-ex-vanilla-frost-cream": { name: "Vanilla Frost Cream (Organic)", price: 24 },
  "lef-ex-indigo-pegasus": { name: "Indigo Pegasus", price: 24 },
  "lef-ex-muddy-banoffee": { name: "Muddy Banoffee", price: 24 },
  "lef-ex-bongo-kush": { name: "Bongo Kush", price: 24 },
  "lef-ex-bramble-hound": { name: "Bramble Hound", price: 24 },
  "lef-ex-steed": { name: "Steed", price: 24 },
  "lef-ex-sour-fuel-hound": { name: "Sour Fuel Hound", price: 24 },
  "lef-ex-orchid-bear": { name: "Orchid Bear (Organic)", price: 24 },
  "lef-ex-starmetal": { name: "Starmetal", price: 24 },
  "lef-ex-cheddar-cloud": { name: "Cheddar Cloud", price: 24 },
  "lef-ex-final-round": { name: "Final Round", price: 24 },
  "lef-ex-cobblestone-swirl": { name: "Cobblestone Swirl", price: 24 },
  "lef-ex-veneer": { name: "Veneer", price: 24 },
  "lef-ex-pastel-sorbet-11": { name: "Pastel Sorbet 11", price: 24 },
  "lef-ex-slush-chief": { name: "Slush Chief (Organic)", price: 24 },
  "lef-sg-dawn-mix": { name: "Dawn Mix", price: 15 },
  "lef-sg-even-split": { name: "Even Split", price: 15 },
  "lef-sg-fiesta-parade": { name: "Fiesta Parade", price: 15 },
  "lef-sg-twilight-sprint": { name: "Twilight Sprint", price: 15 },
  "lef-sg-the-pledge": { name: "The Pledge", price: 15 },
  "lef-sg-ruby-beacon": { name: "Ruby Beacon", price: 15 },
  "lef-pop-assorted": { name: "Pops — Assorted Small/Medium", price: 25 },
  "lef-pop-mini": { name: "Mini Pops — Small Only (Greendoor / Indoor)", price: 15 },
  "lef-raw-untrimmed": { name: "Untrimmed Bud (Greendoor)", price: 10 },
  "lef-raw-crush-shake": { name: "Trim", price: 6 },
  "lef-pr-indoor-glass": { name: "Indoor Pre-Roll · Glass Tube", price: 40 },
  "lef-pr-indoor-plastic": { name: "Indoor Pre-Roll · Plastic Tube", price: 39 },
  "lef-pr-gh-glass": { name: "Greenhouse Pre-Roll · Glass Tube", price: 30 },
  "lef-pr-gh-plastic": { name: "Greenhouse Pre-Roll · Plastic Tube", price: 27 },
  "lef-pr-gh-standard": { name: "Greenhouse Pre-Roll · Standard", price: 25 },
  "lef-pr-moonstick-indoor": { name: "Indoor Moonstick", price: 65 },
  "lef-pr-moonstick-gh": { name: "Greenhouse Moonstick", price: 45 },
  "lef-vp-liquid-gold": { name: "Liquid Gold Cartridge", price: 399 },
  "lef-vp-pure-leaf": { name: "Pure Leaf Cartridge", price: 399 },
  "lef-vp-dirty-vapes": { name: "Dirty Vapes Cartridge", price: 399 },
  "lef-vp-funkt": { name: "Funk't Cartridge", price: 399 },
  "lef-vp-leflabs": { name: "LëF Labs Vapes Cartridge", price: 399 },
  "lef-vp-kush-tells": { name: "Kush & Tells Cartridge", price: 399 },
  "lef-ed-sour-15mg": { name: "Sour Edibles 15mg — Standard", price: 150 },
  "lef-ed-sour-30mg": { name: "Sour Edibles 30mg — Premium", price: 180 },
};

// Flat wholesale delivery fee (ZAR). Set to 0 if customer arranges courier.
const DELIVERY_FEE = 0;

// Defaults to sandbox; override with PAYFAST_PROCESS_URL secret in production
// (e.g. https://www.payfast.co.za/eng/process).
const PAYFAST_PROCESS_URL =
  Deno.env.get("PAYFAST_PROCESS_URL") ?? "https://sandbox.payfast.co.za/eng/process";

// Trusted base URL for PayFast return/cancel redirects. Never accept these
// from the client — that would allow open-redirect / phishing abuse.
const RETURN_BASE_URL =
  Deno.env.get("LEFLABS_RETURN_BASE_URL") ?? "https://tripplefourshophub.online";

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
    // Require an authenticated Supabase user — wholesale ordering is
    // partner-only, no anonymous POSTs allowed.
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.toLowerCase().startsWith("bearer ")) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const authClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await authClient.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Invalid or expired session" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Authorization: only approved wholesale partners can place B2B orders.
    // Membership is managed server-side in `public.wholesale_partners`
    // (insert via service_role / admin only — never self-serve).
    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { data: partnerRow, error: partnerErr } = await adminClient
      .from("wholesale_partners")
      .select("user_id")
      .eq("user_id", userData.user.id)
      .maybeSingle();
    if (partnerErr) {
      console.error("wholesale_partners lookup failed:", partnerErr);
      return new Response(JSON.stringify({ error: "Authorization check failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!partnerRow) {
      return new Response(JSON.stringify({
        error: "Wholesale ordering is restricted to approved Lëf Labs partners. Please contact us to apply for partner access.",
      }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const {
      business_name,
      contact_name,
      email,
      phone,
      delivery_address,
      items,
      notes,
    } = body;

    // Lëf Labs is EFT-only (Absa account). PayFast is not enabled for this partner.
    const paymentMethod = "eft";

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

    const supabase = adminClient;
    const orderRef = await generateOrderRef(supabase, "LEF");

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
        payment_method: paymentMethod,
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

    // Fire-and-forget admin alert email to tripple4442@gmail.com.
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
          source: "Lëf Labs Wholesale",
          paymentMethod,
          customerName: contact_name.trim(),
          customerEmail: email.trim(),
          customerPhone: phone.trim(),
          deliveryAddress: composedAddress,
          items: validatedItems,
          subtotal,
          deliveryFee: DELIVERY_FEE,
          total,
        },
      }),
    }).catch((err) => console.error("Admin order alert enqueue failed:", err));

    // EFT flow — no PayFast redirect; customer pays into the ABSA account
    // using `orderRef` as their unique deposit reference.
    if (paymentMethod === "eft") {
      return new Response(JSON.stringify({
        order_ref: orderRef,
        total,
        payment_method: "eft",
        bank_details: {
          account_name: "Lëf Labs",
          bank: "Absa",
          branch_code: "632005",
          account_number: "4078121856",
          account_type: "Cheque",
          reference: orderRef,
        },
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
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

    const itnUrl = `${supabaseUrl}/functions/v1/payfast-leflabs-itn`;

    // Field order matters for PayFast signature.
    const fields: Record<string, string> = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: `${RETURN_BASE_URL}/partners/lef-labs/order-complete?ref=${orderRef}&status=success`,
      cancel_url: `${RETURN_BASE_URL}/partners/lef-labs/order-complete?ref=${orderRef}&status=cancel`,
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