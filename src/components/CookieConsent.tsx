import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "tripplefour_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const decide = (value: "accepted" | "declined") => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-3 sm:px-4 sm:pb-4">
      <div className="mx-auto flex max-w-4xl flex-col gap-3 rounded-2xl border border-border/60 bg-background/95 p-4 shadow-xl backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground sm:text-sm">
          We use cookies to improve your experience and analyse site traffic. See our{" "}
          <Link to="/privacy-policy" className="underline underline-offset-2 hover:text-foreground">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex gap-2 sm:shrink-0">
          <Button variant="ghost" size="sm" onClick={() => decide("declined")}>
            Decline
          </Button>
          <Button size="sm" onClick={() => decide("accepted")}>
            Accept cookies
          </Button>
        </div>
      </div>
    </div>
  );
}