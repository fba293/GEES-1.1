/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Our Partners Infinite Marquee Section
 * True-to-source reference implementation from trustworthy-turquoise-alligator.globaleducationexpert.com
 * Buttery-smooth 70s hardware-accelerated glide, high contrast dark/light cards, and uniform bold logos.
 */

import React from 'react';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';

interface PartnersMarqueeSectionProps {
  onNavigate?: (view: string, payload?: any) => void;
}

// 45 Authentic Global University Partner Logos
const PARTNER_LOGOS = Array.from({ length: 45 }, (_, idx) => {
  const id = idx + 1;
  return {
    id,
    url: `https://trustworthy-turquoise-alligator.globaleducationexpert.com/assets/images/slider-logos/logo-${id}.webp`,
    name: `Partner University ${id}`
  };
});

// Split across two seamless infinite marquee tracks
const row1Logos = PARTNER_LOGOS.slice(0, 23);
const row2Logos = PARTNER_LOGOS.slice(23);

export const PartnersMarqueeSection: React.FC<PartnersMarqueeSectionProps> = ({ onNavigate }) => {
  // Renders a partner logo card matching the reference website
  const renderCard = (logo: { id: number; url: string; name: string }, keyPrefix: string, isAriaHidden: boolean = false) => (
    <div
      key={`${keyPrefix}-${logo.id}`}
      className="partner-logo"
      title={logo.name}
      onClick={() => onNavigate?.('universities')}
      aria-hidden={isAriaHidden}
      role={isAriaHidden ? undefined : 'button'}
      tabIndex={isAriaHidden ? -1 : 0}
      onKeyDown={(e) => {
        if (!isAriaHidden && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onNavigate?.('universities');
        }
      }}
    >
      <img
        src={logo.url}
        alt={isAriaHidden ? '' : logo.name}
        loading="eager"
        decoding="async"
      />
    </div>
  );

  return (
    <section 
      className="home-partners-section w-full bg-white dark:bg-[#0B1329] py-8 min-[390px]:py-10 sm:py-20 lg:py-28 overflow-hidden relative transition-colors" 
      data-purpose="partners-showcase"
      id="partners-section"
    >
      {/* Ambient Blur Accents */}
      <div className="pointer-events-none absolute -top-24 left-1/4 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl -z-10" />
      <div className="pointer-events-none absolute top-1/2 right-12 w-80 h-80 bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-3xl -z-10" />
      <div className="pointer-events-none absolute -bottom-20 left-10 w-72 h-72 bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-2xl -z-10" />

      <div className="w-full max-w-full sm:max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-12 lg:mb-16 px-2" data-purpose="section-header">
          {/* Main Heading with Golden Pill Badge */}
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-2 sm:gap-3 md:gap-3.5 flex-wrap leading-tight text-center">
            <span>Our</span>
            <span className="bg-[#fbb034] text-slate-950 px-3.5 sm:px-5 md:px-6 py-0.5 sm:py-1 md:py-1.5 rounded-xl sm:rounded-2xl font-black tracking-tight leading-none shadow-sm shrink-0">
              Partners
            </span>
          </h2>
          {/* Supporting Subtext */}
          <p className="mt-2 sm:mt-3 text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed max-w-2xl mx-auto px-2 text-center">
            Connecting you to 167+ top partner universities across the globe.
          </p>
        </div>
      </div>

      {/* Marquee Showcase Container */}
      <div className="relative w-full max-w-[100vw] overflow-hidden py-2 sm:py-4" data-purpose="marquee-container">
        {/* Subtle side gradient fade for organic edge dissolve */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-20 md:w-32 bg-gradient-to-r from-white dark:from-[#0B1329] via-white/80 dark:via-[#0B1329]/80 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-20 md:w-32 bg-gradient-to-l from-white dark:from-[#0B1329] via-white/80 dark:via-[#0B1329]/80 to-transparent z-20" />

        <div className="marquee-mask flex flex-col gap-4 sm:gap-6">
          {/* ROW 1: Auto-Scroll Right-to-Left (data-direction="left") */}
          <div 
            className="marquee-wrapper w-full overflow-hidden" 
            data-direction="left"
            role="group"
            tabIndex={0}
            aria-label="University partner logo strip row 1"
          >
            <div className="marquee-track">
              {/* Primary Sequence */}
              <div className="partner-sequence">
                {row1Logos.map((logo) => renderCard(logo, 'r1-primary'))}
              </div>
              {/* Duplicate Sequence for mathematically seamless loop */}
              <div className="partner-sequence" aria-hidden="true">
                {row1Logos.map((logo) => renderCard(logo, 'r1-dup', true))}
              </div>
            </div>
          </div>

          {/* ROW 2: Auto-Scroll Left-to-Right (data-direction="right") */}
          <div 
            className="marquee-wrapper w-full overflow-hidden" 
            data-direction="right"
            role="group"
            tabIndex={0}
            aria-label="University partner logo strip row 2"
          >
            <div className="marquee-track">
              {/* Primary Sequence */}
              <div className="partner-sequence">
                {row2Logos.map((logo) => renderCard(logo, 'r2-primary'))}
              </div>
              {/* Duplicate Sequence for mathematically seamless loop */}
              <div className="partner-sequence" aria-hidden="true">
                {row2Logos.map((logo) => renderCard(logo, 'r2-dup', true))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call To Action */}
      <div className="mt-8 sm:mt-16 flex justify-center px-4" data-purpose="cta-container">
        <InteractiveHoverButton
          type="button"
          text="View all university partners"
          onClick={() => onNavigate?.('universities')}
          className="min-h-[44px] px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-white dark:bg-slate-900 text-slate-950 dark:text-white border-slate-300 dark:border-slate-700 font-semibold text-sm sm:text-base shadow-xs cursor-pointer active:scale-95"
        />
      </div>
    </section>
  );
};
