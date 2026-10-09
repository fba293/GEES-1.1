/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES - Global Education Expert Services
 * Dedicated Blog.html Hub & Knowledge Base
 * Features:
 * - Oversized typography hero with scribble accent and floating badge
 * - Magazine split layout: Left featured hero slider + Right dark popular articles card
 * - Live keyword search with instant filtering across titles, summaries, and categories
 * - Category filter pills: All, Technology, Digital Marketing / Courses, Social Media / Visa, Other / Scholarships, Saved
 * - 3-Column responsive articles grid with floating hover action buttons, bookmarking, and social sharing
 * - Interactive numbered pagination matching exact design (‹, 1, 2, 3 [active], ..., 22, 23, 24, ›)
 * - Pastel newsletter subscription card with instant feedback
 * - Wellness & mental health focus callout with social community links
 * - 1-on-1 personalized mentorship counseling intake banner
 * - Interactive full article reading modal with copy-to-clipboard link
 * - Fluid, buttery-smooth Framer Motion transitions and mobile optimization for iPhone 16 & tablets
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockBlogPosts } from '../../data/mockDatabase.ts';
import { BlogPost } from '../../types/index.ts';

interface BlogHubViewProps {
  onOpenConsultation: () => void;
  onNavigate?: (view: string, payload?: any) => void;
}

// 5 Rich Hero Slides from the design specification
interface HeroSlide {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  views: string;
  readTime: string;
  date: string;
  img: string;
  author: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'hero-1',
    category: 'Global Admissions 2026/2027',
    title: 'My Revolutionary Roadmap to Study Abroad 2026/2027',
    excerpt:
      'A comprehensive, tested step-by-step master plan covering IELTS waivers, tier-1 university shortlists, statement of purpose frameworks, and fast-track student visa processing.',
    views: '2,983 views',
    readTime: '4 min read',
    date: 'July 28, 2026',
    author: 'GEES Academic Editorial',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCL38dPjC7ApDCOf8FqMMHxIadQ3tXV28wis9CEW1ZGLGjSZ1BJufGNToSyLFIotialZ7a6s0fERRtT9CP5G_eBnW9Y3tTJ1EVz6MUIXSrb0MNZjzNJYsAUDp2Wn-w2GgjtiUZbXri-Y52GJyTa4qBYbkpZAC0ITPATk0IMVSQ4nqhArPw3L8uaIDoWf8OTu-65lmIBMk5MoxGb9zXFwZlJNeVdf0p4waN7Upw62H7S'
  },
  {
    id: 'hero-2',
    category: 'Visa & Immigration Update',
    title: 'What Is a Russell Group University? Complete UK Study Guide',
    excerpt:
      'Explore the prestige, research power, entry requirements, and career prospects offered by the 24 world-renowned UK Russell Group institutions with 2026 Graduate Route policy insights.',
    views: '4,180 views',
    readTime: '6 min read',
    date: 'March 12, 2026',
    author: 'Ariful Hasan (Senior Counsel)',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvWOHLrxbJMo7KpbeFPYtJOz_j1oD39UhOXQfBy4YHZkSO2jugmoS6iFvFXJ2CM4H0pnAp3nM0wAfDQeFJftbNZK5kGOr4deJSKbUPSx5w4eQ_WB9Rr5nst64DvhRrj2dV-E9Gam2frwwO5F32z7zsSBuXG1m-iFtemrErwazrTsQCUvxJmdBrJ1-AGq-QABo4EFdUZg3k3A0ifFgYcHDjgl1ZpmJ9gnHuCBgRcDCG'
  },
  {
    id: 'hero-3',
    category: 'Cost & Accommodation',
    title: 'Living in Kuala Lumpur & London: Honest International Budget Breakdown',
    excerpt:
      'Real numbers: Grocery bills, student transit discounts, high-speed WiFi, health coverage, and hidden dormitory deposits analyzed for incoming 2026 cohorts.',
    views: '3,750 views',
    readTime: '5 min read',
    date: 'August 04, 2026',
    author: 'Shahd Ashraf',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVOmwVdqW2HFHY9SRhk5OAK6Mk0P4dWI9t2XSYH76XJJnVLPaU-4nYfTM6vhvMWR3-p2LlFp3vPbzCEDF_2fRp-5mBDZCMYNj3l6nfbsx8_Fj9QgaKFNXXcEfIsMj7CAkqqCp3dW3A-6H7UWlvTJnQzHRgjLhEoFiWthUMa7EmqxV2WN_RzkmsLsuzjsqHOsKFNenawIDBXeXWToSR1_mnY_9V43ngCJddL91hI3N7'
  },
  {
    id: 'hero-4',
    category: 'Direct SDS Pathways',
    title: 'Study in Canada with GEES – Complete Fall 2026 Intake Roadmap',
    excerpt:
      'Canada college admission intakes, GIC escrow management, language score cutoffs, and post-graduation work permit (PGWP) eligibility explained clearly.',
    views: '5,320 views',
    readTime: '7 min read',
    date: 'August 15, 2026',
    author: 'Ali Ahmed (Canada Specialist)',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGypko5jHLRdiVc8suvx5c_1T7iZ9sANL1rFTrgjBMPV0RoU4QLao68ff7M_o2_d7fmZFlMASO8sC3UL1s5H1-2Dk9Akiv3Zt8Uyh8M4KqSnYY6Yo0cOwzjk-w_bJu1nGm3E1yJJcC1A69EFSCy8J_qBRzox-hNfr3pa9pgL208SwDPP8Hz54dXe3QQX-cO_yIqYLho6O4olK_f725OQD3BsU3ImtgR9wJmTlQmWik'
  },
  {
    id: 'hero-5',
    category: 'Full Scholarships 2026',
    title: '5 Full Scholarships Available for South Asian Students in Malaysia',
    excerpt:
      'Discover government-backed and university-sponsored scholarships covering 100% tuition plus monthly stipends. How to prepare your statement of purpose to qualify.',
    views: '6,910 views',
    readTime: '5 min read',
    date: 'September 01, 2026',
    author: 'GEES Global Panel',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHLHlBvPTUP_woiukR6jyvrpkQHHgNltF53_dXixZxld7Yx6F8iNl2wEjVYBuIYH9nN2OnG47addo1cM7IVv7HMQjElZVM47ps0JKh5Ek7SW4DRjJX3RcOyvMoQEbyQbHuJx80_hm5RnRkgMJZAurStofYHO1Op7az6MKv3hOb4gl8N0lVT-lG4ZBth8xhFjaAs0yA3Jfdl8eRkFFCQYNM2zil4OPMQDvVRRBBGwF5'
  }
];

// Popular Sidebar Articles List
interface PopularArticle {
  id: string;
  kicker: string;
  title: string;
  views: string;
  readTime: string;
  img: string;
  summary: string;
}

const POPULAR_ARTICLES: PopularArticle[] = [
  {
    id: 'pop-1',
    kicker: 'Visa Guide',
    title: 'Complete EMGS Visa Guide for International Applicants',
    views: '5,120 views',
    readTime: '4 min read',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxxfIDgyeagRGN0XzBPet3SvNrO7lEIvoNZNigrhcmr_7UvSG3JXfHOs9ubb73gzPczFX1rjz8CNCUM-DpzNCC4D-N8aW9cA4yJlkBRMqJWJu84E3G0-SsAQ_uttqQN_ib3Ffxf-CrTCZ2SYMzfo3bv3kJ6ZVuMnfmYdq3DQ2qqpNDASduMYKtdtTohMWw8s7Og_GoRExdNB2yWvriRXoHOLO_akzaf2_1SK7u48X5',
    summary:
      'Step-by-step walkthrough of the entire Malaysian student visa process — from university offer letter and EMGS portal lodge to Visa Approval Letter (VAL) and airport immigration clearance.'
  },
  {
    id: 'pop-2',
    kicker: 'Campus Career',
    title: 'Can International Students Work in Malaysia Legally?',
    views: '3,890 views',
    readTime: '5 min read',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvWOHLrxbJMo7KpbeFPYtJOz_j1oD39UhOXQfBy4YHZkSO2jugmoS6iFvFXJ2CM4H0pnAp3nM0wAfDQeFJftbNZK5kGOr4deJSKbUPSx5w4eQ_WB9Rr5nst64DvhRrj2dV-E9Gam2frwwO5F32z7zsSBuXG1m-iFtemrErwazrTsQCUvxJmdBrJ1-AGq-QABo4EFdUZg3k3A0ifFgYcHDjgl1ZpmJ9gnHuCBgRcDCG',
    summary:
      'Detailed breakdown of Immigration Department regulations, 20-hour weekly limits during semester breaks, permissible employment sectors, and remote freelance rules.'
  },
  {
    id: 'pop-3',
    kicker: 'Financial Grants',
    title: '5 Full Scholarships Covering 100% Tuition Fees',
    views: '7,430 views',
    readTime: '7 min read',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHLHlBvPTUP_woiukR6jyvrpkQHHgNltF53_dXixZxld7Yx6F8iNl2wEjVYBuIYH9nN2OnG47addo1cM7IVv7HMQjElZVM47ps0JKh5Ek7SW4DRjJX3RcOyvMoQEbyQbHuJx80_hm5RnRkgMJZAurStofYHO1Op7az6MKv3hOb4gl8N0lVT-lG4ZBth8xhFjaAs0yA3Jfdl8eRkFFCQYNM2zil4OPMQDvVRRBBGwF5',
    summary:
      'Discover government-backed and university-sponsored scholarships covering full tuition and monthly allowances across Malaysia, UK, and Canada.'
  },
  {
    id: 'pop-4',
    kicker: 'Canada Direct',
    title: 'Study in Canada With GEES – 2026 Direct Stream',
    views: '4,120 views',
    readTime: '6 min read',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGypko5jHLRdiVc8suvx5c_1T7iZ9sANL1rFTrgjBMPV0RoU4QLao68ff7M_o2_d7fmZFlMASO8sC3UL1s5H1-2Dk9Akiv3Zt8Uyh8M4KqSnYY6Yo0cOwzjk-w_bJu1nGm3E1yJJcC1A69EFSCy8J_qBRzox-hNfr3pa9pgL208SwDPP8Hz54dXe3QQX-cO_yIqYLho6O4olK_f725OQD3BsU3ImtgR9wJmTlQmWik',
    summary:
      'Canada study planning, SDS updates, Provincial Attestation Letter (PAL) allocations, post-study work options, and university intake schedules.'
  }
];

export const BlogHubView: React.FC<BlogHubViewProps> = ({
  onOpenConsultation,
  onNavigate
}) => {
  // Hero Carousel State
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  // Active Category State
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Search Input State
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active Page State
  const [currentPage, setCurrentPage] = useState<number>(3);

  // Articles Database State with Bookmarks
  const [articles, setArticles] = useState<BlogPost[]>(() => {
    return mockBlogPosts;
  });

  // Modal State for Reading
  const [activeModalArticle, setActiveModalArticle] = useState<{
    title: string;
    topic: string;
    author: string;
    body: string;
  } | null>(null);

  // Copied Link Notification
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Quick Counseling Intake Form State
  const [counselingName, setCounselingName] = useState('');
  const [counselingPhone, setCounselingPhone] = useState('');
  const [counselingCountry, setCounselingCountry] = useState('');
  const [counselingSubmitted, setCounselingSubmitted] = useState(false);

  const heroSlide = HERO_SLIDES[currentHeroSlide];

  // Carousel navigation
  const nextHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  // Keyboard navigation for escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModalArticle(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toggle bookmark on article
  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, saved: !a.saved } : a))
    );
  };

  // Open article modal
  const openArticleModal = (title: string, topic: string, author: string, body: string) => {
    setActiveModalArticle({ title, topic, author, body });
  };

  // Copy link handler
  const handleCopyLink = () => {
    if (activeModalArticle) {
      const url = `${window.location.origin}/blog.html#${encodeURIComponent(
        activeModalArticle.title.toLowerCase().replace(/\s+/g, '-')
      )}`;
      navigator.clipboard.writeText(url);
      setIsLinkCopied(true);
      setTimeout(() => setIsLinkCopied(false), 2400);
    }
  };

  // Newsletter submit
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setIsSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setIsSubscribed(false), 4500);
  };

  // Quick counseling submit
  const handleCounselingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!counselingName || !counselingPhone) return;
    setCounselingSubmitted(true);
    setTimeout(() => {
      setCounselingSubmitted(false);
      setCounselingName('');
      setCounselingPhone('');
      setCounselingCountry('');
    }, 4500);
  };

  // Category Filtering Logic
  const savedCount = articles.filter((a) => a.saved).length;

  const categoriesList = [
    { id: 'all', label: 'All' },
    { id: 'technology', label: 'Technology' },
    { id: 'digital marketing', label: 'Digital Marketing / Courses' },
    { id: 'visa', label: 'Social Media / Visa' },
    { id: 'scholarship', label: 'Other / Scholarships' },
    {
      id: 'saved',
      label: `Saved (${savedCount})`
    }
  ];

  // Combined Filtering
  const filteredArticles = articles.filter((article) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      article.title.toLowerCase().includes(query) ||
      article.excerpt.toLowerCase().includes(query) ||
      article.category.toLowerCase().includes(query);

    if (!matchesSearch) return false;

    if (activeCategory === 'all') return true;
    if (activeCategory === 'saved') return article.saved;
    if (activeCategory === 'technology')
      return (
        article.category.toLowerCase().includes('tech') ||
        article.title.toLowerCase().includes('tech') ||
        article.title.toLowerCase().includes('russell')
      );
    if (activeCategory === 'digital marketing')
      return (
        article.category.toLowerCase().includes('course') ||
        article.category.toLowerCase().includes('market') ||
        article.title.toLowerCase().includes('career')
      );
    if (activeCategory === 'visa')
      return (
        article.category.toLowerCase().includes('visa') ||
        article.title.toLowerCase().includes('visa') ||
        article.title.toLowerCase().includes('immigration')
      );
    if (activeCategory === 'scholarship')
      return (
        article.category.toLowerCase().includes('scholarship') ||
        article.title.toLowerCase().includes('scholarship') ||
        article.category.toLowerCase().includes('canada')
      );

    return true;
  });

  return (
    <div className="w-full bg-[#f7f9fd] dark:bg-[#070D1E] text-[#0b1c30] dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

        {/* Top Breadcrumb & Back Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && window.location.pathname.includes('blog')) {
                window.location.href = '/';
              } else if (onNavigate) {
                onNavigate('home');
              } else if (typeof window !== 'undefined') {
                window.location.href = '/';
              }
            }}
            className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-[#fbb034] hover:underline cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Home</span>
          </button>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">/</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">Blog & Knowledge Hub</span>
        </nav>

        {/* 1. BIG HERO TYPOGRAPHY & MAGAZINE DUAL SHOWCASE */}
        <section className="mb-12 sm:mb-16">
          {/* Oversized Distinctive "Blog." Header & Scribble Style */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 relative">
            <div className="relative">
              {/* Floating Pastel Highlight Badge */}
              <span className="absolute -top-3 left-28 sm:left-36 bg-[#ffecde] dark:bg-orange-950/60 text-[#ff5500] dark:text-[#ff884d] text-[11px] sm:text-xs font-black uppercase px-2.5 py-0.5 rounded-md rotate-[-4deg] shadow-2xs border border-[#ffcdb2] dark:border-orange-800/60 select-none">
                Insights 2026
              </span>
              <div className="flex items-baseline">
                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-none inline-block">
                  Blog<span className="text-[#ff5500]">.</span>
                </h1>
              </div>
              {/* Hand-drawn Scribble Accent Line */}
              <div className="w-36 sm:w-48 mt-1 h-3 relative">
                <svg
                  className="w-full h-full text-[#ff5500]"
                  fill="none"
                  preserveAspectRatio="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="4"
                  viewBox="0 0 160 12"
                >
                  <path d="M 2 8 C 45 2, 100 12, 158 5" />
                </svg>
              </div>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-md font-normal leading-relaxed">
              The ultimate field guide to global degrees, Ivy & Russell League admissions, full scholarships, and post-study work regulations.
            </p>
          </div>

          {/* Magazine Split Layout: Left Featured Carousel & Right Dark Popular Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* LEFT HERO SLIDER CARD (8 Cols) */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs relative overflow-hidden group">
              {/* Top Metadata & Author Tag */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10">
                <div className="flex items-center gap-3">
                  <span className="bg-[#ffecde] dark:bg-orange-950/60 text-[#ff5500] dark:text-[#ff884d] font-black text-xs uppercase px-3.5 py-1.5 rounded-full tracking-wider border border-[#ffd5bf] dark:border-orange-800/50">
                    New Articles
                  </span>
                  <div className="flex items-center gap-2">
                    <img
                      alt="Author Avatar"
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-orange-200 dark:ring-orange-800"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvWOHLrxbJMo7KpbeFPYtJOz_j1oD39UhOXQfBy4YHZkSO2jugmoS6iFvFXJ2CM4H0pnAp3nM0wAfDQeFJftbNZK5kGOr4deJSKbUPSx5w4eQ_WB9Rr5nst64DvhRrj2dV-E9Gam2frwwO5F32z7zsSBuXG1m-iFtemrErwazrTsQCUvxJmdBrJ1-AGq-QABo4EFdUZg3k3A0ifFgYcHDjgl1ZpmJ9gnHuCBgRcDCG"
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {heroSlide.author}
                    </span>
                  </div>
                </div>

                {/* Carousel Controls */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-extrabold text-slate-400">
                    {currentHeroSlide + 1} / {HERO_SLIDES.length}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      aria-label="Previous article"
                      onClick={prevHeroSlide}
                      className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 hover:border-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 text-xs transition cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-sm">chevron_left</span>
                    </button>
                    <button
                      aria-label="Next article"
                      onClick={nextHeroSlide}
                      className="w-8 h-8 rounded-full bg-[#ff5500] hover:bg-[#e04800] text-white flex items-center justify-center text-xs shadow-xs transition cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Hero Article Dynamic Content Container */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={heroSlide.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="relative z-10"
                >
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff5500] mb-2 uppercase tracking-wide">
                    <span className="w-2 h-2 rounded-full bg-[#ff5500]"></span>
                    <span>{heroSlide.category}</span>
                  </div>
                  <h2
                    onClick={() =>
                      openArticleModal(heroSlide.title, heroSlide.category, heroSlide.author, heroSlide.excerpt)
                    }
                    className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-[1.15] mb-4 cursor-pointer hover:text-[#ff5500] transition-colors"
                  >
                    {heroSlide.title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
                    {heroSlide.excerpt}
                  </p>

                  {/* Metrics and Date Row */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-6">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-[#ff5500]">visibility</span>
                      <span>{heroSlide.views}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-slate-400">schedule</span>
                      <span>{heroSlide.readTime}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-slate-400">calendar_today</span>
                      <span>{heroSlide.date}</span>
                    </span>
                  </div>

                  {/* Featured Big Image Banner with verified badge */}
                  <div
                    onClick={() =>
                      openArticleModal(heroSlide.title, heroSlide.category, heroSlide.author, heroSlide.excerpt)
                    }
                    className="rounded-2xl overflow-hidden h-52 sm:h-72 w-full relative mb-6 shadow-xs cursor-pointer group"
                  >
                    <img
                      alt={heroSlide.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={heroSlide.img}
                    />
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-white text-xs font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Verified Academic Roadmap</span>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() =>
                        openArticleModal(heroSlide.title, heroSlide.category, heroSlide.author, heroSlide.excerpt)
                      }
                      className="bg-[#ff5500] hover:bg-[#e04800] text-white font-extrabold text-sm px-7 py-3.5 rounded-xl shadow-lg shadow-orange-500/25 transition-all duration-200 flex items-center gap-2 hover:gap-3 cursor-pointer"
                      type="button"
                    >
                      <span>Read More</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                    <button
                      onClick={onOpenConsultation}
                      className="px-5 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold transition cursor-pointer"
                      type="button"
                    >
                      Book Guidance Session
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* RIGHT CONTRAST DARK POPULAR ARTICLES CARD (4 Cols) */}
            <div className="lg:col-span-4 bg-[#11141c] text-white rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl border border-slate-800">
              <div>
                {/* Dark Section Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-[#ff5500]"></span>
                    <h3 className="text-xl font-black tracking-tight text-white">Popular Articles</h3>
                  </div>
                  <button
                    onClick={() => {
                      document.getElementById('latest-articles')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-xs font-bold text-[#ff5500] hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                {/* List of Popular Articles */}
                <div className="space-y-3.5">
                  {POPULAR_ARTICLES.map((item, idx) => (
                    <div
                      key={item.id}
                      onClick={() =>
                        openArticleModal(item.title, item.kicker, 'GEES Editorial', item.summary)
                      }
                      className={`rounded-2xl p-3.5 transition cursor-pointer flex items-center gap-3 group ${
                        idx === 0
                          ? 'bg-[#191e2b] hover:bg-[#202738] border border-orange-500/30'
                          : 'bg-[#181c26] hover:bg-[#202738] border border-slate-800'
                      }`}
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative">
                        <img
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                          src={item.img}
                        />
                      </div>
                      <div className="grow min-w-0">
                        <span className="text-[10px] font-bold text-[#ff5500] uppercase tracking-wider block">
                          {item.kicker}
                        </span>
                        <h4 className="text-xs font-bold text-white line-clamp-2 group-hover:text-[#ff5500] transition leading-snug">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                          <span>{item.views}</span>
                          <span>•</span>
                          <span>{item.readTime}</span>
                        </div>
                      </div>
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 transition ${
                          idx === 0
                            ? 'bg-[#ff5500] text-white shadow-xs'
                            : 'bg-slate-800 text-slate-300 group-hover:bg-[#ff5500] group-hover:text-white'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Micro Banner inside Dark Card */}
              <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-[#ff5500]">bolt</span>
                  <span className="text-slate-300 font-semibold">120+ Partner Unis</span>
                </div>
                <button
                  type="button"
                  onClick={onOpenConsultation}
                  className="text-white font-extrabold hover:text-[#ff5500] flex items-center gap-1 transition cursor-pointer"
                >
                  <span>Instant Match</span>
                  <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 2. LATEST ARTICLES SECTION (Styled Header, Pill Categories & Search) */}
        <section className="mb-14" id="latest-articles">
          {/* Section Title with highlight bar & live search */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-block relative">
                <span className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight relative z-10">
                  Latest Articles
                </span>
                {/* Highlight bar behind text */}
                <span className="absolute bottom-1.5 left-0 w-full h-3 bg-[#ffd5bf] dark:bg-orange-950/60 -z-0 opacity-80 rounded-xs"></span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
                Discover verified updates on university deadlines, visa clearances, and scholarships.
              </p>
            </div>

            {/* Quick Live Search Input */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search by title, country or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-full py-2.5 pl-10 pr-9 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff5500] focus:border-[#ff5500] shadow-2xs transition"
              />
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <span className="material-symbols-outlined text-sm">search</span>
              </div>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills Bar matching exact requested categories */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-8">
            {categoriesList.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 text-xs font-bold rounded-full transition cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#ff5500] text-white shadow-xs border border-[#ff5500]'
                      : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* 3-Column Articles Grid */}
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <article
                  key={article.id}
                  onClick={() =>
                    openArticleModal(article.title, article.category, article.author, article.excerpt)
                  }
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    {/* Thumbnail with floating category pill and arrow button */}
                    <div className="h-52 overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                      <img
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={article.imageUrl}
                        loading="lazy"
                      />
                      <span className="absolute top-3 left-3 bg-[#ff5500] text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs">
                        {article.category.split('•')[0].trim()}
                      </span>

                      {/* Bookmark button */}
                      <button
                        type="button"
                        onClick={(e) => toggleBookmark(article.id, e)}
                        title={article.saved ? 'Remove bookmark' : 'Bookmark post'}
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-colors shadow-2xs cursor-pointer ${
                          article.saved
                            ? 'bg-red-500 text-white'
                            : 'bg-black/50 text-white hover:bg-black/80'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          {article.saved ? 'bookmark' : 'bookmark_border'}
                        </span>
                      </button>

                      {/* Floating Hover Arrow Button with Vibrant Orange */}
                      <button
                        type="button"
                        aria-label="Open article"
                        className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-[#ff5500] text-white flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-110 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                    </div>

                    {/* Body Content */}
                    <div className="p-6">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        By {article.author}
                      </div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-snug group-hover:text-[#ff5500] transition line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 line-clamp-3 leading-relaxed">
                        {article.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 pb-6 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[13px] text-[#ff5500]">visibility</span>
                      <span>{article.viewsCount ? `${article.viewsCount} views` : '3,200 views'}</span>
                    </span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                    <span>•</span>
                    <span>{article.publishedDate}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
              <div className="w-14 h-14 bg-orange-50 dark:bg-orange-950/40 text-[#ff5500] rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="material-symbols-outlined text-2xl">search_off</span>
              </div>
              <p className="text-base font-bold text-slate-900 dark:text-white">No matching articles found</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Try searching for another keyword or select "All" to browse all published insights.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="mt-4 px-5 py-2.5 bg-[#ff5500] hover:bg-[#e04800] text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
              >
                Show All Articles
              </button>
            </div>
          )}

          {/* Exact Requested Numbered Pagination Bar: ‹, 1, 2, 3 [active], ..., 22, 23, 24, › */}
          <nav
            aria-label="Pagination Navigation"
            className="mt-12 flex items-center justify-center gap-1.5 sm:gap-2 select-none"
          >
            {/* Previous */}
            <button
              aria-label="Previous Page"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 transition text-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>

            {[1, 2].map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm transition cursor-pointer ${
                  currentPage === num
                    ? 'bg-[#ff5500] text-white shadow-md shadow-orange-500/25'
                    : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {num}
              </button>
            ))}

            {/* Page 3 Active in vibrant orange */}
            <button
              aria-current="page"
              onClick={() => setCurrentPage(3)}
              className={`w-10 h-10 flex items-center justify-center rounded-xl font-black text-sm transition cursor-pointer ${
                currentPage === 3
                  ? 'bg-[#ff5500] text-white shadow-md shadow-orange-500/25'
                  : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              3
            </button>

            <span className="w-8 h-10 flex items-center justify-center text-slate-400 font-bold text-sm tracking-wider">
              ...
            </span>

            {[22, 23].map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`w-10 h-10 hidden sm:flex items-center justify-center rounded-xl font-bold text-sm transition cursor-pointer ${
                  currentPage === num
                    ? 'bg-[#ff5500] text-white shadow-md shadow-orange-500/25'
                    : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {num}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(24)}
              className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm transition cursor-pointer ${
                currentPage === 24
                  ? 'bg-[#ff5500] text-white shadow-md shadow-orange-500/25'
                  : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              24
            </button>

            {/* Next */}
            <button
              aria-label="Next Page"
              onClick={() => setCurrentPage((p) => Math.min(24, p + 1))}
              disabled={currentPage === 24}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 transition text-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </nav>
        </section>

        {/* 3. NEWSLETTER & ENGAGEMENT FOOTER SECTION */}
        <section className="mb-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Newsletter Card with Pastel Accent */}
            <div className="lg:col-span-7 bg-[#fff6ee] dark:bg-slate-900 border border-orange-200/80 dark:border-slate-800 rounded-3xl p-7 sm:p-9 flex flex-col justify-between shadow-2xs relative overflow-hidden">
              <div className="relative z-10 mb-6">
                <span className="inline-flex items-center gap-1.5 bg-white dark:bg-slate-800 text-[#ff5500] border border-orange-200 dark:border-slate-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-3 shadow-2xs">
                  <span className="material-symbols-outlined text-sm">mark_email_read</span>
                  <span>Stay Ahead</span>
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  Subscribe to our Academic Newsletter
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-2 max-w-lg leading-relaxed">
                  Get early alerts on university fee discounts, scholarship deadlines, and step-by-step visa guidelines delivered straight to your inbox every Friday.
                </p>
              </div>

              {isSubscribed ? (
                <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-emerald-600">check_circle</span>
                  <span>Subscribed successfully! Watch your inbox for curated weekly insights.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="relative z-10 flex flex-col sm:flex-row gap-2.5 items-stretch">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="grow bg-white dark:bg-slate-800 border border-orange-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#ff5500] placeholder:text-slate-400 shadow-2xs"
                  />
                  <button
                    type="submit"
                    className="bg-[#ff5500] hover:bg-[#e04800] text-white font-extrabold text-sm px-7 py-3.5 rounded-2xl transition shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                  >
                    <span>Subscribe</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </form>
              )}

              <p className="relative z-10 text-[11px] text-slate-400 mt-3">
                We respect your inbox. No spam, ever. Unsubscribe with 1 click anytime.
              </p>
            </div>

            {/* Social Media Harm & Mental Health / Focus Callout Card */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-7 sm:p-8 flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-md border border-rose-100 dark:border-rose-900/40">
                    Wellness & Focus
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">Self Care 2026</span>
                </div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                  "Social Media Seriously Harms Your Mental Health" — Stay Focused
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">
                  Limit infinite doomscrolling during exam prep and IELTS cycles. Connect with verified education mentors and genuine student communities instead.
                </p>
              </div>

              {/* Follow on Socials Channels Row */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Connect With GEES Community
                </span>
                <div className="flex items-center gap-2.5">
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter X"
                    className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition"
                  >
                    <span className="font-bold text-xs">𝕏</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/company/globaleduexpert"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition"
                  >
                    <span className="font-bold text-xs">in</span>
                  </a>
                  <a
                    href="https://www.instagram.com/global.eduexpert"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-gradient-to-tr hover:from-amber-500 hover:to-pink-500 hover:text-white hover:border-transparent transition"
                  >
                    <span className="material-symbols-outlined text-sm">photo_camera</span>
                  </a>
                  <a
                    href="https://www.youtube.com/@globaleduexpert"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-red-600 hover:text-white hover:border-red-600 transition"
                  >
                    <span className="material-symbols-outlined text-sm">smart_display</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. QUICK COUNSELING INTAKE BARREL (Persistent GEES Feature) */}
        <section className="mb-14" id="consultation">
          <div className="bg-gradient-to-br from-[#0c1017] via-[#141924] to-[#1c2233] text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-slate-800">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#ff5500]/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-7 space-y-4">
                <span className="inline-flex items-center gap-1.5 bg-[#ff5500]/20 text-[#ff8040] border border-[#ff5500]/30 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                  ★ Certified Global Counselors
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  Ready to Study Abroad? Get 1-on-1 Personalized Mentorship.
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  From university shortlisting and scholarship essays to visa lodge and pre-departure briefs — our senior advisors support you from start to campus arrival.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-[#ff5500]">check</span>
                    <span>100% Free Consultation</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-[#ff5500]">check</span>
                    <span>98% Visa Clearance</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-[#ff5500]">check</span>
                    <span>120+ Partner Unis</span>
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white text-slate-900 rounded-2xl p-6 shadow-xl">
                <h3 className="text-base font-black text-slate-900">Request Free Counseling</h3>
                <p className="text-xs text-slate-500 mb-3">A GEES Senior Counselor will reach you within 2 hours.</p>
                
                {counselingSubmitted ? (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center space-y-2">
                    <span className="material-symbols-outlined text-3xl text-emerald-600">task_alt</span>
                    <h4 className="font-bold text-sm">Request Submitted!</h4>
                    <p className="text-xs text-slate-600">
                      An authorized advisor will reach out to you shortly via WhatsApp.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleCounselingSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tanvir Ahmed"
                        value={counselingName}
                        onChange={(e) => setCounselingName(e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#ff5500] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                        WhatsApp / Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+880 1800 000000"
                        value={counselingPhone}
                        onChange={(e) => setCounselingPhone(e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#ff5500] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                        Target Country
                      </label>
                      <select
                        required
                        value={counselingCountry}
                        onChange={(e) => setCounselingCountry(e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#ff5500] focus:outline-none font-medium text-slate-800"
                      >
                        <option value="">Select Destination</option>
                        <option value="Malaysia">Malaysia</option>
                        <option value="UK">United Kingdom</option>
                        <option value="Australia">Australia</option>
                        <option value="New Zealand">New Zealand</option>
                        <option value="Cyprus">Cyprus</option>
                        <option value="Belgium">Belgium</option>
                        <option value="Finland">Finland</option>
                        <option value="Greece">Greece</option>
                        <option value="Mauritius">Mauritius</option>
                        <option value="Netherlands">Netherlands</option>
                        <option value="India">India</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="w-full mt-2 bg-[#ff5500] hover:bg-[#e04800] text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-md shadow-orange-500/20 cursor-pointer"
                    >
                      Book Free Counseling Now
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* ARTICLE PREVIEW MODAL */}
      <AnimatePresence>
        {activeModalArticle && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn"
          >
            <div className="relative transform overflow-hidden rounded-3xl bg-white dark:bg-slate-900 text-left shadow-2xl transition-all w-full max-w-xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto no-scrollbar">
              
              {/* Modal Top Meta */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="bg-[#ffecde] dark:bg-orange-950/60 text-[#ff5500] dark:text-[#ff884d] text-[11px] px-2.5 py-0.5 rounded-full font-bold">
                    {activeModalArticle.topic}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    By <strong className="text-slate-800 dark:text-slate-200">{activeModalArticle.author}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  aria-label="Close modal"
                  onClick={() => setActiveModalArticle(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white transition cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>

              {/* Modal Body Content */}
              <div className="mt-4">
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white leading-snug tracking-tight">
                  {activeModalArticle.title}
                </h3>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {activeModalArticle.body}
                </p>

                <div className="mt-6 p-4 rounded-2xl bg-[#fff7f0] dark:bg-slate-800/60 border border-orange-200/60 dark:border-slate-700 flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#ff5500] text-lg mt-0.5 shrink-0">
                    info
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    GEES certified counselors provide free personalized university shortlists, scholarship drafting, and visa document evaluations for 2026/2027 sessions.
                  </p>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="mt-7 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">
                    {isLinkCopied ? 'check' : 'content_copy'}
                  </span>
                  <span>{isLinkCopied ? 'Link copied to clipboard!' : 'Copy article link'}</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setActiveModalArticle(null)}
                    className="flex-1 sm:flex-none px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModalArticle(null);
                      onOpenConsultation();
                    }}
                    className="flex-1 sm:flex-none px-5 py-2.5 bg-[#ff5500] hover:bg-[#e04800] text-white rounded-xl text-xs font-black transition shadow-sm text-center cursor-pointer"
                  >
                    Free Counseling
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
