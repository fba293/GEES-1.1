/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Site Map View
 * Inspired by Apple's clean editorial Site Map (https://www.apple.com/my/sitemap/)
 * Automatically synchronized with SITE_PAGE_REGISTRY and all live data registries.
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  buildLiveSitemapData,
  generateXmlSitemap,
  SitemapLinkItem,
  SitemapSection,
  subscribeSitemapRegistry,
} from '../../lib/sitemap-registry.ts';

interface SiteMapViewProps {
  onNavigate: (view: string, payload?: unknown) => void;
  onOpenConsultation: (topic?: string) => void;
}

const INITIAL_UNIS_PER_COUNTRY = 12;

export const SiteMapView: React.FC<SiteMapViewProps> = ({
  onNavigate,
  onOpenConsultation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [registryVersion, setRegistryVersion] = useState(0);
  const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({});
  const [showAllSubjects, setShowAllSubjects] = useState(false);

  // Automatically re-sync whenever any new page dynamically registers itself
  useEffect(() => {
    return subscribeSitemapRegistry(() => {
      setRegistryVersion((v) => v + 1);
    });
  }, []);

  const liveData = useMemo(() => buildLiveSitemapData(), [registryVersion]);
  const query = searchQuery.trim().toLowerCase();

  const matchesSearch = (title: string, extra?: (string | undefined)[]) => {
    if (!query) return true;
    if (title.toLowerCase().includes(query)) return true;
    if (extra) {
      return extra.some((item) => item && item.toLowerCase().includes(query));
    }
    return false;
  };

  const filteredSections = useMemo(() => {
    return liveData.sections.map((section) => ({
      ...section,
      links: section.links.filter((link) =>
        matchesSearch(link.title, [link.path, ...(link.keywords || [])])
      ),
    }));
  }, [liveData.sections, query]);

  const filteredUniGroups = useMemo(() => {
    return liveData.universityGroups
      .map((group) => {
        const countryMatches = query && group.country.toLowerCase().includes(query);
        const unis = countryMatches
          ? group.universities
          : group.universities.filter((u) =>
              matchesSearch(u.name, [u.city, group.country, u.slug])
            );
        return {
          ...group,
          universities: unis,
        };
      })
      .filter((g) => g.universities.length > 0);
  }, [liveData.universityGroups, query]);

  const sectionById = (id: SitemapSection['id']) =>
    filteredSections.find((s) => s.id === id);

  const exploreSection = sectionById('explore');
  const destinationsSection = sectionById('destinations');
  const servicesSection = sectionById('services');
  const qualificationsSection = sectionById('qualifications');
  const resourcesSection = sectionById('resources');
  const companyPortalsSection = sectionById('company-portals');
  const subjectsSection = sectionById('subjects');
  const languageCentersSection = sectionById('language-centers-directory');

  const totalMatches = useMemo(() => {
    const secCount = filteredSections.reduce((acc, s) => acc + s.links.length, 0);
    const uniCount = filteredUniGroups.reduce((acc, g) => acc + g.universities.length, 0);
    return secCount + uniCount;
  }, [filteredSections, filteredUniGroups]);

  const handleDownloadXml = () => {
    const xml = generateXmlSitemap();
    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gees-sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderSectionColumn = (section?: SitemapSection) => {
    if (!section || section.links.length === 0) return null;
    return (
      <section aria-labelledby={`sitemap-sec-${section.id}`} className="min-w-0">
        <div className="flex items-baseline justify-between gap-2 mb-3.5">
          <h2
            id={`sitemap-sec-${section.id}`}
            className="text-[19px] sm:text-[21px] font-semibold tracking-[-0.015em] text-[#1d1d1f] dark:text-white leading-[1.2]"
          >
            {section.title}
          </h2>
          <span className="text-xs font-normal text-[#7a7a7a] dark:text-slate-400 tabular-nums shrink-0">
            {section.links.length}
          </span>
        </div>
        <ul className="space-y-2">
          {section.links.map((link: SitemapLinkItem) => (
            <li key={link.id}>
              <button
                type="button"
                onClick={() => onNavigate(link.view, link.payload)}
                className="no-min-touch group inline-flex items-baseline gap-1.5 text-left text-[15px] leading-[1.5] text-[#0066cc] dark:text-[#2997ff] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3] rounded-xs cursor-pointer"
              >
                {link.flagEmoji && (
                  <span aria-hidden="true" className="text-sm shrink-0">
                    {link.flagEmoji}
                  </span>
                )}
                <span>{link.title}</span>
                {link.meta && (
                  <span className="text-[12px] text-[#7a7a7a] dark:text-slate-500 font-normal no-underline group-hover:no-underline">
                    ({link.meta})
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </section>
    );
  };

  const visibleSubjectLinks = useMemo(() => {
    if (!subjectsSection) return [];
    if (query || showAllSubjects) return subjectsSection.links;
    return subjectsSection.links.slice(0, 24);
  }, [subjectsSection, query, showAllSubjects]);

  const hasRow1 =
    (exploreSection?.links.length || 0) +
      (destinationsSection?.links.length || 0) +
      (servicesSection?.links.length || 0) >
    0;

  const hasRow2 =
    (qualificationsSection?.links.length || 0) +
      (resourcesSection?.links.length || 0) +
      (companyPortalsSection?.links.length || 0) >
    0;

  return (
    <div className="w-full bg-white dark:bg-[#0a1120] text-[#1d1d1f] dark:text-slate-100 transition-colors">
      <div className="max-w-[980px] mx-auto px-5 sm:px-6 lg:px-8 pt-6 pb-16 sm:pt-10 sm:pb-24">
        {/* Location Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="inline-flex items-center gap-1.5 text-xs font-normal text-[#7a7a7a] dark:text-slate-400 mb-5"
        >
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="no-min-touch inline-flex items-center gap-1 text-[#1d1d1f] dark:text-slate-300 hover:text-[#0066cc] dark:hover:text-[#2997ff] hover:underline transition-colors cursor-pointer"
          >
            <svg
              className="w-3.5 h-3.5 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path d="M3 10.5 12 3l9 7.5" />
              <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
            </svg>
            <span>Home</span>
          </button>
          <svg
            className="w-3 h-3 text-[#7a7a7a] shrink-0"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
          <span className="text-[#1d1d1f] dark:text-white font-semibold" aria-current="page">
            Site Map
          </span>
        </nav>

        {/* Apple-Style Minimal Editorial Header */}
        <header className="pb-8 border-b border-[#e0e0e0] dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-[36px] sm:text-[48px] font-semibold tracking-[-0.02em] leading-[1.08] text-[#1d1d1f] dark:text-white">
                GEES Site Map
              </h1>
              <p className="mt-2.5 text-[17px] leading-[1.47] tracking-[-0.015em] text-[#7a7a7a] dark:text-slate-400">
                Complete index of all GEES pages, destinations, services, subjects, and partner universities — updated automatically.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownloadXml}
              className="no-min-touch self-start sm:self-end inline-flex items-center gap-1.5 text-[14px] text-[#0066cc] dark:text-[#2997ff] hover:underline font-normal shrink-0 cursor-pointer"
            >
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
              <span>Download sitemap.xml</span>
            </button>
          </div>

          {/* Search & Live Index Count Bar */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <svg
                className="w-4 h-4 text-[#7a7a7a] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="7.5" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find a page, destination, service or university..."
                aria-label="Filter site map links"
                className="w-full h-11 pl-10 pr-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 text-[15px] font-medium text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:border-[#0a1120] dark:focus:border-[#fbb034] focus:ring-1 focus:ring-[#0a1120] dark:focus:ring-[#fbb034] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear filter"
                  onClick={() => setSearchQuery('')}
                  className="no-min-touch absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#7a7a7a] hover:text-[#1d1d1f] dark:hover:text-white cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
            </div>

            <div className="text-[13px] text-[#7a7a7a] dark:text-slate-400 tabular-nums">
              {query ? (
                <span>
                  Showing <strong className="font-semibold text-[#1d1d1f] dark:text-white">{totalMatches.toLocaleString()}</strong> matching links
                </span>
              ) : (
                <span>
                  <strong className="font-semibold text-[#1d1d1f] dark:text-white">
                    {liveData.stats.totalIndexedPages.toLocaleString()}
                  </strong>{' '}
                  indexed links · {liveData.stats.destinationsCount} destinations ·{' '}
                  {liveData.stats.universitiesCount} partner universities
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Empty Search State */}
        {totalMatches === 0 && (
          <div className="py-16 text-center border-b border-[#e0e0e0] dark:border-slate-800">
            <p className="text-[19px] font-semibold text-[#1d1d1f] dark:text-white">
              No pages matched &ldquo;{searchQuery}&rdquo;
            </p>
            <p className="mt-1.5 text-[15px] text-[#7a7a7a] dark:text-slate-400">
              Try searching for a country, visa service, subject, or university name.
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="mt-5 px-5 py-2.5 rounded-full bg-[#0066cc] hover:bg-[#0071e3] text-white text-[15px] font-normal transition-colors cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        )}

        {/* Row 1: Explore & Directories | Study Destinations | Admissions & Visa Services */}
        {hasRow1 && (
          <div className="py-10 sm:py-12 border-b border-[#e0e0e0] dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-10">
            {renderSectionColumn(exploreSection)}
            {renderSectionColumn(destinationsSection)}
            {renderSectionColumn(servicesSection)}
          </div>
        )}

        {/* Row 2: Study Levels & Qualifications | Resources & Community | About GEES & Portals */}
        {hasRow2 && (
          <div className="py-10 sm:py-12 border-b border-[#e0e0e0] dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-10">
            {renderSectionColumn(qualificationsSection)}
            {renderSectionColumn(resourcesSection)}
            {renderSectionColumn(companyPortalsSection)}
          </div>
        )}

        {/* Row 3: Courses by Subject (A–Z) — Live from IDP Subject Registry */}
        {subjectsSection && subjectsSection.links.length > 0 && (
          <section
            aria-labelledby="sitemap-sec-subjects"
            className="py-10 sm:py-12 border-b border-[#e0e0e0] dark:border-slate-800"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-5">
              <div className="flex items-baseline gap-2.5">
                <h2
                  id="sitemap-sec-subjects"
                  className="text-[19px] sm:text-[21px] font-semibold tracking-[-0.015em] text-[#1d1d1f] dark:text-white"
                >
                  Courses by Subject (A–Z)
                </h2>
                <span className="text-xs text-[#7a7a7a] dark:text-slate-400 tabular-nums">
                  {subjectsSection.links.length} disciplines
                </span>
              </div>
              {!query && subjectsSection.links.length > 24 && (
                <button
                  type="button"
                  onClick={() => setShowAllSubjects((prev) => !prev)}
                  className="no-min-touch text-[14px] text-[#0066cc] dark:text-[#2997ff] hover:underline self-start sm:self-auto cursor-pointer"
                >
                  {showAllSubjects
                    ? 'Show fewer subjects'
                    : `Show all ${subjectsSection.links.length} subjects`}
                </button>
              )}
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-2">
              {visibleSubjectLinks.map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(link.view, link.payload)}
                    className="no-min-touch text-left text-[15px] leading-[1.5] text-[#0066cc] dark:text-[#2997ff] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3] rounded-xs cursor-pointer"
                  >
                    {link.title}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Row 3.5: Language Centers Directory — Live from LANGUAGE_CENTERS_LIST */}
        {languageCentersSection && languageCentersSection.links.length > 0 && (
          <section
            aria-labelledby="sitemap-sec-language-centers"
            className="py-10 sm:py-12 border-b border-[#e0e0e0] dark:border-slate-800"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-5">
              <div className="flex items-baseline gap-2.5">
                <h2
                  id="sitemap-sec-language-centers"
                  className="text-[19px] sm:text-[21px] font-semibold tracking-[-0.015em] text-[#1d1d1f] dark:text-white"
                >
                  Language Centers in Malaysia
                </h2>
                <span className="text-xs text-[#7a7a7a] dark:text-slate-400 tabular-nums">
                  {languageCentersSection.links.length} centers
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('language-center-list')}
                className="no-min-touch text-[14px] text-[#0066cc] dark:text-[#2997ff] hover:underline self-start sm:self-auto cursor-pointer"
              >
                Open Language Center List →
              </button>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-2">
              {languageCentersSection.links.map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(link.view, link.payload)}
                    className="no-min-touch inline-flex items-baseline gap-1.5 text-left text-[15px] leading-[1.5] text-[#0066cc] dark:text-[#2997ff] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3] rounded-xs cursor-pointer"
                  >
                    <span>{link.title}</span>
                    {link.meta && (
                      <span className="text-[12px] text-[#7a7a7a] dark:text-slate-500 font-normal">
                        ({link.meta})
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Row 4: Partner Universities Directory by Destination — Live from Partner University Registry */}
        {filteredUniGroups.length > 0 && (
          <section
            aria-labelledby="sitemap-sec-universities"
            className="py-10 sm:py-12 border-b border-[#e0e0e0] dark:border-slate-800"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-6">
              <div className="flex items-baseline gap-2.5">
                <h2
                  id="sitemap-sec-universities"
                  className="text-[19px] sm:text-[21px] font-semibold tracking-[-0.015em] text-[#1d1d1f] dark:text-white"
                >
                  Partner Universities by Destination
                </h2>
                <span className="text-xs text-[#7a7a7a] dark:text-slate-400 tabular-nums">
                  {filteredUniGroups.reduce((sum, g) => sum + g.universities.length, 0)} institutions
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('universities')}
                className="no-min-touch text-[14px] text-[#0066cc] dark:text-[#2997ff] hover:underline self-start sm:self-auto cursor-pointer"
              >
                Open full university explorer →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-10">
              {filteredUniGroups.map((group) => {
                const isExpanded = Boolean(query) || Boolean(expandedCountries[group.country]);
                const shownUnis = isExpanded
                  ? group.universities
                  : group.universities.slice(0, INITIAL_UNIS_PER_COUNTRY);
                const remaining = group.universities.length - shownUnis.length;

                return (
                  <div key={group.country} className="min-w-0">
                    <div className="flex items-baseline justify-between gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() =>
                          group.destinationSlug
                            ? onNavigate('study-destination', group.destinationSlug)
                            : onNavigate('universities')
                        }
                        className="no-min-touch inline-flex items-center gap-1.5 text-[16px] font-semibold text-[#1d1d1f] dark:text-white hover:text-[#0066cc] dark:hover:text-[#2997ff] transition-colors text-left cursor-pointer"
                      >
                        <span aria-hidden="true">{group.flagEmoji}</span>
                        <span>{group.country}</span>
                      </button>
                      <span className="text-xs text-[#7a7a7a] dark:text-slate-400 tabular-nums">
                        {group.universities.length}
                      </span>
                    </div>

                    <ul className="space-y-1.5">
                      {shownUnis.map((uni) => (
                        <li key={uni.id}>
                          <button
                            type="button"
                            onClick={() => onNavigate('universities', uni.slug)}
                            className="no-min-touch text-left text-[14px] leading-[1.45] text-[#0066cc] dark:text-[#2997ff] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3] rounded-xs cursor-pointer"
                          >
                            {uni.name}
                          </button>
                        </li>
                      ))}
                    </ul>

                    {!query && group.universities.length > INITIAL_UNIS_PER_COUNTRY && (
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedCountries((prev) => ({
                            ...prev,
                            [group.country]: !prev[group.country],
                          }))
                        }
                        className="no-min-touch mt-2.5 text-[13px] font-medium text-[#1d1d1f] dark:text-slate-300 hover:text-[#0066cc] dark:hover:text-[#2997ff] hover:underline cursor-pointer"
                      >
                        {isExpanded
                          ? 'Show fewer'
                          : `+ Show ${remaining} more in ${group.country}`}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Quiet Parchment Support & Auto-Sync Footer Note */}
        <div className="mt-10 rounded-[18px] bg-[#f5f5f7] dark:bg-slate-900/70 border border-[#e0e0e0]/70 dark:border-slate-800 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-xl">
            <h3 className="text-[17px] font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.015em]">
              Need personal study abroad guidance?
            </h3>
            <p className="text-[14px] leading-[1.45] text-[#7a7a7a] dark:text-slate-400">
              Speak directly with a verified GEES admissions counselor in Dhaka or Subang Jaya. This site map stays synced automatically with every new page, country, service, and partner university added to GEES.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="px-5 py-2.5 rounded-full bg-white dark:bg-slate-800 border border-[#e0e0e0] dark:border-slate-700 text-[#0066cc] dark:text-[#2997ff] text-[14px] font-normal hover:bg-[#fafafc] dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Contact Us
            </button>
            <button
              type="button"
              onClick={() => onOpenConsultation('General Study Abroad Guidance')}
              className="px-5 py-2.5 rounded-full bg-[#0066cc] hover:bg-[#0071e3] text-white text-[14px] font-normal transition-colors cursor-pointer"
            >
              Book Free Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteMapView;
