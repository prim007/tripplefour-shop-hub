import { useEffect, useMemo, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

interface AdBannerProps {
  /** Unique slot identifier for tracking (e.g. "header", "sidebar", "in-content") */
  slot: string;
  /** Raw HTML/script from ad network — rendered inside an iframe-like container */
  adHtml?: string;
  /** Fallback: direct image banner with link */
  fallback?: {
    imageUrl: string;
    href: string;
    alt: string;
  };
  className?: string;
}

/**
 * Configurable ad placement component.
 * Supports raw ad-network HTML (Mantis, TrafficRoots, etc.) or a simple image fallback.
 */
export default function AdBanner({ slot, adHtml, fallback, className = "" }: AdBannerProps) {
  useEffect(() => {
    if (adHtml) {
      trackEvent("ad_impression", { ad_slot: slot });
    }
  }, [adHtml, slot]);

  // Wrap third-party ad markup in a minimal HTML doc rendered inside a sandboxed iframe.
  // The sandbox attribute (without `allow-same-origin` and without `allow-popups`) isolates
  // the ad from the host page: no access to cookies, localStorage, the parent DOM, no
  // top-level navigation and no popup windows. A restrictive CSP additionally limits what
  // the ad markup can load or connect to.
  const srcDoc = useMemo(() => {
    if (!adHtml) return "";
    const csp = [
      "default-src 'none'",
      "img-src https: data:",
      "style-src 'unsafe-inline'",
      "script-src https: 'unsafe-inline'",
      "connect-src https:",
      "frame-src https:",
      "form-action 'none'",
      "base-uri 'none'",
    ].join("; ");
    return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${csp}"><style>html,body{margin:0;padding:0;overflow:hidden;font-family:system-ui,sans-serif}</style></head><body>${adHtml}</body></html>`;
  }, [adHtml]);

  const handleFallbackClick = () => {
    trackEvent("ad_click", { ad_slot: slot, ad_type: "fallback_banner" });
  };

  // Nothing to render
  if (!adHtml && !fallback) return null;

  // Fallback image banner
  if (!adHtml && fallback) {
    return (
      <div className={`flex justify-center ${className}`}>
        <a
          href={fallback.href}
          target="_blank"
          rel="noopener noreferrer nofollow"
          onClick={handleFallbackClick}
          className="block overflow-hidden rounded-xl border border-border transition-shadow hover:shadow-md"
        >
          <img
            src={fallback.imageUrl}
            alt={fallback.alt}
            className="w-full object-cover"
            loading="lazy"
          />
        </a>
      </div>
    );
  }

  // Ad network HTML
  return (
    <div className={`ad-banner flex justify-center ${className}`} data-ad-slot={slot}>
      <iframe
        title={`ad-${slot}`}
        srcDoc={srcDoc}
        sandbox="allow-scripts"
        referrerPolicy="no-referrer"
        loading="lazy"
        className="w-full border-0"
        style={{ minHeight: 90 }}
      />
    </div>
  );
}
