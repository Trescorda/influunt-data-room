"use client";

import { motion } from "framer-motion";
import { CountUp } from "@/components/motion/MotionKit";
import {
  ArrowRight,
  CheckCircle2,
  Flag,
  Leaf,
  Sparkles,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────
// Data — near-term raise only. Raise amount + timing per stage.
// No valuations, no issue prices, no later-round figures.
// ─────────────────────────────────────────────────────────────────────────

type Stage = {
  name: string;
  raise: string;
  timing: string;
  status: string;
  active?: boolean;
  color: string;
  blurb: string;
};

const STAGES: Stage[] = [
  {
    name: "Pre-Seed Bridge",
    raise: "A$1.6M",
    timing: "Close Q3 2026",
    status: "Active",
    active: true,
    color: "#C8964F",
    blurb:
      "Funds the live BML pilot, the Wealth-Tech OS stack and AFSL operations — the proof points that unlock the Seed round.",
  },
  {
    name: "Seed",
    raise: "A$5.0M",
    timing: "H2 2026",
    status: "Next",
    color: "#2E6B53",
    blurb:
      "Scales the proven KulaOS replication pattern, the founder-client cohort and the path to sustained monthly profitability.",
  },
];

type Trigger = { from: string; to: string; points: string[] };

const TRIGGER: Trigger = {
  from: "Pre-Seed",
  to: "Seed",
  points: [
    "BML pilot LIVE",
    "Wealth-Tech OS stack live",
    "AFSL operational",
    "KulaOS replication pattern proven",
  ],
};

// ─────────────────────────────────────────────────────────────────────────
// Two-stage raise view — raise amount + timing, side by side.
// ─────────────────────────────────────────────────────────────────────────

function RaiseTimeline() {
  return (
    <div className="rounded-2xl border border-[#174133]/10 bg-white shadow-[0_1px_40px_-16px_rgba(23,65,51,0.22)] p-6 md:p-9 overflow-hidden">
      <div className="flex items-center gap-2 mb-8">
        <div className="h-px w-8 bg-[#C8964F]" />
        <span className="text-[11px] tracking-[0.22em] uppercase font-semibold text-[#174133]/60">
          The two immediate funding stages
        </span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#174133]">
          <Flag className="w-4 h-4 text-[#C8964F]" />
          Active&nbsp;→&nbsp;Next
        </span>
      </div>

      {/* Two stage cards joined by a milestone connector */}
      <div className="grid md:grid-cols-[1fr_auto_1fr] gap-5 md:gap-3 items-stretch">
        {/* Stage 1 */}
        <StageCard stage={STAGES[0]} index={0} />

        {/* Connector — milestone trigger */}
        <div className="hidden md:flex flex-col items-center justify-center px-1">
          <div className="flex flex-col items-center">
            <div className="h-12 w-px bg-gradient-to-b from-[#C8964F]/0 to-[#C8964F]/60" />
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#C8964F]/10 text-[#C8964F] my-1">
              <ArrowRight className="w-5 h-5" />
            </span>
            <div className="h-12 w-px bg-gradient-to-b from-[#2E6B53]/60 to-[#2E6B53]/0" />
          </div>
        </div>

        {/* Stage 2 */}
        <StageCard stage={STAGES[1]} index={1} />
      </div>
    </div>
  );
}

function StageCard({ stage, index }: { stage: Stage; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: 0.12 * index }}
      className="relative rounded-2xl border bg-[#F8F7F4]/60 p-6 md:p-7 flex flex-col overflow-hidden"
      style={{ borderColor: `${stage.color}33` }}
    >
      {/* color rail */}
      <div
        className="absolute inset-y-0 left-0 w-1.5"
        style={{ backgroundColor: stage.color }}
      />

      {/* status chip */}
      <div className="flex items-center justify-between mb-5 pl-2">
        <span className="text-[11px] tracking-[0.18em] uppercase font-bold text-[#174133]/55">
          Stage {index + 1}
        </span>
        {stage.active ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C8964F] text-white text-[10px] tracking-[0.14em] uppercase font-bold px-2.5 py-1 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            {stage.status}
          </span>
        ) : (
          <span
            className="inline-flex items-center rounded-full text-[10px] tracking-[0.14em] uppercase font-bold px-2.5 py-1"
            style={{ backgroundColor: `${stage.color}1A`, color: stage.color }}
          >
            {stage.status}
          </span>
        )}
      </div>

      {/* name + raise */}
      <div className="pl-2">
        <h4 className="text-lg md:text-xl font-bold text-[#174133] leading-tight">
          {stage.name}
        </h4>
        <div
          className="mt-3 text-4xl md:text-5xl font-bold tabular-nums leading-none"
          style={{ color: stage.color }}
        >
          <CountUp prefix="A$" to={parseFloat(stage.raise.replace(/[^\d.]/g, ""))} decimals={1} suffix="M" />
        </div>
        <div className="mt-2 flex items-center gap-2 text-[12px] md:text-[13px] font-semibold text-[#2B2B2B]/60">
          <span className="text-[10px] tracking-[0.16em] uppercase text-[#2B2B2B]/40 font-semibold">
            Raise
          </span>
          <span className="w-1 h-1 rounded-full bg-[#C8964F]" />
          <span>{stage.timing}</span>
        </div>
      </div>

      {/* divider + blurb */}
      <div
        className="h-px w-full my-5 ml-2"
        style={{ backgroundColor: `${stage.color}22` }}
      />
      <p className="pl-2 text-[13.5px] text-[#2B2B2B]/70 leading-relaxed">
        {stage.blurb}
      </p>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────

export default function SectionRoadmap() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="max-w-3xl mb-12 md:mb-14">
          <div className="text-[#C8964F] text-xs tracking-[0.3em] uppercase font-semibold mb-4">
            10 — Roadmap
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-[#174133] leading-tight">
            The Active Raise
          </h2>
        </div>

        {/* Lead */}
        <p className="text-lg md:text-xl text-[#2B2B2B]/80 leading-relaxed max-w-3xl">
          Two funding stages take us through the next chapter — an active
          Pre-Seed Bridge today, and a Seed round in the second half of 2026 —
          each gated by demonstrated operating milestones.
        </p>

        {/* ── Two-stage raise infographic ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
          className="mt-10"
        >
          <RaiseTimeline />
        </motion.div>

        {/* ── Milestone trigger (Pre-Seed → Seed) ────────────────────── */}
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-5 mt-6 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-[#174133]/10 bg-[#F8F7F4]/70 p-7 md:p-8 shadow-[0_1px_30px_-16px_rgba(23,65,51,0.2)] flex flex-col"
          >
            <div className="flex items-center gap-2 text-[#C8964F] text-[11px] tracking-[0.22em] uppercase font-semibold mb-2">
              <Flag className="w-4 h-4" /> Milestone trigger
            </div>
            <div className="flex items-center gap-2 mb-5">
              <span className="text-sm md:text-base font-bold text-[#174133]">
                {TRIGGER.from}
              </span>
              <ArrowRight className="w-4 h-4 text-[#C8964F]" />
              <span className="text-sm md:text-base font-bold text-[#174133]">
                {TRIGGER.to}
              </span>
            </div>
            <p className="text-[13.5px] text-[#2B2B2B]/70 leading-relaxed mb-5">
              The Seed round opens only once the Pre-Seed Bridge has delivered
              its operating proof points:
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
              {TRIGGER.points.map((p) => (
                <li key={p} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-[18px] h-[18px] text-[#C8964F] shrink-0 mt-0.5" />
                  <span className="text-[13.5px] text-[#2B2B2B]/75 leading-snug">
                    {p}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Forward note — qualitative, no later-round figures */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-[#174133]/15 bg-[#174133] text-white p-7 md:p-8 flex flex-col"
          >
            <div className="flex items-center gap-2 text-[#D6B075] text-[11px] tracking-[0.22em] uppercase font-semibold mb-4">
              <Leaf className="w-4 h-4" /> Beyond the Seed
            </div>
            <p className="text-[14px] text-white/80 leading-relaxed">
              Later rounds are scoped against a clear forward pathway — the{" "}
              <strong className="font-semibold text-white">
                Founders Table chapter rollout
              </strong>{" "}
              alongside the reserve build, with the{" "}
              <strong className="font-semibold text-white">Ripple grant</strong>{" "}
              running in parallel as a lighthouse build.
            </p>
            <div className="mt-auto pt-6 flex items-center gap-2 text-[11px] font-semibold text-[#D6B075]/80">
              <Sparkles className="w-3.5 h-3.5" />
              Round economics are reserved for the private deal room
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
