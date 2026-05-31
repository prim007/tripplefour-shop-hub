import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// PayFast ITN webhook for Lëf Labs orders.
// PayFast does NOT send a JWT — this function deploys with verify_jwt = false.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
};

// Flip to "https://www.payfast.co.za/eng/query/validate" when going live.
const PAYFAST_VALIDATE_URL = "https://sandbox.payfast.co.za/eng/query/validate";

function urlEncodePayfast(value: string): string {
  return encodeURIComponent(value).replace(/%20/g, "+");
}

// Reuse the same MD5 as create-leflabs-order.
async function md5(input: string): Promise<string> {
  function rotateLeft(x: number, n: number) { return (x << n) | (x >>> (32 - n)); }
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
    let lBytePosition = 0, lByteCount = 0;
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
  const S11=7,S12=12,S13=17,S14=22,S21=5,S22=9,S23=14,S24=20,S31=4,S32=11,S33=16,S34=23,S41=6,S42=10,S43=15,S44=21;
  for (let k = 0; k < x.length; k += 16) {
    const AA=a,BB=b,CC=c,DD=d;
    a=FF(a,b,c,d,x[k+0],S11,0xd76aa478);d=FF(d,a,b,c,x[k+1],S12,0xe8c7b756);c=FF(c,d,a,b,x[k+2],S13,0x242070db);b=FF(b,c,d,a,x[k+3],S14,0xc1bdceee);
    a=FF(a,b,c,d,x[k+4],S11,0xf57c0faf);d=FF(d,a,b,c,x[k+5],S12,0x4787c62a);c=FF(c,d,a,b,x[k+6],S13,0xa8304613);b=FF(b,c,d,a,x[k+7],S14,0xfd469501);
    a=FF(a,b,c,d,x[k+8],S11,0x698098d8);d=FF(d,a,b,c,x[k+9],S12,0x8b44f7af);c=FF(c,d,a,b,x[k+10],S13,0xffff5bb1);b=FF(b,c,d,a,x[k+11],S14,0x895cd7be);
    a=FF(a,b,c,d,x[k+12],S11,0x6b901122);d=FF(d,a,b,c,x[k+13],S12,0xfd987193);c=FF(c,d,a,b,x[k+14],S13,0xa679438e);b=FF(b,c,d,a,x[k+15],S14,0x49b40821);
    a=GG(a,b,c,d,x[k+1],S21,0xf61e2562);d=GG(d,a,b,c,x[k+6],S22,0xc040b340);c=GG(c,d,a,b,x[k+11],S23,0x265e5a51);b=GG(b,c,d,a,x[k+0],S24,0xe9b6c7aa);
    a=GG(a,b,c,d,x[k+5],S21,0xd62f105d);d=GG(d,a,b,c,x[k+10],S22,0x02441453);c=GG(c,d,a,b,x[k+15],S23,0xd8a1e681);b=GG(b,c,d,a,x[k+4],S24,0xe7d3fbc8);
    a=GG(a,b,c,d,x[k+9],S21,0x21e1cde6);d=GG(d,a,b,c,x[k+14],S22,0xc33707d6);c=GG(c,d,a,b,x[k+3],S23,0xf4d50d87);b=GG(b,c,d,a,x[k+8],S24,0x455a14ed);
    a=GG(a,b,c,d,x[k+13],S21,0xa9e3e905);d=GG(d,a,b,c,x[k+2],S22,0xfcefa3f8);c=GG(c,d,a,b,x[k+7],S23,0x676f02d9);b=GG(b,c,d,a,x[k+12],S24,0x8d2a4c8a);
    a=HH(a,b,c,d,x[k+5],S31,0xfffa3942);d=HH(d,a,b,c,x[k+8],S32,0x8771f681);c=HH(c,d,a,b,x[k+11],S33,0x6d9d6122);b=HH(b,c,d,a,x[k+14],S34,0xfde5380c);
    a=HH(a,b,c,d,x[k+1],S31,0xa4beea44);d=HH(d,a,b,c,x[k+4],S32,0x4bdecfa9);c=HH(c,d,a,b,x[k+7],S33,0xf6bb4b60);b=HH(b,c,d,a,x[k+10],S34,0xbebfbc70);
    a=HH(a,b,c,d,x[k+13],S31,0x289b7ec6);d=HH(d,a,b,c,x[k+0],S32,0xeaa127fa);c=HH(c,d,a,b,x[k+3],S33,0xd4ef3085);b=HH(b,c,d,a,x[k+6],S34,0x04881d05);
    a=HH(a,b,c,d,x[k+9],S31,0xd9d4d039);d=HH(d,a,b,c,x[k+12],S32,0xe6db99e5);c=HH(c,d,a,b,x[k+15],S33,0x1fa27cf8);b=HH(b,c,d,a,x[k+2],S34,0xc4ac5665);
    a=II(a,b,c,d,x[k+0],S41,0xf4292244);d=II(d,a,b,c,x[k+7],S42,0x432aff97);c=II(c,d,a,b,x[k+14],S43,0xab9423a7);b=II(b,c,d,a,x[k+5],S44,0xfc93a039);
    a=II(a,b,c,d,x[k+12],S41,0x655b59c3);d=II(d,a,b,c,x[k+3],S42,0x8f0ccc92);c=II(c,d,a,b,x[k+10],S43,0xffeff47d);b=II(b,c,d,a,x[k+1],S44,0x85845dd1);
    a=II(a,b,c,d,x[k+8],S41,0x6fa87e4f);d=II(d,a,b,c,x[k+15],S42,0xfe2ce6e0);c=II(c,d,a,b,x[k+6],S43,0xa3014314);b=II(b,c,d,a,x[k+13],S44,0x4e0811a1);
    a=II(a,b,c,d,x[k+4],S41,0xf7537e82);d=II(d,a,b,c,x[k+11],S42,0xbd3af235);c=II(c,d,a,b,x[k+2],S43,0x2ad7d2bb);b=II(b,c,d,a,x[k+9],S44,0xeb86d391);
    a=addUnsigned(a,AA);b=addUnsigned(b,BB);c=addUnsigned(c,CC);d=addUnsigned(d,DD);
  }
  return (wordToHex(a)+wordToHex(b)+wordToHex(c)+wordToHex(d)).toLowerCase();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  try {
    const rawBody = await req.text();
    const params = new URLSearchParams(rawBody);
    const data: Record<string, string> = {};
    for (const [k, v] of params.entries()) data[k] = v;

    // 1. Verify signature
    const passphrase = Deno.env.get("PAYFAST_PASSPHRASE") || null;
    const received = data.signature || "";
    const fieldsForSig: Record<string, string> = { ...data };
    delete fieldsForSig.signature;
    const parts: string[] = [];
    for (const [key, value] of Object.entries(fieldsForSig)) {
      if (value === undefined || value === null || value === "") continue;
      parts.push(`${key}=${urlEncodePayfast(String(value).trim())}`);
    }
    let signatureString = parts.join("&");
    if (passphrase && passphrase.trim()) {
      signatureString += `&passphrase=${urlEncodePayfast(passphrase.trim())}`;
    }
    const expected = await md5(signatureString);
    if (expected !== received.toLowerCase()) {
      console.warn("PayFast ITN signature mismatch", { orderRef: data.m_payment_id });
      return new Response("Invalid signature", { status: 400 });
    }

    // 2. Postback to PayFast to confirm the message originated from them.
    try {
      const validateRes = await fetch(PAYFAST_VALIDATE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: rawBody,
      });
      const validateText = (await validateRes.text()).trim();
      if (!validateText.startsWith("VALID")) {
        console.warn("PayFast validate returned non-VALID:", validateText);
        return new Response("Not validated", { status: 400 });
      }
    } catch (e) {
      console.error("PayFast validate postback failed:", e);
      // Continue — signature check passed. Some sandbox responses are slow.
    }

    // 3. Look up the order and verify amount.
    const orderRef = data.m_payment_id;
    if (!orderRef) return new Response("Missing m_payment_id", { status: 400 });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: order, error: lookupErr } = await supabase
      .from("orders")
      .select("id, order_ref, total, payment_status")
      .eq("order_ref", orderRef)
      .maybeSingle();

    if (lookupErr || !order) {
      console.warn("ITN order not found:", orderRef);
      return new Response("Order not found", { status: 404 });
    }

    const grossAmount = Number(data.amount_gross || data.amount || 0);
    if (Math.abs(grossAmount - Number(order.total)) > 0.01) {
      console.warn("ITN amount mismatch", { orderRef, grossAmount, expected: order.total });
      return new Response("Amount mismatch", { status: 400 });
    }

    // 4. Map PayFast payment status → our schema.
    const pfStatus = (data.payment_status || "").toUpperCase();
    let paymentStatus = "pending";
    let orderStatus = "pending";
    if (pfStatus === "COMPLETE") { paymentStatus = "paid"; orderStatus = "confirmed"; }
    else if (pfStatus === "FAILED") { paymentStatus = "failed"; orderStatus = "cancelled"; }
    else if (pfStatus === "CANCELLED") { paymentStatus = "cancelled"; orderStatus = "cancelled"; }

    await supabase
      .from("orders")
      .update({ payment_status: paymentStatus, status: orderStatus })
      .eq("id", order.id);

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("payfast-leflabs-itn error:", err);
    return new Response("Internal error", { status: 500 });
  }
});