"use client";

import { motion } from "framer-motion";
import {
  Building2,
  Users,
  UserCheck,
  ArrowDown,
  FileSignature,
  Layers3,
  CheckCircle2,
  Rocket,
  Gem,
  Home,
  Banknote,
  Landmark,
  Smartphone,
  ShieldCheck,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Small shared primitives                                            */
/* ------------------------------------------------------------------ */

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <CheckCircle2
        className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#C8964F]"
        strokeWidth={2}
      />
      <span className="leading-relaxed text-[#2B2B2B]/75">{children}</span>
    </li>
  );
}

function Strong({ children }: { children: React.ReactNode }) {
  return (
    <strong className="font-semibold text-[#174133]">{children}</strong>
  );
}

/* ------------------------------------------------------------------ */
/*  Infographic 1 — the B2B–D2C engagement funnel                      */
/* ------------------------------------------------------------------ */

interface FunnelStage {
  Icon: typeof Building2;
  kicker: string;
  title: string;
  detail: string;
  /** relative width of the funnel band, 0–100 */
  width: number;
  tone: "deep" | "mid" | "gold";
}

const FUNNEL: FunnelStage[] = [
  {
    Icon: Building2,
    kicker: "Source",
    title: "Enterprise partner on KulaOS",
    detail: "B2B platform layer · turnkey, replicable pattern",
    width: 100,
    tone: "deep",
  },
  {
    Icon: Users,
    kicker: "Reach",
    title: "Member base",
    detail: "Existing community inside the enterprise",
    width: 78,
    tone: "mid",
  },
  {
    Icon: UserCheck,
    kicker: "Convert",
    title: "Influunt clients",
    detail: "Onboarded D2C into the Wealth-for-Life platform",
    width: 54,
    tone: "gold",
  },
];

const TONE: Record<
  FunnelStage["tone"],
  { band: string; icon: string; text: string; kicker: string }
> = {
  deep: {
    band: "bg-[#174133]",
    icon: "bg-white/10 text-[#D6B075]",
    text: "text-white",
    kicker: "text-[#D6B075]",
  },
  mid: {
    band: "bg-[#174133]/85",
    icon: "bg-white/10 text-[#D6B075]",
    text: "text-white",
    kicker: "text-[#D6B075]",
  },
  gold: {
    band: "bg-gradient-to-r from-[#C8964F] to-[#B8853D]",
    icon: "bg-white/20 text-white",
    text: "text-white",
    kicker: "text-white/90",
  },
};

function EngagementFunnel() {
  return (
    <div className="rounded-2xl border border-[#174133]/10 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-1 flex items-center gap-2 text-[#C8964F]">
        <Layers3 className="h-4 w-4" strokeWidth={2} />
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.22em]">
          D2C Engagement Engine
        </span>
      </div>
      <h4 className="mb-6 text-lg font-bold text-[#174133]">
        From enterprise member base to Influunt client
      </h4>

      <div className="flex flex-col items-center">
        {FUNNEL.map((stage, i) => {
          const tone = TONE[stage.tone];
          const { Icon } = stage;
          return (
            <div key={stage.title} className="w-full">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.12, ease: "easeOut" }}
                style={{ width: `${stage.width}%` }}
                className={`mx-auto flex items-center gap-4 rounded-xl px-4 py-4 shadow-sm md:px-5 ${tone.band}`}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${tone.icon}`}
                >
                  <Icon className="h-[22px] w-[22px]" strokeWidth={1.8} />
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className={`text-[0.62rem] font-semibold uppercase tracking-[0.18em] ${tone.kicker}`}
                  >
                    {stage.kicker}
                  </div>
                  <div className={`text-sm font-bold leading-tight md:text-[0.95rem] ${tone.text}`}>
                    {stage.title}
                  </div>
                  <div className={`mt-0.5 text-xs leading-snug ${tone.text} opacity-75`}>
                    {stage.detail}
                  </div>
                </div>
              </motion.div>

              {i < FUNNEL.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.12 + 0.2 }}
                  className="flex justify-center py-2"
                  aria-hidden
                >
                  <ArrowDown className="h-5 w-5 text-[#C8964F]" strokeWidth={2.25} />
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* BML pilot highlight */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-6 overflow-hidden rounded-xl border border-[#C8964F]/30 bg-[#C8964F]/[0.07]"
      >
        <div className="flex items-center gap-2 border-b border-[#C8964F]/20 bg-[#C8964F]/10 px-4 py-2.5">
          <Rocket className="h-4 w-4 text-[#9A6B27]" strokeWidth={2} />
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#9A6B27]">
            First enterprise pilot
          </span>
        </div>
        <div className="grid gap-px bg-[#C8964F]/15 sm:grid-cols-3">
          <div className="bg-[#FBF8F2] px-4 py-4">
            <div className="text-2xl font-bold leading-none text-[#174133]">
              BML
            </div>
            <div className="mt-1.5 text-xs leading-snug text-[#2B2B2B]/65">
              BodyMindLife — Bondi-based wellness enterprise
            </div>
          </div>
          <div className="bg-[#FBF8F2] px-4 py-4">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold leading-none text-[#174133]">
                ~15,000
              </span>
            </div>
            <div className="mt-1.5 text-xs leading-snug text-[#2B2B2B]/65">
              Active members in the pilot cohort
            </div>
          </div>
          <div className="bg-[#FBF8F2] px-4 py-4">
            <div className="flex items-center gap-1.5">
              <FileSignature className="h-5 w-5 text-[#C8964F]" strokeWidth={2} />
              <span className="text-2xl font-bold leading-none text-[#174133]">
                MOU
              </span>
            </div>
            <div className="mt-1.5 text-xs leading-snug text-[#2B2B2B]/65">
              Received — corporate banking transition & onboarding
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Infographic 2 — Founder-to-Funder pathway                          */
/* ------------------------------------------------------------------ */

interface Tier {
  Icon: typeof Rocket;
  name: string;
}

const TIERS: Tier[] = [
  { Icon: Rocket, name: "Founder" },
  { Icon: Gem, name: "Funder" },
  { Icon: Home, name: "Family Office" },
  { Icon: Banknote, name: "Fund" },
  { Icon: Landmark, name: "Institutional" },
];

function FounderToFunder() {
  return (
    <div className="rounded-2xl border border-[#174133]/10 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-1 flex items-center gap-2 text-[#C8964F]">
        <ArrowDown className="h-4 w-4 rotate-[-90deg]" strokeWidth={2} />
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.22em]">
          Founder-to-Funder pathway
        </span>
      </div>
      <h4 className="mb-7 text-lg font-bold text-[#174133]">
        A single wealth progression, tier by tier
      </h4>

      <div className="relative">
        {/* progression spine */}
        <span
          className="pointer-events-none absolute left-5 right-5 top-7 hidden h-[3px] rounded-full bg-gradient-to-r from-[#174133]/30 via-[#C8964F]/50 to-[#D6B075] md:block"
          aria-hidden
        />

        <ol className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-5 md:gap-x-2">
          {TIERS.map((tier, i) => {
            const { Icon } = tier;
            const isLast = i === TIERS.length - 1;
            return (
              <motion.li
                key={tier.name}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.09, ease: "easeOut" }}
                className="relative flex flex-col items-center text-center"
              >
                <div
                  className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-full border shadow-sm ${
                    isLast
                      ? "border-[#C8964F]/40 bg-gradient-to-br from-[#C8964F] to-[#B8853D] text-white"
                      : "border-[#174133]/10 bg-[#174133] text-[#D6B075]"
                  }`}
                >
                  <Icon className="h-6 w-6" strokeWidth={1.7} />
                  <span className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-[#174133]/10 bg-white text-[0.6rem] font-bold text-[#174133]">
                    {i + 1}
                  </span>
                </div>
                <div className="mt-3.5 text-xs font-bold leading-tight text-[#174133] md:text-[0.8rem]">
                  {tier.name}
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        <div className="flex items-start gap-2.5 rounded-lg bg-[#174133]/[0.04] px-3.5 py-3">
          <ShieldCheck
            className="mt-0.5 h-4 w-4 shrink-0 text-[#C8964F]"
            strokeWidth={2}
          />
          <p className="text-xs leading-relaxed text-[#2B2B2B]/70">
            <Strong>DigiShares</Strong>-powered Fortified Wealth marketplace —
            tokenised private-investment access: subscription, accreditation,
            cap table, distributions and peer-to-peer secondary.
          </p>
        </div>
        <div className="flex items-start gap-2.5 rounded-lg bg-[#174133]/[0.04] px-3.5 py-3">
          <Landmark
            className="mt-0.5 h-4 w-4 shrink-0 text-[#C8964F]"
            strokeWidth={2}
          />
          <p className="text-xs leading-relaxed text-[#2B2B2B]/70">
            <Strong>FundCount</Strong> sits behind the marketplace as the book of
            record.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Infographic 3 — benchmark comparison chips                         */
/* ------------------------------------------------------------------ */

const BENCHMARKS = ["Bitpanda", "Xapo Bank", "Nexo"];

function ProductPanel() {
  return (
    <div className="rounded-2xl border border-[#174133]/10 bg-[#F8F7F4] p-6 shadow-sm md:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
        <div className="flex items-center gap-4 md:shrink-0">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#174133] text-[#D6B075] shadow-sm">
            <Smartphone className="h-7 w-7" strokeWidth={1.7} />
          </div>
          <div>
            <div className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#C8964F]">
              The product
            </div>
            <div className="text-lg font-bold text-[#174133]">Agentic AI</div>
            <div className="text-xs text-[#2B2B2B]/65">
              &ldquo;Wealth for Life CEO in your pocket&rdquo;
            </div>
          </div>
        </div>

        <div className="hidden h-16 w-px bg-[#174133]/10 md:block" aria-hidden />

        <div className="min-w-0 flex-1">
          <div className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-[#2B2B2B]/55">
            Aspirational benchmarks
          </div>
          <div className="mb-4 flex flex-wrap gap-2">
            {BENCHMARKS.map((b) => (
              <span
                key={b}
                className="inline-flex items-center rounded-full border border-[#174133]/15 bg-white px-3.5 py-1.5 text-sm font-semibold text-[#174133]"
              >
                {b}
              </span>
            ))}
          </div>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-xs leading-relaxed text-[#2B2B2B]/75">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#174133]" strokeWidth={2} />
              <span>
                <Strong>Matched</Strong> on regulated digital-asset banking.
              </span>
            </li>
            <li className="flex items-start gap-2 text-xs leading-relaxed text-[#2B2B2B]/75">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#C8964F]" strokeWidth={2} />
              <span>
                <Strong>Exceeded</Strong> on AI-native orchestration, diversified
                metal backing, and sovereign infrastructure.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export default function SectionGoToMarket() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="max-w-3xl mb-12 md:mb-14">
          <div className="text-[#C8964F] text-xs tracking-[0.3em] uppercase font-semibold mb-4">
            07 — Go-to-Market
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-[#174133] leading-tight">
            The B2B&ndash;D2C engagement engine
          </h2>
        </div>

        {/* Lead prose */}
        <div className="max-w-3xl">
          <p className="text-lg md:text-xl text-[#2B2B2B]/80 leading-relaxed">
            Influunt reaches clients through enterprise partners on the{" "}
            <Strong>KulaOS</Strong> platform layer, then converts their member
            bases into Influunt clients. The architecture is designed as a
            turnkey pattern replicable across any B2B enterprise.
          </p>
        </div>

        {/* Funnel infographic */}
        <div className="mt-10 md:mt-12">
          <EngagementFunnel />
        </div>

        {/* Engine supporting prose */}
        <div className="mt-10 grid gap-8 md:mt-12 md:grid-cols-2 md:gap-10">
          <div>
            <h3 className="text-xl font-bold text-[#174133] mt-0 mb-3">
              First enterprise pilot — BodyMindLife (BML)
            </h3>
            <p className="text-[#2B2B2B]/70 leading-relaxed">
              A Bondi-based wellness enterprise with roughly{" "}
              <Strong>15,000 active members</Strong>, confirmed as the first D2C
              Engagement Engine pilot. An <Strong>MOU</Strong> has been received
              for corporate banking transition and member onboarding.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#174133] mt-0 mb-3">
              KulaOS integration
            </h3>
            <p className="text-[#2B2B2B]/70 leading-relaxed mb-3">
              Commercial terms locked:
            </p>
            <ul className="space-y-2.5">
              <Bullet>
                Platform fee plus tiered per-member-record fees, and enterprise
                setup.
              </Bullet>
              <Bullet>
                An <Strong>extraction cap</Strong> protecting Influunt&rsquo;s
                unit economics.
              </Bullet>
              <Bullet>
                <Strong>Category exclusivity</Strong> in Banking / Finance /
                Investment Services.
              </Bullet>
            </ul>
          </div>
        </div>

        {/* Founder-to-Funder */}
        <div className="mt-14 max-w-3xl md:mt-16">
          <h3 className="text-xl font-bold text-[#174133] mt-0 mb-3">
            The Founder-to-Funder pathway
          </h3>
          <p className="text-[#2B2B2B]/70 leading-relaxed">
            Clients progress along a &ldquo;Founder-to-Funder&rdquo; wealth
            pathway — from Founder tier through Funder, Family Office, Fund and
            institutional tiers. The <Strong>DigiShares</Strong>-powered
            Fortified Wealth marketplace gives clients access to tokenised
            private-investment opportunities (subscription, accreditation, cap
            table, distributions and peer-to-peer secondary), with{" "}
            <Strong>FundCount</Strong> as the book of record behind it.
          </p>
        </div>

        <div className="mt-8 md:mt-10">
          <FounderToFunder />
        </div>

        {/* The product */}
        <div className="mt-14 max-w-3xl md:mt-16">
          <h3 className="text-xl font-bold text-[#174133] mt-0 mb-3">
            The product
          </h3>
          <p className="text-[#2B2B2B]/70 leading-relaxed">
            Every client experiences the platform through their <Strong>agentic AI</Strong>,
            the &ldquo;Wealth for Life CEO in your pocket&rdquo;. Aspirational
            benchmarks — Bitpanda, Xapo Bank, Nexo — are{" "}
            <Strong>matched</Strong> on regulated digital-asset banking and{" "}
            <Strong>exceeded</Strong> on AI-native orchestration, diversified
            metal backing, and sovereign infrastructure.
          </p>
        </div>

        <div className="mt-8 md:mt-10">
          <ProductPanel />
        </div>
      </div>
    </section>
  );
}
