import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

interface SocialShareProps {
  url: string;
  title: string;
  /** UTM campaign name, defaults to "organic_share" */
  campaign?: string;
  className?: string;
}

function buildUtmUrl(base: string, source: string, campaign: string) {
  const u = new URL(base, window.location.origin);
  u.searchParams.set("utm_source", source);
  u.searchParams.set("utm_medium", "social");
  u.searchParams.set("utm_campaign", campaign);
  return u.toString();
}

const platforms = [
  {
    name: "X",
    icon: "𝕏",
    share: (url: string, title: string) =>
      `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  },
  {
    name: "Reddit",
    icon: "🔗",
    share: (url: string, title: string) =>
      `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  },
  {
    name: "Pinterest",
    icon: "📌",
    share: (url: string, title: string) =>
      `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}`,
  },
  {
    name: "WhatsApp",
    icon: "💬",
    share: (url: string, title: string) =>
      `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
];

export default function SocialShare({
  url,
  title,
  campaign = "organic_share",
  className = "",
}: SocialShareProps) {
  const handleShare = (platformName: string) => {
    trackEvent("social_share", {
      platform: platformName.toLowerCase(),
      content_url: url,
      campaign,
    });
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Share2 className="h-4 w-4 text-muted-foreground" />
      {platforms.map((p) => {
        const trackedUrl = buildUtmUrl(url, p.name.toLowerCase(), campaign);
        return (
          <Button
            key={p.name}
            variant="outline"
            size="sm"
            className="h-8 w-8 rounded-full p-0 text-sm"
            asChild
          >
            <a
              href={p.share(trackedUrl, title)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleShare(p.name)}
              title={`Share on ${p.name}`}
            >
              {p.icon}
            </a>
          </Button>
        );
      })}
    </div>
  );
}
