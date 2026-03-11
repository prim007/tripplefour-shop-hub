import { useEffect, useState } from "react";
import { Eye, ShoppingBag } from "lucide-react";

interface Props {
  productId?: string;
}

export default function SocialProof({ productId }: Props) {
  const [viewers, setViewers] = useState(0);
  const [recentSales, setRecentSales] = useState(0);

  useEffect(() => {
    // Generate plausible numbers seeded by product ID for consistency
    const seed = productId ? productId.split("").reduce((a, c) => a + c.charCodeAt(0), 0) : 42;
    const hour = new Date().getHours();
    // More viewers during peak hours (10am-9pm)
    const peakMultiplier = hour >= 10 && hour <= 21 ? 1.5 : 0.8;
    setViewers(Math.floor(((seed % 7) + 3) * peakMultiplier));
    setRecentSales(((seed % 12) + 5));
  }, [productId]);

  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive">
        <Eye className="h-3.5 w-3.5 animate-pulse" />
        <span>{viewers} people viewing now</span>
      </div>
      <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
        <ShoppingBag className="h-3.5 w-3.5" />
        <span>{recentSales} sold in last 24hrs</span>
      </div>
    </div>
  );
}
