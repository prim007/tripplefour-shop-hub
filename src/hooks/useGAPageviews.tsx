import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/analytics";

/**
 * Sends a GA4 page_view on every React Router navigation.
 * Without this, SPAs only ever record the first page load.
 */
export default function useGAPageviews() {
  const location = useLocation();

  useEffect(() => {
    // Defer to next tick so document.title (set via Helmet) updates first
    const id = window.setTimeout(() => {
      trackPageView(location.pathname + location.search);
    }, 50);
    return () => window.clearTimeout(id);
  }, [location.pathname, location.search]);
}