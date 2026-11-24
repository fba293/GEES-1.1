/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Global Education Expert Services (GEES)
 * Centralized Single-Source-of-Truth Route & Auto-Updating Site Map Registry
 *
 * HOW AUTO-UPDATING WORKS:
 * 1. Every top-level view registered in `SITE_PAGE_REGISTRY` is automatically both
 *    resolvable by App.tsx (`resolveViewFromPathname`) AND rendered on the Site Map.
 * 2. Dynamic directories (Study Destinations, Services, Courses by Subject,
 *    Study Levels, and Partner Universities) are read live from their source-of-truth
 *    registries (`destinationDataRegistry`, `mockDatabase`, `subject-config`,
 *    `qualification-config`, `PartnerUniversityManager`) on every render.
 * 3. Any feature or new page can also call `registerSitePage(entry)` at module load
 *    time to appear automatically on the Site Map without editing `SiteMapView`.
 */

import { getAllDestinationData } from '../data/destinationDataRegistry.ts';
import { LANGUAGE_CENTERS_LIST } from '../data/languageCentersData.ts';
import { APPROVED_COUNTRY_NAMES } from './country-config.ts';
import {
  mockBlogPosts,
  mockCourses,
  mockServices,
  mockUniversities,
} from '../data/mockDatabase.ts';
import { mockEvents } from '../data/mockEvents.ts';
import { mockNews } from '../data/mockNews.ts';
import { SPECIFIC_QUALIFICATIONS } from './qualification-config.ts';
import { getCanonicalUrl } from './seo-config.ts';
import { IDP_SUBJECT_CATEGORIES } from './subject-config.ts';

export type SitemapCategoryId =
  | 'explore'
  | 'destinations'
  | 'services'
  | 'qualifications'
  | 'resources'
  | 'company-portals'
  | 'subjects'
  | 'language-centers-directory';

export interface SitePageDefinition {
  /** Unique route/view identifier used by App.tsx */
  id: string;
  /** Human-readable label shown in the Site Map */
  title: string;
  /** Canonical relative path (e.g. '/courses', '/sitemap') */
  path: string;
  /** View key passed to onNavigate(view, payload) */
  view: string;
  /** Optional navigation payload */
  payload?: unknown;
  /** URL pathname keywords that resolve to this view */
  pathMatchers?: string[];
  /** Category column in the Apple-style Site Map */
  category: SitemapCategoryId;
  /** Optional short badge or metadata note (e.g., live count) */
  meta?: string;
  /** Optional description for search filtering */
  keywords?: string[];
  /** Exclude from Site Map display while still resolving routes if needed */
  hiddenFromSitemap?: boolean;
}

export interface SitemapLinkItem {
  id: string;
  title: string;
  path: string;
  view: string;
  payload?: unknown;
  meta?: string;
  flagEmoji?: string;
  keywords?: string[];
}

export interface SitemapSection {
  id: SitemapCategoryId;
  title: string;
  subtitle?: string;
  links: SitemapLinkItem[];
}

export interface UniversityCountrySitemapGroup {
  country: string;
  flagEmoji: string;
  destinationSlug?: string;
  universities: {
    id: string;
    name: string;
    slug: string;
    city?: string;
  }[];
}

/**
 * SINGLE SOURCE OF TRUTH FOR ALL APPLICATION PAGES
 * Add any new page here once — App.tsx routing and SiteMapView update automatically.
 */
export const SITE_PAGE_REGISTRY: SitePageDefinition[] = [
  // 1. Explore & Directories
  {
    id: 'home',
    title: 'GEES Home',
    path: '/',
    view: 'home',
    category: 'explore',
    keywords: ['landing', 'main', 'global education expert services'],
  },
  {
    id: 'courses',
    title: 'Find Course Worldwide',
    path: '/courses',
    view: 'courses',
    pathMatchers: ['courses', 'course'],
    category: 'explore',
    keywords: ['programs', 'degrees', 'study abroad courses', 'comparison'],
  },
  {
    id: 'universities',
    title: 'Find Universities Worldwide',
    path: '/universities',
    view: 'universities',
    pathMatchers: ['universities', 'university'],
    category: 'explore',
    keywords: ['colleges', 'institutions', 'partner universities', 'qs ranking'],
  },
  {
    id: 'study-abroad',
    title: 'Study Abroad Explorer',
    path: '/study-abroad',
    view: 'study-abroad',
    pathMatchers: ['study-abroad'],
    category: 'explore',
    keywords: ['study abroad', 'where to study', 'destinations', 'compare countries', 'overseas education', 'post-study work', 'tuition'],
  },
  {
    id: 'language-center-list',
    title: 'Language Center List (Malaysia)',
    path: '/language-center-list',
    view: 'language-center-list',
    pathMatchers: ['language-center-list'],
    category: 'explore',
    keywords: ['language centers', 'english school', 'ielts', 'malaysia', 'kuala lumpur', 'selangor', 'emgs'],
  },
  {
    id: 'destinations',
    title: 'All Study Destinations',
    path: '/countries',
    view: 'destinations',
    pathMatchers: ['countries', 'destinations'],
    category: 'explore',
    keywords: ['study abroad countries', 'global destinations'],
  },
  {
    id: 'wishlist',
    title: 'Saved Courses & Wishlist',
    path: '/wishlist',
    view: 'wishlist',
    pathMatchers: ['wishlist', 'saved-courses'],
    category: 'explore',
    keywords: ['bookmarks', 'shortlist', 'saved'],
  },
  {
    id: 'compare-universities',
    title: 'Compare Universities',
    path: '/compare/universities',
    view: 'compare-universities',
    pathMatchers: ['compare/universities', 'compare-universities'],
    category: 'explore',
    keywords: ['compare', 'universities', 'qs ranking', 'tuition comparison'],
  },
  {
    id: 'compare-programs',
    title: 'Compare Programmes',
    path: '/compare/programs',
    view: 'compare-programs',
    pathMatchers: ['compare/programs', 'compare/programmes', 'compare-programs', 'compare-programmes'],
    category: 'explore',
    keywords: ['compare', 'programmes', 'courses', 'degree comparison'],
  },
  {
    id: 'sitemap',
    title: 'Site Map',
    path: '/sitemap',
    view: 'sitemap',
    pathMatchers: ['sitemap', 'site-map'],
    category: 'explore',
    keywords: ['directory', 'all pages', 'index'],
  },

  // 2. Admissions & Visa Services
  {
    id: 'services',
    title: 'All Services Overview',
    path: '/services',
    view: 'services',
    pathMatchers: ['services'],
    category: 'services',
    keywords: ['counseling', 'student services', 'consulting'],
  },
  {
    id: 'admission-support',
    title: 'University Admission Support',
    path: '/admission-support',
    view: 'admission-support',
    pathMatchers: ['admission-support', 'admission'],
    category: 'services',
    keywords: ['application', 'offer letter', 'enrollment'],
  },
  {
    id: 'school-admission',
    title: 'International School Admission',
    path: '/school-admission',
    view: 'school-admission',
    pathMatchers: ['school-admission'],
    category: 'services',
    keywords: ['k-12', 'igcse', 'high school', 'international schools'],
  },
  {
    id: 'student-visa-assistance',
    title: 'Student Visa Assistance',
    path: '/student-visa-assistance',
    view: 'student-visa-assistance',
    pathMatchers: ['student-visa-assistance', 'visa-assistance', 'student-visa'],
    category: 'services',
    keywords: ['emgs', 'val', 'eval', 'student pass'],
  },
  {
    id: 'track-visa',
    title: 'Track EMGS Visa Status',
    path: '/track-visa',
    view: 'track-visa',
    pathMatchers: ['track-visa', 'track-my-visa', 'emgs', 'visa-tracking'],
    category: 'services',
    keywords: ['emgs tracker', 'application status', 'malaysia visa'],
  },
  {
    id: 'dependent-visa',
    title: 'Dependent & Family Visa',
    path: '/dependent-visa',
    view: 'dependent-visa',
    pathMatchers: ['dependent-visa', 'dependent'],
    category: 'services',
    keywords: ['spouse visa', 'family pass', 'long term social visit'],
  },
  {
    id: 'tourist-visa',
    title: 'Tourist & Visitor Visa',
    path: '/tourist-visa',
    view: 'tourist-visa',
    pathMatchers: ['tourist-visa', 'tourist', 'visitor-visa'],
    category: 'services',
    keywords: ['visit visa', 'travel', 'parents visit'],
  },
  {
    id: 'mm2h',
    title: 'Malaysia My Second Home (MM2H)',
    path: '/mm2h',
    view: 'mm2h',
    pathMatchers: ['mm2h', 'malaysia-second-home', 'malaysia-my-second-home'],
    category: 'services',
    keywords: ['residency', 'sarawak mm2h', 'long term stay'],
  },
  {
    id: 'health-insurance',
    title: 'Student Health Insurance (OSHC / OVHC)',
    path: '/health-insurance',
    view: 'health-insurance',
    pathMatchers: ['health-insurance', 'insurance', 'oshc'],
    category: 'services',
    keywords: ['medical cover', 'travel insurance'],
  },
  {
    id: 'flight-ticketing',
    title: 'Student Flight Ticketing & Travel',
    path: '/flight-ticketing',
    view: 'flight-ticketing',
    pathMatchers: ['flight-ticketing', 'flight', 'ticket'],
    category: 'services',
    keywords: ['airfare', 'baggage allowance', 'airport pickup'],
  },
  {
    id: 'student-referral',
    title: 'Student Referral & B2B Partner Program',
    path: '/student-referral',
    view: 'student-referral',
    pathMatchers: ['student-referral', 'referral'],
    category: 'services',
    keywords: ['commission', 'refer a friend', 'agents'],
  },

  // 3. Resources, Insights & Community
  {
    id: 'events',
    title: 'Education Fairs & Events',
    path: '/events',
    view: 'events',
    pathMatchers: ['event'],
    category: 'resources',
    keywords: ['expo', 'webinar', 'open day', 'spot assessment'],
  },
  {
    id: 'news',
    title: 'News & Immigration Bulletins',
    path: '/news',
    view: 'news',
    pathMatchers: ['news'],
    category: 'resources',
    keywords: ['updates', 'visa announcements', 'policy'],
  },
  {
    id: 'blog',
    title: 'Editorial Blog & Articles',
    path: '/blog',
    view: 'blog',
    pathMatchers: ['blog'],
    category: 'resources',
    keywords: ['guides', 'tips', 'scholarships'],
  },
  {
    id: 'students-guide',
    title: "International Student's Guide",
    path: '/students-guide',
    view: 'students-guide',
    pathMatchers: ['students-guide', 'guide'],
    category: 'resources',
    keywords: ['pre-departure', 'arrival', 'accommodation', 'living abroad'],
  },
  {
    id: 'language-centers',
    title: 'English Language Centers & IELTS Prep',
    path: '/language-centers',
    view: 'language-centers',
    pathMatchers: ['language-centers', 'language'],
    category: 'resources',
    keywords: ['ielts', 'pte', 'english courses', 'els'],
  },
  {
    id: 'resources',
    title: 'Downloads & Application Resources',
    path: '/resources',
    view: 'resources',
    pathMatchers: ['resources'],
    category: 'resources',
    keywords: ['checklists', 'sop templates', 'documents'],
  },
  {
    id: 'success-stories',
    title: 'Student Success Stories',
    path: '/success-stories',
    view: 'success-stories',
    pathMatchers: ['success-stories', 'stories'],
    category: 'resources',
    keywords: ['testimonials', 'reviews', 'alumni'],
  },
  {
    id: 'faq',
    title: 'Frequently Asked Questions (FAQ)',
    path: '/faq',
    view: 'faq',
    pathMatchers: ['faq'],
    category: 'resources',
    keywords: ['help', 'questions', 'answers'],
  },

  // 4. About GEES, Contact & Portals
  {
    id: 'about',
    title: 'About GEES',
    path: '/about-us',
    view: 'about',
    pathMatchers: ['about'],
    category: 'company-portals',
    keywords: ['company', 'mission', 'offices', 'dhaka', 'malaysia'],
  },
  {
    id: 'leadership-director',
    title: 'Leadership & Managing Director',
    path: '/leadership-director',
    view: 'leadership-director',
    pathMatchers: ['leadership'],
    category: 'company-portals',
    keywords: ['executive', 'founder', 'management'],
  },
  {
    id: 'contact',
    title: 'Contact Us & Office Locations',
    path: '/contact',
    view: 'contact',
    pathMatchers: ['contact'],
    category: 'company-portals',
    keywords: ['phone', 'whatsapp', 'email', 'dhaka', 'subang jaya'],
  },
  {
    id: 'student-portal',
    title: 'Student Portal',
    path: '/student-portal',
    view: 'student-portal',
    pathMatchers: ['student-portal'],
    category: 'company-portals',
    keywords: ['dashboard', 'my applications', 'profile'],
  },
  {
    id: 'agent-portal',
    title: 'Agent Portal & Analytics',
    path: '/agent-portal',
    view: 'agent-portal',
    pathMatchers: ['agent-portal', 'analytics'],
    category: 'company-portals',
    keywords: ['b2b', 'partner dashboard', 'commissions'],
  },
  {
    id: 'crm',
    title: 'Counselor CRM Workspace',
    path: '/crm',
    view: 'crm',
    pathMatchers: ['crm'],
    category: 'company-portals',
    keywords: ['leads', 'pipeline', 'staff'],
  },
  {
    id: 'login',
    title: 'Sign In to GEES Account',
    path: '/login',
    view: 'login',
    pathMatchers: ['login', 'signin', 'auth'],
    category: 'company-portals',
    keywords: ['account', 'authentication'],
  },
  {
    id: 'signup',
    title: 'Create Student / Partner Account',
    path: '/signup',
    view: 'signup',
    pathMatchers: ['signup'],
    category: 'company-portals',
    keywords: ['register', 'join'],
  },
];

// Runtime extensible page registry so newly created/mounted pages can register themselves dynamically
const dynamicSitePages: SitePageDefinition[] = [];
const registryListeners = new Set<() => void>();

export function registerSitePage(page: SitePageDefinition): void {
  const existsInStatic = SITE_PAGE_REGISTRY.some((p) => p.id === page.id);
  const dynamicIdx = dynamicSitePages.findIndex((p) => p.id === page.id);
  if (existsInStatic) return;
  if (dynamicIdx >= 0) {
    dynamicSitePages[dynamicIdx] = page;
  } else {
    dynamicSitePages.push(page);
  }
  registryListeners.forEach((listener) => listener());
}

export function subscribeSitemapRegistry(listener: () => void): () => void {
  registryListeners.add(listener);
  return () => {
    registryListeners.delete(listener);
  };
}

export function getAllRegisteredPages(): SitePageDefinition[] {
  return [...SITE_PAGE_REGISTRY, ...dynamicSitePages];
}

/**
 * Resolves a browser pathname to the matching App view key using the single registry.
 * Automatically picks up any new page added to SITE_PAGE_REGISTRY or registerSitePage().
 */
export function resolveViewFromPathname(pathname: string): string {
  const path = (pathname || '').toLowerCase();
  if (!path || path === '/' || path === '/index.html') return 'home';

  if (path.includes('study-in-') || path.includes('study-')) {
    return 'study-destination';
  }

  // Match longer/more specific path matchers first so e.g. 'school-admission' beats 'admission'
  const pages = getAllRegisteredPages();
  const candidates: { matcher: string; view: string }[] = [];
  for (const page of pages) {
    for (const matcher of page.pathMatchers || []) {
      candidates.push({ matcher: matcher.toLowerCase(), view: page.view });
    }
  }
  candidates.sort((a, b) => b.matcher.length - a.matcher.length);

  for (const candidate of candidates) {
    if (path.includes(candidate.matcher)) {
      return candidate.view;
    }
  }

  return 'home';
}

/**
 * Builds the live, auto-updating Apple-style Site Map sections by combining
 * SITE_PAGE_REGISTRY, runtime registered pages, and all live data registries.
 */
export function buildLiveSitemapData(): {
  sections: SitemapSection[];
  universityGroups: UniversityCountrySitemapGroup[];
  stats: {
    totalIndexedPages: number;
    corePages: number;
    destinationsCount: number;
    servicesCount: number;
    subjectsCount: number;
    qualificationsCount: number;
    universitiesCount: number;
    coursesCount: number;
  };
} {
  const allPages = getAllRegisteredPages().filter((p) => !p.hiddenFromSitemap);

  const mapStaticCategory = (category: SitemapCategoryId): SitemapLinkItem[] =>
    allPages
      .filter((p) => p.category === category)
      .map((p) => {
        let meta = p.meta;
        if (p.id === 'courses') meta = `${mockCourses.length.toLocaleString()}+`;
        if (p.id === 'universities') meta = `${mockUniversities.length.toLocaleString()}+`;
        if (p.id === 'study-abroad') meta = `${APPROVED_COUNTRY_NAMES.length}`;
        if (p.id === 'language-center-list') meta = `${LANGUAGE_CENTERS_LIST.length}`;
        if (p.id === 'events') meta = `${mockEvents.length}`;
        if (p.id === 'news') meta = `${mockNews.length}`;
        if (p.id === 'blog') meta = `${mockBlogPosts.length}`;
        return {
          id: p.id,
          title: p.title,
          path: p.path,
          view: p.view,
          payload: p.payload,
          meta,
          keywords: p.keywords,
        };
      });

  // 1. Explore & Directories
  const exploreLinks = mapStaticCategory('explore');

  // 2. Study Destinations (live from destinationDataRegistry)
  const destinationRecords = getAllDestinationData();
  const destinationLinks: SitemapLinkItem[] = destinationRecords.map((dest) => ({
    id: `dest-${dest.slug}`,
    title: `Study in ${dest.countryName}`,
    path: `/${dest.slug}`,
    view: 'study-destination',
    payload: dest.slug,
    flagEmoji: dest.flagEmoji,
    keywords: [dest.countryName, dest.slug, dest.code, dest.currency, 'destination', 'country'],
  }));

  // 3. Admissions & Visa Services (dedicated pages + any additional mockServices catalog items)
  const serviceLinks = mapStaticCategory('services');
  const existingServiceIds = new Set(serviceLinks.map((s) => s.id));
  const extraCatalogServices: SitemapLinkItem[] = mockServices
    .filter((svc) => !existingServiceIds.has(svc.slug))
    .map((svc) => ({
      id: `svc-${svc.slug}`,
      title: svc.title,
      path: `/services#${svc.slug}`,
      view: 'services',
      payload: svc.slug,
      keywords: [svc.category, svc.slug, 'service'],
    }));
  const allServiceLinks = [...serviceLinks, ...extraCatalogServices];

  // 4. Study Levels & Qualifications (live from qualification-config)
  const qualificationLinks: SitemapLinkItem[] = SPECIFIC_QUALIFICATIONS.map((qual) => ({
    id: `qual-${qual.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    title: qual,
    path: `/courses?level=${encodeURIComponent(qual)}`,
    view: 'courses',
    payload: { level: qual },
    keywords: [qual, 'degree', 'level', 'qualification', 'courses'],
  }));

  // 5. Resources, Insights & Community
  const resourceLinks = mapStaticCategory('resources');

  // 6. About GEES, Contact & Portals
  const companyPortalLinks = mapStaticCategory('company-portals');

  // 7. Courses by Subject (live from IDP_SUBJECT_CATEGORIES)
  const subjectLinks: SitemapLinkItem[] = IDP_SUBJECT_CATEGORIES.map((cat) => ({
    id: `subject-${cat.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    title: cat.category,
    path: `/courses?subject=${encodeURIComponent(cat.category)}`,
    view: 'courses',
    payload: { field: cat.category },
    meta: cat.subSubjects.length > 0 ? `${cat.subSubjects.length}` : undefined,
    keywords: [cat.category, ...cat.subSubjects, 'subject', 'major', 'courses'],
  }));

  // 8. Partner Universities grouped by Country (live from mockUniversities)
  const destByCountry = new Map(
    destinationRecords.map((d) => [d.countryName.toLowerCase(), d])
  );
  const groupedMap = new Map<string, UniversityCountrySitemapGroup>();
  for (const uni of mockUniversities) {
    const countryName = (uni.country || 'International').trim();
    const key = countryName.toLowerCase();
    let group = groupedMap.get(key);
    if (!group) {
      const matchedDest = destByCountry.get(key);
      group = {
        country: countryName,
        flagEmoji: uni.flagEmoji || matchedDest?.flagEmoji || '🌐',
        destinationSlug: matchedDest?.slug,
        universities: [],
      };
      groupedMap.set(key, group);
    }
    group.universities.push({
      id: uni.id,
      name: uni.name,
      slug: uni.slug,
      city: uni.city,
    });
  }

  const universityGroups = Array.from(groupedMap.values())
    .map((g) => ({
      ...g,
      universities: [...g.universities].sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => b.universities.length - a.universities.length);

  // 8. Language Centers Directory (live from LANGUAGE_CENTERS_LIST)
  const languageCenterLinks: SitemapLinkItem[] = LANGUAGE_CENTERS_LIST.map((lc) => ({
    id: `lc-link-${lc.id}`,
    title: lc.name,
    path: `/language-center-list/${lc.slug}`,
    view: 'language-center-list',
    payload: lc.slug,
    meta: lc.city,
    flagEmoji: lc.flagEmoji,
    keywords: [lc.name, lc.city, lc.country, ...lc.programs, 'language center', 'english'],
  }));

  const sections: SitemapSection[] = [
    {
      id: 'explore',
      title: 'Explore & Directories',
      links: exploreLinks,
    },
    {
      id: 'destinations',
      title: 'Study Destinations',
      links: destinationLinks,
    },
    {
      id: 'services',
      title: 'Admissions & Visa Services',
      links: allServiceLinks,
    },
    {
      id: 'qualifications',
      title: 'Study Levels & Qualifications',
      links: qualificationLinks,
    },
    {
      id: 'resources',
      title: 'Resources, Insights & Community',
      links: resourceLinks,
    },
    {
      id: 'company-portals',
      title: 'About GEES & Portals',
      links: companyPortalLinks,
    },
    {
      id: 'subjects',
      title: 'Courses by Subject (A–Z)',
      links: subjectLinks,
    },
    {
      id: 'language-centers-directory',
      title: 'Language Centers Directory (Malaysia)',
      links: languageCenterLinks,
    },
  ];

  const totalIndexedPages =
    exploreLinks.length +
    destinationLinks.length +
    allServiceLinks.length +
    qualificationLinks.length +
    resourceLinks.length +
    companyPortalLinks.length +
    subjectLinks.length +
    languageCenterLinks.length +
    mockUniversities.length;

  return {
    sections,
    universityGroups,
    stats: {
      totalIndexedPages,
      corePages: exploreLinks.length + resourceLinks.length + companyPortalLinks.length,
      destinationsCount: destinationLinks.length,
      servicesCount: allServiceLinks.length,
      subjectsCount: subjectLinks.length,
      qualificationsCount: qualificationLinks.length,
      universitiesCount: mockUniversities.length,
      coursesCount: mockCourses.length,
    },
  };
}

/**
 * Generates an up-to-date standard XML Sitemap string directly from the live registry.
 */
export function generateXmlSitemap(): string {
  const { sections, universityGroups } = buildLiveSitemapData();
  const today = new Date().toISOString().split('T')[0];
  const urls = new Map<string, { priority: string; changefreq: string }>();

  for (const section of sections) {
    if (section.id === 'qualifications' || section.id === 'subjects') continue;
    for (const link of section.links) {
      if (link.path.includes('#') || link.path.includes('?')) continue;
      const loc = getCanonicalUrl(link.path);
      const priority =
        link.path === '/'
          ? '1.0'
          : section.id === 'explore' || section.id === 'destinations'
          ? '0.9'
          : '0.8';
      urls.set(loc, { priority, changefreq: 'weekly' });
    }
  }

  for (const group of universityGroups) {
    for (const uni of group.universities) {
      const loc = getCanonicalUrl(`/universities/${uni.slug}`);
      urls.set(loc, { priority: '0.7', changefreq: 'monthly' });
    }
  }

  const entries = Array.from(urls.entries())
    .map(
      ([loc, meta]) =>
        `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${meta.changefreq}</changefreq>\n    <priority>${meta.priority}</priority>\n  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}
