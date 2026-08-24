"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Coins,
  Wrench,
  Lightbulb,
  Scale,
  Gauge,
  Layers,
  Percent,
  CircleDollarSign,
  Boxes,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────
// Data — every figure/label is sourced from the section content. No invention.
// ─────────────────────────────────────────────────────────────────────────

type Segment = {
  label: string;
  share: number;
  function: string;
  color: string;
  Icon: typeof ShieldCheck;
};

const POA_WATERFALL: Segment[] = [
  {
    label: "Strategic Metal Reserve",
    share: 40,
    function: "Grows the diversified reserve; raises the floor under every ICC",
    color: "#174133",
    Icon: ShieldCheck,
  },
  {
    label: "Perpetual Yield Pool",
    share: 35,
    function: "Quarterly distribution to ICC holders, pro rata",
    color: "#C8964F",
    Icon: Coins,
  },
  {
    label: "Operations",
    share: 15,
    function: "Protocol operating costs — compute, audit, custody, compliance",
    color: "#D6B075",
    Icon: Wrench,
  },
  {
    label: "Innovation",
    share: 10,
    function: "New deal sourcing, technology, partner expansion",
    color: "#9AB0A4",
    Icon: Lightbulb,
  },
];

const ICC_FACTS: { label: string; value: string; Icon: typeof Scale }[] = [
  { label: "Regulatory class", value: "MiCA ART (Title III)", Icon: Scale },
  { label: "Hard supply cap", value: "25,000,000 tokens", Icon: Gauge },
  { label: "Reserve model", value: "Diversified metal reserve", Icon: Layers },
  { label: "Headline POA", value: "2.5% precious metals", Icon: Percent },
];

// ─────────────────────────────────────────────────────────────────────────
// Donut — POA waterfall as a stroke-dasharray ring.
// ─────────────────────────────────────────────────────────────────────────

function PoaDonut() {
  const R = 70;
  const CX = 100;
  const CY = 100;
  const C = 2 * Math.PI * R; // circumference
  const GAP = 1.4; // visual gap between segments, in percent

  let cursor = 0;

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" role="img" aria-label="POA revenue waterfall donut">
      {/* track */}
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="#174133" strokeOpacity={0.06} strokeWidth={26} />
      {POA_WATERFALL.map((seg) => {
        const len = (seg.share / 100) * C;
        const gap = (GAP / 100) * C;
        const dash = `${Math.max(len - gap, 0)} ${C - Math.max(len - gap, 0)}`;
        // rotate so the arc starts where the previous left off; -90 puts 0% at 12 o'clock
        const rotation = (cursor / 100) * 360 - 90;
        cursor += seg.share;
        return (
          <motion.circle
            key={seg.label}
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke={seg.color}
            strokeWidth={26}
            strokeLinecap="butt"
            strokeDasharray={dash}
            transform={`rotate(${rotation} ${CX} ${CY})`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          />
        );
      })}
      {/* center label */}
      <text x={CX} y={CY - 6} textAnchor="middle" className="fill-[#174133]" style={{ fontSize: 17, fontWeight: 700 }}>
        POA
      </text>
      <text x={CX} y={CY + 13} textAnchor="middle" className="fill-[#2B2B2B]" style={{ fontSize: 8.5, opacity: 0.6, letterSpacing: 0.5 }}>
        REVENUE SPLIT
      </text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────

export default function SectionMonetary() {
  return (
    <section className="bg-[#F8F7F4] py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="max-w-3xl mb-12 md:mb-14">
          <div className="text-[#C8964F] text-xs tracking-[0.3em] uppercase font-semibold mb-4">
            04 — Monetary System
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-[#174133] leading-tight">
            AssetNeo &amp; the monetary system
          </h2>
        </div>

        {/* ── ICC intro + fact strip ─────────────────────────────────── */}
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-start">
          <div>
            <h3 className="text-xl font-bold text-[#174133] mt-0 mb-3">
              ICC — the Influunt Commodity Coin
            </h3>
            <p className="text-lg md:text-xl text-[#2B2B2B]/80 leading-relaxed">
              ICC is a{" "}
              <strong className="font-semibold text-[#174133]">
                MiCA Asset-Referenced Token (Title III)
              </strong>{" "}
              — never described as a stablecoin. It is capped at{" "}
              <strong className="font-semibold text-[#174133]">25,000,000 tokens</strong> and is
              anchored by a{" "}
              <strong className="font-semibold text-[#174133]">diversified metal-value reserve</strong>:
              a gold floor plus silver, platinum-group metals, rare earths and technology metals,
              compounding through programmatic trade margin.
            </p>
            <p className="text-[#2B2B2B]/70 leading-relaxed mt-4">
              Earlier &ldquo;1 ICC = 1g gold&rdquo; descriptions are superseded by this
              diversified-reserve model.
            </p>
          </div>

          {/* ICC fact strip */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-[#174133]/10 bg-white shadow-[0_1px_30px_-12px_rgba(23,65,51,0.18)] overflow-hidden"
          >
            <div className="flex items-center gap-2 bg-[#174133] px-5 py-3.5">
              <CircleDollarSign className="w-4 h-4 text-[#D6B075]" />
              <span className="text-white text-[11px] tracking-[0.22em] uppercase font-semibold">
                ICC at a glance
              </span>
            </div>
            <div className="grid grid-cols-2 divide-x divide-y divide-[#174133]/8">
              {ICC_FACTS.map((f) => (
                <div key={f.label} className="p-5 flex flex-col gap-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#C8964F]/10 text-[#C8964F]">
                    <f.Icon className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] tracking-[0.18em] uppercase text-[#2B2B2B]/45 font-semibold">
                    {f.label}
                  </span>
                  <span className="text-[15px] font-bold text-[#174133] leading-snug">
                    {f.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── POA explainer ──────────────────────────────────────────── */}
        <h3 className="text-xl font-bold text-[#174133] mt-14 mb-3">
          POA — Programmatic Offtake Allocation
        </h3>
        <p className="text-[#2B2B2B]/70 leading-relaxed max-w-3xl">
          Every commodity tokenised through Influunt carries a smart-contract-encoded{" "}
          <strong className="font-semibold text-[#174133]">POA</strong>: a fixed margin (headline
          2.5% for precious metals, calibrated per commodity class) captured at the point of trade,
          regardless of market price. POA is collected at the settlement layer — not as a
          fee-on-transfer on the ERC-3643 token — so institutional exchange integration is preserved.
        </p>

        {/* ── POA waterfall infographic: donut + segment cards ───────── */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
          className="mt-8 rounded-2xl border border-[#174133]/10 bg-white shadow-[0_1px_40px_-16px_rgba(23,65,51,0.22)] p-6 md:p-9"
        >
          <div className="flex items-center gap-2 mb-7">
            <div className="h-px w-8 bg-[#C8964F]" />
            <span className="text-[11px] tracking-[0.22em] uppercase font-semibold text-[#174133]/60">
              POA revenue waterfall
            </span>
          </div>

          <div className="grid md:grid-cols-[200px_1fr] gap-8 md:gap-12 items-center">
            {/* Donut */}
            <div className="relative w-44 h-44 md:w-[200px] md:h-[200px] mx-auto">
              <PoaDonut />
            </div>

            {/* Segment legend cards */}
            <div className="grid sm:grid-cols-2 gap-3.5">
              {POA_WATERFALL.map((seg, i) => (
                <motion.div
                  key={seg.label}
                  initial={{ opacity: 0, x: 14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.08 * i }}
                  className="relative rounded-xl border border-[#174133]/10 bg-[#F8F7F4]/70 p-4 pl-5 overflow-hidden"
                >
                  <span
                    className="absolute left-0 top-0 bottom-0 w-1.5"
                    style={{ backgroundColor: seg.color }}
                  />
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                        style={{ backgroundColor: `${seg.color}1A`, color: seg.color }}
                      >
                        <seg.Icon className="w-4 h-4" />
                      </span>
                      <span className="font-bold text-[#174133] text-sm leading-tight">
                        {seg.label}
                      </span>
                    </div>
                    <span
                      className="text-2xl font-bold tabular-nums leading-none shrink-0"
                      style={{ color: seg.color }}
                    >
                      {seg.share}%
                    </span>
                  </div>
                  <p className="text-[12.5px] text-[#2B2B2B]/65 leading-relaxed mt-2.5">
                    {seg.function}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Two-basket monetary system ─────────────────────────────── */}
        <h3 className="text-xl font-bold text-[#174133] mt-14 mb-3">
          Two-basket monetary system
        </h3>
        <p className="text-[#2B2B2B]/70 leading-relaxed max-w-3xl mb-8">
          Basket 1 is the Strategic Metal Reserve (the floor); Basket 2 is the treasury yield engine.
          A Chainlink-fed, AI-supervised auto-rebalancer keeps the system self-balancing, and
          Chainlink Proof-of-Reserve verifies reserve holdings on-chain.
        </p>

        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-5 md:gap-4 items-stretch">
          {/* Basket 1 */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-[#174133]/15 bg-[#174133] text-white p-7 flex flex-col"
          >
            <div className="flex items-center gap-2 text-[#D6B075] text-[11px] tracking-[0.22em] uppercase font-semibold mb-4">
              <ShieldCheck className="w-4 h-4" /> Basket 1
            </div>
            <div className="text-xl font-bold leading-snug mb-2">Strategic Metal Reserve</div>
            <p className="text-white/65 text-sm leading-relaxed">
              The floor under every ICC — a diversified holding of physical metal that grows with
              every trade and is verified on-chain by Chainlink Proof-of-Reserve.
            </p>
          </motion.div>

          {/* Rebalancer connector */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex md:flex-col items-center justify-center gap-2 px-2"
          >
            <div className="hidden md:block w-px flex-1 bg-gradient-to-b from-transparent via-[#C8964F]/40 to-[#C8964F]/40" />
            <div className="flex flex-col items-center justify-center text-center rounded-full border border-[#C8964F]/30 bg-white shadow-sm w-28 h-28 md:w-32 md:h-32 shrink-0 pb-1.5">
              <Scale className="w-5 h-5 text-[#C8964F] mb-1" />
              <span className="text-[9.5px] tracking-[0.12em] uppercase font-semibold text-[#174133] leading-tight px-2">
                Auto-
                <br />
                rebalancer
              </span>
            </div>
            <div className="hidden md:block w-px flex-1 bg-gradient-to-t from-transparent via-[#C8964F]/40 to-[#C8964F]/40" />
          </motion.div>

          {/* Basket 2 */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-[#174133]/10 bg-white p-7 flex flex-col shadow-[0_1px_30px_-14px_rgba(23,65,51,0.2)]"
          >
            <div className="flex items-center gap-2 text-[#C8964F] text-[11px] tracking-[0.22em] uppercase font-semibold mb-4">
              <Coins className="w-4 h-4" /> Basket 2
            </div>
            <div className="text-xl font-bold leading-snug mb-2 text-[#174133]">
              Treasury Yield Engine
            </div>
            <p className="text-[#2B2B2B]/70 text-sm leading-relaxed">
              The working capital that compounds programmatic trade margin and funds the Perpetual
              Yield Pool&rsquo;s quarterly, pro-rata distribution to ICC holders.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-[#C8964F]">
              <Gauge className="w-4 h-4" /> Chainlink-fed, AI-supervised &amp; self-balancing
            </div>
          </motion.div>
        </div>

        {/* ── Issuance, settlement & marketplace ─────────────────────── */}
        <h3 className="text-xl font-bold text-[#174133] mt-14 mb-3">
          Issuance, settlement and marketplace
        </h3>
        <p className="text-[#2B2B2B]/70 leading-relaxed max-w-3xl mb-7">
          ICC issuance is sovereign on{" "}
          <strong className="font-semibold text-[#174133]">Avalanche (ERC-3643)</strong> with{" "}
          <strong className="font-semibold text-[#174133]">Zoniqx</strong> for the tokenisation
          lifecycle. Settlement runs on the{" "}
          <strong className="font-semibold text-[#174133]">XRP Ledger with RLUSD</strong> and agentic
          payments via the <strong className="font-semibold text-[#174133]">x402</strong> protocol.
          The client-facing Founder-to-Funder investment marketplace runs on{" "}
          <strong className="font-semibold text-[#174133]">DigiShares</strong> (source-code owned).
         
        </p>

        {/* Tech-stack pill rail */}
        <div className="flex flex-wrap gap-2.5">
          {[
            { k: "Issuance", v: "Avalanche · ERC-3643" },
            { k: "Tokenisation", v: "Zoniqx" },
            { k: "Settlement", v: "XRP Ledger · RLUSD" },
            { k: "Agentic payments", v: "x402 protocol" },
            { k: "Marketplace", v: "DigiShares" },
          ].map((p) => (
            <span
              key={p.k}
              className="inline-flex items-center gap-2 rounded-full border border-[#174133]/10 bg-white pl-2.5 pr-3.5 py-1.5 text-sm"
            >
              <span className="text-[10px] tracking-[0.14em] uppercase font-semibold text-[#C8964F] bg-[#C8964F]/10 rounded-full px-2 py-0.5">
                {p.k}
              </span>
              <span className="font-semibold text-[#174133]">{p.v}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
