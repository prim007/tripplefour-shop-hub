import { Leaf } from "lucide-react";
import { strainImage } from "@/data/leflabsStrainImages";

type Props = {
  id: string;
  name: string;
  className?: string;
};

/**
 * Square strain thumbnail. Falls back to a branded placeholder tile
 * for strains that don't have catalogue photography yet.
 */
const StrainThumb = ({ id, name, className = "h-16 w-16" }: Props) => {
  const src = strainImage(id);

  if (!src) {
    return (
      <div
        className={`${className} flex shrink-0 flex-col items-center justify-center gap-0.5 rounded-lg border border-border bg-muted/40 text-muted-foreground`}
        aria-label={`No photo available for ${name}`}
        role="img"
      >
        <Leaf className="h-4 w-4" aria-hidden="true" />
        <span className="font-mono text-[8px] uppercase tracking-wide">444</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`${name} flower — Lëf Labs catalogue photo`}
      loading="lazy"
      decoding="async"
      width={128}
      height={128}
      className={`${className} shrink-0 rounded-lg border border-border object-cover`}
    />
  );
};

export default StrainThumb;
