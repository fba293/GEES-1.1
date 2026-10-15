/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Reusable Study Destination Page Template
 * Master Orchestrator Component for all GEES Approved Study Countries
 */

import React, { useEffect } from 'react';
import { getDestinationDataBySlug, normalizeDestinationSlug } from '../../data/destinationDataRegistry.ts';
import { SITE_URL, getCanonicalUrl } from '../../lib/seo-config.ts';
import { generateDestinationSchemaGraph } from '../../utils/StructuredDataGenerator.ts';
import { StudyDestinationHero } from './StudyDestinationHero.tsx';
import { DestinationQuickFacts } from './DestinationQuickFacts.tsx';
import { WhyStudySection } from './WhyStudySection.tsx';
import { DestinationUniversities } from './DestinationUniversities.tsx';
import { DestinationCourses } from './DestinationCourses.tsx';
import { AdmissionRequirements } from './AdmissionRequirements.tsx';
import { ScholarshipsSection } from './ScholarshipsSection.tsx';
import { IntakeTimeline } from './IntakeTimeline.tsx';
import { VisaProcessSection } from './VisaProcessSection.tsx';
import { DestinationSuccessStories } from './DestinationSuccessStories.tsx';
import { DestinationFAQ } from './DestinationFAQ.tsx';
import { DestinationLeadForm } from './DestinationLeadForm.tsx';
import { RelatedDestinations } from './RelatedDestinations.tsx';

interface StudyDestinationPageProps {
  countrySlugOrName?: string;
  onNavigate: (view: string, payload?: any) => void;
  onOpenConsultation: (counselor?: string) => void;
}

export const StudyDestinationPage: React.FC<StudyDestinationPageProps> = ({
  countrySlugOrName = 'study-in-malaysia',
  onNavigate,
  onOpenConsultation
}) => {
  const normalizedSlug = normalizeDestinationSlug(countrySlugOrName);
  const data = getDestinationDataBySlug(normalizedSlug);
  const canonicalUrl = getCanonicalUrl(data.slug);

  // Smooth Scroll Helper
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Dynamic SEO Metadata Injection & Schema.org JSON-LD Graph
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Set Document Title
    document.title = data.seo.title;

    // Set Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', data.seo.description);

    // OpenGraph Tags
    const setOgTag = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setOgTag('og:title', data.seo.title);
    setOgTag('og:description', data.seo.description);
    setOgTag('og:type', 'website');
    setOgTag('og:url', canonicalUrl);
    if (data.hero.imageUrl) {
      setOgTag('og:image', data.hero.imageUrl);
    }

    // Twitter Tags
    const setTwitterTag = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setTwitterTag('twitter:card', 'summary_large_image');
    setTwitterTag('twitter:title', data.seo.title);
    setTwitterTag('twitter:description', data.seo.description);

    // Canonical Link Tag
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // Programmatic Structured Data JSON-LD Injection
    const schemaGraphId = `schema-graph-${data.slug}`;
    let scriptEl = document.getElementById(schemaGraphId) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = schemaGraphId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    const schemaGraph = generateDestinationSchemaGraph(data);
    scriptEl.textContent = JSON.stringify(schemaGraph);

    // Scroll to top when loading a new destination page
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

    return () => {
      const el = document.getElementById(schemaGraphId);
      if (el) el.remove();
    };
  }, [data, canonicalUrl]);

  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#070D1E] text-slate-900 dark:text-white transition-colors">
      {/* Breadcrumb Header Bar */}
      <div className="w-full bg-slate-900 text-slate-300 py-2.5 px-4 sm:px-6 lg:px-8 text-xs border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar whitespace-nowrap">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="hover:text-amber-400 font-medium transition-colors cursor-pointer"
          >
            Home
          </button>
          <span className="text-slate-600">/</span>
          <button
            type="button"
            onClick={() => onNavigate('destinations')}
            className="hover:text-amber-400 font-medium transition-colors cursor-pointer"
          >
            Study Destinations
          </button>
          <span className="text-slate-600">/</span>
          <span className="text-amber-400 font-bold flex items-center gap-1">
            <span>{data.flagEmoji}</span>
            <span>Study in {data.countryName}</span>
          </span>
        </div>
      </div>

      {/* SECTION 1 — PREMIUM COUNTRY HERO */}
      <StudyDestinationHero
        data={data}
        onOpenConsultation={onOpenConsultation}
        onScrollToSection={scrollToSection}
      />

      {/* SECTION 2 — COUNTRY QUICK FACTS */}
      <DestinationQuickFacts data={data} />

      {/* SECTION 3 — WHY STUDY IN THIS COUNTRY? */}
      <WhyStudySection data={data} />

      {/* SECTION 4 — TOP UNIVERSITIES */}
      <DestinationUniversities
        data={data}
        onNavigate={onNavigate}
        onOpenConsultation={onOpenConsultation}
      />

      {/* SECTION 5 — POPULAR COURSES */}
      <DestinationCourses
        data={data}
        onNavigate={onNavigate}
        onOpenConsultation={onOpenConsultation}
      />

      {/* SECTION 6 — ADMISSION REQUIREMENTS & COSTS */}
      <AdmissionRequirements data={data} />

      {/* SECTION 7 — SCHOLARSHIPS & FUNDING */}
      <ScholarshipsSection
        data={data}
        onOpenConsultation={onOpenConsultation}
      />

      {/* SECTION 8 — INTAKES & APPLICATION DEADLINES */}
      <IntakeTimeline
        data={data}
        onOpenConsultation={onOpenConsultation}
      />

      {/* SECTION 9 — STUDENT VISA & APPLICATION PROCESS */}
      <VisaProcessSection
        data={data}
        onOpenConsultation={onOpenConsultation}
      />

      {/* SECTION 10 — STUDENT SUCCESS STORIES */}
      <DestinationSuccessStories
        data={data}
        onOpenConsultation={onOpenConsultation}
      />

      {/* SECTION 11 — COUNTRY FAQ (with Schema.org FAQPage JSON-LD) */}
      <DestinationFAQ
        data={data}
        onOpenConsultation={onOpenConsultation}
      />

      {/* SECTION 12 — GEES FREE COUNSELLING FORM */}
      <DestinationLeadForm data={data} />

      {/* SECTION 13 — RELATED STUDY DESTINATIONS */}
      <RelatedDestinations
        currentSlug={data.slug}
        onNavigate={onNavigate}
      />
    </div>
  );
};

export default StudyDestinationPage;
