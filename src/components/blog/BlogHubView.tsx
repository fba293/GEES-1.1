/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES - Global Education Expert Services
 * Blog & Study Guides Explorer (/blog)
 *
 * Redesigned on the unified Universities, Courses, Language Center List & Study Abroad
 * architecture: dark navy hero banner with location breadcrumb, unified search card,
 * floating pill controls bar, Stitch-style collapsible left filter sidebar with
 * liquid-gooey reading-time slider, Cards/List/Featured/Saved views, and full article reader.
 */

import React, { useMemo, useState } from 'react';
import { mockBlogPosts } from '../../data/mockDatabase.ts';
import { GooeyIeltsSlider } from '../portal/GooeyIeltsSlider.tsx';
import { NumberTicker } from '../ui/number-ticker.tsx';
import { ExplorerPageShell, ExplorerHeroBanner, SectionHeader } from '../portal/ExplorerTheme.tsx';

interface BlogHubViewProps {
  onOpenConsultation: (topicContext?: string) => void;
  onNavigate?: (view: string, payload?: any) => void;
  onNavigateHome?: () => void;
}

type BlogTopic =
  | 'Visa & Immigration'
  | 'Admissions & Guides'
  | 'Scholarships'
  | 'Cost & Career'
  | 'Country Guides';

interface EnrichedBlogArticle {
  id: string;
  slug: string;
  title: string;
  topic: BlogTopic;
  country: string;
  publishedDate: string;
  sortDate: number;
  readMinutes: number;
  readTime: string;
  author: string;
  viewsCount: number;
  excerpt: string;
  body: string;
  imageUrl: string;
  takeaways: string[];
  featured: boolean;
  defaultSaved: boolean;
}

const ITEMS_PER_PAGE = 6;
const MAX_READ_MINUTES = 10;

const BLOG_TOPICS: BlogTopic[] = [
  'Visa & Immigration',
  'Admissions & Guides',
  'Scholarships',
  'Cost & Career',
  'Country Guides',
];

const CHECKBOX_CLASS =
  'rounded border-slate-300 text-amber-500 focus:ring-amber-500 w-3.5 h-3.5 cursor-pointer accent-amber-500';
const ACTIVE_BADGE_CLASS =
  'text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 max-w-[115px] truncate';
const DEFAULT_BADGE_CLASS =
  'text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500';

/** Resilient editorial cover image with clean gradient fallback */
const ArticleCoverImage: React.FC<{
  src: string;
  alt: string;
  topic: string;
  country: string;
  heightClass?: string;
}> = ({ src, alt, topic, country, heightClass = 'h-48' }) => {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`relative w-full ${heightClass} overflow-hidden bg-[#0a1120] shrink-0`}>
      {!failed && src ? (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setFailed(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[#0a1120] via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4 text-center text-white">
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
            {topic}
          </span>
          <span className="text-xs text-slate-300 mt-1">{country}</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1120]/70 via-transparent to-black/15 pointer-events-none" />
    </div>
  );
};

function parseReadMinutes(readTime: string): number {
  const match = readTime.match(/(\d+)/);
  return match ? Math.min(MAX_READ_MINUTES, Math.max(1, Number(match[1]))) : 5;
}

function classifyTopic(category: string, title: string): BlogTopic {
  const hay = `${category} ${title}`.toLowerCase();
  if (hay.includes('scholarship') || hay.includes('grant') || hay.includes('funded')) {
    return 'Scholarships';
  }
  if (hay.includes('visa') || hay.includes('emgs') || hay.includes('immigration') || hay.includes('evidence')) {
    return 'Visa & Immigration';
  }
  if (hay.includes('cost') || hay.includes('living') || hay.includes('budget') || hay.includes('work')) {
    return 'Cost & Career';
  }
  if (hay.includes('russell') || hay.includes('roadmap') || hay.includes('ielts') || hay.includes('admission')) {
    return 'Admissions & Guides';
  }
  return 'Country Guides';
}

function detectCountry(category: string, title: string): string {
  const hay = `${category} ${title}`.toLowerCase();
  if (hay.includes('malaysia') || hay.includes('kuala lumpur') || hay.includes('emgs')) return 'Malaysia';
  if (hay.includes('australia')) return 'Australia';
  if (hay.includes('uk') || hay.includes('russell') || hay.includes('london') || hay.includes('britain')) {
    return 'United Kingdom';
  }
  if (hay.includes('canada') || hay.includes('pgwp') || hay.includes('sds')) return 'Canada';
  if (hay.includes('malta')) return 'Malta';
  return 'Global';
}

const CURATED_EXTRA_ARTICLES: EnrichedBlogArticle[] = [
  {
    id: 'curated-1',
    slug: 'roadmap-to-study-abroad-2026-2027',
    title: 'Complete Roadmap to Study Abroad 2026/2027: Timeline & Checklist',
    topic: 'Admissions & Guides',
    country: 'Global',
    publishedDate: 'September 14, 2026',
    sortDate: 20260914,
    readMinutes: 5,
    readTime: '5 min read',
    author: 'GEES Academic Editorial',
    viewsCount: 4920,
    excerpt:
      'A step-by-step admission calendar covering university shortlisting, IELTS/MOI pathways, Statement of Purpose drafting, and student visa filing.',
    body: 'Planning an international degree 9 to 12 months ahead unlocks the widest scholarship windows and lowest tuition tiers. Start by shortlisting 4 to 6 accredited universities across two countries, verifying intake deadlines (September/October or February/March), and compiling attested academic transcripts. Preparing your English proficiency test early—or confirming institutional Medium of Instruction (MOI) waivers—gives you a decisive head start before visa slots tighten.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCL38dPjC7ApDCOf8FqMMHxIadQ3tXV28wis9CEW1ZGLGjSZ1BJufGNToSyLFIotialZ7a6s0fERRtT9CP5G_eBnW9Y3tTJ1EVz6MUIXSrb0MNZjzNJYsAUDp2Wn-w2GgjtiUZbXri-Y52GJyTa4qBYbkpZAC0ITPATk0IMVSQ4nqhArPw3L8uaIDoWf8OTu-65lmIBMk5MoxGb9zXFwZlJNeVdf0p4waN7Upw62H7S',
    takeaways: [
      'Begin university shortlisting at least 8–10 months prior to your target intake.',
      'Submit scholarship applications alongside conditional admission offers to maximize awards.',
      'Audit bank solvency statements 3 months ahead of embassy visa submission.',
    ],
    featured: true,
    defaultSaved: false,
  },
  {
    id: 'curated-2',
    slug: 'living-in-kuala-lumpur-and-london-budget-breakdown',
    title: 'Living in Kuala Lumpur vs. London: Real Student Budget Breakdown',
    topic: 'Cost & Career',
    country: 'Malaysia',
    publishedDate: 'August 24, 2026',
    sortDate: 20260824,
    readMinutes: 6,
    readTime: '6 min read',
    author: 'Shahd Ashraf',
    viewsCount: 3750,
    excerpt:
      'Honest monthly comparisons of student housing, groceries, public transit passes, health cover, and part-time earnings across KL and London.',
    body: 'Choosing between studying at a UK branch campus in Kuala Lumpur versus relocating directly to London comes down to total 3-year cost of ownership. In Kuala Lumpur, international students comfortably manage rent, meals, high-speed internet, and LRT transit between $420 and $650 USD per month, whereas central London budgets require $1,400 to $1,950 USD monthly. Many students optimize ROI by completing Year 1–2 in Malaysia and transferring for their final honours year in the UK.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDVOmwVdqW2HFHY9SRhk5OAK6Mk0P4dWI9t2XSYH76XJJnVLPaU-4nYfTM6vhvMWR3-p2LlFp3vPbzCEDF_2fRp-5mBDZCMYNj3l6nfbsx8_Fj9QgaKFNXXcEfIsMj7CAkqqCp3dW3A-6H7UWlvTJnQzHRgjLhEoFiWthUMa7EmqxV2WN_RzkmsLsuzjsqHOsKFNenawIDBXeXWToSR1_mnY_9V43ngCJddL91hI3N7',
    takeaways: [
      'Kuala Lumpur living expenses average roughly one-third of Greater London student budgets.',
      'Student transit concessions cut monthly commuting costs by 30%–50% in both capitals.',
      'Twinning and credit-transfer pathways let you earn an identical UK degree for far less.',
    ],
    featured: true,
    defaultSaved: false,
  },
  {
    id: 'curated-3',
    slug: 'study-in-canada-fall-intake-pgwp-roadmap',
    title: 'Study in Canada: PAL, Co-op Degrees & 3-Year PGWP Explained',
    topic: 'Country Guides',
    country: 'Canada',
    publishedDate: 'August 15, 2026',
    sortDate: 20260815,
    readMinutes: 7,
    readTime: '7 min read',
    author: 'Ali Ahmed',
    viewsCount: 5320,
    excerpt:
      'Everything international applicants need to know about Provincial Attestation Letters (PAL), paid university co-op terms, and PGWP rules.',
    body: 'Canada remains a magnet for career-focused international graduates thanks to built-in cooperative education placements and Post-Graduation Work Permits (PGWP) lasting up to 3 years. Under updated IRCC guidelines, undergraduate and diploma applicants should verify their institution’s Designated Learning Institution (DLI) PGWP eligibility and secure their Provincial Attestation Letter (PAL) immediately after accepting an offer. Master’s and PhD graduates continue to enjoy streamlined PGWP eligibility.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDGypko5jHLRdiVc8suvx5c_1T7iZ9sANL1rFTrgjBMPV0RoU4QLao68ff7M_o2_d7fmZFlMASO8sC3UL1s5H1-2Dk9Akiv3Zt8Uyh8M4KqSnYY6Yo0cOwzjk-w_bJu1nGm3E1yJJcC1A69EFSCy8J_qBRzox-hNfr3pa9pgL208SwDPP8Hz54dXe3QQX-cO_yIqYLho6O4olK_f725OQD3BsU3ImtgR9wJmTlQmWik',
    takeaways: [
      'Confirm DLI and PGWP field-of-study eligibility before paying your tuition deposit.',
      'Paid university co-op semesters offset living costs and build Canadian employer references.',
      'Students may legally work up to 24 hours per week off-campus during academic terms.',
    ],
    featured: true,
    defaultSaved: false,
  },
  {
    id: 'curated-4',
    slug: 'five-full-scholarships-for-international-students',
    title: '5 Full Scholarships Covering 100% Tuition & Living Stipends in 2026',
    topic: 'Scholarships',
    country: 'Global',
    publishedDate: 'September 01, 2026',
    sortDate: 20260901,
    readMinutes: 5,
    readTime: '5 min read',
    author: 'GEES Academic Editorial',
    viewsCount: 7430,
    excerpt:
      'Compare Chevening, Malaysia International Scholarship (MIS), Stipendium Hungaricum, GKS Korea, and Australia Awards deadlines and criteria.',
    body: 'Fully funded government scholarships evaluate leadership impact and career clarity just as heavily as academic GPA. The Malaysia International Scholarship (MIS), UK Chevening, Hungary’s Stipendium Hungaricum, South Korea’s GKS, and Australia Awards all cover 100% tuition plus monthly living allowances. Applicants with clear research alignment, two tailored academic references, and early unconditional offers dramatically outperform last-minute submissions.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAHLHlBvPTUP_woiukR6jyvrpkQHHgNltF53_dXixZxld7Yx6F8iNl2wEjVYBuIYH9nN2OnG47addo1cM7IVv7HMQjElZVM47ps0JKh5Ek7SW4DRjJX3RcOyvMoQEbyQbHuJx80_hm5RnRkgMJZAurStofYHO1Op7az6MKv3hOb4gl8N0lVT-lG4ZBth8xhFjaAs0yA3Jfdl8eRkFFCQYNM2zil4OPMQDvVRRBBGwF5',
    takeaways: [
      'Stipendium Hungaricum and GKS cover full tuition, dormitory housing, and monthly stipends.',
      'Chevening requires 2 years of work experience (including internships and volunteering).',
      'Many Malaysian private universities stack 25%–50% merit waivers automatically on offer.',
    ],
    featured: true,
    defaultSaved: false,
  },
  {
    id: 'curated-5',
    slug: 'can-international-students-work-in-malaysia-legally',
    title: 'Can International Students Work Part-Time in Malaysia Legally?',
    topic: 'Cost & Career',
    country: 'Malaysia',
    publishedDate: 'August 10, 2026',
    sortDate: 20260810,
    readMinutes: 4,
    readTime: '4 min read',
    author: 'Fahad Bin Abdullah',
    viewsCount: 3890,
    excerpt:
      'Official Immigration Department guidelines on 20-hour semester break work permits, eligible sectors, and university endorsement steps.',
    body: 'International students holding a valid Malaysian Student Pass are permitted to work part-time up to 20 hours per week during scheduled semester breaks and holidays longer than 7 days. Eligible sectors include restaurants, petrol kiosks, mini-markets, and hotels—excluding cashier roles. Applications must be endorsed by your university international office and submitted to Immigration Malaysia before starting work.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCvWOHLrxbJMo7KpbeFPYtJOz_j1oD39UhOXQfBy4YHZkSO2jugmoS6iFvFXJ2CM4H0pnAp3nM0wAfDQeFJftbNZK5kGOr4deJSKbUPSx5w4eQ_WB9Rr5nst64DvhRrj2dV-E9Gam2frwwO5F32z7zsSBuXG1m-iFtemrErwazrTsQCUvxJmdBrJ1-AGq-QABo4EFdUZg3k3A0ifFgYcHDjgl1ZpmJ9gnHuCBgRcDCG',
    takeaways: [
      'Permitted up to 20 hours/week during official semester breaks exceeding 7 days.',
      'Requires prior written approval from your institution’s International Student Office.',
      'Maintain strong attendance (80%+) and academic standing to keep your Student Pass active.',
    ],
    featured: false,
    defaultSaved: false,
  },
  {
    id: 'curated-6',
    slug: 'ielts-vs-pte-vs-moi-choosing-your-english-pathway',
    title: 'IELTS vs. PTE Academic vs. MOI Waiver: Which Fits Your Target Uni?',
    topic: 'Admissions & Guides',
    country: 'Global',
    publishedDate: 'July 22, 2026',
    sortDate: 20260722,
    readMinutes: 3,
    readTime: '3 min read',
    author: 'Nusrat Jahan',
    viewsCount: 3180,
    excerpt:
      'Compare test fees, result turnaround speeds, and which UK, Australian, and Malaysian universities accept PTE or Medium of Instruction letters.',
    body: 'Selecting the right English proof can save weeks on your admission timeline. IELTS Academic remains universally accepted across all 15 study destinations, while PTE Academic delivers automated scores within 48 hours and is fully accepted for Australian Subclass 500 and UK Student Visas. In Malaysia and select UK universities, students from English-medium backgrounds or approved intensive language centers can qualify without retaking external tests.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCxxfIDgyeagRGN0XzBPet3SvNrO7lEIvoNZNigrhcmr_7UvSG3JXfHOs9ubb73gzPczFX1rjz8CNCUM-DpzNCC4D-N8aW9cA4yJlkBRMqJWJu84E3G0-SsAQ_uttqQN_ib3Ffxf-CrTCZ2SYMzfo3bv3kJ6ZVuMnfmYdq3DQ2qqpNDASduMYKtdtTohMWw8s7Og_GoRExdNB2yWvriRXoHOLO_akzaf2_1SK7u48X5',
    takeaways: [
      'PTE Academic scores typically arrive in 24–48 hours—ideal for tight intake deadlines.',
      'MOI letters are accepted by select UK and Malaysian universities with strong HSC/Bachelor records.',
      'MOE-approved language centers in Kuala Lumpur offer direct university progression tracks.',
    ],
    featured: false,
    defaultSaved: false,
  },
];

function buildAllArticles(): EnrichedBlogArticle[] {
  const seenTitles = new Set<string>();
  const baseFromMock: EnrichedBlogArticle[] = [];

  mockBlogPosts.forEach((post, idx) => {
    const normalizedTitle = post.title.trim().toLowerCase();
    // Deduplicate identical titles in mockBlogPosts
    if (seenTitles.has(normalizedTitle)) return;
    seenTitles.add(normalizedTitle);

    baseFromMock.push({
      id: post.id,
      slug: post.slug,
      title: post.title,
      topic: classifyTopic(post.category, post.title),
      country: detectCountry(post.category, post.title),
      publishedDate: post.publishedDate,
      sortDate: 20260920 - idx * 12,
      readMinutes: parseReadMinutes(post.readTime),
      readTime: post.readTime,
      author: post.author,
      viewsCount: post.viewsCount || 2800,
      excerpt: post.excerpt,
      body: post.body,
      imageUrl: post.imageUrl,
      takeaways: post.takeaways || [],
      featured: idx < 2,
      defaultSaved: Boolean(post.saved),
    });
  });

  const combined = [...baseFromMock];
  CURATED_EXTRA_ARTICLES.forEach((extra) => {
    const key = extra.title.trim().toLowerCase();
    if (!seenTitles.has(key)) {
      seenTitles.add(key);
      combined.push(extra);
    }
  });

  return combined;
}

export const BlogHubView: React.FC<BlogHubViewProps> = ({
  onOpenConsultation,
  onNavigate,
  onNavigateHome,
}) => {
  const allArticles = useMemo(() => buildAllArticles(), []);

  // View, Reader, Sort, Pagination & Bookmarks State
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [displayMode, setDisplayMode] = useState<'grid' | 'list' | 'featured' | 'saved'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'shortest' | 'longest' | 'az'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [savedIds, setSavedIds] = useState<string[]>(() =>
    allArticles.filter((a) => a.defaultSaved).map((a) => a.id)
  );
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [showAllActiveChips, setShowAllActiveChips] = useState(false);
  const [applyConfirmed, setApplyConfirmed] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<BlogTopic[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [minReadMinutes, setMinReadMinutes] = useState(1);
  const [maxReadMinutes, setMaxReadMinutes] = useState(MAX_READ_MINUTES);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  // Stitch-style Collapsible Filter Drawers (all collapsed by default, matching Universities & Courses)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    topic: false,
    country: false,
    readTime: false,
    author: false,
    highlights: false,
  });

  const toggleAccordion = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const hasAnyExpanded = useMemo(() => Object.values(expanded).some(Boolean), [expanded]);

  const handleCollapseAll = () => {
    setExpanded({
      topic: false,
      country: false,
      readTime: false,
      author: false,
      highlights: false,
    });
  };

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedTopics([]);
    setSelectedCountries([]);
    setSelectedAuthors([]);
    setMinReadMinutes(1);
    setMaxReadMinutes(MAX_READ_MINUTES);
    setFeaturedOnly(false);
    setCountrySearch('');
    setShowAllActiveChips(false);
    setCurrentPage(1);
  };

  const activeArticle = useMemo(
    () => (selectedSlug ? allArticles.find((a) => a.slug === selectedSlug) || null : null),
    [allArticles, selectedSlug]
  );

  // Facets
  const countryOptions = useMemo(() => {
    const counts = new Map<string, number>();
    allArticles.forEach((a) => counts.set(a.country, (counts.get(a.country) || 0) + 1));
    return Array.from(counts.entries())
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count || a.country.localeCompare(b.country));
  }, [allArticles]);

  const authorOptions = useMemo(() => {
    const counts = new Map<string, number>();
    allArticles.forEach((a) => counts.set(a.author, (counts.get(a.author) || 0) + 1));
    return Array.from(counts.entries())
      .map(([author, count]) => ({ author, count }))
      .sort((a, b) => b.count - a.count || a.author.localeCompare(b.author));
  }, [allArticles]);

  const topicCounts = useMemo(() => {
    const map = new Map<BlogTopic, number>();
    BLOG_TOPICS.forEach((t) => map.set(t, 0));
    allArticles.forEach((a) => map.set(a.topic, (map.get(a.topic) || 0) + 1));
    return map;
  }, [allArticles]);

  const filteredCountryOptions = useMemo(() => {
    const q = countrySearch.trim().toLowerCase();
    return countryOptions.filter((c) => !q || c.country.toLowerCase().includes(q));
  }, [countryOptions, countrySearch]);

  // Filtered & Sorted Articles
  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = allArticles.filter((article) => {
      if (q) {
        const hay = [
          article.title,
          article.excerpt,
          article.body,
          article.topic,
          article.country,
          article.author,
          article.takeaways.join(' '),
        ]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }

      if (selectedTopics.length > 0 && !selectedTopics.includes(article.topic)) return false;
      if (selectedCountries.length > 0 && !selectedCountries.includes(article.country)) return false;
      if (selectedAuthors.length > 0 && !selectedAuthors.includes(article.author)) return false;
      if (article.readMinutes < minReadMinutes || article.readMinutes > maxReadMinutes) return false;
      if (featuredOnly && !article.featured) return false;
      return true;
    });

    const sorted = [...list];
    if (sortBy === 'popular') sorted.sort((a, b) => b.viewsCount - a.viewsCount);
    else if (sortBy === 'shortest') sorted.sort((a, b) => a.readMinutes - b.readMinutes);
    else if (sortBy === 'longest') sorted.sort((a, b) => b.readMinutes - a.readMinutes);
    else if (sortBy === 'az') sorted.sort((a, b) => a.title.localeCompare(b.title));
    else sorted.sort((a, b) => b.sortDate - a.sortDate);

    return sorted;
  }, [
    allArticles,
    searchQuery,
    selectedTopics,
    selectedCountries,
    selectedAuthors,
    minReadMinutes,
    maxReadMinutes,
    featuredOnly,
    sortBy,
  ]);

  const effectiveArticles = useMemo(() => {
    if (displayMode === 'saved') {
      return filteredArticles.filter((a) => savedIds.includes(a.id));
    }
    if (displayMode === 'featured') {
      return filteredArticles.filter((a) => a.featured);
    }
    return filteredArticles;
  }, [displayMode, filteredArticles, savedIds]);

  const totalPages = Math.max(1, Math.ceil(effectiveArticles.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedArticles = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return effectiveArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [effectiveArticles, safePage]);

  const relatedArticles = useMemo(() => {
    if (!activeArticle) return [];
    return allArticles
      .filter((a) => a.id !== activeArticle.id)
      .sort((a, b) => {
        const aScore =
          (a.topic === activeArticle.topic ? 2 : 0) + (a.country === activeArticle.country ? 2 : 0);
        const bScore =
          (b.topic === activeArticle.topic ? 2 : 0) + (b.country === activeArticle.country ? 2 : 0);
        return bScore - aScore || b.viewsCount - a.viewsCount;
      })
      .slice(0, 3);
  }, [activeArticle, allArticles]);

  const isReadTimeActive = minReadMinutes > 1 || maxReadMinutes < MAX_READ_MINUTES;

  // Live Active Filter Chips
  const activeFilterChips = useMemo(() => {
    const chips: { key: string; prefix: string; value: string; onRemove: () => void }[] = [];

    if (searchQuery.trim()) {
      chips.push({
        key: 'search',
        prefix: 'Search',
        value: searchQuery.trim(),
        onRemove: () => {
          setSearchQuery('');
          setCurrentPage(1);
        },
      });
    }

    selectedTopics.forEach((topic) => {
      chips.push({
        key: `topic-${topic}`,
        prefix: 'Topic',
        value: topic,
        onRemove: () => {
          setSelectedTopics((prev) => prev.filter((t) => t !== topic));
          setCurrentPage(1);
        },
      });
    });

    selectedCountries.forEach((country) => {
      chips.push({
        key: `country-${country}`,
        prefix: 'Country',
        value: country,
        onRemove: () => {
          setSelectedCountries((prev) => prev.filter((c) => c !== country));
          setCurrentPage(1);
        },
      });
    });

    selectedAuthors.forEach((author) => {
      chips.push({
        key: `author-${author}`,
        prefix: 'Author',
        value: author,
        onRemove: () => {
          setSelectedAuthors((prev) => prev.filter((a) => a !== author));
          setCurrentPage(1);
        },
      });
    });

    if (isReadTimeActive) {
      chips.push({
        key: 'readTime',
        prefix: 'Read Time',
        value: `${minReadMinutes} – ${maxReadMinutes} min`,
        onRemove: () => {
          setMinReadMinutes(1);
          setMaxReadMinutes(MAX_READ_MINUTES);
          setCurrentPage(1);
        },
      });
    }

    if (featuredOnly) {
      chips.push({
        key: 'featured',
        prefix: 'Editorial',
        value: "Editor's Picks",
        onRemove: () => {
          setFeaturedOnly(false);
          setCurrentPage(1);
        },
      });
    }

    return chips;
  }, [
    searchQuery,
    selectedTopics,
    selectedCountries,
    selectedAuthors,
    isReadTimeActive,
    minReadMinutes,
    maxReadMinutes,
    featuredOnly,
  ]);

  const handleGoHome = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else if (onNavigate) {
      onNavigate('home');
    } else if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  const handleCopyArticleLink = (slug: string) => {
    if (typeof window === 'undefined' || !navigator.clipboard) return;
    navigator.clipboard.writeText(`${window.location.origin}/blog#${slug}`);
    setIsLinkCopied(true);
    window.setTimeout(() => setIsLinkCopied(false), 2200);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setIsSubscribed(true);
    setNewsletterEmail('');
    window.setTimeout(() => setIsSubscribed(false), 4500);
  };

  const avgReadMinutes = useMemo(
    () =>
      Math.round(
        allArticles.reduce((sum, item) => sum + item.readMinutes, 0) / Math.max(1, allArticles.length)
      ),
    [allArticles]
  );

  // Reusable Stitch-style Filter Sidebar (Desktop + Mobile Drawer)
  const renderFilterSidebar = (isMobile = false) => (
    <div
      className={`stitch-filter-card bg-white border border-slate-200/90 shadow-lg flex flex-col overflow-hidden ${
        isMobile ? 'h-full rounded-none border-0' : 'rounded-2xl sticky top-24 max-h-[calc(100vh-7rem)]'
      }`}
    >
      {/* Dark Navy Filter Header */}
      <div className="bg-[#0d1629] px-4 py-3.5 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M4 6h16M4 12h16M4 18h16" opacity="0.3" />
              <circle cx="8" cy="6" fill="#f59e0b" r="2.5" stroke="none" />
              <line x1="4" x2="5.5" y1="6" y2="6" />
              <line x1="10.5" x2="20" y1="6" y2="6" />
              <circle cx="16" cy="12" fill="#f59e0b" r="2.5" stroke="none" />
              <line x1="4" x2="13.5" y1="12" y2="12" />
              <line x1="18.5" x2="20" y1="12" y2="12" />
              <circle cx="9" cy="18" fill="#f59e0b" r="2.5" stroke="none" />
              <line x1="4" x2="6.5" y1="18" y2="18" />
              <line x1="11.5" x2="20" y1="18" y2="18" />
            </svg>
          </span>
          <span className="text-xs sm:text-sm font-bold tracking-wider text-white">Filters</span>
          <span className="bg-amber-400 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-full shrink-0 tabular-nums">
            {filteredArticles.length} results
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            aria-label="Collapse all filter sections"
            className={`no-min-touch w-7 h-7 rounded-lg flex items-center justify-center transition-all focus:outline-none focus:ring-1 focus:ring-amber-400/70 cursor-pointer ${
              hasAnyExpanded
                ? 'bg-white/10 text-amber-400 hover:bg-amber-400/20 hover:text-amber-300'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
            }`}
            title="Collapse all"
            type="button"
            onClick={handleCollapseAll}
          >
            <svg
              aria-hidden="true"
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.1"
              viewBox="0 0 24 24"
            >
              <path d="m7 4 5 5 5-5" />
              <path d="m7 20 5-5 5 5" />
            </svg>
          </button>

          {isMobile && (
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(false)}
              aria-label="Close filters"
              className="no-min-touch w-7 h-7 rounded-lg bg-white/10 text-white hover:bg-white/20 flex items-center justify-center cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Collapsible Filter Sections */}
      <div className="divide-y divide-slate-100 overflow-y-auto flex-1 custom-scrollbar">
        {/* 1. Topic / Category */}
        <div className="bg-white">
          <button
            type="button"
            aria-expanded={expanded.topic}
            onClick={() => toggleAccordion('topic')}
            className="w-full h-11 px-4 flex items-center justify-between hover:bg-slate-50/90 transition-colors focus:outline-none select-none text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <svg className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 6h16M4 12h10M4 18h14" strokeLinecap="round" />
              </svg>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight shrink-0">
                Topic
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={selectedTopics.length > 0 ? ACTIVE_BADGE_CLASS : DEFAULT_BADGE_CLASS}>
                {selectedTopics.length > 0 ? `${selectedTopics.length} selected` : 'All Topics'}
              </span>
              <svg
                className={`w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
                  expanded.topic ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>
          {expanded.topic && (
            <div className="bg-slate-50/70 p-3 border-t border-slate-100">
              <div className="bg-white rounded-xl border border-slate-200 p-2 space-y-1">
                {BLOG_TOPICS.map((topic) => {
                  const checked = selectedTopics.includes(topic);
                  return (
                    <label
                      key={topic}
                      className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            setSelectedTopics((prev) =>
                              prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
                            );
                            setCurrentPage(1);
                          }}
                          className={CHECKBOX_CLASS}
                        />
                        <span className="text-xs font-medium text-slate-700 truncate">{topic}</span>
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 tabular-nums">
                        {topicCounts.get(topic) || 0}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 2. Destination Focus */}
        <div className="bg-white">
          <button
            type="button"
            aria-expanded={expanded.country}
            onClick={() => toggleAccordion('country')}
            className="w-full h-11 px-4 flex items-center justify-between hover:bg-slate-50/90 transition-colors focus:outline-none select-none text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <svg className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <path d="M3.6 9h16.8M3.6 15h16.8M12 3a14.5 14.5 0 0 0 0 18M12 3a14.5 14.5 0 0 1 0 18" strokeLinecap="round" />
              </svg>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight shrink-0">
                Destination
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={selectedCountries.length > 0 ? ACTIVE_BADGE_CLASS : DEFAULT_BADGE_CLASS}>
                {selectedCountries.length > 0 ? `${selectedCountries.length} selected` : 'Any'}
              </span>
              <svg
                className={`w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
                  expanded.country ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>
          {expanded.country && (
            <div className="bg-slate-50/70 p-3 border-t border-slate-100 space-y-2">
              <input
                type="text"
                data-purpose="inset-filter-input"
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                placeholder="Search country..."
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:border-[#0a1120] dark:focus:border-[#fbb034] focus:ring-1 focus:ring-[#0a1120] dark:focus:ring-[#fbb034] transition-all"
              />
              <div className="bg-white rounded-xl border border-slate-200 p-2 max-h-44 overflow-y-auto custom-scrollbar space-y-1">
                {filteredCountryOptions.map(({ country, count }) => {
                  const checked = selectedCountries.includes(country);
                  return (
                    <label
                      key={country}
                      className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            setSelectedCountries((prev) =>
                              prev.includes(country)
                                ? prev.filter((c) => c !== country)
                                : [...prev, country]
                            );
                            setCurrentPage(1);
                          }}
                          className={CHECKBOX_CLASS}
                        />
                        <span className="text-xs font-medium text-slate-700 truncate">{country}</span>
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 tabular-nums">
                        {count}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 3. Reading Time (Liquid Gooey Slider) */}
        <div className="bg-white">
          <button
            type="button"
            aria-expanded={expanded.readTime}
            onClick={() => toggleAccordion('readTime')}
            className="w-full h-11 px-4 flex items-center justify-between hover:bg-slate-50/90 transition-colors focus:outline-none select-none text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <svg className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight shrink-0">
                Reading Time
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={isReadTimeActive ? ACTIVE_BADGE_CLASS : DEFAULT_BADGE_CLASS}>
                {isReadTimeActive ? `${minReadMinutes}–${maxReadMinutes}m` : 'Any'}
              </span>
              <svg
                className={`w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
                  expanded.readTime ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>
          {expanded.readTime && (
            <div className="bg-slate-50/70 p-3 border-t border-slate-100">
              <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 tabular-nums">
                  <span>
                    {minReadMinutes} — {maxReadMinutes} min read
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMinReadMinutes(1);
                      setMaxReadMinutes(MAX_READ_MINUTES);
                      setCurrentPage(1);
                    }}
                    className="no-min-touch text-[11px] font-semibold text-amber-600 hover:text-amber-700 cursor-pointer"
                  >
                    Reset
                  </button>
                </div>

                <GooeyIeltsSlider
                  min={1}
                  max={MAX_READ_MINUTES}
                  step={1}
                  valueMin={minReadMinutes}
                  valueMax={maxReadMinutes}
                  onChange={(nextMin, nextMax) => {
                    setMinReadMinutes(nextMin);
                    setMaxReadMinutes(nextMax);
                    setCurrentPage(1);
                  }}
                  trackId="blog-readtime-track"
                  minInputId="blog-readtime-min"
                  maxInputId="blog-readtime-max"
                  minAriaLabel="Minimum reading time in minutes"
                  maxAriaLabel="Maximum reading time in minutes"
                  badgeWidth={42}
                  formatBadge={(v) => `${v}m`}
                />

                <div className="flex justify-between text-[10px] text-slate-400 font-medium tabular-nums">
                  <span>1 min</span>
                  <span>5 min</span>
                  <span>10 min</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. Author / Editorial Desk */}
        <div className="bg-white">
          <button
            type="button"
            aria-expanded={expanded.author}
            onClick={() => toggleAccordion('author')}
            className="w-full h-11 px-4 flex items-center justify-between hover:bg-slate-50/90 transition-colors focus:outline-none select-none text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <svg className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c1.8-3.8 5-5.5 8-5.5s6.2 1.7 8 5.5" strokeLinecap="round" />
              </svg>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight shrink-0">
                Author
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={selectedAuthors.length > 0 ? ACTIVE_BADGE_CLASS : DEFAULT_BADGE_CLASS}>
                {selectedAuthors.length > 0 ? `${selectedAuthors.length} selected` : 'All'}
              </span>
              <svg
                className={`w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
                  expanded.author ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>
          {expanded.author && (
            <div className="bg-slate-50/70 p-3 border-t border-slate-100">
              <div className="bg-white rounded-xl border border-slate-200 p-2 max-h-44 overflow-y-auto custom-scrollbar space-y-1">
                {authorOptions.map(({ author, count }) => {
                  const checked = selectedAuthors.includes(author);
                  return (
                    <label
                      key={author}
                      className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            setSelectedAuthors((prev) =>
                              prev.includes(author)
                                ? prev.filter((a) => a !== author)
                                : [...prev, author]
                            );
                            setCurrentPage(1);
                          }}
                          className={CHECKBOX_CLASS}
                        />
                        <span className="text-xs font-medium text-slate-700 truncate">{author}</span>
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 tabular-nums">
                        {count}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 5. Editorial Highlights */}
        <div className="bg-white">
          <button
            type="button"
            aria-expanded={expanded.highlights}
            onClick={() => toggleAccordion('highlights')}
            className="w-full h-11 px-4 flex items-center justify-between hover:bg-slate-50/90 transition-colors focus:outline-none select-none text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <svg className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9L12 3Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight shrink-0">
                Editorial Picks
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={featuredOnly ? ACTIVE_BADGE_CLASS : DEFAULT_BADGE_CLASS}>
                {featuredOnly ? 'Featured' : 'Any'}
              </span>
              <svg
                className={`w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
                  expanded.highlights ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>
          {expanded.highlights && (
            <div className="bg-slate-50/70 p-3 border-t border-slate-100">
              <div className="bg-white rounded-xl border border-slate-200 p-2">
                <label className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featuredOnly}
                    onChange={() => {
                      setFeaturedOnly((prev) => !prev);
                      setCurrentPage(1);
                    }}
                    className={CHECKBOX_CLASS}
                  />
                  <span className="text-xs font-medium text-slate-700">
                    Editor&apos;s Picks &amp; Flagship Guides Only
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="px-4 py-3 bg-white border-t border-slate-200/90 flex items-center justify-between gap-3 shrink-0 select-none">
        <button
          type="button"
          onClick={resetAllFilters}
          className="px-2.5 py-2.5 rounded-lg text-[13px] font-medium text-slate-900 hover:text-slate-600 hover:bg-slate-50 active:scale-[0.98] transition-all focus:outline-none cursor-pointer whitespace-nowrap"
        >
          Reset Filters
        </button>
        <button
          type="button"
          onClick={() => {
            setApplyConfirmed(true);
            window.setTimeout(() => {
              setApplyConfirmed(false);
              if (isMobile) setIsMobileFilterOpen(false);
            }, 600);
          }}
          className={`px-5 py-2.5 rounded-lg bg-[#FBC500] hover:bg-[#ebb700] active:scale-[0.98] text-slate-950 font-medium text-[13px] transition-all duration-150 flex items-center justify-center whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1 cursor-pointer ${
            applyConfirmed ? 'ring-2 ring-amber-400' : ''
          }`}
        >
          {applyConfirmed ? 'Filters Applied ✓' : 'Apply Filters'}
        </button>
      </div>
    </div>
  );

  return (
    <ExplorerPageShell>
      {/* 1. Shared Explorer Hero Banner & Full-Width Search Theme */}
      <ExplorerHeroBanner
        dataPurpose="blog-hero-banner"
        onNavigateHome={handleGoHome}
        topRightAction={
          activeArticle ? (
            <button
              type="button"
              onClick={() => setSelectedSlug(null)}
              className="absolute top-3 right-3 sm:top-8 sm:right-8 inline-flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-slate-800/90 text-slate-200 text-xs font-bold hover:bg-slate-700 transition-colors cursor-pointer shadow-xs z-10"
            >
              <span className="material-symbols-outlined text-[15px]">arrow_back</span>
              <span>All Articles</span>
            </button>
          ) : undefined
        }
        breadcrumbs={
          activeArticle
            ? [
                { label: 'Blog', onClick: () => setSelectedSlug(null) },
                { label: activeArticle.title },
              ]
            : displayMode === 'saved'
              ? [
                  {
                    label: 'Blog',
                    onClick: () => {
                      setDisplayMode('grid');
                      setCurrentPage(1);
                    },
                  },
                  { label: 'Saved Articles' },
                ]
              : [{ label: 'Blog' }]
        }
        titlePrefix="Study Abroad"
        titleHighlight="Blog"
        titleSuffix="& Guides"
        subtitle="Verified insights on university admissions, student visas, scholarships, and living costs"
        rightSlot={
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 pt-3 lg:pt-0 border-t border-white/10 lg:border-t-0 shrink-0">
            <div>
              <div className="text-xl sm:text-2xl font-black text-white tabular-nums leading-none">
                <NumberTicker value={allArticles.length} className="!text-white !tracking-tight" />
              </div>
              <div className="text-[11px] text-slate-400 font-medium mt-1">Published Guides</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white tabular-nums leading-none">
                <NumberTicker value={BLOG_TOPICS.length} delay={0.08} className="!text-white !tracking-tight" />
              </div>
              <div className="text-[11px] text-slate-400 font-medium mt-1">Topic Categories</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white tabular-nums leading-none">
                <NumberTicker value={countryOptions.length} delay={0.16} className="!text-white !tracking-tight" />
              </div>
              <div className="text-[11px] text-slate-400 font-medium mt-1">Regions Covered</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white tabular-nums leading-none">
                <NumberTicker value={avgReadMinutes} delay={0.24} className="!text-white !tracking-tight" />
                <span className="text-[#fbb034] text-sm font-extrabold ml-0.5">min</span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium mt-1">Avg Read Time</div>
            </div>
          </div>
        }
        search={
          !activeArticle
            ? {
                value: searchQuery,
                onChange: (val) => {
                  setSearchQuery(val);
                  setCurrentPage(1);
                },
                onSubmit: () => setCurrentPage(1),
                placeholder: 'Search articles, visa updates, scholarships, or study destinations',
              }
            : undefined
        }
      />

      {/* VIEW A: FULL IN-PAGE ARTICLE READER */}
      {activeArticle ? (
        <article className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Main Editorial Body */}
            <div className="lg:col-span-8 p-6 sm:p-10 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 space-y-6">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-bold text-amber-600 dark:text-amber-400">{activeArticle.topic}</span>
                <span aria-hidden="true">·</span>
                <span>{activeArticle.country}</span>
                <span aria-hidden="true">·</span>
                <span>{activeArticle.publishedDate}</span>
                <span aria-hidden="true">·</span>
                <span>{activeArticle.readTime}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{activeArticle.viewsCount.toLocaleString()} views</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight text-balance">
                {activeArticle.title}
              </h2>

              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Written by <span className="text-slate-950 dark:text-white font-bold">{activeArticle.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleBookmark(activeArticle.id)}
                    className={`no-min-touch inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                      savedIds.includes(activeArticle.id)
                        ? 'bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-500/15 dark:border-amber-500/40 dark:text-amber-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-500'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {savedIds.includes(activeArticle.id) ? 'bookmark' : 'bookmark_border'}
                    </span>
                    <span>{savedIds.includes(activeArticle.id) ? 'Saved' : 'Save'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyArticleLink(activeArticle.slug)}
                    className="no-min-touch inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-amber-500 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {isLinkCopied ? 'check' : 'link'}
                    </span>
                    <span>{isLinkCopied ? 'Copied' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                <ArticleCoverImage
                  src={activeArticle.imageUrl}
                  alt={activeArticle.title}
                  topic={activeArticle.topic}
                  country={activeArticle.country}
                  heightClass="h-60 sm:h-80"
                />
              </div>

              <p className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                {activeArticle.excerpt}
              </p>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeArticle.body}
              </p>

              {activeArticle.takeaways.length > 0 && (
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 space-y-3">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                    Key Takeaways for Applicants
                  </h3>
                  <ul className="space-y-2">
                    {activeArticle.takeaways.map((point, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
                      >
                        <span className="font-bold text-amber-600 dark:text-amber-400 tabular-nums shrink-0">
                          0{idx + 1}.
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Reader Sidebar */}
            <aside className="lg:col-span-4 p-6 sm:p-8 bg-slate-50/60 dark:bg-slate-950/30 space-y-6">
              <div className="p-5 rounded-2xl bg-[#0a1120] text-white space-y-3">
                <h3 className="text-base font-black tracking-tight">
                  Need Personalized Advice on This Topic?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Speak 1-on-1 with a certified GEES counselor for offer shortlists, scholarship checks, and visa readiness.
                </p>
                <div className="flex flex-col gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onOpenConsultation(`Article Inquiry: ${activeArticle.title}`)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#fbb034] hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer transition-colors"
                  >
                    Book Free Counseling
                  </button>
                  {onNavigate && (
                    <button
                      type="button"
                      onClick={() => onNavigate('study-abroad')}
                      className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs cursor-pointer transition-colors"
                    >
                      Compare Study Destinations →
                    </button>
                  )}
                </div>
              </div>

              {relatedArticles.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Related Study Guides
                  </h3>
                  <div className="space-y-3">
                    {relatedArticles.map((rel) => (
                      <button
                        key={rel.id}
                        type="button"
                        onClick={() => {
                          setSelectedSlug(rel.slug);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full text-left p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-amber-500 transition-colors cursor-pointer block"
                      >
                        <div className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                          {rel.topic} · {rel.readTime}
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1 line-clamp-2">
                          {rel.title}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </article>
      ) : (
        /* VIEW B: BLOG DIRECTORY EXPLORER WITH SHARED SECTION HEADER & STITCH SIDEBAR */
        <>
          <SectionHeader
            title={displayMode === 'saved' ? 'Saved Study Guides' : 'Study Abroad Articles & Guides'}
            subtitle="Filter expert guides by topic, destination country, reading time, and publication date."
            countLabel={`(${effectiveArticles.length.toLocaleString()})`}
          />

          {/* 2. Quiet Active Filter Chips & Pagination Controls */}
          <div className="mb-3 sm:mb-5 space-y-3">
            {/* Row 2: Results Count + Filtered By Chips + Clear All + Pagination */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              {/* Left Cluster: Result Count & Active Filter Chips */}
              <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5 shrink-0">
                  <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                    {displayMode === 'saved' ? 'Saved Articles:' : 'Total Articles:'}
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                    {effectiveArticles.length.toLocaleString()}
                  </span>
                </div>

                {activeFilterChips.length > 0 && (
                  <>
                    <span className="hidden sm:inline-block h-4 w-px bg-slate-200 dark:bg-slate-700 mx-0.5 shrink-0" />
                    <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase shrink-0">
                      FILTERED BY:
                    </span>

                    {(showAllActiveChips
                      ? activeFilterChips
                      : activeFilterChips.slice(0, 3)
                    ).map((chip) => (
                      <span
                        key={chip.key}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 text-xs max-w-[220px]"
                      >
                        <span className="text-slate-400 font-normal shrink-0">
                          {chip.prefix}:
                        </span>
                        <span className="text-slate-900 dark:text-white font-medium truncate">
                          {chip.value}
                        </span>
                        <button
                          type="button"
                          aria-label={`Remove ${chip.prefix} ${chip.value}`}
                          onClick={chip.onRemove}
                          className="no-min-touch text-slate-400 hover:text-slate-700 dark:hover:text-white ml-0.5 inline-flex items-center justify-center cursor-pointer shrink-0"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M18 6 6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}

                    {activeFilterChips.length > 3 && (
                      <button
                        type="button"
                        onClick={() => setShowAllActiveChips((prev) => !prev)}
                        className="no-min-touch inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50/70 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-800 text-[#0b47c9] dark:text-blue-400 text-xs font-semibold hover:bg-blue-100/70 transition-colors cursor-pointer shrink-0"
                      >
                        {showAllActiveChips
                          ? 'Show less'
                          : `+${activeFilterChips.length - 3} more`}
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Right Cluster: Clear All + Page Indicator & Chevrons */}
              <div className="flex items-center gap-3 shrink-0 ml-auto">
                {activeFilterChips.length > 0 && (
                  <>
                    <button
                      type="button"
                      onClick={resetAllFilters}
                      className="no-min-touch inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.9"
                        viewBox="0 0 24 24"
                      >
                        <path d="M3 6h18" />
                        <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                      </svg>
                      <span>Clear all</span>
                    </button>
                    <span className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
                  </>
                )}

                <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                  <span className="whitespace-nowrap">
                    Page{' '}
                    <strong className="font-bold text-slate-900 dark:text-white tabular-nums">
                      {safePage}
                    </strong>{' '}
                    / <span className="tabular-nums">{totalPages}</span>
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={safePage === 1}
                      onClick={() => {
                        setCurrentPage((p) => Math.max(1, p - 1));
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                      aria-label="Previous Page"
                      className="no-min-touch w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.1"
                        viewBox="0 0 24 24"
                      >
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      disabled={safePage === totalPages}
                      onClick={() => {
                        setCurrentPage((p) => Math.min(totalPages, p + 1));
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                      aria-label="Next Page"
                      className="no-min-touch w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.1"
                        viewBox="0 0 24 24"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Controls Bar Positioned Cleanly Above the Filters & Results Row */}
          <div className="flex items-center justify-between lg:justify-end gap-2.5 sm:gap-3 flex-wrap mb-3 sm:mb-5">
            {/* Mobile Filter Trigger Button */}
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden h-[42px] px-4 rounded-full border border-[#e5eaf2] dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-semibold inline-flex items-center gap-2 shadow-[0_1px_2px_rgba(15,23,42,0.03)] cursor-pointer active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px] text-[#0b47c9]">tune</span>
              <span>Filters</span>
              {activeFilterChips.length > 0 && (
                <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[#e3ecfc] text-[#0b47c9] text-[11px] font-bold inline-flex items-center justify-center tabular-nums">
                  {activeFilterChips.length}
                </span>
              )}
            </button>

            {/* Segmented View Mode & Sort Pill Cluster */}
            <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar max-w-full">
              {/* View Mode Pill Switcher: Cards, List, Featured, Saved */}
              <div className="inline-flex items-center p-1 rounded-full bg-[#f4f6fa] dark:bg-slate-800/90 border border-[#e5eaf2] dark:border-slate-700/80 shadow-[0_1px_2px_rgba(15,23,42,0.03)] shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setDisplayMode('grid');
                    setCurrentPage(1);
                  }}
                  className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-[13px] transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    displayMode === 'grid'
                      ? 'bg-white dark:bg-slate-900 text-[#0b47c9] dark:text-blue-400 font-semibold shadow-[0_1px_4px_rgba(15,23,42,0.08)]'
                      : 'text-[#475569] dark:text-slate-300 font-medium hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <svg
                    className="w-4 h-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.9"
                    viewBox="0 0 24 24"
                  >
                    <rect x="3.5" y="3.5" width="7" height="7" rx="1.2" />
                    <rect x="13.5" y="3.5" width="7" height="7" rx="1.2" />
                    <rect x="3.5" y="13.5" width="7" height="7" rx="1.2" />
                    <rect x="13.5" y="13.5" width="7" height="7" rx="1.2" />
                  </svg>
                  <span className="hidden xs:inline">Cards</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDisplayMode('list');
                    setCurrentPage(1);
                  }}
                  className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-[13px] transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    displayMode === 'list'
                      ? 'bg-white dark:bg-slate-900 text-[#0b47c9] dark:text-blue-400 font-semibold shadow-[0_1px_4px_rgba(15,23,42,0.08)]'
                      : 'text-[#475569] dark:text-slate-300 font-medium hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <svg
                    className="w-4 h-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.9"
                    viewBox="0 0 24 24"
                  >
                    <line x1="9" y1="6.5" x2="20" y2="6.5" />
                    <line x1="9" y1="12" x2="20" y2="12" />
                    <line x1="9" y1="17.5" x2="20" y2="17.5" />
                    <circle cx="4.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                    <circle cx="4.5" cy="12" r="1" fill="currentColor" stroke="none" />
                    <circle cx="4.5" cy="17.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                  <span className="hidden xs:inline">List</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDisplayMode('featured');
                    setCurrentPage(1);
                  }}
                  className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-[13px] transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    displayMode === 'featured'
                      ? 'bg-white dark:bg-slate-900 text-[#0b47c9] dark:text-blue-400 font-semibold shadow-[0_1px_4px_rgba(15,23,42,0.08)]'
                      : 'text-[#475569] dark:text-slate-300 font-medium hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <svg
                    className="w-4 h-4 shrink-0"
                    fill={displayMode === 'featured' ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.85"
                    viewBox="0 0 24 24"
                  >
                    <polygon points="12 2.8 14.9 8.7 21.4 9.6 16.7 14.2 17.8 20.7 12 17.6 6.2 20.7 7.3 14.2 2.6 9.6 9.1 8.7 12 2.8" />
                  </svg>
                  <span className="hidden xs:inline">Featured</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDisplayMode(displayMode === 'saved' ? 'grid' : 'saved');
                    setCurrentPage(1);
                  }}
                  className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-[13px] transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    displayMode === 'saved'
                      ? 'bg-white dark:bg-slate-900 text-[#0b47c9] dark:text-blue-400 font-semibold shadow-[0_1px_4px_rgba(15,23,42,0.08)]'
                      : 'text-[#475569] dark:text-slate-300 font-medium hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <svg
                    className="w-4 h-4 shrink-0"
                    fill={displayMode === 'saved' ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.85"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5v16l-6-3.5-6 3.5v-16Z" />
                  </svg>
                  <span className="hidden xs:inline">Saved</span>
                  {savedIds.length > 0 && (
                    <span className="min-w-[22px] h-[22px] px-1.5 rounded-full bg-[#e3ecfc] dark:bg-blue-900/60 text-[#0b47c9] dark:text-blue-300 text-[12px] font-bold inline-flex items-center justify-center tabular-nums">
                      {savedIds.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Uniform Minimalistic Sort Dropdown */}
              <div className="relative inline-flex items-center rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 focus-within:border-[#0a1120] dark:focus-within:border-[#fbb034] focus-within:ring-1 focus-within:ring-[#0a1120] dark:focus-within:ring-[#fbb034] transition-all shrink-0">
                <svg
                  className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.9"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 18V6m0 0-3 3m3-3 3 3" />
                  <path d="M16 6v12m0 0-3-3m3 3 3-3" />
                </svg>
                <select
                  aria-label="Sort articles"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="h-[40px] pl-9 pr-9 rounded-xl bg-transparent text-[13px] font-semibold text-slate-800 dark:text-white focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="newest">Most Recent</option>
                  <option value="popular">Most Viewed</option>
                  <option value="shortest">Shortest Read</option>
                  <option value="longest">In-Depth Guides</option>
                  <option value="az">Title A – Z</option>
                </select>
                <svg
                  className="w-4 h-4 text-[#64748b] dark:text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>
          </div>

          {/* 4. Main Explorer Grid: Stitch Filter Sidebar + Article Results */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block lg:col-span-3">{renderFilterSidebar(false)}</aside>

            {/* Right Articles Workspace */}
            <div className="lg:col-span-9 min-w-0">
              {effectiveArticles.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-10 text-center space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {displayMode === 'saved'
                      ? 'No saved articles yet'
                      : 'No articles match your filters'}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    {displayMode === 'saved'
                      ? 'Bookmark any study guide or visa update to build your personal reading list.'
                      : 'Try clearing a topic, destination, or reading-time filter to explore more guides.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (displayMode === 'saved') setDisplayMode('grid');
                      else resetAllFilters();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#0a1120] text-white dark:bg-[#fbb034] dark:text-slate-950 text-xs font-bold cursor-pointer"
                  >
                    {displayMode === 'saved' ? 'Browse All Articles' : 'Reset All Filters'}
                  </button>
                </div>
              ) : displayMode === 'list' ? (
                /* COMPACT LIST VIEW */
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden shadow-xs">
                  {paginatedArticles.map((article) => {
                    const isSaved = savedIds.includes(article.id);
                    return (
                      <article
                        key={article.id}
                        className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                      >
                        <div className="flex items-start gap-4 min-w-0 flex-1">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSlug(article.slug);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="w-24 h-20 sm:w-32 sm:h-24 rounded-xl overflow-hidden shrink-0 cursor-pointer border border-slate-200 dark:border-slate-700"
                          >
                            <ArticleCoverImage
                              src={article.imageUrl}
                              alt={article.title}
                              topic={article.topic}
                              country={article.country}
                              heightClass="h-full"
                            />
                          </button>

                          <div className="min-w-0 flex-1 space-y-1.5">
                            <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 dark:text-slate-400">
                              <span className="font-bold text-amber-600 dark:text-amber-400">
                                {article.topic}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>{article.country}</span>
                              <span aria-hidden="true">·</span>
                              <span>{article.readTime}</span>
                              <span aria-hidden="true">·</span>
                              <span>{article.publishedDate}</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedSlug(article.slug);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="no-min-touch text-left text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug cursor-pointer"
                            >
                              {article.title}
                            </button>

                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                              {article.excerpt}
                            </p>

                            <div className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                              By {article.author} · {article.viewsCount.toLocaleString()} views
                            </div>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-stretch gap-2 shrink-0 sm:w-36">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSlug(article.slug);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#0a1120] hover:bg-slate-800 dark:bg-[#fbb034] dark:text-slate-950 text-white font-bold text-xs text-center transition-colors cursor-pointer whitespace-nowrap"
                          >
                            Read Guide
                          </button>
                          <button
                            type="button"
                            onClick={(e) => toggleBookmark(article.id, e)}
                            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                              isSaved
                                ? 'border-amber-400 bg-amber-50 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300'
                                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-500'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[15px]">
                              {isSaved ? 'bookmark' : 'bookmark_border'}
                            </span>
                            <span>{isSaved ? 'Saved' : 'Save'}</span>
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                /* CARDS GRID VIEW (DEFAULT & FEATURED & SAVED) */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {paginatedArticles.map((article) => {
                    const isSaved = savedIds.includes(article.id);
                    return (
                      <article
                        key={article.id}
                        className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
                      >
                        {/* Cover Photo + Bookmark Button */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSlug(article.slug);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="block w-full text-left cursor-pointer"
                            aria-label={`Read ${article.title}`}
                          >
                            <ArticleCoverImage
                              src={article.imageUrl}
                              alt={article.title}
                              topic={article.topic}
                              country={article.country}
                            />
                          </button>

                          <button
                            type="button"
                            aria-label={isSaved ? `Remove ${article.title} from saved` : `Save ${article.title}`}
                            onClick={(e) => toggleBookmark(article.id, e)}
                            className={`no-min-touch absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-colors cursor-pointer z-10 ${
                              isSaved
                                ? 'bg-[#fbb034] text-slate-950'
                                : 'bg-[#0a1120]/70 text-white hover:bg-[#0a1120]/90'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {isSaved ? 'bookmark' : 'bookmark_border'}
                            </span>
                          </button>
                        </div>

                        {/* Card Body */}
                        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
                          <div className="space-y-2.5">
                            {/* Clean Unboxed Metadata */}
                            <div className="flex items-center gap-1.5 text-[11.5px] text-slate-500 dark:text-slate-400">
                              <span className="font-bold text-amber-600 dark:text-amber-400 truncate">
                                {article.topic}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="truncate">{article.country}</span>
                              <span aria-hidden="true">·</span>
                              <span className="shrink-0">{article.readTime}</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedSlug(article.slug);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="no-min-touch text-left text-base sm:text-[17px] font-black text-slate-900 dark:text-white tracking-tight leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2 cursor-pointer"
                            >
                              {article.title}
                            </button>

                            <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                              {article.excerpt}
                            </p>
                          </div>

                          {/* Footer Metadata & Read Action */}
                          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                              <span className="truncate font-medium">By {article.author}</span>
                              <span className="shrink-0">{article.publishedDate}</span>
                            </div>

                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
                                {article.viewsCount.toLocaleString()} views
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedSlug(article.slug);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="no-min-touch inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#0a1120] hover:bg-slate-800 dark:bg-[#fbb034] dark:hover:bg-amber-400 text-white dark:text-slate-950 font-bold text-xs transition-colors cursor-pointer whitespace-nowrap"
                              >
                                <span>Read Guide</span>
                                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}

              {/* Real Dynamic Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-1.5">
                  <button
                    type="button"
                    disabled={safePage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    aria-label="Previous page"
                    className="no-min-touch w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:border-amber-500 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`no-min-touch w-9 h-9 rounded-xl text-xs font-bold tabular-nums transition-colors cursor-pointer ${
                        page === safePage
                          ? 'bg-[#fbb034] text-slate-950 border border-amber-500'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-amber-500'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={safePage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    aria-label="Next page"
                    className="no-min-touch w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:border-amber-500 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                </div>
              )}

              {/* 5. Clean Weekly Digest & Counseling Strip */}
              <section className="mt-10 grid grid-cols-1 xl:grid-cols-12 gap-5">
                <div className="xl:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 flex flex-col justify-between gap-4 shadow-xs">
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                      Weekly Admissions &amp; Visa Briefing
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Receive scholarship deadlines, EMGS &amp; embassy policy changes, and intake alerts every Friday.
                    </p>
                  </div>

                  {isSubscribed ? (
                    <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold">
                      Subscribed — watch your inbox for this week&apos;s admissions briefing.
                    </div>
                  ) : (
                    <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2.5">
                      <input
                        type="email"
                        required
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        placeholder="Enter your email address"
                        aria-label="Email address for weekly briefing"
                        className="flex-1 h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="submit"
                        className="h-11 px-5 rounded-xl bg-[#0a1120] hover:bg-slate-800 dark:bg-[#fbb034] dark:hover:bg-amber-400 text-white dark:text-slate-950 font-bold text-xs whitespace-nowrap shrink-0 cursor-pointer transition-colors"
                      >
                        Subscribe
                      </button>
                    </form>
                  )}
                </div>

                <div className="xl:col-span-5 bg-[#0a1120] text-white rounded-2xl p-6 sm:p-7 flex flex-col justify-between gap-4 shadow-xs">
                  <div>
                    <h2 className="text-lg sm:text-xl font-black tracking-tight">
                      Have a Specific Visa or Admission Question?
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                      Talk directly with a GEES advisor to review your transcripts, IELTS score, and target scholarships.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => onOpenConsultation('Blog Consultation Request')}
                      className="px-4 py-2.5 rounded-xl bg-[#fbb034] hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer transition-colors whitespace-nowrap"
                    >
                      Book Free Counseling
                    </button>
                    {onNavigate && (
                      <button
                        type="button"
                        onClick={() => onNavigate('courses')}
                        className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs cursor-pointer transition-colors whitespace-nowrap"
                      >
                        Explore Courses →
                      </button>
                    )}
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Mobile Filter Slide-Over Drawer */}
          {isMobileFilterOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-xs"
                onClick={() => setIsMobileFilterOpen(false)}
              />
              <div className="relative w-full max-w-sm h-full bg-white z-10 shadow-2xl">
                {renderFilterSidebar(true)}
              </div>
            </div>
          )}
        </>
      )}
    </ExplorerPageShell>
  );
};
