/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES "Meet Our Counselors" Section with Bidirectional Photo Sync & 1-on-1 Booking
 */

import React, { useState } from 'react';
import { mockCounselors } from '../../data/mockDatabase.ts';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';
import { AnimatedTabs } from '../ui/animated-tabs.tsx';

interface CounselorsSectionProps {
  onOpenBooking: (counselorName?: string, roleTitle?: string) => void;
}

export const CounselorsSection: React.FC<CounselorsSectionProps> = ({ onOpenBooking }) => {
  const [activeDepartment, setActiveDepartment] = useState<'all' | 'leadership' | 'counseling' | 'growth'>('all');
  const [hoveredCounselorId, setHoveredCounselorId] = useState<string | null>(null);

  const departmentTabs = [
    { label: 'All Experts', id: 'all' },
    { label: 'Leadership', id: 'leadership' },
    { label: 'Admissions & Visas', id: 'counseling' },
    { label: 'Global Outreach', id: 'growth' }
  ];

  const filteredCounselors = activeDepartment === 'all'
    ? mockCounselors
    : mockCounselors.filter(c => c.department === activeDepartment);

  return (
    <section id="counselors-section" className="py-16 md:py-24 relative overflow-hidden bg-white dark:bg-[#070b19] border-t border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 px-2">
          <h2 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white flex items-center justify-center flex-wrap gap-2 sm:gap-3 leading-tight">
            <span>Meet Our</span>
            <span className="bg-[#fbb034] text-slate-950 px-3.5 sm:px-6 py-0.5 sm:py-1 rounded-xl sm:rounded-2xl tracking-tight font-black shadow-sm">
              Counselors
            </span>
          </h2>
          <p className="mt-2.5 sm:mt-3 text-sm sm:text-lg text-slate-500 dark:text-slate-400 font-normal leading-relaxed px-2">
            Personalized attention and expert guidance from seasoned admissions mentors.
          </p>

          {/* Department Filter Tabs with Universal 120 FPS Sliding Indicator */}
          <div className="mt-6 sm:mt-8 w-full flex justify-center">
            <AnimatedTabs
              tabs={departmentTabs}
              activeId={activeDepartment}
              onChange={(id) => setActiveDepartment(id as any)}
              size="md"
            />
          </div>
        </div>

        {/* 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14 items-start">
          {/* Mobile High-Density 2-Column Grid (< sm) */}
          <div className="grid grid-cols-2 sm:hidden gap-2.5 w-full">
            {filteredCounselors.map((c) => {
              return (
                <div
                  key={`mobile-${c.id}`}
                  onClick={() => onOpenBooking(c.name, c.role)}
                  className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-slate-900 shadow-sm border border-slate-200/40 dark:border-slate-800/80 active:scale-[0.98] transition-all cursor-pointer group"
                >
                  <img
                    src={c.photoUrl}
                    alt={c.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                    loading="lazy"
                    decoding="async"
                  />
                  {/* Top-Right Quick WhatsApp with 44px effective touch target */}
                  <div className="absolute top-1 right-1 z-20 flex items-center">
                    <a
                      href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center active:scale-90 transition-transform"
                      title="Quick WhatsApp"
                      aria-label={`WhatsApp ${c.name}`}
                    >
                      <span className="w-8 h-8 rounded-full bg-slate-900/80 backdrop-blur-xs text-emerald-400 flex items-center justify-center border border-white/20 shadow-xs">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"></path></svg>
                      </span>
                    </a>
                  </div>
                  {/* Scrim and bottom info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
                  <div className="absolute bottom-0 inset-x-0 p-2.5 text-white">
                    <span className="text-[8.5px] uppercase font-black tracking-wider text-[#fbb034] block mb-0.5 truncate">
                      {c.role}
                    </span>
                    <h4 className="text-[12px] font-bold leading-tight truncate text-white">{c.name}</h4>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Left: Staggered 3-Column Photo Grid (Tablet & Desktop only: sm+) */}
          <div className="hidden sm:grid lg:col-span-7 sm:grid-cols-3 gap-3.5 sm:gap-4 pt-2">
            {/* Col 1 */}
            <div className="flex flex-col gap-3.5 sm:gap-4">
              {filteredCounselors.slice(0, 2).map((c) => {
                const isHovered = hoveredCounselorId === c.id;
                return (
                  <div
                    key={c.id}
                    onMouseEnter={() => setHoveredCounselorId(c.id)}
                    onMouseLeave={() => setHoveredCounselorId(null)}
                    onClick={() => onOpenBooking(c.name, c.role)}
                    className={`relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[3/4] bg-slate-900 cursor-pointer shadow-md transition-all duration-300 ${
                      isHovered ? 'ring-4 ring-[#fbb034] scale-105 z-20 shadow-2xl' : 'hover:scale-[1.02]'
                    }`}
                  >
                    <img
                      src={c.photoUrl}
                      alt={c.name}
                      className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? 'grayscale-0' : 'grayscale'}`}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/20 to-transparent"></div>
                    <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 text-white">
                      <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-amber-300 block mb-0.5">
                        {c.role}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold leading-snug">{c.name}</h4>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Col 2 */}
            <div className="flex flex-col gap-3.5 sm:gap-4 mt-8 sm:mt-12">
              {filteredCounselors.slice(2, 4).map((c) => {
                const isHovered = hoveredCounselorId === c.id;
                return (
                  <div
                    key={c.id}
                    onMouseEnter={() => setHoveredCounselorId(c.id)}
                    onMouseLeave={() => setHoveredCounselorId(null)}
                    onClick={() => onOpenBooking(c.name, c.role)}
                    className={`relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[3/4] bg-slate-900 cursor-pointer shadow-md transition-all duration-300 ${
                      isHovered ? 'ring-4 ring-[#fbb034] scale-105 z-20 shadow-2xl' : 'hover:scale-[1.02]'
                    }`}
                  >
                    <img
                      src={c.photoUrl}
                      alt={c.name}
                      className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? 'grayscale-0' : 'grayscale'}`}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/20 to-transparent"></div>
                    <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 text-white">
                      <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-amber-300 block mb-0.5">
                        {c.role}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold leading-snug">{c.name}</h4>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Col 3 */}
            <div className="flex flex-col gap-3.5 sm:gap-4 mt-4 sm:mt-6">
              {filteredCounselors.slice(4, 6).map((c) => {
                const isHovered = hoveredCounselorId === c.id;
                return (
                  <div
                    key={c.id}
                    onMouseEnter={() => setHoveredCounselorId(c.id)}
                    onMouseLeave={() => setHoveredCounselorId(null)}
                    onClick={() => onOpenBooking(c.name, c.role)}
                    className={`relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[3/4] bg-slate-900 cursor-pointer shadow-md transition-all duration-300 ${
                      isHovered ? 'ring-4 ring-[#fbb034] scale-105 z-20 shadow-2xl' : 'hover:scale-[1.02]'
                    }`}
                  >
                    <img
                      src={c.photoUrl}
                      alt={c.name}
                      className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? 'grayscale-0' : 'grayscale'}`}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/20 to-transparent"></div>
                    <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 text-white">
                      <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-amber-300 block mb-0.5">
                        {c.role}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold leading-snug">{c.name}</h4>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Interactive Member List */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Our Advisory Board</div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Available Today
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 flex flex-col">
              {filteredCounselors.map((counselor) => {
                const isHovered = hoveredCounselorId === counselor.id;
                return (
                  <div
                    key={counselor.id}
                    onMouseEnter={() => setHoveredCounselorId(counselor.id)}
                    onMouseLeave={() => setHoveredCounselorId(null)}
                    onClick={() => onOpenBooking(counselor.name, counselor.role)}
                    className={`py-3.5 sm:py-4 px-3.5 rounded-2xl cursor-pointer transition-all duration-300 transform will-change-transform ${
                      isHovered
                        ? 'bg-amber-50/70 dark:bg-slate-800/90 -translate-y-1 shadow-md border border-amber-200/60 dark:border-amber-500/30'
                        : 'hover:bg-amber-50/40 dark:hover:bg-slate-800/60 hover:-translate-y-0.5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {/* Active Indicator Bar */}
                        <span
                          className={`w-1.5 h-9 rounded-full transition-all duration-300 ${
                            isHovered ? 'bg-[#fbb034] scale-y-100' : 'bg-slate-200 dark:bg-slate-700 scale-y-75'
                          }`}
                        />
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 block">
                            {counselor.role}
                          </span>
                          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                            {counselor.name}
                          </h3>
                        </div>
                      </div>

                      {/* Social Actions + Direct Book Button */}
                      <div className="flex items-center gap-1.5">
                        {/* WhatsApp */}
                        <a
                          href={`https://wa.me/${counselor.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center hover:scale-110 active:scale-90 transition-transform"
                          title="Chat on WhatsApp"
                        >
                          <svg className="w-4 h-4 sm:w-3.5 sm:h-3.5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"></path></svg>
                        </a>
                        {/* LinkedIn */}
                        <a
                          href={counselor.linkedInUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-sky-50 dark:bg-sky-950/40 text-sky-600 flex items-center justify-center hover:scale-110 active:scale-90 transition-transform"
                          title="LinkedIn Profile"
                        >
                          <svg className="w-4 h-4 sm:w-3.5 sm:h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
                        </a>
                        {/* Book CTA */}
                        <div className="hidden sm:block">
                          <InteractiveHoverButton
                            type="button"
                            text="Book"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenBooking(counselor.name, counselor.role);
                            }}
                            className="ml-1 w-20 py-2 sm:py-1.5 min-h-[40px] px-2.5 rounded-xl bg-white dark:bg-slate-900 text-slate-950 dark:text-white border-slate-300 dark:border-slate-700 text-xs font-bold shadow-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Fast-Track Consultation Block */}
            <div className="pt-2">
              <div className="bg-slate-900 text-white p-4 xs:p-5 rounded-2xl flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 shadow-lg">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-[#fbb034]">Fast-Track Processing</p>
                  <h5 className="text-sm font-bold mt-0.5">Need immediate advice today?</h5>
                </div>
                <InteractiveHoverButton
                  type="button"
                  text="Connect Now"
                  onClick={() => onOpenBooking('Express Desk Advisor', 'Admissions Desk')}
                  className="min-h-[44px] w-full xs:w-auto px-5 py-2.5 bg-amber-500 hover:bg-[#fbb034] text-slate-950 border-amber-400 text-xs font-extrabold rounded-xl shadow-sm cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
