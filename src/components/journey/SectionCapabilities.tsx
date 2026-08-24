"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Building2,
  ShieldCheck,
  Compass,
  Wallet,
  HeartPulse,
  Sparkles,
  Layers,
  GraduationCap,
  Network,
  CircleDot,
  ArrowRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const faculty = [
  {
    name: "Wealth Architect",
    icon: Building2,
    blurb: "Designs the path to a sustainable, income-generating portfolio.",
  },
  {
    name: "Compliance Guardian",
    icon: ShieldCheck,
    blurb: "Keeps every move aligned to mandate and jurisdiction.",
  },
  {
    name: "Opportunity Scout",
    icon: Compass,
    blurb: "Surfaces moves that compound the plan over time.",
  },
];

const lifecycle = [
  { label: "Companion", icon: HeartPulse, note: "Immediate assistance" },
  { label: "Learning", icon: GraduationCap, note: "Personalises to each client" },
  { label: "Intellects", icon: Layers, note: "Specialised knowledge" },
  { label: "Zonal", icon: Network, note: "Coordinating orchestration" },
];

const pillars = [
  {
    name: "Wealth",
    icon: Wallet,
    sub: "Live portfolio",
    points: [
      "ICC holdings",
      "Commodity-treasury exposure",
      "POA yield",
      "Wealth-plan progress",
    ],
  },
  {
    name: "Wellbeing",
    icon: HeartPulse,
    sub: "Life-currency",
    points: [
      "Tracked by the day",
      "Tracked by the week",
      "Tracked by the month",
    ],
  },
  {
    name: "Opportunities",
    icon: Sparkles,
    sub: "AI-surfaced moves",
    points: [
      "Compounds Wealth + Wellbeing",
      "Individually surfaced",
      "Collective via Global Safe Haven",
    ],
  },
];

const foundation = [
  "pAI-OS shell",
  "KwaaiNet decentralised inference",
  "W3C Solid data sovereignty",
  "IEEE P7012 value-alignment",
  "Confidential-RAG privacy",
  "Swiss-Vault / iBridge deployment",
];

/* ------------------------------------------------------------------ */
/*  Motion helpers                                                     */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const viewport = { once: true, amount: 0.3 } as const;

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <CircleDot className="mt-1 h-4 w-4 shrink-0 text-[#C8964F]" strokeWidth={2.25} />
      <span className="text-[#2B2B2B]/75 leading-relaxed">{children}</span>
    </li>
  );
}

/* Hub-and-spoke: the agentic AI at centre, AssetNeo beneath, faculty as spokes */
function HubAndSpoke() {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={fadeUp}
      className="relative overflow-hidden rounded-2xl border border-[#174133]/10 bg-[#F8F7F4] p-6 shadow-[0_1px_2px_rgba(17,65,51,0.04)] md:p-10"
    >
      <div className="mb-8 flex items-center gap-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#C8964F]">
          Agentic architecture
        </span>
        <span className="h-px flex-1 bg-gradient-to-r from-[#C8964F]/40 to-transparent" />
      </div>

      {/* Agentic AI — centre node */}
      <motion.div variants={fadeUp} custom={0} className="flex justify-center">
        <div className="relative flex w-full max-w-md flex-col items-center rounded-2xl border border-[#174133]/15 bg-white px-6 py-6 text-center shadow-[0_10px_30px_-12px_rgba(17,65,51,0.25)]">
          <div className="absolute -top-3 rounded-full bg-[#174133] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white">
            Client-facing
          </div>
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#174133] text-white ring-4 ring-[#C8964F]/25">
            <Bot className="h-7 w-7" strokeWidth={1.75} />
          </div>
          <div className="text-xl font-bold text-[#174133]">Agentic AI</div>
          <div className="mt-1 text-sm text-[#2B2B2B]/70">
            The Wealth for Life CEO — an agentic AI executive in the client&rsquo;s pocket
          </div>
        </div>
      </motion.div>

      {/* Connector down to the domain brain */}
      <div className="flex justify-center" aria-hidden>
        <div className="my-3 h-7 w-px bg-gradient-to-b from-[#174133]/30 to-[#C8964F]/40" />
      </div>

      {/* AssetNeo — domain brain */}
      <motion.div variants={fadeUp} custom={1} className="flex justify-center">
        <div className="flex w-full max-w-2xl items-center gap-4 rounded-xl border border-[#C8964F]/40 bg-gradient-to-br from-[#174133] to-[#0d2b22] px-5 py-4 text-white shadow-lg">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#C8964F]/20 text-[#D6B075]">
            <Network className="h-6 w-6" strokeWidth={1.75} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-[#D6B075]">AssetNeo</span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white/80">
                Domain brain
              </span>
            </div>
            <div className="mt-0.5 text-sm text-white/70">
              Treasury · the wealth engine · bullion–blockchain–banking logic
            </div>
          </div>
        </div>
      </motion.div>

      {/* Spokes label */}
      <div className="my-6 flex items-center gap-3" aria-hidden>
        <span className="h-px flex-1 bg-[#174133]/10" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#174133]/55">
          Orchestrates a faculty of specialised agents
        </span>
        <span className="h-px flex-1 bg-[#174133]/10" />
      </div>

      {/* Faculty — spokes */}
      <div className="grid gap-4 sm:grid-cols-3">
        {faculty.map((agent, i) => {
          const Icon = agent.icon;
          return (
            <motion.div
              key={agent.name}
              variants={fadeUp}
              custom={i + 2}
              className="group rounded-xl border border-[#174133]/10 bg-white p-5 shadow-[0_1px_2px_rgba(17,65,51,0.04)] transition-shadow hover:shadow-[0_8px_24px_-12px_rgba(17,65,51,0.22)]"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#C8964F]/12 text-[#C8964F]">
                <Icon className="h-5 w-5" strokeWidth={1.9} />
              </div>
              <div className="text-sm font-bold text-[#174133]">{agent.name}</div>
              <div className="mt-1 text-sm leading-relaxed text-[#2B2B2B]/65">{agent.blurb}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Agent lifecycle — labelled pill row */}
      <div className="mt-8 rounded-xl border border-[#174133]/10 bg-white/60 p-5">
        <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#174133]/60">
          A proven agent lifecycle
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
          {lifecycle.map((stage, i) => {
            const Icon = stage.icon;
            return (
              <div key={stage.label} className="flex items-center gap-2">
                <div className="flex items-center gap-2.5 rounded-full border border-[#174133]/10 bg-[#F8F7F4] py-1.5 pl-2 pr-3.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#174133] text-white">
                    <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-xs font-bold text-[#174133]">{stage.label}</span>
                    <span className="block text-[11px] text-[#2B2B2B]/55">{stage.note}</span>
                  </span>
                </div>
                {i < lifecycle.length - 1 && (
                  <ArrowRight className="h-4 w-4 shrink-0 text-[#C8964F]/60" strokeWidth={2.25} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

/* Three-pillar product as three columns */
function ThreePillars() {
  return (
    <div className="mt-6">
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#174133]/60">
          The three-pillar product
        </div>
        <div className="hidden text-xs text-[#2B2B2B]/55 sm:block">
          One dashboard · &ldquo;currency&rdquo; in two senses
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {pillars.map((pillar, i) => {
          const Icon = pillar.icon;
          return (
            <motion.div
              key={pillar.name}
              initial="hidden"
              whileInView="show"
              viewport={viewport}
              variants={fadeUp}
              custom={i}
              className="relative flex flex-col overflow-hidden rounded-2xl border border-[#174133]/10 bg-white p-6 shadow-[0_1px_2px_rgba(17,65,51,0.04)]"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#C8964F] to-[#D6B075]" />
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#174133] text-white">
                  <Icon className="h-5 w-5" strokeWidth={1.9} />
                </div>
                <div>
                  <div className="text-lg font-bold text-[#174133]">{pillar.name}</div>
                  <div className="text-xs font-medium uppercase tracking-wide text-[#C8964F]">
                    {pillar.sub}
                  </div>
                </div>
              </div>
              <ul className="mt-1 space-y-2.5">
                {pillar.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <CircleDot className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C8964F]" strokeWidth={2.5} />
                    <span className="text-sm leading-relaxed text-[#2B2B2B]/75">{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

export default function SectionCapabilities() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10">
        <div className="mb-12 max-w-3xl md:mb-14">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#C8964F]">
            03 — Core Capabilities
          </div>
          <h2 className="text-3xl font-bold leading-tight text-[#174133] md:text-5xl">
            The agentic AI and the faculty
          </h2>
        </div>

        {/* Agentic AI intro */}
        <h3 className="mb-3 mt-8 text-xl font-bold text-[#174133] first:mt-0">
          The agentic AI &mdash; the Wealth for Life CEO
        </h3>
        <p className="max-w-3xl text-lg leading-relaxed text-[#2B2B2B]/80 md:text-xl">
          The Wealth for Life CEO is the client-facing face of the system: an agentic AI executive in the client&rsquo;s
          pocket. It is included in every Founder-tier and above subscription, and is trained on
          Influunt&rsquo;s sovereign monetary model and wealth-planning methodology. It optimises the
          client&rsquo;s time, energy and focus and fast-tracks a personal wealth plan toward a sustainable,
          income-generating private investment portfolio.
        </p>

        {/* Faculty intro */}
        <h3 className="mb-3 mt-10 text-xl font-bold text-[#174133]">
          The faculty of specialised agents
        </h3>
        <p className="mb-8 max-w-3xl leading-relaxed text-[#2B2B2B]/70">
          Beneath it runs{" "}
          <strong className="font-semibold text-[#174133]">AssetNeo</strong>, Influunt&rsquo;s domain brain
          (treasury, the wealth engine, bullion–blockchain–banking logic), which orchestrates a faculty
          of specialised agents — for example a Wealth Architect, a Compliance Guardian, and an
          Opportunity Scout. The faculty maps to a proven agent lifecycle: a Companion layer for
          immediate assistance, an individual learning module that personalises to each client,
          specialised knowledge structures (Intellects), and coordinating (Zonal) orchestration.
        </p>

        {/* INFOGRAPHIC — hub & spoke */}
        <HubAndSpoke />

        {/* Three-pillar product */}
        <h3 className="mb-3 mt-12 text-xl font-bold text-[#174133]">The three-pillar product</h3>
        <p className="mb-2 max-w-3xl leading-relaxed text-[#2B2B2B]/70">
          The client dashboard expresses &ldquo;currency&rdquo; in two senses across three pillars:
        </p>
        <ThreePillars />

        {/* Open-source foundation */}
        <h3 className="mb-3 mt-12 text-xl font-bold text-[#174133]">
          Built on an open-source foundation
        </h3>
        <div className="grid gap-8 md:grid-cols-[1.1fr_1fr] md:items-center">
          <p className="max-w-3xl leading-relaxed text-[#2B2B2B]/70">
            The IAI-OS is assembled on the{" "}
            <strong className="font-semibold text-[#174133]">KWAAI / pAI-OS</strong> open-source stack
            (the pAI-OS shell, KwaaiNet decentralised inference, W3C Solid data sovereignty, IEEE P7012
            value-alignment, and confidential-RAG privacy research) with a Swiss-Vault / iBridge
            reference deployment — so Influunt builds on a proven substrate rather than a sovereign AI
            from zero.
          </p>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            variants={fadeUp}
            className="rounded-2xl border border-[#174133]/10 bg-[#F8F7F4] p-6 shadow-[0_1px_2px_rgba(17,65,51,0.04)]"
          >
            <div className="mb-4 flex items-center gap-2.5">
              <Layers className="h-4 w-4 text-[#C8964F]" strokeWidth={2.25} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#174133]/65">
                Proven substrate · not from zero
              </span>
            </div>
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {foundation.map((item) => (
                <Bullet key={item}>
                  <span className="text-sm">{item}</span>
                </Bullet>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
