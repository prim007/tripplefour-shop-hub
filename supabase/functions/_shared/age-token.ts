// Shared verifier for the signed age-verification token issued by issue-age-token.
const encoder = new TextEncoder();

function base64UrlToText(value: string): string {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return atob(padded);
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function signValue(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return bytesToBase64Url(new Uint8Array(signature));
}

export async function verifyAgeToken(token: unknown, secret: string): Promise<boolean> {
  if (!token || typeof token !== "string") return false;
  const [payloadPart, signaturePart] = token.split(".");
  if (!payloadPart || !signaturePart) return false;

  try {
    const expectedSignature = await signValue(payloadPart, secret);
    if (expectedSignature !== signaturePart) return false;

    const payload = JSON.parse(base64UrlToText(payloadPart)) as { type?: string; exp?: number };
    if (payload.type !== "age") return false;
    if (typeof payload.exp !== "number" || payload.exp <= Date.now()) return false;
    return true;
  } catch {
    return false;
  }
}
