import { useEffect, useRef } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adHtml && containerRef.current) {
      // Inject ad network script/HTML
      containerRef.current.innerHTML = adHtml;

      // Execute any <script> tags within the injected HTML
      const scripts = containerRef.current.querySelectorAll("script");
      scripts.forEach((oldScript) => {
        const newScript = document.createElement("script");
        Array.from(oldScript.attributes).forEach((attr) =>
          newScript.setAttribute(attr.name, attr.value)
        );
        newScript.textContent = oldScript.textContent;
        oldScript.parentNode?.replaceChild(newScript, oldScript);
      });

      trackEvent("ad_impression", { ad_slot: slot });
    }
  }, [adHtml, slot]);

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
    <div
      ref={containerRef}
      className={`ad-banner flex justify-center ${className}`}
      data-ad-slot={slot}
    />
  );
}
