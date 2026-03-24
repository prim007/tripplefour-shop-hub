export const AGE_VERIFIED_KEY = "tripplefour_age_verified";
export const AGE_TOKEN_KEY = "tripplefour_age_token";

export function hasUnexpiredAgeToken(token: string | null): boolean {
  if (!token || typeof token !== "string") return false;

  const [payloadPart] = token.split(".");
  if (!payloadPart) return false;

  try {
    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const payload = JSON.parse(atob(padded)) as { exp?: number; type?: string };

    if (payload.type !== "age") return false;
    if (typeof payload.exp !== "number") return false;

    return payload.exp > Date.now();
  } catch {
    return false;
  }
}
