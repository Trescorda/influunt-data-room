'use client'

import Link from 'next/link'
import { ArrowRight, FolderOpen, ShieldCheck } from 'lucide-react'
import {
  FloatCue,
  KenBurns,
  MaskReveal,
  Reveal,
  ScrollProgress,
} from '@/components/motion/MotionKit'
import SectionIntroduction from '@/components/journey/SectionIntroduction'
import SectionArchitecture from '@/components/journey/SectionArchitecture'
import SectionCapabilities from '@/components/journey/SectionCapabilities'
import SectionMonetary from '@/components/journey/SectionMonetary'
import SectionInfrastructure from '@/components/journey/SectionInfrastructure'
import SectionRegulatory from '@/components/journey/SectionRegulatory'
import SectionGoToMarket from '@/components/journey/SectionGoToMarket'
import SectionCompetitive from '@/components/journey/SectionCompetitive'
import SectionJourney from '@/components/journey/SectionJourney'
import SectionRoadmap from '@/components/journey/SectionRoadmap'
import SectionReferences from '@/components/journey/SectionReferences'

const HERO_BG = '/journey/hero-gold-reserve.webp'
const CREST = '/influunt-crest.png'

/**
 * The Investment Journey — the high-level narrative investors read first,
 * ported from the public Invest page. The public page's lead-capture gate
 * and data-room teaser are dropped: whoever is reading this is already
 * inside the data room. The closing hands off to the documents instead.
 */
export function JourneyView() {
  return (
    <div className="bg-white text-inf-body overflow-x-hidden">
      <ScrollProgress />

      <Hero />

      <div id="overview">
        <SectionIntroduction />
        <SectionArchitecture />
        <SectionCapabilities />
        <SectionMonetary />
        <SectionInfrastructure />
        <SectionRegulatory />
        <SectionGoToMarket />
        <SectionCompetitive />
        <SectionJourney />
        <SectionRoadmap />
        <SectionReferences />
      </div>

      <DocumentsHandoff />
    </div>
  )
}

function Hero() {
  return (
    <section className="relative min-h-[72vh] flex items-center justify-center bg-inf-obsidian">
      <div className="absolute inset-0 overflow-hidden">
        <KenBurns src={HERO_BG} alt="" className="opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-inf-obsidian via-inf-obsidian/80 to-inf-obsidian/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-inf-obsidian via-transparent to-inf-obsidian/70" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 w-full pt-24 pb-20 text-center">
        <Reveal variant="fade" duration={0.8}>
          <p className="text-xs tracking-[0.3em] uppercase text-inf-gold-display font-semibold mb-6 drop-shadow-[0_1px_6px_rgba(17,17,17,0.6)]">
            The Investment Opportunity
          </p>
        </Reveal>
        <h1 className="text-4xl md:text-6xl font-bold leading-[1.08] tracking-tight mb-6 text-white">
          <MaskReveal delay={0.1}>
            Invest in <span className="text-inf-gold">Influunt</span>
          </MaskReveal>
        </h1>

        <Reveal delay={0.25}>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed mb-10">
            An introduction to what Influunt is and how it works — the foundation,
            the architecture, and the opportunity to back it.
          </p>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#overview">
              <button className="flex items-center gap-2 bg-inf-gold text-white hover:bg-inf-gold-hover font-semibold text-sm tracking-widest uppercase px-8 py-4 rounded-inf transition-colors">
                Explore the Overview <ArrowRight className="w-4 h-4" />
              </button>
            </a>
            <Link href="/room">
              <button className="w-full border border-inf-gold/50 text-inf-gold hover:bg-inf-gold/10 font-medium text-sm tracking-widest uppercase px-8 py-4 rounded-inf transition-colors">
                Go to the Documents
              </button>
            </Link>
          </div>
        </Reveal>
      </div>

      <FloatCue className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10" />
    </section>
  )
}

/**
 * Closing bookend — the journey is the high-level story; the documents are
 * the detail behind it. Send them onward.
 */
function DocumentsHandoff() {
  return (
    <section className="bg-inf-obsidian text-white py-20 md:py-24 text-center">
      <Reveal variant="fade" duration={0.9} className="max-w-[1380px] mx-auto px-6">
        <img src={CREST} alt="" className="h-14 w-14 object-contain mx-auto mb-6" />
        <p className="text-xs tracking-[0.3em] uppercase text-inf-gold font-semibold mb-4">
          Go Deeper
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-5">
          The supporting documents
        </h2>
        <p className="text-white/60 text-base leading-relaxed max-w-xl mx-auto mb-9">
          Everything above is the overview. The full diligence materials — financials,
          legal, technical architecture and the business plan — are held in the data room.
        </p>
        <Link href="/room">
          <button className="inline-flex items-center gap-2 bg-inf-gold text-white hover:bg-inf-gold-hover font-semibold text-sm tracking-widest uppercase px-8 py-4 rounded-inf transition-colors">
            <FolderOpen className="w-4 h-4" /> Open the Data Room
          </button>
        </Link>
        <p className="text-white/40 text-sm max-w-md mx-auto leading-relaxed flex items-center justify-center gap-2 mt-9">
          <ShieldCheck className="w-4 h-4 text-inf-gold flex-none" />
          This overview is an introduction, not an offer of securities.
        </p>
      </Reveal>
    </section>
  )
}
