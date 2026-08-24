"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Landmark,
  Globe2,
  Building2,
  Banknote,
  Anchor,
  Scale,
  Fingerprint,
  Link2,
  Gavel,
  Lock,
  AlertTriangle,
  Dot,
} from "lucide-react";

type Jurisdiction = {
  code: string;
  country: string;
  posture: string;
  detail?: string;
  Icon: typeof Globe2;
};

const JURISDICTIONS: Jurisdiction[] = [
  {
    code: "MT",
    country: "Malta",
    posture: "MiCA CASP / EMI",
    Icon: Landmark,
  },
  {
    code: "AU",
    country: "Australia",
    posture: "Own AFSL (advanced filing)",
    detail: "Held as a balance-sheet asset — not operated under another party's licence.",
    Icon: ShieldCheck,
  },
  {
    code: "KY",
    country: "Cayman Islands",
    posture: "CIMA VASP / EIF",
    Icon: Anchor,
  },
  {
    code: "LU",
    country: "Luxembourg",
    posture: "RAIF SICAV",
    detail: "The Investular fund.",
    Icon: Building2,
  },
  {
    code: "SG",
    country: "Singapore",
    posture: "MAS MPI",
    Icon: Banknote,
  },
];

type Chip = {
  label: string;
  role: string;
  Icon: typeof Globe2;
};

const ARCHITECTURE: Chip[] = [
  { label: "Compliance Guardian", role: "In-system agent", Icon: ShieldCheck },
  { label: "AFSL House", role: "Compliance consultancy", Icon: Scale },
  { label: "ABM Legal", role: "Regulatory counsel", Icon: Gavel },
  { label: "Sumsub", role: "KYC identity", Icon: Fingerprint },
  { label: "Chainalysis", role: "Chain analytics", Icon: Link2 },
];

const GATES = [
  "Anti-hawking (s992A)",
  "s708 wholesale gating",
  "MiCA Article 40 POA wording",
];

export default function SectionRegulatory() {
  return (
    <section className="bg-[#F8F7F4] py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="max-w-3xl mb-12 md:mb-14">
          <div className="text-[#C8964F] text-xs tracking-[0.3em] uppercase font-semibold mb-4">
            06 — Regulatory &amp; Compliance
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-[#174133] leading-tight">
            A five-jurisdiction regulated perimeter
          </h2>
        </div>

        {/* Lead */}
        <p className="text-lg md:text-xl text-[#2B2B2B]/80 leading-relaxed max-w-3xl">
          Influunt operates a{" "}
          <strong className="font-semibold text-[#174133]">
            five-jurisdiction regulated perimeter
          </strong>{" "}
          — each licence deliberately scoped, each posture mapped to a named
          authority.
        </p>

        {/* ── INFOGRAPHIC: five-jurisdiction grid ── */}
        <div className="mt-10 md:mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
            {JURISDICTIONS.map((j, i) => (
              <motion.div
                key={j.code}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative flex flex-col rounded-2xl border border-[#174133]/10 bg-white p-5 shadow-[0_1px_2px_rgba(17,65,51,0.04)] hover:shadow-[0_10px_30px_-12px_rgba(17,65,51,0.25)] hover:border-[#C8964F]/40 transition-all duration-300"
              >
                {/* gold hairline top accent */}
                <span className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[#C8964F]/60 to-transparent" />

                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#174133]/[0.06] text-[#174133] group-hover:bg-[#174133] group-hover:text-white transition-colors duration-300">
                    <j.Icon className="h-[22px] w-[22px]" strokeWidth={1.7} />
                  </div>
                  <span className="text-[11px] font-semibold tracking-[0.18em] text-[#C8964F]">
                    {j.code}
                  </span>
                </div>

                <div className="mt-4 text-base font-bold text-[#174133]">
                  {j.country}
                </div>

                <div className="mt-1.5">
                  <span className="inline-flex items-center rounded-md bg-[#D6B075]/15 px-2 py-1 text-[12px] font-semibold leading-none text-[#174133]">
                    {j.posture}
                  </span>
                </div>

                {j.detail && (
                  <p className="mt-3 text-[12.5px] leading-relaxed text-[#2B2B2B]/60">
                    {j.detail}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Classification discipline ── */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="lg:col-span-7">
            <h3 className="text-xl font-bold text-[#174133] mt-0 mb-3">
              Classification discipline
            </h3>
            <p className="text-[#2B2B2B]/70 leading-relaxed">
              ICC is a{" "}
              <strong className="font-semibold text-[#174133]">
                MiCA Asset-Referenced Token (Title III)
              </strong>{" "}
              and is never marketed as a stablecoin;{" "}
              <strong className="font-semibold text-[#174133]">RLUSD</strong>{" "}
              serves as the stablecoin settlement bridge. The
              diversified-metal-reserve model — not a 1:1 gold peg — governs all
              live materials.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <div className="flex-1 rounded-xl border border-[#174133]/10 bg-white p-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#C8964F]">
                  ICC
                </div>
                <div className="mt-1.5 text-sm font-bold text-[#174133]">
                  MiCA Asset-Referenced Token
                </div>
                <div className="mt-0.5 text-[12.5px] text-[#2B2B2B]/60">
                  Title III · never a stablecoin
                </div>
              </div>
              <div className="hidden sm:flex items-center text-[#C8964F]">
                <Link2 className="h-5 w-5" strokeWidth={1.7} />
              </div>
              <div className="flex-1 rounded-xl border border-[#174133]/10 bg-white p-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#C8964F]">
                  RLUSD
                </div>
                <div className="mt-1.5 text-sm font-bold text-[#174133]">
                  Stablecoin settlement bridge
                </div>
                <div className="mt-0.5 text-[12.5px] text-[#2B2B2B]/60">
                  Diversified metal reserve
                </div>
              </div>
            </div>
          </div>

          {/* Non-negotiable gates callout */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="h-full rounded-2xl border border-[#174133]/15 bg-[#174133] p-6 md:p-7 text-white shadow-[0_18px_40px_-20px_rgba(17,65,51,0.6)]"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C8964F]/20 text-[#D6B075]">
                  <AlertTriangle className="h-[18px] w-[18px]" strokeWidth={1.9} />
                </div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D6B075]">
                  Non-negotiable gates
                </div>
              </div>

              <p className="mt-4 text-[14px] leading-relaxed text-white/75">
                Each requires written sign-off from{" "}
                <strong className="font-semibold text-white">ABM Legal</strong>{" "}
                and the{" "}
                <strong className="font-semibold text-white">
                  Head of Compliance
                </strong>{" "}
                before any retail-facing rollout.
              </p>

              <ul className="mt-5 space-y-2.5">
                {GATES.map((gate) => (
                  <li key={gate} className="flex items-start gap-2.5">
                    <Lock
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#D6B075]"
                      strokeWidth={2}
                    />
                    <span className="text-[13.5px] leading-snug text-white/90">
                      {gate}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 border-t border-white/10 pt-4">
                <p className="text-[12.5px] leading-relaxed text-white/60">
                  ICC's ART classification gates the Malta MiCA submission and
                  requires a formal ART-scope legal opinion before any white
                  paper is filed.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Compliance architecture: chip row ── */}
        <div className="mt-14">
          <h3 className="text-xl font-bold text-[#174133] mt-0 mb-1">
            Compliance architecture
          </h3>
          <p className="text-[#2B2B2B]/70 leading-relaxed max-w-3xl">
            A layered stack of in-system enforcement, specialist consultancy,
            named accountability, regulatory counsel, and best-in-class KYC /
            AML.
          </p>

          <div className="mt-7 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {ARCHITECTURE.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="flex items-center gap-3 rounded-xl border border-[#174133]/10 bg-white px-4 py-3.5 hover:border-[#C8964F]/40 transition-colors duration-300"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#C8964F]/12 text-[#C8964F]">
                  <c.Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-[13.5px] font-bold text-[#174133]">
                    {c.label}
                  </div>
                  <div className="truncate text-[11.5px] text-[#2B2B2B]/55">
                    {c.role}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* supporting detail list */}
          <ul className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 max-w-4xl">
            {[
              {
                k: "Compliance Guardian",
                v: "An in-system agent that defines and enforces the boundary between general information and personal financial advice.",
              },
              {
                k: "AFSL House",
                v: "Specialist compliance consultancy structuring the AFSL scope and CAR program.",
              },
              {
                k: "Robin Austin",
                v: "Head of Compliance, with day-to-day accountability.",
              },
              {
                k: "ABM Legal",
                v: "Regulatory counsel — AFSL, MiCA ART scope, anti-hawking, privacy.",
              },
              {
                k: "KYC / AML",
                v: "Sumsub (identity) and Chainalysis (chain analytics).",
              },
            ].map((item) => (
              <li key={item.k} className="flex items-start gap-2.5">
                <Dot className="-ml-1.5 mt-0.5 h-5 w-5 shrink-0 text-[#C8964F]" />
                <p className="text-[14px] leading-relaxed text-[#2B2B2B]/75">
                  <strong className="font-semibold text-[#174133]">
                    {item.k}
                  </strong>{" "}
                  — {item.v}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
