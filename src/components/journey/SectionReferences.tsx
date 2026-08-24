"use client";

import { motion } from "framer-motion";
import {
  Landmark,
  Recycle,
  Coins,
  Globe2,
  ShieldCheck,
  FileText,
  Layers,
  ScrollText,
  Banknote,
  RefreshCw,
} from "lucide-react";

type Source = {
  topic: string;
  provider: string;
  Icon: typeof Globe2;
};

const SOURCES: Source[] = [
  {
    topic: "Neobanking market sizing",
    provider: "Fortune Business Insights",
    Icon: Landmark,
  },
  {
    topic: "RWA-tokenisation forecasts",
    provider: "Citi / BCG",
    Icon: Coins,
  },
  {
    topic: "Institutional gold",
    provider: "Basel III Tier 1 treatment",
    Icon: ShieldCheck,
  },
];

type Note = {
  Icon: typeof Globe2;
  lead: string;
  body: string;
};

const NOTES: Note[] = [
  {
    Icon: RefreshCw,
    lead: "Latest version governs",
    body: "All figures are reconciled to the latest internal versions; where a source document conflicts with a more recent one, the more recent governs.",
  },
  {
    Icon: Banknote,
    lead: "Xero is the authoritative source for financials",
    body: "and overrides written business-plan projections on any conflict.",
  },
  {
    Icon: ScrollText,
    lead: "ICC is a MiCA Asset-Referenced Token",
    body: "presented on a diversified metal-value reserve — the 25M supply cap and diversified-reserve model supersede earlier 1:1-gold descriptions.",
  },
  {
    Icon: FileText,
    lead: "Currency is Australian dollars (A$)",
    body: "throughout, across the site and every brief.",
  },
];

export default function SectionReferences() {
  return (
    <section className="bg-[#F8F7F4] py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="max-w-3xl mb-12 md:mb-14">
          <div className="text-[#C8964F] text-xs tracking-[0.3em] uppercase font-semibold mb-4">
            11 — References
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-[#174133] leading-tight">
            References &amp; methodology
          </h2>
        </div>

        {/* ── Market sources ── */}
        <div>
          <h3 className="text-xl font-bold text-[#174133] mt-0 mb-2">
            Market sources
          </h3>
          <p className="text-[#2B2B2B]/70 leading-relaxed max-w-3xl">
            Market sizing and structural figures draw on the following
            third-party and institutional references.
          </p>

          <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {SOURCES.map((s, i) => (
              <motion.div
                key={s.topic}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="group relative flex flex-col rounded-xl border border-[#174133]/10 bg-white p-4 shadow-[0_1px_2px_rgba(17,65,51,0.04)] hover:border-[#C8964F]/40 hover:shadow-[0_10px_28px_-14px_rgba(17,65,51,0.22)] transition-all duration-300"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C8964F]/12 text-[#C8964F] group-hover:bg-[#174133] group-hover:text-white transition-colors duration-300">
                  <s.Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                </div>
                <div className="mt-3.5 text-[13.5px] font-bold leading-snug text-[#174133]">
                  {s.topic}
                </div>
                <div className="mt-1.5 text-[12px] leading-snug text-[#2B2B2B]/55">
                  {s.provider}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Methodology notes ── */}
        <div className="mt-14">
          <h3 className="text-xl font-bold text-[#174133] mt-0 mb-2">
            Methodology notes
          </h3>
          <p className="text-[#2B2B2B]/70 leading-relaxed max-w-3xl">
            The conventions and precedence rules applied across every figure in
            this materials set.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="mt-7 overflow-hidden rounded-2xl border border-[#174133]/10 bg-white shadow-[0_1px_2px_rgba(17,65,51,0.04)]"
          >
            <ul className="divide-y divide-[#174133]/[0.08]">
              {NOTES.map((n) => (
                <li
                  key={n.lead}
                  className="flex items-start gap-4 px-5 py-4 md:px-6 md:py-5"
                >
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#174133]/[0.06] text-[#174133]">
                    <n.Icon className="h-[17px] w-[17px]" strokeWidth={1.8} />
                  </div>
                  <p className="text-[14px] leading-relaxed text-[#2B2B2B]/75">
                    <strong className="font-semibold text-[#174133]">
                      {n.lead}
                    </strong>{" "}
                    {n.body}
                  </p>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* gold hairline footnote */}
          <div className="mt-8 flex items-center gap-4">
            <span className="h-px flex-1 bg-gradient-to-r from-[#C8964F]/40 to-transparent" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2B2B2B]/40">
              Influunt — References &amp; methodology
            </span>
            <span className="h-px flex-1 bg-gradient-to-l from-[#C8964F]/40 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
