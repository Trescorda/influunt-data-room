"use client";

import { motion } from "framer-motion";
import {
  Smartphone,
  BrainCircuit,
  Compass,
  Store,
  BookOpen,
  Coins,
  Landmark,
  ShieldCheck,
  Server,
  ShieldHalf,
  Layers,
  CircleDollarSign,
  ArrowLeftRight,
} from "lucide-react";

type Posture = "Build / own" | "Buy" | "Buy & own" | "Buy / own" | "Integrate";

interface LayerRow {
  layer: string;
  component: string;
  posture: Posture;
  Icon: typeof Smartphone;
}

const LAYERS: LayerRow[] = [
  {
    layer: "Client experience",
    component: 'The "Wealth for Life CEO" app',
    posture: "Build / own",
    Icon: Smartphone,
  },
  {
    layer: "AI intelligence",
    component: "Agentic AI + AssetNeo, on the KWAAI / pAI-OS open-source base",
    posture: "Build / own",
    Icon: BrainCircuit,
  },
  {
    layer: "Advice & onboarding",
    component: "WealthObjects (optional)",
    posture: "Buy",
    Icon: Compass,
  },
  {
    layer: "Investment marketplace",
    component: "DigiShares — Founder-to-Funder suite (source-code owned)",
    posture: "Buy & own",
    Icon: Store,
  },
  {
    layer: "Book of record",
    component: "FundCount (also RAIF administrator)",
    posture: "Buy",
    Icon: BookOpen,
  },
  {
    layer: "Issuance & tokens",
    component: "Avalanche ERC-3643 + Zoniqx",
    posture: "Build / own",
    Icon: Coins,
  },
  {
    layer: "Monetary core",
    component: "ICC · POA · two-basket reserve",
    posture: "Build / own",
    Icon: Landmark,
  },
  {
    layer: "Settlement & custody",
    component: "XRPL / RLUSD · x402 · Utila / Anchorage Digital",
    posture: "Integrate",
    Icon: ShieldCheck,
  },
  {
    layer: "Compute & energy",
    component: "Swiss Vault · iBridge · KwaaiNet · Bloom Energy",
    posture: "Integrate",
    Icon: Server,
  },
];

const POSTURE_STYLES: Record<
  string,
  { dot: string; chip: string; label: string }
> = {
  build: {
    dot: "bg-[#C8964F]",
    chip: "bg-[#C8964F]/12 text-[#9A6B27] border-[#C8964F]/30",
    label: "Build / own",
  },
  buy: {
    dot: "bg-[#174133]",
    chip: "bg-[#174133]/8 text-[#174133] border-[#174133]/20",
    label: "Buy",
  },
  integrate: {
    dot: "bg-slate-400",
    chip: "bg-slate-500/8 text-slate-600 border-slate-400/30",
    label: "Integrate",
  },
};

function postureKey(p: Posture): "build" | "buy" | "integrate" {
  if (p === "Integrate") return "integrate";
  if (p.includes("own")) return "build";
  return "buy";
}

function StackBand({ row, index }: { row: LayerRow; index: number }) {
  const key = postureKey(row.posture);
  const style = POSTURE_STYLES[key];
  const { Icon } = row;
  return (
    <motion.div
      initial={{ opacity: 0, x: -14 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: "easeOut" }}
      className="group relative flex items-center gap-4 rounded-xl border border-[#174133]/10 bg-white px-4 py-3.5 shadow-sm transition-shadow hover:shadow-md md:gap-5 md:px-5"
    >
      <span
        className={`absolute left-0 top-2 bottom-2 w-1 rounded-full ${style.dot}`}
        aria-hidden
      />
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#174133]/5 text-[#174133]">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-bold text-[#174133] md:text-[0.95rem]">
          {row.layer}
        </div>
        <div className="truncate text-xs text-[#2B2B2B]/65 md:text-sm">
          {row.component}
        </div>
      </div>
      <span
        className={`hidden shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wide sm:inline-flex ${style.chip}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} aria-hidden />
        {style.label}
      </span>
    </motion.div>
  );
}

function PostureLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      {(["build", "buy", "integrate"] as const).map((k) => (
        <span
          key={k}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#2B2B2B]/70"
        >
          <span
            className={`h-2.5 w-2.5 rounded-full ${POSTURE_STYLES[k].dot}`}
            aria-hidden
          />
          {POSTURE_STYLES[k].label}
        </span>
      ))}
    </div>
  );
}

interface TripleNode {
  Icon: typeof CircleDollarSign;
  name: string;
  role: string;
}

const TRIPLE: TripleNode[] = [
  {
    Icon: CircleDollarSign,
    name: "ICC token",
    role: "Store of value & collateral",
  },
  {
    Icon: Landmark,
    name: "Tokenised treasury",
    role: "Liquidity engine",
  },
  {
    Icon: ArrowLeftRight,
    name: "Trade desk",
    role: "Instant primary buy/sell & margin capture",
  },
];

function TokenTreasuryTrade() {
  return (
    <div className="rounded-2xl border border-[#174133]/10 bg-white p-6 shadow-sm md:p-7">
      <div className="mb-1 flex items-center gap-2 text-[#C8964F]">
        <Layers className="h-4 w-4" strokeWidth={2} />
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.2em]">
          Monetary core
        </span>
      </div>
      <h4 className="mb-5 text-lg font-bold text-[#174133]">
        Token · Treasury · Trade
      </h4>

      <div className="relative grid gap-3">
        {/* connecting reinforcing spine */}
        <span
          className="pointer-events-none absolute left-[27px] top-6 bottom-6 w-px bg-gradient-to-b from-[#C8964F]/40 via-[#174133]/25 to-[#C8964F]/40"
          aria-hidden
        />
        {TRIPLE.map((node, i) => {
          const { Icon } = node;
          return (
            <motion.div
              key={node.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
              className="relative z-10 flex items-center gap-4 rounded-xl border border-[#174133]/10 bg-[#F8F7F4] px-4 py-3"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#174133] text-[#D6B075]">
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.9} />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-[#174133]">
                  {node.name}
                </div>
                <div className="text-xs text-[#2B2B2B]/65">{node.role}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-5 flex items-start gap-2.5 rounded-lg bg-[#174133]/[0.04] px-3.5 py-3">
        <ShieldHalf
          className="mt-0.5 h-4 w-4 shrink-0 text-[#C8964F]"
          strokeWidth={2}
        />
        <p className="text-xs leading-relaxed text-[#2B2B2B]/70">
          Three reinforcing economic layers, supervised by the agentic
          AI&rsquo;s faculty and governed by smart contracts.
        </p>
      </div>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C8964F]" aria-hidden />
      <span className="text-[#2B2B2B]/75 leading-relaxed">{children}</span>
    </li>
  );
}

export default function SectionArchitecture() {
  return (
    <section className="bg-[#F8F7F4] py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="max-w-3xl mb-12 md:mb-14">
          <div className="text-[#C8964F] text-xs tracking-[0.3em] uppercase font-semibold mb-4">
            02 — Architecture
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-[#174133] leading-tight">
            The IAI-OS — built, owned, integrated
          </h2>
        </div>

        {/* Intro prose */}
        <div className="max-w-3xl">
          <h3 className="text-xl font-bold text-[#174133] mb-3">
            Architecture overview
          </h3>
          <p className="text-lg md:text-xl text-[#2B2B2B]/80 leading-relaxed">
            Influunt runs on the{" "}
            <strong className="font-semibold text-[#174133]">IAI-OS</strong>{" "}
            (Influunt Agentic AI Operating System): a layered architecture in
            which each layer carries an explicit build, buy, own, or integrate
            decision. The differentiated layers are built and owned by Influunt;
            the non-differentiated plumbing is bought or integrated from
            best-in-class partners.
          </p>
        </div>

        {/* Main infographic grid */}
        <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-[1.55fr_1fr] lg:gap-8">
          {/* Vertical layered stack */}
          <div className="rounded-2xl border border-[#174133]/10 bg-white/60 p-5 shadow-sm md:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-[#174133]">
                <Layers className="h-5 w-5 text-[#C8964F]" strokeWidth={2} />
                <span className="text-sm font-bold uppercase tracking-wide">
                  The IAI-OS stack
                </span>
              </div>
              <PostureLegend />
            </div>
            <div className="grid gap-2.5">
              {LAYERS.map((row, i) => (
                <StackBand key={row.layer} row={row} index={i} />
              ))}
            </div>
          </div>

          {/* Token–Treasury–Trade side panel */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <TokenTreasuryTrade />
          </div>
        </div>

        {/* Doctrine prose */}
        <div className="mt-12 grid gap-8 md:mt-14 md:grid-cols-2 md:gap-10">
          <div>
            <h3 className="text-xl font-bold text-[#174133] mb-3">
              The sovereignty doctrine
            </h3>
            <p className="text-[#2B2B2B]/70 leading-relaxed">
              Sovereignty is governance, ownership of orchestration, control and
              substitutability &mdash; not ownership of every component. Whatever
              is bought or integrated, Influunt owns the{" "}
              <strong className="font-semibold text-[#174133]">
                brand, orchestration, token and IP
              </strong>
              . Compliance and governance span every layer.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#174133] mb-3">
              Hybrid compute
            </h3>
            <p className="text-[#2B2B2B]/70 leading-relaxed">
              Responsive client experiences run on low-latency{" "}
              <strong className="font-semibold text-[#174133]">(Web2)</strong>{" "}
              infrastructure; training, settlement, economic activity and data
              sovereignty run on decentralised{" "}
              <strong className="font-semibold text-[#174133]">(Web3)</strong>{" "}
              infrastructure. The two are bridged by Influunt&rsquo;s
              orchestration, so the client sees one seamless product while the
              system retains sovereign control of its data and money.
            </p>
          </div>
        </div>

        {/* Token–Treasury–Trade prose */}
        <div className="mt-10 max-w-3xl">
          <h3 className="text-xl font-bold text-[#174133] mb-3">
            Token&ndash;Treasury&ndash;Trade
          </h3>
          <p className="text-[#2B2B2B]/70 leading-relaxed mb-4">
            The monetary core is organised as three reinforcing economic layers,
            supervised by the agentic AI&rsquo;s faculty and governed by smart
            contracts:
          </p>
          <ul className="space-y-2.5">
            <Bullet>
              the{" "}
              <strong className="font-semibold text-[#174133]">
                ICC token
              </strong>{" "}
              (store of value and collateral),
            </Bullet>
            <Bullet>
              the{" "}
              <strong className="font-semibold text-[#174133]">
                tokenised treasury
              </strong>{" "}
              (liquidity engine), and
            </Bullet>
            <Bullet>
              the{" "}
              <strong className="font-semibold text-[#174133]">
                trade desk
              </strong>{" "}
              (instant primary buy/sell and margin capture).
            </Bullet>
          </ul>
        </div>
      </div>
    </section>
  );
}
