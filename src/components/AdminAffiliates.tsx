import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Copy, Plus, Power, DollarSign, Users } from "lucide-react";

interface AffiliateStats {
  sales: number;
  pending: number;
  confirmed: number;
  paid: number;
}

interface Affiliate {
  id: string;
  code: string;
  name: string;
  email: string | null;
  phone: string | null;
  social_handle: string | null;
  commission_percent: number;
  active: boolean;
  created_at: string;
  stats: AffiliateStats;
}

const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-orders`;

export default function AdminAffiliates({ adminKey }: { adminKey: string }) {
  const [list, setList] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ code: "", name: "", email: "", phone: "", social_handle: "", commission_percent: 15 });

  const headers = { "x-admin-key": adminKey, "Content-Type": "application/json" };

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}?action=list-affiliates`, { headers });
      if (!res.ok) throw new Error();
      setList(await res.json());
    } catch {
      toast({ title: "Error", description: "Failed to load affiliates.", variant: "destructive" });
    }
    setLoading(false);
  };

  useEffect(() => { fetchList(); /* eslint-disable-next-line */ }, []);

  const create = async () => {
    if (!form.code || !form.name) {
      toast({ title: "Code and name required", variant: "destructive" });
      return;
    }
    setCreating(true);
    try {
      const res = await fetch(`${baseUrl}?action=create-affiliate`, { method: "POST", headers, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      toast({ title: "✅ Affiliate created", description: `Code ${form.code.toUpperCase()} is live.` });
      setForm({ code: "", name: "", email: "", phone: "", social_handle: "", commission_percent: 15 });
      fetchList();
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to create.", variant: "destructive" });
    }
    setCreating(false);
  };

  const toggle = async (id: string, active: boolean) => {
    await fetch(`${baseUrl}?action=toggle-affiliate`, { method: "POST", headers, body: JSON.stringify({ id, active }) });
    fetchList();
  };

  const markPaid = async (affiliate_id: string, name: string) => {
    if (!window.confirm(`Mark all confirmed commissions for ${name} as PAID?`)) return;
    const res = await fetch(`${baseUrl}?action=mark-payouts-paid`, { method: "POST", headers, body: JSON.stringify({ affiliate_id }) });
    const data = await res.json();
    toast({ title: "✅ Payouts marked", description: `${data.count} referral(s) marked as paid.` });
    fetchList();
  };

  const copyLink = (code: string) => {
    const url = `${window.location.origin}/?ref=${code}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Link copied", description: url });
  };

  return (
    <div className="space-y-6">
      {/* Create form */}
      <div className="rounded-xl border bg-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Plus className="h-4 w-4 text-primary" />
          <h2 className="font-display font-bold">New Affiliate Code</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Code *</Label>
            <Input placeholder="JANE10" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
          </div>
          <div className="space-y-1.5">
            <Label>Name *</Label>
            <Input placeholder="Jane Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Phone</Label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Social Handle</Label>
            <Input placeholder="@jane" value={form.social_handle} onChange={(e) => setForm({ ...form, social_handle: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Commission %</Label>
            <Input type="number" min={0} max={50} value={form.commission_percent} onChange={(e) => setForm({ ...form, commission_percent: Number(e.target.value) })} />
          </div>
        </div>
        <Button onClick={create} disabled={creating} className="w-full sm:w-auto">
          {creating ? "Creating..." : "Create Affiliate"}
        </Button>
      </div>

      {/* List */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <h2 className="font-display font-bold">Affiliates ({list.length})</h2>
        </div>
        {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
        {list.map((a) => (
          <div key={a.id} className={`rounded-xl border p-4 space-y-3 ${a.active ? "bg-card" : "bg-muted/30 opacity-70"}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <code className="rounded bg-primary/10 px-2 py-0.5 font-mono font-bold text-primary">{a.code}</code>
                  <span className="font-medium">{a.name}</span>
                  {!a.active && <span className="rounded-full bg-muted px-2 py-0.5 text-xs">Inactive</span>}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {a.social_handle && `${a.social_handle} • `}{a.email}{a.phone && ` • ${a.phone}`} • {a.commission_percent}% commission
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => copyLink(a.code)}>
                  <Copy className="h-3.5 w-3.5 mr-1" /> Link
                </Button>
                <Button variant="outline" size="sm" onClick={() => toggle(a.id, !a.active)}>
                  <Power className="h-3.5 w-3.5 mr-1" /> {a.active ? "Disable" : "Enable"}
                </Button>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 text-sm">
              <div><span className="text-muted-foreground">Sales:</span> <strong>{a.stats.sales}</strong></div>
              <div><span className="text-muted-foreground">Pending:</span> <strong>R{a.stats.pending.toFixed(2)}</strong></div>
              <div><span className="text-muted-foreground">Owed:</span> <strong className="text-primary">R{a.stats.confirmed.toFixed(2)}</strong></div>
              <div><span className="text-muted-foreground">Paid out:</span> <strong>R{a.stats.paid.toFixed(2)}</strong></div>
            </div>

            {a.stats.confirmed > 0 && (
              <Button size="sm" variant="secondary" onClick={() => markPaid(a.id, a.name)}>
                <DollarSign className="h-3.5 w-3.5 mr-1" /> Mark R{a.stats.confirmed.toFixed(2)} as paid
              </Button>
            )}
          </div>
        ))}
        {!loading && list.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">No affiliates yet. Create your first code above.</p>
        )}
      </div>
    </div>
  );
}
