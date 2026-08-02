import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

type OAuthNamespace = {
  getAuthorizationDetails: (id: string) => Promise<{ data: any; error: any }>;
  approveAuthorization: (id: string) => Promise<{ data: any; error: any }>;
  denyAuthorization: (id: string) => Promise<{ data: any; error: any }>;
};

const oauth = () => (supabase.auth as unknown as { oauth: OAuthNamespace }).oauth;

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Missing authorization_id in the request.");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/auth?redirect=" + encodeURIComponent(next);
        return;
      }
      try {
        const { data, error } = await oauth().getAuthorizationDetails(authorizationId);
        if (!active) return;
        if (error) {
          setError(error.message);
          return;
        }
        const immediate = data?.redirect_url ?? data?.redirect_to;
        if (immediate && !data?.client) {
          window.location.href = immediate;
          return;
        }
        setDetails(data);
      } catch (e: any) {
        if (active) setError(e?.message ?? "Could not load this authorization request.");
      }
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    try {
      const { data, error } = approve
        ? await oauth().approveAuthorization(authorizationId)
        : await oauth().denyAuthorization(authorizationId);
      if (error) {
        setBusy(false);
        setError(error.message);
        return;
      }
      const target = data?.redirect_url ?? data?.redirect_to;
      if (!target) {
        setBusy(false);
        setError("No redirect returned by the authorization server.");
        return;
      }
      window.location.href = target;
    } catch (e: any) {
      setBusy(false);
      setError(e?.message ?? "Something went wrong.");
    }
  }

  const clientName = details?.client?.name ?? details?.client?.client_name ?? "this app";
  const redirectUri = details?.client?.redirect_uri ?? details?.redirect_uri;
  const scopes: string[] = (details?.scope ?? details?.scopes ?? "")
    .toString()
    .split(" ")
    .filter(Boolean);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card p-8 shadow-3d">
        <div className="mb-6 flex justify-center">
          <span className="font-display text-2xl font-bold tracking-widest text-primary">444</span>
        </div>

        {error ? (
          <>
            <h1 className="mb-2 text-center font-display text-xl font-bold uppercase tracking-wide">
              Authorization failed
            </h1>
            <p className="text-center text-sm text-muted-foreground">{error}</p>
          </>
        ) : !details ? (
          <p className="text-center text-sm text-muted-foreground">Loading authorization request…</p>
        ) : (
          <>
            <h1 className="mb-3 text-center font-display text-xl font-bold uppercase tracking-wide">
              Connect {clientName} to Tripplefour
            </h1>
            <p className="mb-6 text-center text-sm text-muted-foreground">
              This lets {clientName} use Tripplefour as you.
            </p>

            <div className="mb-6 space-y-2 rounded-lg border border-border/60 bg-background/50 p-4 text-sm">
              {redirectUri && (
                <p className="break-all text-muted-foreground">
                  <span className="font-semibold text-foreground">Redirects to:</span> {redirectUri}
                </p>
              )}
              {scopes.length > 0 && (
                <ul className="list-inside list-disc text-muted-foreground">
                  {scopes.map((s) => (
                    <li key={s}>
                      {s === "email"
                        ? "Share your email address"
                        : s === "profile" || s === "openid"
                        ? "Share your basic profile"
                        : `Additional permission requested: ${s}`}
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-xs text-muted-foreground">
                This does not bypass Tripplefour's permissions or backend policies.
              </p>
            </div>

            <div className="flex gap-3">
              <Button className="flex-1" disabled={busy} onClick={() => decide(true)}>
                Approve
              </Button>
              <Button variant="outline" className="flex-1" disabled={busy} onClick={() => decide(false)}>
                Cancel connection
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}