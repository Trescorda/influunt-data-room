"use client";

import { motion } from "framer-motion";
import {
  Flag,
  Users,
  Rocket,
  Globe2,
  Layers,
  Recycle,
  type LucideIcon,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────
// Data — the company arc from incorporation (20 May 2025) to the Safe Haven at scale, 2030.
// Moved from the Team page; the growth-curve format is unchanged.
// ─────────────────────────────────────────────────────────────────────────

type Milestone = {
  period: string;
  title: string;
  detail: string;
  icon: LucideIcon;
  state: "done" | "now" | "future";
};

const JOURNEY: Milestone[] = [
  {
    period: "2025 · Incorporated",
    title: "The company is born",
    icon: Flag,
    state: "done",
    detail:
      "Influunt Pty Ltd is incorporated on 20 May 2025 — and the platform is designed, costed and stress-tested. The brand and two-basket monetary architecture take shape.",
  },
  {
    period: "2026 · Now",
    title: "Partners, pilot & first capital",
    icon: Users,
    state: "now",
    detail:
      "Legal, audit and technology partners are locked in, a 10,000-member national wellness pilot is signed, and the A$1.6M pre-seed bridge opens at an A$20M valuation. You’re here.",
  },
  {
    period: "2027 · Launch",
    title: "The bank switches on",
    icon: Rocket,
    state: "future",
    detail:
      "The first members and partners onboard — backed by A$5M — proving the model at real scale from day one.",
  },
  {
    period: "2028 · Scale",
    title: "Across new markets",
    icon: Globe2,
    state: "future",
    detail: "New markets and services roll out, backed by A$35M, as the platform grows fast.",
  },
  {
    period: "2029 · Expand",
    title: "Deepening the ecosystem",
    icon: Layers,
    state: "future",
    detail: "The Vault, Club, Wellbeing and partner network deepen — one membership, a widening world.",
  },
  {
    period: "2030 · The Collective",
    title: "The Safe Haven at scale",
    icon: Globe2,
    state: "future",
    detail:
      "Chapter by chapter, the Founders Table Collective and the reserve compound together — the Global Safe Haven at full scale.",
  },
];

const GOLD = "#C8964F";
const GREEN = "#174133";
const RAIL_FUTURE = "rgba(23,65,51,0.18)";

const NODE_STYLE: Record<Milestone["state"], string> = {
  done: "bg-[#174133] text-white",
  now: "bg-[#C8964F] text-white",
  future: "bg-white text-[#174133] border-2 border-[#174133]/20",
};
const CHIP: Record<Milestone["state"], { label: string; cls: string }> = {
  done: { label: "Delivered", cls: "bg-[#174133]/10 text-[#174133]" },
  now: { label: "Now", cls: "bg-[#C8964F] text-white" },
  future: { label: "Planned", cls: "bg-[#C8964F]/15 text-[#C8964F]" },
};

function DetailCard({ it }: { it: Milestone }) {
  const Icon = it.icon;
  const chip = CHIP[it.state];
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#174133]/10 bg-white p-5 text-left shadow-[0_24px_50px_-18px_rgba(23,65,51,0.4)]">
      <div className="absolute inset-y-0 left-0 w-1.5" style={{ backgroundColor: it.state === "now" ? GOLD : GREEN }} />
      <div className="flex items-center justify-between gap-3 pl-2">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#174133]/[0.06] text-[#174133]">
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${chip.cls}`}>
          {it.state === "now" && <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />}
          {chip.label}
        </span>
      </div>
      <p className="pl-2 mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C8964F]">{it.period}</p>
      <p className="pl-2 mt-1 text-sm font-bold leading-snug text-[#174133]">{it.title}</p>
      <div className="ml-2 my-3 h-px bg-[#174133]/10" />
      <p className="pl-2 text-[13px] leading-relaxed text-[#2B2B2B]/70">{it.detail}</p>
    </div>
  );
}

/* Growth-curve geometry — the journey climbs like a line graph from 2025 to
   2030. Percent coordinates shared by the SVG path (viewBox 1200x460,
   preserveAspectRatio="none") and the absolutely-positioned HTML nodes. */
const CURVE_X = [100, 300, 500, 700, 900, 1100];
const CURVE_Y = [400, 342, 282, 222, 158, 92];

function curvePath() {
  let d = `M ${CURVE_X[0]} ${CURVE_Y[0]}`;
  for (let i = 1; i < CURVE_X.length; i++) {
    const x0 = CURVE_X[i - 1], y0 = CURVE_Y[i - 1], x1 = CURVE_X[i], y1 = CURVE_Y[i];
    const mx = (x0 + x1) / 2;
    d += ` C ${mx} ${y0}, ${mx} ${y1}, ${x1} ${y1}`;
  }
  return d;
}

/* Node rings match the section background (white here, cream on the old Team
   placement) — they mask the curve behind each node. */
function Timeline({ items }: { items: Milestone[] }) {
  const nowIndex = items.findIndex((i) => i.state === "now");
  const last = items.length - 1;
  // gradient stop at the "Now" node, as a fraction of the path's x-extent
  const nowStop = (CURVE_X[nowIndex] - CURVE_X[0]) / (CURVE_X[last] - CURVE_X[0]);
  const path = curvePath();
  return (
    <div className="mt-12 md:mt-16">
      {/* Desktop — an ascending growth curve; hover a node for the detail */}
      <div className="hidden lg:block">
        <div className="relative h-[460px] w-full">
          {/* the curve itself */}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 460" preserveAspectRatio="none" aria-hidden>
            <defs>
              <linearGradient id="railGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor={GOLD} />
                <stop offset={String(nowStop)} stopColor={GOLD} />
                <stop offset={String(nowStop + 0.001)} stopColor={RAIL_FUTURE} />
                <stop offset="1" stopColor={RAIL_FUTURE} />
              </linearGradient>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={GREEN} stopOpacity="0.08" />
                <stop offset="1" stopColor={GREEN} stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* soft area fill under the curve — reads as a rising graph */}
            <path d={`${path} L ${CURVE_X[last]} 460 L ${CURVE_X[0]} 460 Z`} fill="url(#areaGrad)" />
            <path d={path} fill="none" stroke="url(#railGrad)" strokeWidth="3.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
          </svg>

          {/* nodes + labels + hover cards */}
          {items.map((it, i) => {
            const Icon = it.icon;
            const leftPct = (CURVE_X[i] / 1200) * 100;
            const topPct = (CURVE_Y[i] / 460) * 100;
            const low = topPct > 50; // low on the curve → card opens upward
            return (
              <div
                key={it.period}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${leftPct}%`, top: `${topPct}%` }}
              >
                {it.state === "now" && (
                  <span className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-[#C8964F]/20" />
                )}
                <span className={`relative z-10 grid h-14 w-14 place-items-center rounded-full ring-4 ring-white shadow-[0_6px_18px_-6px_rgba(23,65,51,0.35)] transition-transform duration-300 group-hover:scale-105 ${NODE_STYLE[it.state]}`}>
                  <Icon className="h-6 w-6" />
                </span>
                {/* period + title on the open side of the curve */}
                <div className={`absolute left-1/2 w-[170px] -translate-x-1/2 text-center ${low ? "top-full mt-3" : "bottom-full mb-3"}`}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C8964F]">{it.period}</p>
                  <p className="mt-1 text-[13px] font-bold leading-snug text-[#174133]">{it.title}</p>
                </div>
                {/* hover detail card — opens away from the curve edge */}
                <div
                  className={`pointer-events-none absolute left-1/2 z-20 w-[268px] -translate-x-1/2 opacity-0 transition-all duration-300 group-hover:opacity-100 motion-reduce:transition-none ${
                    low
                      ? "bottom-full mb-3 translate-y-2 group-hover:translate-y-0"
                      : "top-full mt-3 -translate-y-2 group-hover:translate-y-0"
                  }`}
                >
                  <DetailCard it={it} />
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-center text-xs text-[#2B2B2B]/40">Hover a milestone for the detail.</p>
      </div>

      {/* Mobile — vertical rail of icon nodes + cards */}
      <div className="lg:hidden">
        {items.map((it, i) => {
          const Icon = it.icon;
          return (
            <div key={it.period} className="flex items-stretch gap-4">
              <div className="relative flex w-14 shrink-0 flex-col items-center">
                <span className={`z-10 grid h-14 w-14 place-items-center rounded-full ring-4 ring-white ${NODE_STYLE[it.state]}`}>
                  <Icon className="h-6 w-6" />
                </span>
                {i < last && <div className="my-1 w-[3px] flex-1 rounded-full" style={{ backgroundColor: i < nowIndex ? GOLD : RAIL_FUTURE }} />}
              </div>
              <div className="flex-1 pb-6">
                <DetailCard it={it} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────

export default function SectionJourney() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="max-w-3xl mb-12 md:mb-14">
          <div className="text-[#C8964F] text-xs tracking-[0.3em] uppercase font-semibold mb-4">
            09 — Our Journey
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-[#174133] leading-tight">
            Incorporated in 2025, Built for <span className="text-[#C8964F]">2030</span>
          </h2>
        </div>

        {/* Lead */}
        <p className="text-lg md:text-xl text-[#2B2B2B]/80 leading-relaxed max-w-3xl">
          From incorporation to a self-renewing gold reserve — six milestones,
          one ascending curve. The active raise on this page funds the next
          step of it.
        </p>

        {/* ── Growth-curve timeline ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
        >
          <Timeline items={JOURNEY} />
        </motion.div>
      </div>
    </section>
  );
}
