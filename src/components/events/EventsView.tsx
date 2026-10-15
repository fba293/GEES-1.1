/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Global Education Expert Services - Events & Spot Assessment Fairs View
 */

import React, { useState, useMemo } from 'react';
import { mockEvents } from '../../data/mockEvents.ts';
import { EventItem } from '../../types/index.ts';

interface EventsViewProps {
  onBackToHome?: () => void;
  onOpenConsultation?: (defaultSubject?: string) => void;
  onNavigate?: (view: string, payload?: any) => void;
}

export const EventsView: React.FC<EventsViewProps> = ({
  onBackToHome,
  onOpenConsultation,
  onNavigate
}) => {
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [registeredEventIds, setRegisteredEventIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  // Filtered Events List
  const filteredEvents = useMemo(() => {
    return mockEvents.filter((evt) => {
      const matchesType = selectedType === 'All' || evt.type === selectedType;
      const matchesLoc = selectedLocation === 'All' || evt.locationType === selectedLocation;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        evt.title.toLowerCase().includes(q) ||
        evt.description.toLowerCase().includes(q) ||
        evt.venueName.toLowerCase().includes(q) ||
        evt.participatingUniversities.some((u) => u.name.toLowerCase().includes(q) || u.country.toLowerCase().includes(q));

      return matchesType && matchesLoc && matchesSearch;
    });
  }, [selectedType, selectedLocation, searchQuery]);

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
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b19] text-slate-900 dark:text-slate-100 transition-colors pb-16">
      {/* Top Breadcrumb Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors cursor-pointer group"
        >
          <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
          <span>Back to GEES Home</span>
        </button>
      </div>

      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-12 md:py-16 mb-10 shadow-xl">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider mb-4">
              <span className="material-symbols-outlined text-sm animate-pulse">event_upcoming</span>
              <span>100% Free Entry & Spot Offer Letters</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Global Education Fairs & <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
                University Spot Assessments
              </span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6">
              Connect face-to-face or virtually with official international university delegates from the UK, Australia, Malaysia, New Zealand, and Europe. Enjoy 100% application fee waivers, on-the-spot profile evaluation, and scholarship guidance.
            </p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <p className="text-2xl font-black text-amber-400">100% Free</p>
                <p className="text-xs text-slate-300 font-medium">Entry & VIP Access</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <p className="text-2xl font-black text-amber-400">167+</p>
                <p className="text-xs text-slate-300 font-medium">Partner Universities</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <p className="text-2xl font-black text-amber-400">$4.2M+</p>
                <p className="text-xs text-slate-300 font-medium">Scholarships Awarded</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <p className="text-2xl font-black text-amber-400">98%</p>
                <p className="text-xs text-slate-300 font-medium">Visa Grant Success</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Events Catalog Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search & Filter Controls Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-md border border-slate-200 dark:border-slate-800 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
              <input
                type="text"
                placeholder="Search events, universities, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-amber-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Location Selector */}
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 shrink-0">Venue:</span>
              {['All', 'Dhaka', 'Malaysia', 'Virtual', 'Hybrid'].map((loc) => (
                <button
                  key={loc}
                  onClick={() => setSelectedLocation(loc)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedLocation === loc
                      ? 'bg-blue-600 dark:bg-amber-500 text-white dark:text-slate-950 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {loc === 'Dhaka' ? '🇧🇩 Kakrail, Dhaka' : loc === 'Malaysia' ? '🇲🇾 Subang Jaya' : loc === 'Virtual' ? '💻 Online Zoom' : loc}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-800 pb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 shrink-0">Event Type:</span>
            {[
              'All',
              'Spot Assessment Fair',
              'Roadshow',
              'Webinar',
              'Visa & Scholarship Clinic',
              'IELTS Workshop'
            ].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedType === type
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Section Title & Results Count */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-500">campaign</span>
            <span>Featured GEES Fairs & Sessions</span>
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
            {filteredEvents.length} {filteredEvents.length === 1 ? 'Event' : 'Events'} Available
          </span>
        </div>

        {/* Events Cards Grid */}
        {filteredEvents.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 my-8">
            <span className="material-symbols-outlined text-5xl text-slate-400 mb-3">event_busy</span>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">No events found matching your criteria</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
              Try adjusting your search filters or clear your selection to view all upcoming university fairs.
            </p>
            <button
              onClick={() => {
                setSelectedType('All');
                setSelectedLocation('All');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {filteredEvents.map((evt) => {
              const isRegistered = registeredEventIds.has(evt.id);

              return (
                <div
                  key={evt.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Event Image Banner with Overlays */}
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <img
                      src={evt.bannerUrl}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500 text-slate-950 shadow-md">
                        {evt.type}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-white backdrop-blur-md border border-white/20 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-amber-400">location_on</span>
                        <span>{evt.locationType === 'Dhaka' ? 'Kakrail, Dhaka' : evt.locationType === 'Malaysia' ? 'Subang Jaya' : evt.locationType}</span>
                      </span>
                    </div>

                    {/* Bottom Date Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <p className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">calendar_month</span>
                        <span>{evt.dateText} • {evt.timeText}</span>
                      </p>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-5">
                    <div>
                      {/* Title */}
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug mb-2 group-hover:text-blue-600 dark:group-hover:text-amber-400 transition-colors">
                        {evt.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
                        {evt.description}
                      </p>

                      {/* Venue Address */}
                      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 mb-4">
                        <span className="material-symbols-outlined text-sm text-red-500 shrink-0 mt-0.5">map</span>
                        <div className="min-w-0">
                          <strong className="block font-semibold text-slate-900 dark:text-white">{evt.venueName}</strong>
                          <span className="text-slate-500 dark:text-slate-400 block truncate">{evt.venueAddress}</span>
                        </div>
                      </div>

                      {/* Participating Universities */}
                      <div className="mb-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                          Participating Institutions & Delegates:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {evt.participatingUniversities.map((uni, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-900 dark:bg-blue-950/60 dark:text-blue-200 border border-blue-100 dark:border-blue-900/50"
                            >
                              <span>{uni.flagEmoji}</span>
                              <span>{uni.name}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Highlights Key Points */}
                      <div className="space-y-1.5">
                        {evt.highlights.slice(0, 3).map((h, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                            <span className="material-symbols-outlined text-sm text-emerald-500 shrink-0 mt-0.5">check_circle</span>
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                      {/* Free Entry tag & Calendar button */}
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <span className="inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                          <span className="material-symbols-outlined text-sm">confirmation_number</span>
                          <span>FREE PASS</span>
                        </span>
                        <button
                          onClick={() => downloadCalendarIcs(evt)}
                          title="Add to Calendar (.ics)"
                          className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">calendar_add_on</span>
                          <span className="hidden sm:inline">Add to Calendar</span>
                        </button>
                      </div>

                      {/* Registration CTA Button */}
                      <button
                        onClick={() => handleRegister(evt)}
                        className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                          isRegistered
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/20'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">{isRegistered ? 'verified' : 'how_to_reg'}</span>
                        <span>{isRegistered ? 'Pass Requested ✓' : 'Claim Free Pass'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Event Booking Help Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 mb-12 relative overflow-hidden">
          <div className="max-w-xl space-y-2 relative z-10 text-center md:text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
              Custom Group Booking or University Fair Inquiry
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Planning to bring your institution or group?
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Contact our Events Team directly to schedule a dedicated spot-assessment session or request personalized group counseling at Kakrail Dhaka or Subang Jaya Malaysia.
            </p>
          </div>
          <div className="relative z-10 shrink-0 w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onOpenConsultation?.('Group Event Inquiry / Spot Assessment')}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg hover:scale-105 cursor-pointer text-center"
            >
              Contact Event Coordinators
            </button>
            <a
              href="https://wa.me/8801805529578"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm transition-all backdrop-blur-md border border-white/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>WhatsApp Direct</span>
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
