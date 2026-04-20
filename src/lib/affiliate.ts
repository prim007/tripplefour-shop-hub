// Affiliate referral capture: ?ref=CODE in URL gets stored for 30 days
const STORAGE_KEY = "tf-affiliate-ref";
const TTL_MS = 30 * 24 * 60 * 60 * 1000;

interface StoredRef {
  code: string;
  capturedAt: number;
}

export function captureRefFromUrl(): void {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");
  if (!ref) return;
  const clean = ref.trim().toUpperCase().slice(0, 32);
  if (!/^[A-Z0-9_-]{2,32}$/.test(clean)) return;
  const payload: StoredRef = { code: clean, capturedAt: Date.now() };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch { /* noop */ }
}

export function getStoredAffiliateCode(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredRef;
    if (!parsed?.code) return null;
    if (Date.now() - parsed.capturedAt > TTL_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed.code;
  } catch {
    return null;
  }
}

export function clearAffiliateCode(): void {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
}
