/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES - Global Education Expert Services
 * Master Application Shell & Multi-View Orchestrator
 */

import React, { useState, useEffect } from 'react';
import { UserRole, ServiceItem } from './types/index.ts';

// Common Layout & Modal Components
import { Navbar } from './components/common/Navbar.tsx';
import { Footer } from './components/common/Footer.tsx';
import { PreFooterCta } from './components/common/PreFooterCta.tsx';
import { ConsultationModal } from './components/common/ConsultationModal.tsx';
import { SearchModal } from './components/common/SearchModal.tsx';
import { MobileDrawer } from './components/common/MobileDrawer.tsx';
import { BackToTopButton } from './components/common/BackToTopButton.tsx';

// Home Page Sections
import { HeroSection } from './components/home/HeroSection.tsx';
import { PartnersMarqueeSection } from './components/home/PartnersMarqueeSection.tsx';
import { ServicesCoverflow } from './components/home/ServicesCoverflow.tsx';
import { StepsRoadmapSection } from './components/home/StepsRoadmapSection.tsx';
import { DestinationsGallery } from './components/home/DestinationsGallery.tsx';
import { WhyChooseSection } from './components/home/WhyChooseSection.tsx';
import { StudentStoriesReels } from './components/home/StudentStoriesReels.tsx';
import { CounselorsSection } from './components/home/CounselorsSection.tsx';
import { SuccessStoriesSection } from './components/home/SuccessStoriesSection.tsx';
import { BlogsUpdatesSection } from './components/home/BlogsUpdatesSection.tsx';
import { FaqSection } from './components/home/FaqSection.tsx';

// Portals & Sub-System Views
import { UniversityExplorerView } from './components/portal/UniversityExplorerView.tsx';
import { StudentPortalView } from './components/portal/StudentPortalView.tsx';
import { CrmView } from './components/portal/CrmView.tsx';
import { AgentPortalView } from './components/portal/AgentPortalView.tsx';
import { ContactUsView } from './components/contact/ContactUsView.tsx';

export default function App() {
  // Theme state: dark / light
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('gees-theme');
      if (stored) return stored === 'dark';
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  // Current view routing state
  const [currentView, setCurrentView] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('blog')) return 'blog';
      if (path.includes('faq')) return 'faq';
      if (path.includes('contact')) return 'contact';
    }
    return 'home';
  });

  // Navigation payload (e.g. selected university slug or destination)
  const [navPayload, setNavPayload] = useState<any>(null);

  // Active user role context for portals
  const [activeRole, setActiveRole] = useState<UserRole>('student');

  // Modals visibility state
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [selectedCounselorForModal, setSelectedCounselorForModal] = useState<string | undefined>(undefined);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Selected service detail popup
  const [selectedServiceDetail, setSelectedServiceDetail] = useState<ServiceItem | null>(null);

  // Sync theme to HTML root
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('gees-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('gees-theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  // Main navigation handler
  const handleNavigate = (view: string, payload?: any) => {
    if (view === 'apply') {
      setSelectedCounselorForModal(payload);
      setIsConsultationModalOpen(true);
      return;
    }

    if (view === 'contact' || view === 'contact-us') {
      setCurrentView('contact');
      setNavPayload(payload || null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setNavPayload(payload || null);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open consultation modal with counselor
  const handleOpenConsultation = (counselorName?: string) => {
    setSelectedCounselorForModal(counselorName);
    setIsConsultationModalOpen(true);
  };

  // Search selection handler
  const handleSelectSearchResult = (type: string, id: string) => {
    setIsSearchModalOpen(false);
    if (type === 'university') {
      setCurrentView('universities');
      setNavPayload(id);
    } else if (type === 'destination') {
      setCurrentView('universities');
      setNavPayload(id);
    } else if (type === 'service') {
      setCurrentView('services');
    } else {
      setCurrentView('universities');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070D1E] text-slate-900 dark:text-slate-100 font-sans selection:bg-[#fbb034]/30 transition-colors duration-200">
      {/* Floating Universal Header */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        activeRole={activeRole}
        onRoleChange={setActiveRole}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="pt-20 sm:pt-24 lg:pt-28">
        {/* VIEW: HOME */}
        {currentView === 'home' && (
          <>
            {/* Hero Section */}
            <HeroSection
              onNavigate={handleNavigate}
              onOpenConsultationModal={handleOpenConsultation}
            />

            {/* University Partners Marquee */}
            <PartnersMarqueeSection onNavigate={handleNavigate} />

            {/* Our Services 3D Coverflow */}
            <ServicesCoverflow
              onSelectService={(service) => setSelectedServiceDetail(service)}
              onViewAllServices={() => handleNavigate('services')}
            />

            {/* 6 Steps Roadmap */}
            <StepsRoadmapSection onOpenBooking={() => handleOpenConsultation()} />

            {/* Choose Your Destination Gallery */}
            <DestinationsGallery
              onNavigateToCountry={(c) => handleNavigate('universities', c)}
              onOpenConsultation={handleOpenConsultation}
            />

            {/* Why Choose GEES */}
            <WhyChooseSection
              onSelectCountry={(c) => handleNavigate('universities', c)}
            />

            {/* Student Stories & Video Reels */}
            <StudentStoriesReels />

            {/* Meet Our Expert Counselors */}
            <CounselorsSection onOpenBooking={handleOpenConsultation} />

            {/* Student Success Stories & Testimonials */}
            <SuccessStoriesSection />

            {/* Blogs, News & Visa Updates */}
            <BlogsUpdatesSection onOpenConsultation={() => handleOpenConsultation()} />

            {/* Frequently Asked Questions */}
            <FaqSection
              isCompact={true}
              onOpenConsultation={() => handleOpenConsultation()}
              onNavigate={handleNavigate}
            />

            {/* Pre-Footer Action Banner */}
            <PreFooterCta
              onOpenConsultation={() => handleOpenConsultation()}
              onNavigate={handleNavigate}
            />
          </>
        )}

        {/* VIEW: UNIVERSITIES & COURSES */}
        {(currentView === 'universities' || currentView === 'courses') && (
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
              <button
                onClick={() => handleNavigate('home')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 mb-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                <span>Back to Home</span>
              </button>
            </div>
            <UniversityExplorerView
              initialSlug={typeof navPayload === 'string' ? navPayload : undefined}
              onApply={(uniName) => handleOpenConsultation(`Admissions Representative for ${uniName}`)}
            />
          </div>
        )}

        {/* VIEW: SERVICES DETAIL EXPLORER */}
        {currentView === 'services' && (
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
              <button
                onClick={() => handleNavigate('home')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 mb-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                <span>Back to Home</span>
              </button>
            </div>
            <ServicesCoverflow
              onSelectService={(service) => setSelectedServiceDetail(service)}
              onViewAllServices={() => {}}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
              <StepsRoadmapSection onOpenBooking={() => handleOpenConsultation()} />
            </div>
          </div>
        )}

        {/* VIEW: DESTINATIONS */}
        {currentView === 'destinations' && (
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
              <button
                onClick={() => handleNavigate('home')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 mb-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                <span>Back to Home</span>
              </button>
            </div>
            <DestinationsGallery
              onNavigateToCountry={(c) => handleNavigate('universities', c)}
              onOpenConsultation={handleOpenConsultation}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
              <WhyChooseSection onSelectCountry={(c) => handleNavigate('universities', c)} />
            </div>
          </div>
        )}

        {/* VIEW: STUDENT APPLICATION PORTAL */}
        {currentView === 'student-portal' && (
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-4">
              <button
                onClick={() => handleNavigate('home')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                <span>Back to Home</span>
              </button>
            </div>
            <StudentPortalView />
          </div>
        )}

        {/* VIEW: COUNSELOR CRM PIPELINE */}
        {currentView === 'crm' && (
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-4">
              <button
                onClick={() => handleNavigate('home')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                <span>Back to Home</span>
              </button>
            </div>
            <CrmView />
          </div>
        )}

        {/* VIEW: B2B SUB-AGENT & COMMISSION PORTAL */}
        {(currentView === 'agent-portal' || currentView === 'analytics') && (
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-4">
              <button
                onClick={() => handleNavigate('home')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                <span>Back to Home</span>
              </button>
            </div>
            <AgentPortalView />
          </div>
        )}

        {/* VIEW: STANDALONE BLOGS */}
        {currentView === 'blog' && (
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-4">
              <button
                onClick={() => handleNavigate('home')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                <span>Back to Home</span>
              </button>
            </div>
            <BlogsUpdatesSection onOpenConsultation={() => handleOpenConsultation()} />
          </div>
        )}

        {/* VIEW: STANDALONE FAQ */}
        {currentView === 'faq' && (
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-4">
              <button
                onClick={() => handleNavigate('home')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                <span>Back to Home</span>
              </button>
            </div>
            <FaqSection
              isCompact={false}
              onOpenConsultation={() => handleOpenConsultation()}
              onNavigate={handleNavigate}
            />
          </div>
        )}

        {/* VIEW: CONTACT US */}
        {currentView === 'contact' && (
          <ContactUsView
            onNavigate={handleNavigate}
            onOpenConsultationModal={handleOpenConsultation}
          />
        )}
      </main>

      {/* Universal Interactive Beam Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Reusable Modals & Dialogs */}
      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
        preselectedCounselor={selectedCounselorForModal}
      />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectResult={handleSelectSearchResult}
      />

      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onNavigate={handleNavigate}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onOpenSearch={() => {
          setIsMobileMenuOpen(false);
          setIsSearchModalOpen(true);
        }}
        onRoleChange={setActiveRole}
      />

      {/* Service Detail Modal */}
      {selectedServiceDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedServiceDetail(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-500 flex items-center justify-center text-2xl font-bold">
                ★
              </span>
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-slate-400">{selectedServiceDetail.category}</span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{selectedServiceDetail.title}</h3>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              {selectedServiceDetail.desc}
            </p>
            {selectedServiceDetail.fullContent && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 mb-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedServiceDetail.fullContent}
              </div>
            )}
            <div className="space-y-3 mb-8">
              <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Service Highlights</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  Category: {selectedServiceDetail.category}
                </span>
                {selectedServiceDetail.badge && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                    {selectedServiceDetail.badge}
                  </span>
                )}
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Verified Counselor Support
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  setSelectedServiceDetail(null);
                  handleOpenConsultation(`Advisor for ${selectedServiceDetail.title}`);
                }}
                className="flex-1 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm tracking-wide text-center cursor-pointer shadow-lg shadow-blue-600/30"
              >
                Book Free Consultation for This Service
              </button>
              <button
                onClick={() => setSelectedServiceDetail(null)}
                className="px-6 py-3 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Back-to-Top Button */}
      <BackToTopButton />
    </div>
  );
}
