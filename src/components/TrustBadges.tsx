import { Shield, Truck, Lock, Star } from "lucide-react";

interface Props {
  compact?: boolean;
}

export default function TrustBadges({ compact = false }: Props) {
  const badges = [
    { icon: Shield, label: "Quality Guaranteed", color: "text-primary" },
    { icon: Truck, label: "24-48hr Delivery", color: "text-primary" },
    { icon: Lock, label: "Secure Checkout", color: "text-primary" },
    { icon: Star, label: "500+ Happy Customers", color: "text-accent" },
  ];

  if (compact) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
        {badges.map((b) => (
          <span key={b.label} className="flex items-center gap-1">
            <b.icon className={`h-3.5 w-3.5 ${b.color}`} />
            {b.label}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-xl border-2 border-primary/10 bg-primary/5 p-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {badges.map((b) => (
          <div key={b.label} className="flex flex-col items-center gap-1.5 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <b.icon className={`h-5 w-5 ${b.color}`} />
            </div>
            <span className="text-xs font-medium">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
