import { MapPin } from "lucide-react";

/**
 * Sitewide thin banner signaling SA-only delivery.
 * Helps clarify scope for international visitors and reinforces local intent for SEO/UX.
 */
export default function GeoBanner() {
  return (
    <div className="w-full bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-1.5 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold">
        <MapPin className="h-3 w-3" aria-hidden="true" />
        <span>South Africa only · Nationwide delivery · ZAR (R)</span>
      </div>
    </div>
  );
}