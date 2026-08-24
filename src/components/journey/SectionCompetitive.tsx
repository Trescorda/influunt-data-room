"use client";

import { motion } from "framer-motion";
import {
  Check,
  X,
  Minus,
  Layers,
  Pickaxe,
  Coins,
  BrainCircuit,
  ShieldCheck,
  ArrowDown,
  Sparkles,
  Lock,
} from "lucide-react";

/* ─────────────────────────  Comparison matrix data  ───────────────────────── */

type Cell = { state: "yes" | "no" | "partial"; note?: string };

type MatrixRow = {
  capability: string;
  cells: [Cell, Cell, Cell, Cell]; // Bitpanda, Xapo Bank, Nexo, Influunt
};

const COLUMNS = ["Bitpanda", "Xapo Bank", "Nexo", "Influunt"] as const;

const MATRIX: MatrixRow[] = [
  {
    capability: "Regulated digital-asset banking",
    cells: [
      { state: "partial" },
      { state: "yes" },
      { state: "partial" },
      { state: "yes" },
    ],
  },
  {
    capability: "Diversified metal-backed token",
    cells: [
      { state: "no" },
      { state: "no" },
      { state: "no" },
      { state: "yes", note: "ICC" },
    ],
  },
  {
    capability: "AI-native, per-client agent",
    cells: [
      { state: "no" },
      { state: "no" },
      { state: "no" },
      { state: "yes", note: "Agentic AI" },
    ],
  },
  {
    capability: "Sovereign owned infrastructure",
    cells: [
      { state: "no" },
      { state: "no" },
      { state: "no" },
      { state: "yes" },
    ],
  },
];

/* ─────────────────────────  Moat stack data  ───────────────────────── */

type MoatLayer = {
  stage: string;
  label: string;
  detail: string;
  Icon: typeof Layers;
};

const MOAT: MoatLayer[] = [
  {
    stage: "Token",
    label: "ICC / POA",
    detail: "Diversified metal-backed token",
    Icon: Coins,
  },
  {
    stage: "Intelligence",
    label: "Agentic AI / AssetNeo",
    detail: "AI-native orchestration",
    Icon: BrainCircuit,
  },
  {
    stage: "Compliance",
    label: "Five-jurisdiction perimeter",
    detail: "Compliance-gated, owned IP",
    Icon: ShieldCheck,
  },
];

/* ─────────────────────────  Cell renderer  ───────────────────────── */

function MatrixCell({ cell, emphasised }: { cell: Cell; emphasised: boolean }) {
  if (cell.state === "yes") {
    return (
      <div className="flex flex-col items-center justify-center gap-1">
        <span
          className={
            emphasised
              ? "flex h-7 w-7 items-center justify-center rounded-full bg-[#C8964F] text-white shadow-[0_4px_12px_-3px_rgba(200,150,79,0.6)]"
              : "flex h-7 w-7 items-center justify-center rounded-full bg-[#C8964F]/12 text-[#C8964F]"
          }
        >
          <Check className="h-4 w-4" strokeWidth={2.6} />
        </span>
        {cell.note && (
          <span
            className={
              emphasised
                ? "text-[10.5px] font-semibold leading-none text-[#174133]"
                : "text-[10.5px] font-semibold leading-none text-[#2B2B2B]/50"
            }
          >
            {cell.note}
          </span>
        )}
      </div>
    );
  }

  if (cell.state === "partial") {
    return (
      <div className="flex flex-col items-center justify-center gap-1">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#174133]/[0.06] text-[#174133]/55">
          <Minus className="h-4 w-4" strokeWidth={2.4} />
        </span>
        <span className="text-[10.5px] font-medium leading-none text-[#2B2B2B]/45">
          Partial
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2B2B2B]/[0.04] text-[#2B2B2B]/30">
        <X className="h-4 w-4" strokeWidth={2.2} />
      </span>
    </div>
  );
}

export default function SectionCompetitive() {
  return (
    <section className="bg-[#F8F7F4] py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="max-w-3xl mb-12 md:mb-14">
          <div className="text-[#C8964F] text-xs tracking-[0.3em] uppercase font-semibold mb-4">
            08 — Competitive Positioning
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-[#174133] leading-tight">
            Where Influunt stands apart
          </h2>
        </div>

        {/* Lead */}
        <p className="text-lg md:text-xl text-[#2B2B2B]/80 leading-relaxed max-w-3xl">
          Influunt's benchmarks each occupy one slice of the stack; none combine
          all four of Influunt's differentiators —{" "}
          <strong className="font-semibold text-[#174133]">
            AI-native orchestration
          </strong>
          ,{" "}
          <strong className="font-semibold text-[#174133]">
            diversified-metal-backed token
          </strong>
          ,{" "}
          <strong className="font-semibold text-[#174133]">
            sovereign infrastructure
          </strong>
          , and{" "}
          <strong className="font-semibold text-[#174133]">
            proprietary gold supply
          </strong>
          .
        </p>

        {/* ─────────────  INFOGRAPHIC: comparison matrix  ───────────── */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
          className="mt-10 md:mt-12 overflow-hidden rounded-2xl border border-[#174133]/10 bg-white shadow-[0_18px_44px_-26px_rgba(17,65,51,0.35)]"
        >
          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              {/* Header row */}
              <div className="grid grid-cols-[minmax(220px,1.6fr)_repeat(4,minmax(96px,1fr))] items-stretch">
                <div className="flex items-center bg-[#174133] px-5 py-4 md:px-6">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
                    Capability
                  </span>
                </div>
                {COLUMNS.map((col) => {
                  const isInfluunt = col === "Influunt";
                  return (
                    <div
                      key={col}
                      className={
                        isInfluunt
                          ? "relative flex flex-col items-center justify-center gap-0.5 bg-[#174133] px-3 py-4 text-center"
                          : "flex flex-col items-center justify-center bg-[#174133] px-3 py-4 text-center"
                      }
                    >
                      {isInfluunt && (
                        <span className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-[#D6B075] to-transparent" />
                      )}
                      <span
                        className={
                          isInfluunt
                            ? "text-[13px] font-bold tracking-wide text-[#D6B075]"
                            : "text-[12px] font-semibold tracking-wide text-white/70"
                        }
                      >
                        {col}
                      </span>
                      {isInfluunt && (
                        <span className="mt-0.5 inline-flex items-center gap-1 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-white/55">
                          <Sparkles className="h-2.5 w-2.5" strokeWidth={2.2} />
                          Full stack
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Body rows */}
              {MATRIX.map((row, ri) => (
                <div
                  key={row.capability}
                  className={
                    "grid grid-cols-[minmax(220px,1.6fr)_repeat(4,minmax(96px,1fr))] items-stretch border-t border-[#174133]/8 " +
                    (ri % 2 === 1 ? "bg-[#F8F7F4]/60" : "bg-white")
                  }
                >
                  <div className="flex items-center px-5 py-4 md:px-6">
                    <span className="text-[13.5px] font-semibold leading-snug text-[#174133]">
                      {row.capability}
                    </span>
                  </div>
                  {row.cells.map((cell, ci) => {
                    const isInfluunt = ci === 3;
                    return (
                      <div
                        key={ci}
                        className={
                          isInfluunt
                            ? "flex items-center justify-center px-3 py-4 bg-[#C8964F]/[0.06] border-x border-[#C8964F]/15"
                            : "flex items-center justify-center px-3 py-4"
                        }
                      >
                        <MatrixCell cell={cell} emphasised={isInfluunt} />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[#174133]/8 bg-[#F8F7F4] px-5 py-3.5 md:px-6">
            <span className="inline-flex items-center gap-2 text-[12px] text-[#2B2B2B]/65">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C8964F] text-white">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              Delivered
            </span>
            <span className="inline-flex items-center gap-2 text-[12px] text-[#2B2B2B]/65">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#174133]/[0.06] text-[#174133]/55">
                <Minus className="h-3 w-3" strokeWidth={2.8} />
              </span>
              Partial
            </span>
            <span className="inline-flex items-center gap-2 text-[12px] text-[#2B2B2B]/65">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2B2B2B]/[0.05] text-[#2B2B2B]/35">
                <X className="h-3 w-3" strokeWidth={2.6} />
              </span>
              Not offered
            </span>
          </div>
        </motion.div>

        {/* ─────────────  Decentralised-AI field  ───────────── */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="lg:col-span-7">
            <h3 className="text-xl font-bold text-[#174133] mt-0 mb-3">
              Against the decentralised-AI field
            </h3>
            <p className="text-[#2B2B2B]/70 leading-relaxed">
              Set against agent-marketplace projects such as{" "}
              <strong className="font-semibold text-[#174133]">Shiza</strong> or
              compute networks such as{" "}
              <strong className="font-semibold text-[#174133]">Bittensor</strong>
              , Influunt's edge is the opposite of permissionless: it is{" "}
              <strong className="font-semibold text-[#174133]">
                regulated, gold-backed and compliance-gated
              </strong>
              . Those projects can supply vocabulary and substitutable compute,
              but none carry a regulated monetary system or a multi-jurisdiction
              compliance perimeter.
            </p>
          </div>

          {/* Contrast pills */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-1">
              <div className="rounded-xl border border-[#174133]/10 bg-white p-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2B2B2B]/45">
                  Decentralised-AI field
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["Permissionless", "Substitutable compute", "Vocabulary"].map(
                    (t) => (
                      <span
                        key={t}
                        className="inline-flex items-center rounded-full border border-[#2B2B2B]/12 bg-[#2B2B2B]/[0.03] px-2.5 py-1 text-[11.5px] font-medium text-[#2B2B2B]/55"
                      >
                        {t}
                      </span>
                    ),
                  )}
                </div>
              </div>
              <div className="rounded-xl border border-[#C8964F]/30 bg-gradient-to-br from-white to-[#D6B075]/[0.06] p-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#C8964F]">
                  Influunt
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["Regulated", "Gold-backed", "Compliance-gated"].map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 rounded-full border border-[#C8964F]/30 bg-[#C8964F]/10 px-2.5 py-1 text-[11.5px] font-semibold text-[#174133]"
                    >
                      <Check className="h-3 w-3 text-[#C8964F]" strokeWidth={3} />
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────  INFOGRAPHIC: vertical-integration moat stack  ───────────── */}
        <div className="mt-16">
          <div className="flex items-center gap-2.5 mb-2">
            <Lock className="h-5 w-5 text-[#C8964F]" strokeWidth={1.9} />
            <h3 className="text-xl font-bold text-[#174133] mt-0 mb-0">
              The moat — vertical integration
            </h3>
          </div>
          <p className="text-[#2B2B2B]/70 leading-relaxed max-w-3xl">
            Supply → token → intelligence → compliance, combined with owned IP
            and the five-jurisdiction regulatory perimeter.{" "}
            <strong className="font-semibold text-[#174133]">
              Margin compounds to Influunt's own balance sheet
            </strong>{" "}
            rather than leaking to third-party vendors.
          </p>

          <div className="mt-8 mx-auto max-w-2xl">
            {MOAT.map((layer, i) => (
              <div key={layer.label}>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-[#174133]/10 bg-white px-5 py-4 shadow-[0_1px_2px_rgba(17,65,51,0.04)] hover:border-[#C8964F]/40 hover:shadow-[0_12px_30px_-16px_rgba(17,65,51,0.28)] transition-all duration-300"
                  style={{
                    // subtle widening / deepening band as the stack descends
                    marginLeft: `${i * 14}px`,
                    marginRight: `${i * 14}px`,
                  }}
                >
                  <span className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#C8964F] to-[#D6B075]" />
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#174133]/[0.06] text-[#174133] group-hover:bg-[#174133] group-hover:text-white transition-colors duration-300">
                    <layer.Icon className="h-[22px] w-[22px]" strokeWidth={1.7} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[#C8964F]">
                        {layer.stage}
                      </span>
                      <span className="text-base font-bold text-[#174133]">
                        {layer.label}
                      </span>
                    </div>
                    <div className="mt-0.5 text-[12.5px] text-[#2B2B2B]/60">
                      {layer.detail}
                    </div>
                  </div>
                  <span className="hidden sm:flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#C8964F]/10 text-[12px] font-bold text-[#C8964F]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </motion.div>

                {i < MOAT.length - 1 && (
                  <div
                    className="flex justify-center py-1.5"
                    style={{ marginLeft: `${i * 14}px`, marginRight: `${i * 14}px` }}
                  >
                    <ArrowDown
                      className="h-4 w-4 text-[#C8964F]/50"
                      strokeWidth={2}
                    />
                  </div>
                )}
              </div>
            ))}

            {/* Outcome footer */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: MOAT.length * 0.1 }}
              className="mt-5 flex items-center gap-3 rounded-2xl border border-[#174133]/15 bg-[#174133] px-5 py-4 text-white shadow-[0_18px_40px_-22px_rgba(17,65,51,0.6)]"
              style={{
                marginLeft: `${MOAT.length * 14}px`,
                marginRight: `${MOAT.length * 14}px`,
              }}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C8964F]/20 text-[#D6B075]">
                <Layers className="h-5 w-5" strokeWidth={1.9} />
              </div>
              <p className="text-[13.5px] leading-snug text-white/85">
                <strong className="font-semibold text-white">
                  Owned IP, end to end.
                </strong>{" "}
                Margin compounds on Influunt's balance sheet — no leakage to
                third-party vendors.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
