'use client';
import { cn } from '@/lib/utils';

type AuroraBackgroundProps = {
  className?: string;
  showRadialGradient?: boolean;
};

// Adapted from the open-source Aceternity UI "Aurora Background" (the same
// component shadcn.io's gated registry ships under /background/aurora).
// Recolored to this site's own hue tokens instead of the demo's stock
// blue/indigo/violet, and trimmed to a standalone decorative layer — the
// upstream version wraps the whole page as a layout component, which
// doesn't fit here since `<main class="page">` already owns that role.
// Pure CSS animation (`animate-aurora`, defined in tailwind.css); no JS
// animation loop. `motion-safe:` is Tailwind's built-in
// prefers-reduced-motion gate, so reduced-motion visitors just get the
// static gradient with no extra code.
export function AuroraBackground({ className, showRadialGradient = true }: AuroraBackgroundProps) {
  return (
    <div className={cn('pointer-events-none fixed inset-0 overflow-hidden', className)} aria-hidden>
      <div
        className="absolute inset-0"
        style={
          {
            '--aurora':
              'repeating-linear-gradient(100deg,var(--hue-lime) 10%,var(--hue-cyan) 15%,var(--hue-violet) 20%,var(--hue-rose) 25%,var(--hue-amber) 30%)',
            '--dark-gradient':
              'repeating-linear-gradient(100deg,var(--bg) 0%,var(--bg) 7%,transparent 10%,transparent 12%,var(--bg) 16%)',
            '--white-gradient':
              'repeating-linear-gradient(100deg,var(--bg) 0%,var(--bg) 7%,transparent 10%,transparent 12%,var(--bg) 16%)',
          } as React.CSSProperties
        }
      >
        <div
          className={cn(
            'motion-safe:after:animate-aurora pointer-events-none absolute -inset-[10px]',
            '[background-image:var(--white-gradient),var(--aurora)] [background-size:300%,200%] [background-position:50%_50%,50%_50%]',
            'opacity-30 blur-[10px] will-change-transform',
            "after:absolute after:inset-0 after:[background-image:var(--dark-gradient),var(--aurora)] after:[background-size:200%,100%] after:[background-attachment:fixed] after:mix-blend-difference after:content-['']",
            showRadialGradient &&
              '[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]',
          )}
        />
      </div>
    </div>
  );
}
