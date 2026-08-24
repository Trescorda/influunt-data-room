"use client";

import { motion } from "framer-motion";
import {
  Server,
  Cpu,
  Network,
  Radio,
  BatteryCharging,
  Boxes,
  Leaf,
  Database,
  Building2,
  Recycle,
  Layers,
} from "lucide-react";

type Component = {
  name: string;
  role: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
};

const COMPUTE: Component[] = [
  {
    name: "Swiss Vault",
    role: "Data layer",
    desc: "Sovereign, geo-distributed data residency.",
    icon: Database,
  },
  {
    name: "iBridge",
    role: "Compute layer",
    desc: "GPU and storage for inference and training.",
    icon: Cpu,
  },
  {
    name: "KwaaiNet",
    role: "P2P inference",
    desc: "Decentralised, Byzantine-fault-tolerant, OpenAI-compatible — demand-first, contracted capacity.",
    icon: Network,
  },
  {
    name: "365 Mesh",
    role: "Connectivity",
    desc: "IoT and connectivity infrastructure.",
    icon: Radio,
  },
];

const ENERGY: Component[] = [
  {
    name: "Bloom Energy",
    role: "Microgrid",
    desc: "Behind-the-meter solid-oxide fuel-cell microgrids for sovereign, resilient power.",
    icon: BatteryCharging,
  },
  {
    name: "Vertiv / Kais-AIR",
    role: "Modular DC",
    desc: "Modular data-centre infrastructure.",
    icon: Boxes,
  },
  {
    name: "NABERS",
    role: "Performance",
    desc: "High environmental-performance ratings as a real procurement and emissions standard.",
    icon: Leaf,
  },
];

const SITES: { name: string; tag: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { name: "Distributed data-centre sites", tag: "Compute", icon: Server },
  { name: "Banking & operations sites", tag: "Operate", icon: Building2 },
];

function StackColumn({
  label,
  accent,
  items,
  Glyph,
}: {
  label: string;
  accent: string;
  items: Component[];
  Glyph: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="relative">
      <div className="flex items-center gap-3 mb-5">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: accent }}
        >
          <Glyph className="h-5 w-5 text-white" />
        </div>
        <div className="text-sm font-bold uppercase tracking-[0.18em] text-[#174133]">
          {label}
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-[#C8964F]/50 to-transparent" />
      </div>

      <div className="space-y-3">
        {items.map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="group relative overflow-hidden rounded-xl border border-[#174133]/10 bg-white p-4 shadow-[0_1px_2px_rgba(17,17,17,0.04)] transition-shadow hover:shadow-[0_8px_24px_rgba(23,65,51,0.08)]"
            >
              <span
                className="absolute inset-y-0 left-0 w-1"
                style={{ backgroundColor: accent }}
                aria-hidden="true"
              />
              <div className="flex items-start gap-3.5 pl-2">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#174133]/10 bg-[#F8F7F4]">
                  <Icon className="h-[18px] w-[18px] text-[#174133]" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-[#174133]">{c.name}</span>
                    <span className="rounded-full bg-[#C8964F]/12 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#B8853D]">
                      {c.role}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-[#2B2B2B]/70">
                    {c.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default function SectionInfrastructure() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="max-w-3xl mb-12 md:mb-14">
          <div className="text-[#C8964F] text-xs tracking-[0.3em] uppercase font-semibold mb-4">
            05 — Infrastructure
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-[#174133] leading-tight">
            Phygital infrastructure &amp; compute
          </h2>
        </div>

        {/* Lead + site triad */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14 lg:items-start">
          <div>
            <p className="text-lg md:text-xl text-[#2B2B2B]/80 leading-relaxed">
              Influunt&apos;s{" "}
              <strong className="font-semibold text-[#174133]">&quot;phygital&quot;</strong>{" "}
              thesis is that the intangible monetary layer runs on physical
              infrastructure that is itself part of the value proposition — not a
              commodity input.
            </p>
            <p className="mt-4 text-[#2B2B2B]/70 leading-relaxed">
              The footprint spans three site categories across the five
              jurisdictions:
            </p>
          </div>

          {/* Site triad */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {SITES.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex flex-col rounded-2xl border border-[#174133]/10 bg-[#F8F7F4] p-4 text-center shadow-[0_1px_2px_rgba(17,17,17,0.04)] sm:p-5"
                >
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#174133]">
                    <Icon className="h-6 w-6 text-[#D6B075]" />
                  </div>
                  <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C8964F]">
                    {s.tag}
                  </div>
                  <div className="text-[13px] font-bold leading-snug text-[#174133] sm:text-sm">
                    {s.name}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* COMPUTE vs ENERGY stack */}
        <div className="mt-14 rounded-2xl border border-[#174133]/10 bg-[#F8F7F4] p-6 shadow-[0_2px_8px_rgba(17,17,17,0.03)] md:mt-16 md:p-10">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Layers className="h-5 w-5 text-[#C8964F]" />
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#174133]">
                The phygital stack
              </span>
            </div>
            <div className="h-px flex-1 bg-[#174133]/10" />
            <span className="text-xs font-medium text-[#2B2B2B]/55">
              Owned compute · owned energy
            </span>
          </div>

          <div className="grid gap-8 md:grid-cols-2 md:gap-10">
            <StackColumn
              label="Compute"
              accent="#174133"
              items={COMPUTE}
              Glyph={Cpu}
            />
            <StackColumn
              label="Energy"
              accent="#C8964F"
              items={ENERGY}
              Glyph={BatteryCharging}
            />
          </div>
        </div>

        {/* Compute as a commodity */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-12">
          <div>
            <h3 className="text-xl font-bold text-[#174133] mt-0 mb-3">
              Compute as a commodity
            </h3>
            <p className="text-[#2B2B2B]/70 leading-relaxed">
              Owned compute and energy convert operating margin into{" "}
              <strong className="font-semibold text-[#174133]">
                balance-sheet assets
              </strong>
              , and are themselves linked to the POA and two-basket system — so
              infrastructure ownership compounds enterprise value rather than
              leaking it to third parties.
            </p>
            <p className="mt-4 text-[#2B2B2B]/70 leading-relaxed">
              The distributed node network is also the answer to the consumer-node{" "}
              <strong className="font-semibold text-[#174133]">
                &quot;graveyard&quot; problem
              </strong>{" "}
              in decentralised infrastructure: every client&apos;s sovereign
              financial-and-wellbeing data is genuine, contracted, demand-first
              usage, with{" "}
              <strong className="font-semibold text-[#174133]">
                Influunt as the anchor tenant
              </strong>
              .
            </p>
          </div>

          {/* Flow chip: margin -> assets */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center gap-3 rounded-2xl border border-[#174133]/10 bg-gradient-to-br from-[#174133] to-[#0e2a22] p-6 text-white"
          >
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#D6B075]">
              Value compounding
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="rounded-lg bg-white/10 px-3 py-2 font-medium">
                Operating margin
              </span>
              <svg
                className="h-4 w-6 shrink-0 text-[#C8964F]"
                viewBox="0 0 24 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M1 8h19m0 0-5-5m5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="rounded-lg bg-[#C8964F] px-3 py-2 font-semibold text-[#111111]">
                Balance-sheet assets
              </span>
            </div>
            <p className="text-sm leading-relaxed text-white/70">
              Infrastructure ownership compounds enterprise value rather than
              leaking it to third parties.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
