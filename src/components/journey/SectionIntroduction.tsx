"use client";

import { motion } from "framer-motion";
import { CountUp } from "@/components/motion/MotionKit";
import {
  Coins,
  Bot,
  Recycle,
  Globe2,
  Quote,
  TrendingUp,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────
// SectionIntroduction — 01 · Introduction
// "The sovereign money system"
// Self-contained: data + sub-components live in this file.
// ─────────────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

// Four-pillar row — the platform's vertically integrated stack.
const PILLARS = [
  {
    icon: Coins,
    name: "ICC",
    label: "Influunt Commodity Coin",
    note: "MiCA Asset-Referenced Token",
  },
  {
    icon: Bot,
    name: "Agentic AI",
    label: "Wealth for Life CEO",
    note: "One instance per client",
  },
  {
    icon: Globe2,
    name: "5 Jurisdictions",
    label: "Regulated infrastructure",
    note: "MT · AU · SG · KY · LU",
  },
];

// "At a glance" — the five facts as a stat-card grid.
const AT_A_GLANCE = [
  {
    icon: Coins,
    tag: "ICC",
    headline: "25,000,000",
    unit: "supply cap",
    body:
      "A MiCA Asset-Referenced Token, backed by a diversified metal-value reserve — gold floor plus silver, PGMs, rare earths and technology metals — that compounds through programmatic trade margin.",
  },
  {
    icon: Bot,
    tag: "Agentic AI",
    headline: "1 : 1",
    unit: "instance per client",
    body:
      'A sovereign agentic AI, delivered as the "Wealth for Life CEO in your pocket" — one personalised instance for every client.',
  },
  {
    icon: Globe2,
    tag: "Jurisdictions",
    headline: "5",
    unit: "regulated markets",
    body:
      "Malta, Australia, Singapore, the Cayman Islands and Luxembourg — sovereign, multi-jurisdiction infrastructure under direct ownership.",
  },
];

// Active raise — Pre-Seed Bridge (open now) and the Seed round.
const RAISE_STAGES = [
  { label: "Pre-Seed Bridge", value: "A$1.6M", active: true },
  { label: "Seed", value: "A$5.0M", active: false },
];

export default function SectionIntroduction() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="max-w-3xl mb-12 md:mb-14">
          <div className="text-[#C8964F] text-xs tracking-[0.3em] uppercase font-semibold mb-4">
            01 — Introduction
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-[#174133] leading-tight">
            The sovereign money system
          </h2>
        </div>

        {/* ── Prose ───────────────────────────────────────────────────── */}
        <div className="max-w-3xl space-y-5">
          <p className="text-lg md:text-xl text-[#2B2B2B]/80 leading-relaxed">
            Influunt is an AI-native, gold-anchored monetary operating system — a{" "}
            <strong className="font-semibold text-[#174133]">
              "Bank of the Future"
            </strong>{" "}
            that unifies a regulated digital-asset bank, a diversified
            metal-reserve token (ICC), and a sovereign agentic-AI layer
            into a single, vertically integrated platform.
          </p>
          <p className="text-[#2B2B2B]/70 leading-relaxed">
              Where conventional crypto-banks bolt digital assets onto legacy
              rails, Influunt is purpose-built &mdash; AI-native and
              blockchain-principles first. Every client receives{" "}
              <strong className="font-semibold text-[#174133]">
                a personal &ldquo;Wealth for Life CEO&rdquo;
              </strong>{" "}
              &mdash; an agentic AI that orchestrates their wealth, wellbeing and
              opportunities across a regulated, multi-jurisdiction infrastructure.
            </p>
        </div>

        {/* ── Thesis pull-quote ───────────────────────────────────────── */}
        <motion.figure
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="relative my-12 md:my-14 overflow-hidden rounded-2xl border border-[#174133]/10 bg-[#174133] px-7 py-9 md:px-12 md:py-12 shadow-[0_24px_60px_-30px_rgba(23,65,51,0.6)]"
        >
          {/* gold hairline accent */}
          <span className="absolute left-0 top-0 h-full w-1 bg-[#C8964F]" />
          {/* faint oversized quote glyph */}
          <Quote
            className="pointer-events-none absolute -right-3 -top-3 h-28 w-28 text-[#D6B075]/15"
            strokeWidth={1.25}
          />
          <div className="relative">
            <figcaption className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#D6B075]">
              The thesis in one line
            </figcaption>
            <blockquote className="max-w-3xl text-xl md:text-3xl font-bold leading-snug text-white">
              Programmable money, allocated gold and agentic AI in a single treasury
              platform &mdash; built for founders, operating businesses and family
              offices.
            </blockquote>
          </div>
        </motion.figure>

        {/* ── 4-pillar row ────────────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          transition={{ staggerChildren: 0.08 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-12 md:mb-16"
        >
          {PILLARS.map(({ icon: Icon, name, label, note }) => (
            <motion.div
              key={name}
              variants={fadeUp}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="group flex items-start gap-3 rounded-xl border border-[#174133]/10 bg-[#F8F7F4] px-4 py-4 transition-colors hover:border-[#C8964F]/40"
            >
              <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#174133] text-[#D6B075] transition-colors group-hover:bg-[#C8964F] group-hover:text-white">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <div className="text-sm font-bold text-[#174133] leading-tight">
                  {name}
                </div>
                <div className="text-[13px] text-[#2B2B2B]/70 leading-snug">
                  {label}
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-wide text-[#C8964F] font-semibold">
                  {note}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── "At a glance" infographic ───────────────────────────────── */}
        <div className="mb-8 flex items-center gap-4">
          <div className="text-[#174133] text-sm font-bold uppercase tracking-[0.2em]">
            At a glance
          </div>
          <span className="h-px flex-1 bg-gradient-to-r from-[#C8964F]/50 to-transparent" />
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5"
        >
          {AT_A_GLANCE.map(({ icon: Icon, tag, headline, unit, body }) => (
            <motion.article
              key={tag}
              variants={fadeUp}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="group relative flex flex-col rounded-2xl border border-[#174133]/10 bg-white p-6 md:p-7 shadow-[0_10px_30px_-22px_rgba(23,65,51,0.45)] transition-all hover:-translate-y-0.5 hover:border-[#C8964F]/30 hover:shadow-[0_18px_44px_-26px_rgba(23,65,51,0.55)]"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#174133]/[0.06] text-[#174133] transition-colors group-hover:bg-[#174133] group-hover:text-[#D6B075]">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <span className="rounded-full border border-[#C8964F]/30 bg-[#C8964F]/[0.06] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C8964F]">
                  {tag}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl md:text-[2.5rem] font-bold leading-none text-[#174133]">
                  {headline}
                </span>
                <span className="text-xs font-medium uppercase tracking-wide text-[#2B2B2B]/55">
                  {unit}
                </span>
              </div>

              <span className="mt-4 mb-4 block h-px w-10 bg-[#C8964F]/60" />

              <p className="text-sm leading-relaxed text-[#2B2B2B]/70">{body}</p>
            </motion.article>
          ))}
        </motion.div>

        {/* ── Active raise (the 5th fact, visualised) ─────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mt-4 md:mt-5 overflow-hidden rounded-2xl border border-[#174133]/10 bg-[#F8F7F4] p-6 md:p-8"
        >
          <div className="mb-6 flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#174133] text-[#D6B075]">
              <TrendingUp className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#174133]">
                  Active raise
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C8964F]/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#C8964F]">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C8964F]/60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#C8964F]" />
                  </span>
                  Open now
                </span>
              </div>
              <p className="text-[13px] text-[#2B2B2B]/65">
                The A$1.6M Pre-Seed Bridge is open now, ahead of the A$5.0M Seed
                round.
              </p>
            </div>
          </div>

          {/* Two-node raise */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px overflow-hidden rounded-xl border border-[#174133]/10 bg-[#174133]/10">
            {RAISE_STAGES.map((stage, i) => (
              <div
                key={stage.label}
                className={`relative flex flex-col justify-center px-5 py-5 ${
                  stage.active ? "bg-[#174133]" : "bg-white"
                }`}
              >
                <div
                  className={`mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                    stage.active ? "text-[#D6B075]" : "text-[#C8964F]"
                  }`}
                >
                  {stage.active ? "Open now" : "Next"}
                </div>
                <div
                  className={`text-2xl md:text-[1.75rem] font-bold leading-none ${
                    stage.active ? "text-white" : "text-[#174133]"
                  }`}
                >
                  <CountUp prefix="A$" to={parseFloat(stage.value.replace(/[^\d.]/g, ""))} decimals={1} suffix="M" />
                </div>
                <div
                  className={`mt-1.5 text-xs ${
                    stage.active ? "text-white/70" : "text-[#2B2B2B]/60"
                  }`}
                >
                  {stage.label}
                </div>

                {/* gold connector arrow between nodes (desktop) */}
                {i < RAISE_STAGES.length - 1 && (
                  <span className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 md:block">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#C8964F]/40 bg-white text-[#C8964F]">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
