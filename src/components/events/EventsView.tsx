/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Global Education Expert Services - Events & Spot Assessment Fairs View
 * Built on the shared GEES Explorer Theme (ExplorerPageShell, ExplorerHeroBanner, SectionHeader).
 */

import React, { useState, useMemo } from 'react';
import { mockEvents } from '../../data/mockEvents.ts';
import { EventItem } from '../../types/index.ts';
import {
  EXPLORER_THEME,
  ExplorerCtaBanner,
  ExplorerEmptyState,
  ExplorerFilterBar,
  ExplorerHeroBanner,
  ExplorerHeroMetrics,
  ExplorerPageShell,
  SectionHeader,
} from '../portal/ExplorerTheme.tsx';

interface EventsViewProps {
  onBackToHome?: () => void;
  onOpenConsultation?: (defaultSubject?: string) => void;
  onNavigate?: (view: string, payload?: any) => void;
}

const EVENT_TYPES = [
  'All',
  'Spot Assessment Fair',
  'Roadshow',
  'Webinar',
  'Visa & Scholarship Clinic',
  'IELTS Workshop',
];

const VENUE_OPTIONS = [
  { id: 'All', label: 'All Venues' },
  { id: 'Dhaka', label: 'Kakrail, Dhaka' },
  { id: 'Malaysia', label: 'Subang Jaya' },
  { id: 'Virtual', label: 'Online Zoom' },
  { id: 'Hybrid', label: 'Hybrid' },
];

export const EventsView: React.FC<EventsViewProps> = ({
  onBackToHome,
  onOpenConsultation,
  onNavigate,
}) => {
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [registeredEventIds, setRegisteredEventIds] = useState<Set<string>>(new Set());

  const handleGoHome = () => {
    if (onBackToHome) onBackToHome();
    else onNavigate?.('home');
  };

  const filteredEvents = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return mockEvents.filter((evt) => {
      const matchesType = selectedType === 'All' || evt.type === selectedType;
      const matchesLoc = selectedLocation === 'All' || evt.locationType === selectedLocation;
      const matchesSearch =
        !q ||
        evt.title.toLowerCase().includes(q) ||
        evt.description.toLowerCase().includes(q) ||
        evt.venueName.toLowerCase().includes(q) ||
        evt.participatingUniversities.some(
          (u) => u.name.toLowerCase().includes(q) || u.country.toLowerCase().includes(q)
        );
      return matchesType && matchesLoc && matchesSearch;
    });
  }, [selectedType, selectedLocation, searchQuery]);

  const hasActiveFilters =
    selectedType !== 'All' || selectedLocation !== 'All' || searchQuery.trim().length > 0;

  const resetFilters = () => {
    setSelectedType('All');
    setSelectedLocation('All');
    setSearchQuery('');
  };

  const handleRegister = (evt: EventItem) => {
    setRegisteredEventIds((prev) => new Set(prev).add(evt.id));
    if (onOpenConsultation) {
      onOpenConsultation(`VIP Pass for ${evt.title} (${evt.dateText})`);
    }
  };

  const downloadCalendarIcs = (evt: EventItem) => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//GEES Education Events//EN
BEGIN:VEVENT
SUMMARY:${evt.title}
DESCRIPTION:${evt.description.replace(/\n/g, ' ')}
LOCATION:${evt.venueName}, ${evt.venueAddress}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${evt.slug}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <ExplorerPageShell>
      {/* 1. Shared Dark-Navy Explorer Hero Banner & Full-Width Search */}
      <ExplorerHeroBanner
        dataPurpose="events-hero-banner"
        onNavigateHome={handleGoHome}
        breadcrumbs={[{ label: 'Education Fairs & Events' }]}
        titlePrefix="Global Education"
        titleHighlight="Fairs"
        titleSuffix="& Spot Assessments"
        subtitle="Meet official university delegates from the UK, Australia, Malaysia, New Zealand, and Europe with free application fee waivers"
        rightSlot={
          <ExplorerHeroMetrics
            items={[
              { value: '100%', label: 'Free Entry & VIP Pass' },
              { value: '167', suffix: '+', label: 'Partner Universities' },
              { value: '$4.2M', suffix: '+', label: 'Scholarships Awarded' },
              { value: '98%', label: 'Visa Grant Success' },
            ]}
          />
        }
        search={{
          value: searchQuery,
          onChange: setSearchQuery,
          placeholder: 'Search fairs, participating universities, cities, or workshops...',
          ariaLabel: 'Search education fairs and spot assessments',
        }}
      />

      {/* 2. Shared Section Header (Consistent mb-12 & Vertically Centered Title) */}
      <SectionHeader
        title="Upcoming Education Fairs & Spot Assessments"
        subtitle="Filter by event format or venue location to claim your free entry pass and add sessions to your calendar."
        countLabel={`(${filteredEvents.length.toLocaleString()})`}
        rightSlot={
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {VENUE_OPTIONS.map((venue) => {
              const isActive = selectedLocation === venue.id;
              return (
                <button
                  key={venue.id}
                  type="button"
                  onClick={() => setSelectedLocation(venue.id)}
                  className={`no-min-touch h-8 px-3 rounded-lg border text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    isActive
                      ? EXPLORER_THEME.filterButtonActive
                      : EXPLORER_THEME.filterButtonIdle
                  }`}
                >
                  {venue.label}
                </button>
              );
            })}
          </div>
        }
      />

      {/* 3. Shared Quiet Event-Type Filter Bar */}
      <ExplorerFilterBar
        options={EVENT_TYPES.map((type) => ({ id: type, label: type }))}
        activeId={selectedType}
        onSelect={setSelectedType}
        totalCount={filteredEvents.length}
        countEntityLabel="Events"
        hasActiveFilters={hasActiveFilters}
        onReset={resetFilters}
      />

      {/* 4. Events Cards Grid or Shared Empty State */}
      {filteredEvents.length === 0 ? (
        <ExplorerEmptyState
          icon="event_busy"
          title="No events match your current filters"
          description="Try clearing your search term or selecting a different venue or event type above."
          onReset={resetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEvents.map((evt) => {
            const isRegistered = registeredEventIds.has(evt.id);
            const venueBadge =
              evt.locationType === 'Dhaka'
                ? 'Kakrail, Dhaka'
                : evt.locationType === 'Malaysia'
                ? 'Subang Jaya'
                : evt.locationType;

            return (
              <article
                key={evt.id}
                className={`${EXPLORER_THEME.card} overflow-hidden flex flex-col group`}
              >
                {/* Event Banner Image */}
                <div className="relative h-52 overflow-hidden bg-slate-900">
                  <img
                    src={evt.bannerUrl}
                    alt={evt.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1120]/85 via-[#0a1120]/25 to-transparent pointer-events-none" />

                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#fbb034] text-[#0a1120]">
                      {evt.type}
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#0a1120]/85 text-white border border-white/15 inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] text-[#fbb034]">
                        location_on
                      </span>
                      <span>{venueBadge}</span>
                    </span>
                  </div>

                  <div className="absolute bottom-3.5 left-4 right-4 text-xs font-semibold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[15px] text-[#fbb034]">
                      calendar_month
                    </span>
                    <span>
                      {evt.dateText} · {evt.timeText}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className={`${EXPLORER_THEME.cardPadding} flex-1 flex flex-col justify-between gap-5`}>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug group-hover:text-amber-600 dark:group-hover:text-[#fbb034] transition-colors">
                        {evt.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mt-1.5">
                        {evt.description}
                      </p>
                    </div>

                    {/* Venue Block */}
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 text-xs">
                      <span className="material-symbols-outlined text-[16px] text-slate-500 dark:text-slate-400 shrink-0 mt-0.5">
                        map
                      </span>
                      <div className="min-w-0">
                        <strong className="block font-semibold text-slate-900 dark:text-white">
                          {evt.venueName}
                        </strong>
                        <span className="text-slate-500 dark:text-slate-400 block truncate">
                          {evt.venueAddress}
                        </span>
                      </div>
                    </div>

                    {/* Participating Institutions */}
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Participating Institutions
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {evt.participatingUniversities.map((uni, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/70 dark:border-slate-700"
                          >
                            <span>{uni.flagEmoji}</span>
                            <span>{uni.name}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Highlights */}
                    <ul className="space-y-1.5">
                      {evt.highlights.slice(0, 3).map((h, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300"
                        >
                          <span className="material-symbols-outlined text-[15px] text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                            check_circle
                          </span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                        Free Entry Pass
                      </span>
                      <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">
                        ·
                      </span>
                      <button
                        type="button"
                        onClick={() => downloadCalendarIcs(evt)}
                        title="Add to Calendar (.ics)"
                        className="no-min-touch inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          calendar_add_on
                        </span>
                        <span>Save .ICS</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRegister(evt)}
                      className={
                        isRegistered
                          ? 'inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-[13px] transition-all cursor-pointer whitespace-nowrap'
                          : EXPLORER_THEME.primaryGoldButton
                      }
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {isRegistered ? 'verified' : 'how_to_reg'}
                      </span>
                      <span>{isRegistered ? 'Pass Requested' : 'Claim Free Pass'}</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* 5. Shared Dark-Navy Bottom Consultation CTA */}
      <ExplorerCtaBanner
        title="Planning to bring your institution or student group?"
        description="Contact our Events Team to schedule a dedicated spot-assessment session or group counseling at our Dhaka or Subang Jaya offices."
        primaryLabel="Contact Event Coordinators"
        onPrimaryClick={() => onOpenConsultation?.('Group Event Inquiry / Spot Assessment')}
        secondaryLabel="WhatsApp Direct"
        secondaryHref="https://wa.me/8801805529578"
      />
    </ExplorerPageShell>
  );
};
