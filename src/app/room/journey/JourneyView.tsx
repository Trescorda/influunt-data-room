'use client'

import { ShieldCheck } from 'lucide-react'
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

/**
 * Cover. The one dark band in the room, and it earns it: this is a hero
 * *image* with a subject behind it — the gold reserve — not a flat black
 * field. That is the sanctioned exception in the design system; chrome is
 * never dark. The scrim exists only to make the type legible, and the
 * bottom edge dissolves into the paper ground so the band reads as part of
 * the page rather than a slab bolted onto it.
 *
 * No call-to-action buttons: this is a tab inside the room, so "explore"
 * and "go to the documents" are the sidebar's job. The scroll cue stays —
 * it signals there is more below without asking for a click.
 */
function Hero() {
  return (
    <section className="relative min-h-[64vh] flex items-center justify-center overflow-hidden bg-inf-black">
      <div className="absolute inset-0 overflow-hidden">
        <KenBurns src={HERO_BG} alt="" className="opacity-80" />
        {/* Legibility scrim. Symmetric, because the type is centred — a
            left-weighted gradient left the lede sitting on the brightest
            bars. The radial lift sits directly behind the text block. */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/65" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_62%_54%_at_50%_46%,rgba(0,0,0,0.58),transparent_72%)]" />
        {/* Dissolve into the paper ground below */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-inf-paper" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-10 w-full pt-24 pb-24 text-center">
        <Reveal variant="fade" duration={0.8}>
          <img src={CREST} alt="" className="h-12 w-12 object-contain mx-auto mb-6 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]" />
          <p className="text-xs tracking-[0.3em] uppercase text-inf-gold-display font-semibold mb-5 drop-shadow-[0_1px_6px_rgba(17,17,17,0.6)]">
            The Investment Opportunity
          </p>
        </Reveal>

        <h1 className="text-4xl md:text-6xl font-bold leading-[1.08] tracking-tight mb-6 text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
          <MaskReveal delay={0.1}>
            Invest in <span className="text-inf-gold-display">Influunt</span>
          </MaskReveal>
        </h1>

        <Reveal delay={0.25}>
          <p className="text-lg md:text-xl text-white/75 max-w-2xl mx-auto leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)]">
            An introduction to what Influunt is and how it works — the foundation,
            the architecture, and the opportunity to back it.
          </p>
        </Reveal>
      </div>

      <FloatCue className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10" />
    </section>
  )
}

/**
 * Closing bookend. The narrative ends; the disclaimer stands on its own —
 * navigation back to the documents lives in the sidebar.
 */
function DocumentsHandoff() {
  return (
    <section className="bg-inf-paper border-t border-inf-line py-16 md:py-20 text-center">
      <Reveal variant="fade" duration={0.9} className="max-w-[1380px] mx-auto px-6">
        <img src={CREST} alt="" className="h-12 w-12 object-contain mx-auto mb-6" />
        <p className="text-inf-muted text-sm max-w-lg mx-auto leading-relaxed flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-inf-gold flex-none" />
          This overview is an introduction, not an offer of securities.
        </p>
      </Reveal>
    </section>
  )
}
