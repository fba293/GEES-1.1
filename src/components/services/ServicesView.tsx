/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES - Global Education Expert Services
 * Dedicated Services Page featuring Connoisseur Stack Interactor GSAP Animation
 * 
 * Features:
 * - GSAP SVG clipping animation with horizontal stripes, hexagons, and sharp pixel grids
 * - Exact typography and font sizing from connoisseur-stack-interactor
 * - All 20 services from GEES with exact image URLs
 * - Interactive detail preview modal
 * - Category filter pills for rapid scanning
 * - 100% removed '6 Steps to your goal' section as requested
 */

import React, { useState, useMemo } from 'react';
import { mockServices } from '../../data/mockDatabase.ts';
import { ServiceItem } from '../../types/index.ts';
import { ConnoisseurStackInteractor, MenuItem } from '../ui/connoisseur-stack-interactor.tsx';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';
import { CountryServiceManager, OFFICIAL_COUNTRIES } from '../../utils/CountryServiceManager.ts';

interface ServicesViewProps {
  onBackToHome: () => void;
  onOpenConsultation: (serviceName?: string) => void;
  initialSelectedServiceSlug?: string;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  onBackToHome,
  onOpenConsultation,
  initialSelectedServiceSlug
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [countrySearch, setCountrySearch] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [activeModalService, setActiveModalService] = useState<ServiceItem | null>(() => {
    if (initialSelectedServiceSlug) {
      return mockServices.find(s => s.slug === initialSelectedServiceSlug) || null;
    }
    return null;
  });

  // Default items array mapped to the 11 official partner countries
  const defaultItems: MenuItem[] = useMemo(() => {
    return CountryServiceManager.getDefaultCountryMenuItems();
  }, []);

  // Filtered list of countries based on search term
  const filteredCountryOptions = useMemo(() => {
    if (!countrySearch.trim()) return OFFICIAL_COUNTRIES;
    const term = countrySearch.toLowerCase().trim();
    return OFFICIAL_COUNTRIES.filter(c => 
      c.name.toLowerCase().includes(term) ||
      c.code.toLowerCase().includes(term) ||
      c.citiesText.toLowerCase().includes(term)
    );
  }, [countrySearch]);

  const categories = [
    { id: 'all', label: 'All Services (31)' },
    { id: 'Admissions', label: 'Admissions' },
    { id: 'Study Destinations', label: 'Study Destinations' },
    { id: 'Immigration', label: 'Visas & Immigration' },
    { id: 'Arrival', label: 'Arrival Support' },
    { id: 'Living', label: 'Living & Student Life' },
    { id: 'Tests & Partners', label: 'Test Prep & Partners' }
  ];

  const filteredServices = useMemo(() => {
    let result = mockServices;
    if (selectedCategory !== 'all') {
      result = result.filter(s => s.category === selectedCategory);
    }
    if (selectedCountry !== 'all') {
      result = result.filter(s => 
        s.title.toLowerCase().includes(selectedCountry.toLowerCase()) ||
        s.slug.toLowerCase().includes(selectedCountry.toLowerCase())
      );
    }
    return result.length > 0 ? result : mockServices;
  }, [selectedCategory, selectedCountry]);

  // Map to MenuItem format with cycling clip shapes
  const serviceItems: MenuItem[] = (filteredServices.length > 0 ? filteredServices : mockServices).map((service, index) => {
    const clipVariants = ['clip-original', 'clip-hexagons', 'clip-pixels'];
    return {
      num: String(index + 1).padStart(2, '0'),
      name: service.title.toUpperCase(),
      clipId: clipVariants[index % clipVariants.length],
      image: service.imageUrl,
      category: service.category,
      desc: service.desc,
      badge: service.badge,
      slug: service.slug
    };
  });

  const handleItemClick = (item: MenuItem, index: number) => {
    const foundService = mockServices.find(s => s.title.toUpperCase() === item.name) || mockServices[index];
    if (foundService) {
      setActiveModalService(foundService);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#050505] text-slate-900 dark:text-white transition-colors duration-500 pb-20">
      {/* Top Header & Breadcrumb Strip */}
      <div className="w-full border-b border-slate-100 dark:border-zinc-900 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-md sticky top-16 sm:top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            type="button"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer py-1.5 px-3 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-2.5">
            <span className="hidden sm:inline-block text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Need personalized guidance?
            </span>
            <button
              onClick={() => onOpenConsultation('Comprehensive Services')}
              className="text-xs font-bold px-4 py-2 rounded-full bg-[#fbb034] text-slate-950 hover:bg-amber-400 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              Free Consultation
            </button>
          </div>
        </div>
      </div>

      {/* Page Title & Intro */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-6 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-4">
          <span>Official University Representation</span>
        </div>
        <h1 className="text-3xl xs:text-4xl sm:text-6xl font-black tracking-tight text-slate-950 dark:text-white mb-3 leading-tight">
          Every Service You Need for{' '}
          <span className="bg-[#fbb034] text-slate-950 px-3 sm:px-5 py-0.5 rounded-xl sm:rounded-2xl inline-block shadow-sm">
            Study Abroad
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-lg text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed mb-6">
          Explore all 20 professional services & 11 official study destinations provided by GEES. Hover over any service to trigger interactive visual projections or click for full coverage details.
        </p>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                if (cat.id !== 'Study Destinations') {
                  setSelectedCountry('all');
                }
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-md scale-105'
                  : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Country Filter & Search Bar for Study Destinations */}
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs">
          {/* Country Search Input */}
          <div className="relative w-full sm:flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-lg pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={countrySearch}
              onChange={(e) => setCountrySearch(e.target.value)}
              placeholder="Search partner countries (e.g. Malaysia, UK, Australia...)"
              className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-100 placeholder:text-zinc-400 shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-[#fbb034] focus:border-[#fbb034]"
            />
            {countrySearch && (
              <button
                type="button"
                onClick={() => setCountrySearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-xs p-1"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Custom Styled Country Select Dropdown */}
          <div className="relative w-full sm:w-auto min-w-[200px]">
            <select
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                if (e.target.value !== 'all') {
                  setSelectedCategory('Study Destinations');
                }
              }}
              className="w-full appearance-none rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-100 pl-3.5 pr-8 py-2 text-xs sm:text-sm font-medium shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-[#fbb034] focus:border-[#fbb034] cursor-pointer"
            >
              <option value="all">🌍 All Official Countries (11)</option>
              {filteredCountryOptions.map((c) => (
                <option key={c.code} value={c.name}>
                  {c.flagEmoji} {c.name} ({c.unisCountText})
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none text-base">
              expand_more
            </span>
          </div>
        </div>
      </div>

      {/* Connoisseur Stack Interactor Stage */}
      <div className="w-full max-w-[1440px] mx-auto px-2 sm:px-4">
        <ConnoisseurStackInteractor
          items={serviceItems}
          onItemClick={handleItemClick}
          className="rounded-3xl border border-zinc-200/80 dark:border-zinc-900 shadow-2xl my-4"
        />
      </div>

      {/* Bottom Service Advisory CTA */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-zinc-950 text-white dark:bg-zinc-900/90 border border-zinc-800 shadow-2xl flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-[#fbb034] text-slate-950 flex items-center justify-center mb-4 shadow-md font-black">
            <span className="material-symbols-outlined text-2xl">verified</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            100% Free Processing & Consultation
          </h2>
          <p className="max-w-xl text-zinc-400 text-sm sm:text-base mb-6 leading-relaxed">
            As authorized institutional representatives, GEES charges zero consultancy fees for university admissions, document reviews, and application processing.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <InteractiveHoverButton
              type="button"
              text="Book A 1-on-1 Session"
              onClick={() => onOpenConsultation('General Services Inquiry')}
              className="px-8 py-3.5 rounded-full bg-white text-zinc-950 font-bold text-sm shadow-md"
            />
            <a
              href="https://wa.me/8801805529578"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/20 active:scale-95"
            >
              <span>💬 Direct WhatsApp Desk</span>
            </a>
          </div>
        </div>
      </div>

      {/* Service Detail Modal */}
      {activeModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in duration-200">
            {/* Close Button */}
            <button
              onClick={() => setActiveModalService(null)}
              className="absolute top-4 right-4 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer active:scale-95"
              aria-label="Close modal"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>

            {/* Modal Image Header */}
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-5 bg-slate-100 dark:bg-slate-800 shadow-md">
              <img
                src={activeModalService.imageUrl}
                alt={activeModalService.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#fbb034] text-slate-950">
                  {activeModalService.badge || activeModalService.category}
                </span>
                <span className="text-xs font-semibold text-slate-200 bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-xs">
                  {activeModalService.category}
                </span>
              </div>
            </div>

            {/* Service Title & Description */}
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
              {activeModalService.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              {activeModalService.desc}
            </p>

            {/* Key Deliverables */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 mb-6 space-y-2">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                What GEES Delivers:
              </span>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                <span className="material-symbols-outlined text-emerald-500 text-sm">check_circle</span>
                <span>Dedicated senior counselor assigned directly to your case</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                <span className="material-symbols-outlined text-emerald-500 text-sm">check_circle</span>
                <span>Direct portal processing with 150+ international partner universities</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                <span className="material-symbols-outlined text-emerald-500 text-sm">check_circle</span>
                <span>Complete transparency with zero hidden agency charges</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col xs:flex-row gap-3">
              <button
                onClick={() => {
                  const serviceName = activeModalService.title;
                  setActiveModalService(null);
                  onOpenConsultation(serviceName);
                }}
                className="min-h-[44px] flex-1 py-3 px-4 rounded-full bg-[#fbb034] hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Book This Service (100% Free)</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
              <button
                onClick={() => setActiveModalService(null)}
                className="min-h-[44px] py-3 px-5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesView;
