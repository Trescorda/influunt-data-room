'use client';

import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * MotionKit — the shared motion vocabulary for influunt.global.
 *
 * "The system's confidence reads through stillness, not motion."
 *
 * One place for every scroll/entrance/hover behaviour so the whole site moves
 * like it was choreographed by one hand.
 *
 * ── The two-curve rule ────────────────────────────────────────────────────
 * There are exactly TWO easing curves on this site. A third is a bug.
 *   EASE_ATMOS — everything the page does by itself (reveals, rises, traces).
 *                Symmetric ease-in-out: it starts from stillness, so movement
 *                stays visible for its whole duration instead of a quarter of it.
 *   EASE_STATE — everything a pointer touches (hover, focus, active). Nothing else.
 *
 * ── The duration ladder ───────────────────────────────────────────────────
 *   0.2s  state       — hover / focus / active. Instant.
 *   1.1s  section     — anything the page reveals mid-scroll. The workhorse.
 *   2.5s  atmosphere  — hero settle, counters, hairline draws. Rationed:
 *                       at most ONE atmosphere event visible per viewport.
 *   (1.3s is the single documented exception, for a page H1 word cascade.)
 * No duration off this ladder. `duration: 0.6` is a bug.
 *
 * ── Denied outright ───────────────────────────────────────────────────────
 * Springs. Overshoot. Bounce. Parallax. `repeat: Infinity`. Animating layout
 * properties (left/top/width/height). Animated box-shadow, filter or blur.
 * Rotation, tilt, 3D, cursor effects, scroll-jacking.
 *
 * Replay is a deliberate exception — see REPLAY below. Origin's doctrine fires
 * each reveal once, which is correct for a finished site but makes the motion
 * invisible on a second pass. While the language is being judged, blocks
 * re-animate every time they re-enter the viewport.
 *
 * Everything degrades to its final static state under prefers-reduced-motion —
 * except the 0.2s state rung, which is affordance, not decoration, and stays.
 *
 * Brand: green #174133 · gold #C8964F · display gold #D6B075.
 */

/** Atmospheric curve — a true symmetric settle. Used for everything the page does on its own. */
export const EASE_ATMOS: [number, number, number, number] = [0.455, 0.03, 0.515, 0.955];
/** The CSS `ease` keyword, written out. Used for hover/focus/active and nothing else. */
export const EASE_STATE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];
/** Back-compat alias so existing call sites inherit the new curve untouched. */
export const EASE = EASE_ATMOS;

/** The only durations that exist. */
export const DUR = { state: 0.2, section: 1.1, atmos: 2.5 } as const;

/** House viewport contract. Travel is finished by the time the block is readable. */
// REPLAY: set to false so reveals re-fire every time a block re-enters the
// viewport. Scroll up and down and the site animates again — which is what makes
// the motion legible while it is being judged. Flip to `true` to make each
// element animate exactly once per page load.
const REPLAY = true;
const VIEW = { once: !REPLAY, amount: 0.15, margin: "0px 0px -8% 0px" } as const;

/* ────────────────────────── StrokeFrame ──────────────────────────
   The signature. A 1px gold hairline that draws itself once around a frame,
   clockwise from the top-left, and stays. Nothing arrives — a line that was
   conceptually always there is simply inscribed.

   Rationed: once per page (twice on Invest). More than that and it is a
   border style, not a gesture. */
export function StrokeFrame({
  children,
  radius = 0,
  className = "",
  delay = 0.25,
}: {
  children: ReactNode;
  /** Corner radius in viewBox units (0–100). 0 keeps the brand's square corners. */
  radius?: number;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <div className={`relative ${className}`}>
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <motion.rect
          x={0.5}
          y={0.5}
          width={99}
          height={99}
          rx={radius}
          fill="none"
          stroke="#C8964F"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          pathLength={1}
          strokeDasharray="1 1"
          initial={{ strokeDashoffset: reduce ? 0 : 1 }}
          whileInView={{ strokeDashoffset: 0 }}
          viewport={{ once: VIEW.once, amount: 0.4 }}
          transition={reduce ? { duration: 0 } : { duration: DUR.atmos, delay, ease: EASE_ATMOS }}
        />
      </svg>
      {children}
    </div>
  );
}

/* ────────────────────────── Reveal ──────────────────────────
   Scroll-triggered entrance. The workhorse for section-scale blocks. */
type RevealVariant = "up" | "fade" | "scale" | "left" | "right" | "aperture";

const REVEAL_FROM: Record<
  RevealVariant,
  { x?: number; y?: number; scale?: number; clipPath?: string }
> = {
  up: { y: 56 },
  fade: {},
  scale: { scale: 0.965 },
  left: { x: -64 },
  right: { x: 64 },
  // Zero travel — the block un-occludes top-down. For full-bleed photography,
  // where a 40px rise fights the image.
  aperture: { clipPath: "inset(0 0 100% 0)" },
};

const REVEAL_TO: Record<RevealVariant, Record<string, unknown>> = {
  up: { y: 0 },
  fade: {},
  scale: { scale: 1 },
  left: { x: 0 },
  right: { x: 0 },
  aperture: { clipPath: "inset(0 0 0% 0)" },
};

export function Reveal({
  children,
  variant = "up",
  delay = 0,
  duration = DUR.section,
  amount = VIEW.amount,
  once = VIEW.once,
  className = "",
}: {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  amount?: number;
  once?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...REVEAL_FROM[variant] }}
      whileInView={{ opacity: 1, ...REVEAL_TO[variant] }}
      viewport={{ once, amount, margin: VIEW.margin }}
      transition={{ duration, delay, ease: EASE_ATMOS }}
    >
      {children}
    </motion.div>
  );
}

/* ────────────────────────── Stagger ──────────────────────────
   Cascade for grids and lists. The total cascade is capped so a long grid
   reads as one sweep rather than as N separate events. */
const staggerItem = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: DUR.section, ease: EASE_ATMOS } },
};

export function Stagger({
  children,
  gap = 0.14,
  count,
  delay = 0,
  amount = VIEW.amount,
  once = VIEW.once,
  className = "",
}: {
  children: ReactNode;
  gap?: number;
  /** Pass the child count to cap the total cascade at 0.7s. */
  count?: number;
  delay?: number;
  amount?: number;
  once?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  const g = count ? Math.min(gap, 0.7 / Math.max(1, count - 1)) : gap;
  return (
    <motion.div
      className={className}
      variants={{ hidden: {}, show: { transition: { staggerChildren: g, delayChildren: delay } } }}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount, margin: VIEW.margin }}
    >
      {children}
    </motion.div>
  );
}

export function Item({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  );
}

/* ────────────────────────── TextReveal ──────────────────────────
   Word-by-word masked rise.

   SCARCITY RULE: the page H1 only. Every other heading uses MaskReveal.
   A word cascade repeated down a page is the most template-signalling
   gesture in the kit. */
export function TextReveal({
  text,
  className = "",
  delay = 0,
  gap = 0.075,
  duration = 1.3,
  once = true,
}: {
  text: string;
  className?: string;
  delay?: number;
  gap?: number;
  duration?: number;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <span className={className}>{text}</span>;
  const words = text.split(/\s+/).filter(Boolean);
  // The in-view observer MUST sit on this outer, unclipped span. The per-word
  // inner spans start translated fully outside their overflow-hidden wrappers,
  // so an observer attached to them reports 0% visible forever and the reveal
  // deadlocks (hidden because it never fired; never fires because it's hidden).
  // The outer span has a normal box, so it intersects normally, and the variant
  // labels propagate down to the word children.
  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.35, margin: VIEW.margin }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } }}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "110%" },
              show: { y: "0%", transition: { duration, ease: EASE_ATMOS } },
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}{" "}
    </motion.span>
  );
}

/* ────────────────────────── MaskReveal ──────────────────────────
   Whole-block masked rise. The workhorse for every heading below the page H1,
   on every page. Keeps any coloured <span>s / markup untouched. */
export function MaskReveal({
  children,
  className = "",
  delay = 0,
  duration = DUR.section,
  amount = 0.25,
  once = VIEW.once,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  amount?: number;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <span className={`block ${className}`}>{children}</span>;
  // The in-view observer MUST sit on this outer, unclipped span — the inner
  // span starts translated fully outside the overflow-hidden mask, so an
  // observer attached to it reports 0% visible forever and the reveal
  // deadlocks. The outer box intersects normally and the variant label
  // propagates to the child.
  return (
    <motion.span
      className={`block overflow-hidden pb-[0.18em] -mb-[0.18em] ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
    >
      <motion.span
        className="block"
        variants={{
          hidden: { y: "126%" },
          show: { y: "0%", transition: { duration, delay, ease: EASE_ATMOS } },
        }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

/* ────────────────────────── Parallax (deprecated) ──────────────────────────
   @deprecated Parallax is denied by the motion doctrine — and the old
   implementation wrapped the scroll transform in a spring, which can overshoot.
   Now a transparent passthrough so existing call sites keep compiling.

   Do NOT swap these call sites to <Reveal variant="aperture">. That was
   tried on Home's three full-bleed image breaks and left all three
   permanently invisible: the wrappers are absolutely positioned with
   negative insets inside overflow-hidden sections, whileInView never fired
   for them, and the variant's initial state is clipPath inset(0 0 100% 0)
   with opacity 0 — so the images were clipped away with nothing to un-clip
   them. Verified over CDP at a 1280x900 viewport. KenBurns is still the
   right call for hero covers. */
export function Parallax({
  children,
  range: _range = 0,
  className = "",
}: {
  children: ReactNode;
  range?: number;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

/* ────────────────────────── KenBurns ──────────────────────────
   Cinematic settle for dark hero covers. 4% over 2.5s on a symmetric curve is
   a drift you feel but cannot point to. Above-the-fold covers only, one per
   page — it counts as that viewport's single atmosphere event. */
export function KenBurns({
  src,
  alt = "",
  className = "",
  from = 1.08,
  duration = 3.2,
}: {
  src: string;
  alt?: string;
  className?: string;
  from?: number;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  const cls = `absolute inset-0 h-full w-full object-cover ${className}`;
  if (reduce) return <img src={src} alt={alt} className={cls} />;
  return (
    <motion.img
      src={src}
      alt={alt}
      className={cls}
      initial={{ scale: from }}
      animate={{ scale: 1 }}
      transition={{ duration, ease: EASE_ATMOS }}
    />
  );
}

/* ────────────────────────── CountUp ──────────────────────────
   Animates a number when it scrolls into view. The symmetric curve makes the
   figure crawl off the mark, accelerate, then decelerate into place — it lands
   rather than ticks. Copy-safe: renders exactly prefix + value + suffix.

   Rules: never more than three in one viewport, and never on a live or
   market-quoted figure — a counting live number reads as an exchange. */
export function CountUp({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = DUR.atmos,
  className = "",
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [val, setVal] = useState(0);
  useEffect(() => {
    // Reduced motion needs no animation and no state write — the rendered
    // value is derived below, which keeps setState out of this effect.
    if (!inView || reduce) return;
    const controls = animate(0, to, { duration, ease: EASE_ATMOS, onUpdate: (v) => setVal(v) });
    return () => controls.stop();
  }, [inView, to, duration, reduce]);
  const display = reduce ? to : val;
  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ────────────────────────── HoverLift ──────────────────────────
   Card hover: a 3px rise on the state rung. No spring — a 300/22 spring
   overshoots on both press and release.
   On Invest dossier cards, prefer a 0.2s border-color state instead; a lifting
   card on a data page reads as an app, not a document. */
export function HoverLift({
  children,
  y = -3,
  className = "",
}: {
  children: ReactNode;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      whileHover={{ y }}
      transition={{ duration: DUR.state, ease: EASE_STATE }}
    >
      {children}
    </motion.div>
  );
}

/* ────────────────────────── ShimmerDivider ──────────────────────────
   The brand's gold hairline, drawn rather than swept. It rules itself in from
   the left, once, and stops — the same grammar as StrokeFrame.
   Reserve for dividers that introduce a major section. */
export function ShimmerDivider({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const bar = `h-0.5 bg-gradient-to-r from-[#C8964F] to-transparent ${className}`;
  if (reduce) return <div className={bar} />;
  return (
    <motion.div
      className={bar}
      style={{ transformOrigin: "left" }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: VIEW.once, amount: 0.6 }}
      transition={{ duration: DUR.atmos, ease: EASE_ATMOS }}
    />
  );
}

/* ────────────────────────── ScrollProgress ──────────────────────────
   2px green→gold hairline fixed to the top of the viewport.
   Invest only. On a narrative page it measures a manifesto like a task;
   on an eleven-section dossier it is genuinely useful. No spring — the raw
   scroll value is already per-frame smooth, and a spring makes the bar lag
   the reader's actual position. */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  if (reduce) return null;
  return (
    <motion.div
      style={{ scaleX: scrollYProgress }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-gradient-to-r from-[#174133] via-[#C8964F] to-[#D6B075]"
    />
  );
}

/* ────────────────────────── BtnSheen (deprecated) ──────────────────────────
   @deprecated A 700ms light sweep sits on no rung of the ladder, and removing
   it is part of what makes the StrokeFrame trace read as THE distinctive move
   rather than the third sparkle on the page. Renders nothing; CTA hover is now
   a 0.2s border/background state. Kept as a no-op so call sites compile. */
export function BtnSheen() {
  return null;
}

/* ────────────────────────── FloatCue ──────────────────────────
   Scroll affordance for tall dark heroes. The perpetual gold pulse is gone —
   nothing on this site loops forever. The hairline stays; it just doesn't
   perform. */
export function FloatCue({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none flex flex-col items-center ${className}`} aria-hidden>
      <div className="h-12 w-px bg-white/20" />
    </div>
  );
}
