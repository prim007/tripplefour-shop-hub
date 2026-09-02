import { useMemo } from "react";

const LEAF_COUNT = 14;

/**
 * Decorative, non-interactive drifting weed leaves used as a page backdrop.
 * Purely presentational — hidden from assistive tech and disabled for
 * users who prefer reduced motion.
 */
export default function FloatingLeaves() {
  const leaves = useMemo(
    () =>
      Array.from({ length: LEAF_COUNT }, (_, i) => ({
        id: i,
        left: (i * 37) % 100,
        top: (i * 61) % 100,
        size: 26 + ((i * 13) % 44),
        duration: 18 + ((i * 7) % 16),
        delay: -((i * 5) % 20),
        drift: i % 2 === 0 ? 1 : -1,
        opacity: 0.18 + ((i % 4) * 0.06),
      })),
    []
  );

  return (
    <div className="floating-leaves" aria-hidden="true">
      {leaves.map((leaf) => (
        <span
          key={leaf.id}
          className="floating-leaf"
          style={
            {
              left: `${leaf.left}%`,
              top: `${leaf.top}%`,
              width: `${leaf.size}px`,
              height: `${leaf.size}px`,
              opacity: leaf.opacity,
              animationDuration: `${leaf.duration}s`,
              animationDelay: `${leaf.delay}s`,
              "--drift": `${leaf.drift * (40 + (leaf.id % 5) * 18)}px`,
              "--spin": `${leaf.drift * 180}deg`,
            } as React.CSSProperties
          }
        >
          <svg viewBox="0 0 64 64" className="h-full w-full">
            <g fill="currentColor">
              <path d="M32 60c-1.2-6-1.6-11-1.6-14.8 0-1 1.3-1 1.6 0 .3-1 1.6-1 1.6 0 0 3.8-.4 8.8-1.6 14.8z" />
              <path d="M32 48C28 42 26 34 26 24c0-8 3-16 6-22 3 6 6 14 6 22 0 10-2 18-6 24z" />
              <path d="M32 46c-4-4-9-9-12-15-2.6-5.2-3.6-12-3.8-18.4 5 3.6 10.4 8 13.6 13.4C32.6 31 33 39 32 46z" />
              <path d="M32 46c4-4 9-9 12-15 2.6-5.2 3.6-12 3.8-18.4-5 3.6-10.4 8-13.6 13.4C31.4 31 31 39 32 46z" />
              <path d="M32 48c-5-1.6-11-4.6-15.4-9C13 35.4 10 30 8 25c5.8.6 12.4 2.4 17.2 6 4 3 6.6 10 6.8 17z" />
              <path d="M32 48c5-1.6 11-4.6 15.4-9C51 35.4 54 30 56 25c-5.8.6-12.4 2.4-17.2 6-4 3-6.6 10-6.8 17z" />
            </g>
          </svg>
        </span>
      ))}
    </div>
  );
}
