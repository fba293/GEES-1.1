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
import { FloatingBottomNav } from './components/common/FloatingBottomNav.tsx';

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
import { CourseExplorerView } from './components/portal/CourseExplorerView.tsx';
import { StudentPortalView } from './components/portal/StudentPortalView.tsx';
import { CrmView } from './components/portal/CrmView.tsx';
import { AgentPortalView } from './components/portal/AgentPortalView.tsx';
import { ContactUsView } from './components/contact/ContactUsView.tsx';
import { BlogHubView } from './components/blog/BlogHubView.tsx';
import { ServicesView } from './components/services/ServicesView.tsx';
import { EventsView } from './components/events/EventsView.tsx';
import { NewsView } from './components/news/NewsView.tsx';
import { AboutUsView } from './components/about/AboutUsView.tsx';
import { SuccessStoriesView } from './components/stories/SuccessStoriesView.tsx';
import { LanguageCentersView } from './components/language/LanguageCentersView.tsx';
import { StudentsGuideView } from './components/guide/StudentsGuideView.tsx';
import { ResourcesHubView } from './components/resources/ResourcesHubView.tsx';
import { LeadershipDirectorView } from './components/about/LeadershipDirectorView.tsx';
import { AdmissionSupportView } from './components/services/AdmissionSupportView.tsx';
import { SchoolAdmissionView } from './components/services/SchoolAdmissionView.tsx';
import { StudentReferralView } from './components/services/StudentReferralView.tsx';
import { StudentVisaAssistanceView } from './components/services/StudentVisaAssistanceView.tsx';
import { DependentVisaView } from './components/services/DependentVisaView.tsx';
import { TouristVisaView } from './components/services/TouristVisaView.tsx';
import { MM2HView } from './components/services/MM2HView.tsx';
import { HealthInsuranceView } from './components/services/HealthInsuranceView.tsx';
import { FlightTicketingView } from './components/services/FlightTicketingView.tsx';
import { WishlistPortal } from './components/portal/WishlistPortal.tsx';
import { StudyDestinationPage } from './components/destination/StudyDestinationPage.tsx';
import { normalizeDestinationSlug } from './data/destinationDataRegistry.ts';
import { CurrencyProvider } from './context/CurrencyContext.tsx';
import { ThemeProvider, useTheme } from './context/ThemeContext.tsx';
import { WishlistProvider } from './context/WishlistContext.tsx';

function AppContent() {
  // Theme state from global ThemeContext
  const { isDark, toggleTheme } = useTheme();

  // Current view routing state
  const [currentView, setCurrentView] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('study-in-') || path.includes('study-malaysia') || path.includes('study-uk') || path.includes('study-australia')) return 'study-destination';
      if (path.includes('wishlist') || path.includes('saved-courses')) return 'wishlist';
      if (path.includes('flight-ticketing') || path.includes('flight') || path.includes('ticket')) return 'flight-ticketing';
      if (path.includes('health-insurance') || path.includes('insurance') || path.includes('oshc')) return 'health-insurance';
      if (path.includes('mm2h') || path.includes('malaysia-second-home') || path.includes('malaysia-my-second-home')) return 'mm2h';
      if (path.includes('tourist-visa') || path.includes('tourist') || path.includes('visitor-visa')) return 'tourist-visa';
      if (path.includes('dependent-visa') || path.includes('dependent')) return 'dependent-visa';
      if (path.includes('student-visa-assistance') || path.includes('visa-assistance') || path.includes('student-visa')) return 'student-visa-assistance';
      if (path.includes('student-referral') || path.includes('referral')) return 'student-referral';
      if (path.includes('school-admission')) return 'school-admission';
      if (path.includes('admission-support') || path.includes('admission')) return 'admission-support';
      if (path.includes('blog')) return 'blog';
      if (path.includes('news')) return 'news';
      if (path.includes('about')) return 'about';
      if (path.includes('faq')) return 'faq';
      if (path.includes('event')) return 'events';
      if (path.includes('contact')) return 'contact';
      if (path.includes('services')) return 'services';
      if (path.includes('success-stories') || path.includes('stories')) return 'success-stories';
      if (path.includes('language-centers') || path.includes('language')) return 'language-centers';
      if (path.includes('students-guide') || path.includes('guide')) return 'students-guide';
      if (path.includes('resources')) return 'resources';
      if (path.includes('leadership')) return 'leadership-director';
      if (path.includes('countries') || path.includes('destinations')) return 'destinations';
      if (path.includes('courses') || path.includes('course')) return 'courses';
      if (path.includes('universities') || path.includes('university')) return 'universities';
    }
    return 'home';
  });

  // Navigation payload (e.g. selected university slug or destination)
  const [navPayload, setNavPayload] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase().replace(/^\/+/, '');
      if (path.includes('study-in-') || path.includes('study-')) {
        return path;
      }
    }
    return null;
  });

  // Active user role context for portals
  const [activeRole, setActiveRole] = useState<UserRole>('student');

  // Modals visibility state
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [selectedCounselorForModal, setSelectedCounselorForModal] = useState<string | undefined>(undefined);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Selected service detail popup
  const [selectedServiceDetail, setSelectedServiceDetail] = useState<ServiceItem | null>(null);

  // Force browser scroll restoration to manual and scroll to top (0,0) on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      window.scrollTo(0, 0);
    }
  }, []);

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

    if (view === 'faq' || view === 'faqs') {
      setCurrentView('faq');
      setNavPayload(payload || null);
      if (typeof window !== 'undefined' && window.location.pathname.includes('.html')) {
        window.history.pushState({}, '', 'faq.html');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'events' || view === 'event') {
      setCurrentView('events');
      setNavPayload(payload || null);
      if (typeof window !== 'undefined' && window.location.pathname.includes('.html')) {
        window.history.pushState({}, '', 'events.html');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'about' || view === 'about-us') {
      setCurrentView('about');
      setNavPayload(payload || null);
      if (typeof window !== 'undefined' && window.location.pathname.includes('.html')) {
        window.history.pushState({}, '', 'about-us.html');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'news') {
      setCurrentView('news');
      setNavPayload(payload || null);
      if (typeof window !== 'undefined' && window.location.pathname.includes('.html')) {
        window.history.pushState({}, '', 'news.html');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'success-stories' || view === 'stories') {
      setCurrentView('success-stories');
      setNavPayload(payload || null);
      if (typeof window !== 'undefined' && window.location.pathname.includes('.html')) {
        window.history.pushState({}, '', 'success-stories.html');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'language-centers' || view === 'language') {
      setCurrentView('language-centers');
      setNavPayload(payload || null);
      if (typeof window !== 'undefined' && window.location.pathname.includes('.html')) {
        window.history.pushState({}, '', 'language-centers.html');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'students-guide' || view === 'guide') {
      setCurrentView('students-guide');
      setNavPayload(payload || null);
      if (typeof window !== 'undefined' && window.location.pathname.includes('.html')) {
        window.history.pushState({}, '', 'students-guide.html');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'resources') {
      setCurrentView('resources');
      setNavPayload(payload || null);
      if (typeof window !== 'undefined' && window.location.pathname.includes('.html')) {
        window.history.pushState({}, '', 'resources.html');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'leadership-director' || view === 'leadership') {
      setCurrentView('leadership-director');
      setNavPayload(payload || null);
      if (typeof window !== 'undefined' && window.location.pathname.includes('.html')) {
        window.history.pushState({}, '', 'leadership-director.html');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'flight-ticketing' || view === 'flight' || view === 'tickets' || (view === 'services' && (payload === 'flight-ticketing' || payload === 'flight' || payload === 'tickets' || payload === 'airfare'))) {
      setCurrentView('flight-ticketing');
      setNavPayload(payload || null);
      if (typeof window !== 'undefined' && window.location.pathname.includes('.html')) {
        window.history.pushState({}, '', 'flight-ticketing.html');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'health-insurance' || view === 'insurance' || (view === 'services' && (payload === 'health-insurance' || payload === 'insurance' || payload === 'oshc' || payload === 'student-insurance'))) {
      setCurrentView('health-insurance');
      setNavPayload(payload || null);
      if (typeof window !== 'undefined' && window.location.pathname.includes('.html')) {
        window.history.pushState({}, '', 'health-insurance.html');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'mm2h' || (view === 'services' && (payload === 'mm2h' || payload === 'malaysia-second-home' || payload === 'sarawak-mm2h'))) {
      setCurrentView('mm2h');
      setNavPayload(payload || null);
      if (typeof window !== 'undefined' && window.location.pathname.includes('.html')) {
        window.history.pushState({}, '', 'mm2h.html');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'tourist-visa' || view === 'tourist' || view === 'visitor' || (view === 'services' && (payload === 'tourist-visa' || payload === 'tourist'))) {
      setCurrentView('tourist-visa');
      setNavPayload(payload || null);
      if (typeof window !== 'undefined' && window.location.pathname.includes('.html')) {
        window.history.pushState({}, '', 'tourist-visa.html');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'dependent-visa' || view === 'dependent' || (view === 'services' && (payload === 'dependent-visa' || payload === 'dependent'))) {
      setCurrentView('dependent-visa');
      setNavPayload(payload || null);
      if (typeof window !== 'undefined' && window.location.pathname.includes('.html')) {
        window.history.pushState({}, '', 'dependent-visa.html');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'student-visa-assistance' || view === 'student-visa' || view === 'visa-assistance' || (view === 'services' && (payload === 'student-visa-assistance' || payload === 'visa-assistance' || payload === 'student-visa'))) {
      setCurrentView('student-visa-assistance');
      setNavPayload(payload || null);
      if (typeof window !== 'undefined' && window.location.pathname.includes('.html')) {
        window.history.pushState({}, '', 'student-visa-assistance.html');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'student-referral' || view === 'referral' || (view === 'services' && payload === 'b2b-partnership')) {
      setCurrentView('student-referral');
      setNavPayload(payload || null);
      if (typeof window !== 'undefined' && window.location.pathname.includes('.html')) {
        window.history.pushState({}, '', 'student-referral.html');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'school-admission' || (view === 'services' && payload === 'school-admission')) {
      setCurrentView('school-admission');
      setNavPayload(payload || null);
      if (typeof window !== 'undefined' && window.location.pathname.includes('.html')) {
        window.history.pushState({}, '', 'school-admission.html');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'admission-support' || (view === 'services' && payload === 'admission-support')) {
      setCurrentView('admission-support');
      setNavPayload(payload || null);
      if (typeof window !== 'undefined' && window.location.pathname.includes('.html')) {
        window.history.pushState({}, '', 'admission-support.html');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'study-destination' || view === 'study-in-malaysia' || view.startsWith('study-in-') || ((view === 'destinations' || view === 'countries') && payload)) {
      const countryTarget = typeof payload === 'string' ? payload : (view.startsWith('study-in-') ? view : 'study-in-malaysia');
      const normalizedSlug = normalizeDestinationSlug(countryTarget);
      setCurrentView('study-destination');
      setNavPayload(normalizedSlug);
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', `/${normalizedSlug}`);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'home' && typeof window !== 'undefined' && (window.location.pathname.includes('blog') || window.location.pathname.includes('news') || window.location.pathname.includes('services') || window.location.pathname.includes('faq') || window.location.pathname.includes('event') || window.location.pathname.includes('contact') || window.location.pathname.includes('countries') || window.location.pathname.includes('universities') || window.location.pathname.includes('courses') || window.location.pathname.includes('study-in-'))) {
      window.location.href = '/';
      return;
    }

    if (view === 'services' && typeof window !== 'undefined' && window.location.pathname.includes('.html')) {
      window.history.pushState({}, '', 'services.html');
    }

    if ((view === 'destinations' || view === 'countries') && typeof window !== 'undefined' && window.location.pathname.includes('.html')) {
      window.history.pushState({}, '', 'countries.html');
    }

    if (view === 'universities' && typeof window !== 'undefined' && window.location.pathname.includes('.html')) {
      window.history.pushState({}, '', 'universities.html');
    }

    if (view === 'courses' && typeof window !== 'undefined' && window.location.pathname.includes('.html')) {
      window.history.pushState({}, '', 'courses.html');
    }

    if ((view === 'wishlist' || view === 'saved-courses') && typeof window !== 'undefined' && window.location.pathname.includes('.html')) {
      window.history.pushState({}, '', 'wishlist.html');
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
    <div className="min-h-screen bg-white dark:bg-[#070D1E] text-slate-900 dark:text-slate-100 font-sans selection:bg-[#fbb034]/30 transition-colors duration-200">
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
      <main className="pt-20 sm:pt-24 lg:pt-28 pb-20 md:pb-0 bg-white dark:bg-[#070D1E]">
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
            <BlogsUpdatesSection
              onOpenConsultation={() => handleOpenConsultation()}
              onNavigate={handleNavigate}
            />

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

        {/* VIEW: UNIVERSITIES */}
        {currentView === 'universities' && (
          <div className="py-2 max-w-[95%] mx-auto w-full">
            <UniversityExplorerView
              initialSlug={typeof navPayload === 'string' ? navPayload : undefined}
              onApply={(uniName) => handleOpenConsultation(`Admissions Representative for ${uniName}`)}
            />
          </div>
        )}

        {/* VIEW: COURSES & COMPARISON ENGINE */}
        {currentView === 'courses' && (
          <div className="py-2 max-w-[95%] mx-auto w-full">
            <CourseExplorerView
              onApply={(courseInfo) => handleOpenConsultation(`Admissions for ${courseInfo}`)}
              onNavigateToUni={(uniSlug) => handleNavigate('universities', uniSlug)}
              onNavigateToWishlist={() => handleNavigate('wishlist')}
              initialQuery={navPayload && typeof navPayload === 'object' ? navPayload.query : (typeof navPayload === 'string' ? navPayload : '')}
              initialCountry={navPayload && typeof navPayload === 'object' ? navPayload.destination : 'all'}
              initialLevel={navPayload && typeof navPayload === 'object' ? navPayload.level : 'all'}
              initialField={navPayload && typeof navPayload === 'object' ? navPayload.field : 'all'}
            />
          </div>
        )}

        {/* VIEW: COURSE WISHLIST PORTAL */}
        {currentView === 'wishlist' && (
          <div className="py-2 max-w-[95%] mx-auto w-full">
            <WishlistPortal
              onNavigate={handleNavigate}
              onOpenConsultation={handleOpenConsultation}
              onNavigateToUni={(uniSlug) => handleNavigate('universities', uniSlug)}
            />
          </div>
        )}

        {/* VIEW: SERVICES DETAIL EXPLORER (Connoisseur Stack Interactor, No 6 Steps Section) */}
        {currentView === 'services' && (
          <ServicesView
            onBackToHome={() => handleNavigate('home')}
            onOpenConsultation={handleOpenConsultation}
            initialSelectedServiceSlug={typeof navPayload === 'string' ? navPayload : undefined}
          />
        )}

        {/* VIEW: REUSABLE STUDY DESTINATION PAGE */}
        {currentView === 'study-destination' && (
          <StudyDestinationPage
            countrySlugOrName={typeof navPayload === 'string' ? navPayload : 'study-in-malaysia'}
            onNavigate={handleNavigate}
            onOpenConsultation={handleOpenConsultation}
          />
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

        {/* VIEW: STANDALONE BLOGS (Redesigned Magazine Blog Hub) */}
        {currentView === 'blog' && (
          <div className="py-2 sm:py-4">
            <BlogHubView
              onOpenConsultation={() => handleOpenConsultation()}
              onNavigate={handleNavigate}
            />
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

        {/* VIEW: EVENTS & EDUCATION FAIRS */}
        {currentView === 'events' && (
          <EventsView
            onBackToHome={() => handleNavigate('home')}
            onOpenConsultation={handleOpenConsultation}
            onNavigate={handleNavigate}
          />
        )}

        {/* VIEW: GLOBAL NEWS & VISA BULLETINS */}
        {currentView === 'news' && (
          <NewsView
            onBackToHome={() => handleNavigate('home')}
            onOpenConsultation={handleOpenConsultation}
            onNavigate={handleNavigate}
          />
        )}

        {/* VIEW: ABOUT US */}
        {currentView === 'about' && (
          <AboutUsView
            onBackToHome={() => handleNavigate('home')}
            onOpenConsultation={handleOpenConsultation}
            onNavigate={handleNavigate}
          />
        )}

        {/* VIEW: SUCCESS STORIES */}
        {currentView === 'success-stories' && (
          <SuccessStoriesView
            onBackToHome={() => handleNavigate('home')}
            onOpenConsultation={handleOpenConsultation}
            onNavigate={handleNavigate}
          />
        )}

        {/* VIEW: LANGUAGE CENTERS */}
        {currentView === 'language-centers' && (
          <LanguageCentersView
            onBackToHome={() => handleNavigate('home')}
            onOpenConsultation={handleOpenConsultation}
            onNavigate={handleNavigate}
          />
        )}

        {/* VIEW: STUDENTS GUIDE */}
        {currentView === 'students-guide' && (
          <StudentsGuideView
            onBackToHome={() => handleNavigate('home')}
            onOpenConsultation={handleOpenConsultation}
            onNavigate={handleNavigate}
          />
        )}

        {/* VIEW: RESOURCES HUB */}
        {currentView === 'resources' && (
          <ResourcesHubView
            onBackToHome={() => handleNavigate('home')}
            onOpenConsultation={handleOpenConsultation}
            onNavigate={handleNavigate}
          />
        )}

        {/* VIEW: LEADERSHIP & DIRECTOR */}
        {currentView === 'leadership-director' && (
          <LeadershipDirectorView
            onBackToHome={() => handleNavigate('home')}
            onOpenConsultation={handleOpenConsultation}
            onNavigate={handleNavigate}
          />
        )}

        {/* VIEW: ADMISSION SUPPORT */}
        {currentView === 'admission-support' && (
          <AdmissionSupportView
            onBackToHome={() => handleNavigate('home')}
            onOpenConsultation={handleOpenConsultation}
            onNavigate={handleNavigate}
          />
        )}

        {/* VIEW: SCHOOL ADMISSION */}
        {currentView === 'school-admission' && (
          <SchoolAdmissionView
            onBackToHome={() => handleNavigate('home')}
            onOpenConsultation={handleOpenConsultation}
            onNavigate={handleNavigate}
          />
        )}

        {/* VIEW: STUDENT REFERRAL */}
        {currentView === 'student-referral' && (
          <StudentReferralView
            onBackToHome={() => handleNavigate('home')}
            onOpenConsultation={handleOpenConsultation}
            onNavigate={handleNavigate}
          />
        )}

        {/* VIEW: STUDENT VISA ASSISTANCE */}
        {currentView === 'student-visa-assistance' && (
          <StudentVisaAssistanceView
            onBackToHome={() => handleNavigate('home')}
            onOpenConsultation={handleOpenConsultation}
            onNavigate={handleNavigate}
          />
        )}

        {/* VIEW: DEPENDENT VISA */}
        {currentView === 'dependent-visa' && (
          <DependentVisaView
            onBackToHome={() => handleNavigate('home')}
            onOpenConsultation={handleOpenConsultation}
            onNavigate={handleNavigate}
          />
        )}

        {/* VIEW: TOURIST VISA */}
        {currentView === 'tourist-visa' && (
          <TouristVisaView
            onBackToHome={() => handleNavigate('home')}
            onOpenConsultation={handleOpenConsultation}
            onNavigate={handleNavigate}
          />
        )}

        {/* VIEW: MM2H MALAYSIA RESIDENCY */}
        {currentView === 'mm2h' && (
          <MM2HView
            onBackToHome={() => handleNavigate('home')}
            onOpenConsultation={handleOpenConsultation}
            onNavigate={handleNavigate}
          />
        )}

        {/* VIEW: HEALTH INSURANCE & MEDICAL COVER */}
        {currentView === 'health-insurance' && (
          <HealthInsuranceView
            onBackToHome={() => handleNavigate('home')}
            onOpenConsultation={handleOpenConsultation}
            onNavigate={handleNavigate}
          />
        )}

        {/* VIEW: FLIGHT TICKETING & STUDENT TRAVEL LOGISTICS */}
        {currentView === 'flight-ticketing' && (
          <FlightTicketingView
            onBackToHome={() => handleNavigate('home')}
            onOpenConsultation={handleOpenConsultation}
            onNavigate={handleNavigate}
          />
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

      {/* Custom Floating Island Mobile Bottom Navigation Dock (GEES-1.1 across all pages) */}
      <FloatingBottomNav
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenConsultation={handleOpenConsultation}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <WishlistProvider>
          <AppContent />
        </WishlistProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}
