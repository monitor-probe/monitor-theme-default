import type { ReactNode } from "react"

type Props = { label: ReactNode; pct: number | null; foot: ReactNode; empty?: ReactNode }

/**
 * One metric: name and percentage on top, bar in the middle, raw numbers
 * underneath. Monochrome, since the length of the bar carries the message.
 */
export function Meter({ label, pct, foot, empty = "—" }: Props) {
  // null means the metric has no ceiling to fill, so the bar stays empty rather
  // than reporting 0%. What replaces the percentage depends on the reason:
  // unknown for a node with no metrics, ∞ for a plan with no limit. The bar stops
  // at full while the figure does not, so a plan past its quota reads 209%.
  const filled = pct === null ? 0 : Math.min(100, Math.max(0, pct))
  return (
    <div className="min-w-0">
      <div className="flex items-baseline justify-between gap-2">
        <span className="truncate text-xs text-muted-foreground">{label}</span>
        <span className="tnum text-xs font-medium">
          {pct === null ? empty : `${pct < 10 ? pct.toFixed(1) : pct.toFixed(0)}%`}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        {/* Moved rather than resized: a width transition lays the whole page out
            again on every animation frame of its half second, which with four
            bars to a card would cost the list 365 ms per frame against 57 at 200
            nodes in desktop Chromium. Shifted left by what it lacks, the
            full-width bar keeps its rounded end, and the track's rounding clips
            the start as before. Hidden when empty, where the edge it is moved
            out past would otherwise antialias into a sliver; visibility is
            transitioned too, so the hiding waits for the slide to finish. */}
        <div
          className={`h-full rounded-full bg-foreground transition-[transform,visibility] duration-500 ${filled === 0 ? "invisible" : ""}`}
          style={{ transform: `translateX(${filled - 100}%)` }}
        />
      </div>
      <div className="tnum mt-1.5 truncate text-xs text-muted-foreground">{foot}</div>
    </div>
  )
}
