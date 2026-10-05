import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

type Status = "loading" | "valid" | "already" | "invalid" | "success" | "error";

export default function Unsubscribe() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState<Status>("loading");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    fetch(`${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${token}`, {
      headers: { apikey: anonKey },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.valid === false && data.reason === "already_unsubscribed") {
          setStatus("already");
        } else if (data.valid) {
          setStatus("valid");
        } else {
          setStatus("invalid");
        }
      })
      .catch(() => setStatus("invalid"));
  }, [token]);

  const handleUnsubscribe = async () => {
    if (!token) return;
    setSubmitting(true);
    try {
      const { data } = await supabase.functions.invoke("handle-email-unsubscribe", {
        body: { token },
      });
      if (data?.success) {
        setStatus("success");
      } else if (data?.reason === "already_unsubscribed") {
        setStatus("already");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Helmet>
        <title>Email Preferences — Unsubscribe | Tripplefour</title>
        <meta name="description" content="Manage your Tripplefour email preferences and unsubscribe from emails." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="mx-auto max-w-md text-center space-y-6">
          {status === "loading" && (
            <>
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Verifying your request…</p>
            </>
          )}

          {status === "valid" && (
            <>
              <h1 className="font-display text-2xl font-bold">Unsubscribe</h1>
              <p className="text-muted-foreground">
                Are you sure you want to unsubscribe from Tripplefour emails?
              </p>
              <Button onClick={handleUnsubscribe} disabled={submitting} size="lg" className="w-full">
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Confirm Unsubscribe
              </Button>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="mx-auto h-14 w-14 text-primary" />
              <h1 className="font-display text-2xl font-bold">Unsubscribed</h1>
              <p className="text-muted-foreground">
                You've been successfully unsubscribed. You won't receive further emails from us.
              </p>
            </>
          )}

          {status === "already" && (
            <>
              <CheckCircle className="mx-auto h-14 w-14 text-muted-foreground" />
              <h1 className="font-display text-2xl font-bold">Already Unsubscribed</h1>
              <p className="text-muted-foreground">
                You've already unsubscribed from our emails.
              </p>
            </>
          )}

          {status === "invalid" && (
            <>
              <XCircle className="mx-auto h-14 w-14 text-destructive" />
              <h1 className="font-display text-2xl font-bold">Invalid Link</h1>
              <p className="text-muted-foreground">
                This unsubscribe link is invalid or has expired.
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="mx-auto h-14 w-14 text-destructive" />
              <h1 className="font-display text-2xl font-bold">Something Went Wrong</h1>
              <p className="text-muted-foreground">
                We couldn't process your request. Please try again later.
              </p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
