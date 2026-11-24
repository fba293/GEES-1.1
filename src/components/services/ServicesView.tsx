/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES - Global Education Expert Services
 * Unified All Services Directory — Matches Courses, Universities & Study Abroad Countries Architecture
 */

import React, { useState, useMemo, useEffect } from 'react';
import { mockServices } from '../../data/mockDatabase.ts';
import { ServiceItem } from '../../types/index.ts';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination.tsx';
import { ExplorerHeroBanner, ExplorerPageShell, SectionHeader } from '../portal/ExplorerTheme.tsx';

interface ServicesViewProps {
  onBackToHome: () => void;
  onOpenConsultation: (serviceName?: string) => void;
  onNavigate?: (view: string, payload?: any) => void;
  initialSelectedServiceSlug?: string;
}

type ServiceDisplayMode = 'grid' | 'list' | 'compare' | 'wishlist';
type ServiceSortBy = 'featured' | 'popular' | 'fastest' | 'az' | 'category';

interface EnrichedService extends ServiceItem {
  stage: string;
  feeLabel: string;
  feeType: 'Free Consultancy' | 'Partner / Official Fee' | 'Rewards & Discounts';
  turnaround: string;
  turnaroundBucket: 'Instant / Same Day' | '24–72 Hours' | '1–2 Weeks' | '2–6 Weeks';
  turnaroundOrder: number;
  deliveryMode: 'Online & In-Person' | 'Online Portal' | 'Dedicated Counselor' | 'On-Ground Support';
  coverage: string;
  deliverables: string[];
  targetRoute: { view: string; payload?: string } | null;
  highlights: string[];
  popularityScore: number;
}

const SERVICE_CATEGORIES = [
  'Admissions',
  'Immigration',
  'Arrival',
  'Living',
  'Tests & Partners',
  'Study Destinations',
] as const;

const JOURNEY_STAGES = [
  'Pre-Application',
  'Admissions & Offers',
  'Visa & Compliance',
  'Pre-Departure & Arrival',
  'Living & Ongoing',
] as const;

const FEE_TYPES = [
  'Free Consultancy',
  'Partner / Official Fee',
  'Rewards & Discounts',
] as const;

const DELIVERY_MODES = [
  'Online & In-Person',
  'Online Portal',
  'Dedicated Counselor',
  'On-Ground Support',
] as const;

const TURNAROUND_BUCKETS = [
  'Instant / Same Day',
  '24–72 Hours',
  '1–2 Weeks',
  '2–6 Weeks',
] as const;

const HIGHLIGHT_OPTIONS = [
  'Dedicated Service Guide',
  'Zero Consultancy Fee',
  'Direct Partner Network',
  'Priority Fast-Track',
] as const;

const ITEMS_PER_PAGE = 9;
const SAVED_SERVICES_STORAGE_KEY = 'gees_saved_services_v1';
const COMPARE_SERVICES_STORAGE_KEY = 'gees_compare_services_v1';

const CHECKBOX_CLASS =
  'w-3.5 h-3.5 rounded border-slate-300 text-amber-500 focus:ring-amber-400 focus:ring-offset-0 cursor-pointer accent-amber-500';
const ACTIVE_BADGE_CLASS =
  'px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10.5px] font-bold tabular-nums';
const DEFAULT_BADGE_CLASS =
  'px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10.5px] font-medium';

function getDedicatedRoute(service: ServiceItem): { view: string; payload?: string } | null {
  switch (service.slug) {
    case 'admission-support':
      return { view: 'admission-support' };
    case 'school-admission':
      return { view: 'school-admission' };
    case 'student-referral':
    case 'b2b-partnership':
      return { view: 'student-referral' };
    case 'student-visa-assistance':
      return { view: 'student-visa-assistance' };
    case 'track-visa':
      return { view: 'track-visa' };
    case 'dependent-visa':
      return { view: 'dependent-visa' };
    case 'tourist-visa':
      return { view: 'tourist-visa' };
    case 'mm2h-program':
      return { view: 'mm2h' };
    case 'health-insurance':
      return { view: 'health-insurance' };
    case 'flight-ticketing':
      return { view: 'flight-ticketing' };
    default:
      if (service.slug.startsWith('study-in-')) {
        return { view: 'study-destination', payload: service.slug };
      }
      return null;
  }
}

function enrichService(service: ServiceItem, index: number): EnrichedService {
  const targetRoute = getDedicatedRoute(service);

  const customMap: Record<
    string,
    Partial<
      Pick<
        EnrichedService,
        | 'stage'
        | 'feeLabel'
        | 'feeType'
        | 'turnaround'
        | 'turnaroundBucket'
        | 'turnaroundOrder'
        | 'deliveryMode'
        | 'coverage'
        | 'deliverables'
        | 'popularityScore'
      >
    >
  > = {
    'admission-support': {
      stage: 'Admissions & Offers',
      feeLabel: '100% Free',
      feeType: 'Free Consultancy',
      turnaround: '3–7 Business Days',
      turnaroundBucket: '1–2 Weeks',
      turnaroundOrder: 3,
      deliveryMode: 'Dedicated Counselor',
      coverage: '800+ Partner Institutions',
      deliverables: [
        'Academic profile & scholarship eligibility audit',
        'Direct university portal application filing',
        'Offer letter follow-up & condition clearance',
      ],
      popularityScore: 100,
    },
    'school-admission': {
      stage: 'Admissions & Offers',
      feeLabel: '100% Free',
      feeType: 'Free Consultancy',
      turnaround: '1–2 Weeks',
      turnaroundBucket: '1–2 Weeks',
      turnaroundOrder: 3,
      deliveryMode: 'Dedicated Counselor',
      coverage: 'UK, Malaysia & Global Schools',
      deliverables: [
        'International boarding & pathway school matching',
        'Guardian & parent orientation briefings',
        'Entrance assessment & interview preparation',
      ],
      popularityScore: 91,
    },
    'student-referral': {
      stage: 'Pre-Application',
      feeLabel: 'Cash Reward',
      feeType: 'Rewards & Discounts',
      turnaround: 'Upon Enrollment',
      turnaroundBucket: 'Instant / Same Day',
      turnaroundOrder: 1,
      deliveryMode: 'Online Portal',
      coverage: 'Global Student Network',
      deliverables: [
        'Guaranteed cash reward per enrolled referral',
        'Transparent enrollment tracking updates',
        'No cap on total student referrals',
      ],
      popularityScore: 86,
    },
    'student-visa-assistance': {
      stage: 'Visa & Compliance',
      feeLabel: '100% Free Guidance',
      feeType: 'Free Consultancy',
      turnaround: '2–4 Weeks',
      turnaroundBucket: '2–6 Weeks',
      turnaroundOrder: 4,
      deliveryMode: 'Dedicated Counselor',
      coverage: '15+ Embassy Jurisdictions',
      deliverables: [
        'Full document & bank solvency verification',
        'Mock visa interview coaching sessions',
        'Biometrics & embassy submission scheduling',
      ],
      popularityScore: 99,
    },
    'track-visa': {
      stage: 'Visa & Compliance',
      feeLabel: '100% Free Tool',
      feeType: 'Free Consultancy',
      turnaround: 'Instant Online',
      turnaroundBucket: 'Instant / Same Day',
      turnaroundOrder: 1,
      deliveryMode: 'Online Portal',
      coverage: 'Malaysia (EMGS VAL)',
      deliverables: [
        'Real-time EMGS VAL percentage status check',
        'Stage-by-stage green/yellow milestone explanations',
        'Direct counselor escalation if delayed',
      ],
      popularityScore: 96,
    },
    'dependent-visa': {
      stage: 'Visa & Compliance',
      feeLabel: '100% Free Guidance',
      feeType: 'Free Consultancy',
      turnaround: '2–5 Weeks',
      turnaroundBucket: '2–6 Weeks',
      turnaroundOrder: 4,
      deliveryMode: 'Dedicated Counselor',
      coverage: 'UK, Australia, Malaysia & EU',
      deliverables: [
        'Spouse, child & parent eligibility assessment',
        'Relationship & financial proof checklist',
        'Joint or subsequent dependent filing support',
      ],
      popularityScore: 88,
    },
    'tourist-visa': {
      stage: 'Visa & Compliance',
      feeLabel: 'Official Fee Only',
      feeType: 'Partner / Official Fee',
      turnaround: '1–3 Weeks',
      turnaroundBucket: '1–2 Weeks',
      turnaroundOrder: 3,
      deliveryMode: 'Online & In-Person',
      coverage: 'UK, USA, Schengen & Asia',
      deliverables: [
        'Convocation & family visit invitation support',
        'Travel itinerary & sponsor letter review',
        'Embassy appointment & form filing',
      ],
      popularityScore: 84,
    },
    'mm2h-program': {
      stage: 'Visa & Compliance',
      feeLabel: 'Official Tier Fee',
      feeType: 'Partner / Official Fee',
      turnaround: '4–6 Weeks',
      turnaroundBucket: '2–6 Weeks',
      turnaroundOrder: 4,
      deliveryMode: 'Dedicated Counselor',
      coverage: 'Malaysia & Sarawak MM2H',
      deliverables: [
        'Silver, Gold & Platinum tier eligibility review',
        'Fixed deposit & property compliance guidance',
        'End-to-end residency pass endorsement',
      ],
      popularityScore: 85,
    },
    'student-accommodation': {
      stage: 'Pre-Departure & Arrival',
      feeLabel: 'Verified Partner Rate',
      feeType: 'Partner / Official Fee',
      turnaround: '24–72 Hours',
      turnaroundBucket: '24–72 Hours',
      turnaroundOrder: 2,
      deliveryMode: 'On-Ground Support',
      coverage: 'On-Campus & PBSA Residences',
      deliverables: [
        'Verified campus hostels & private studio options',
        'Transparent lease review before deposit',
        'Roommate & proximity-to-campus matching',
      ],
      popularityScore: 93,
    },
    'health-insurance': {
      stage: 'Pre-Departure & Arrival',
      feeLabel: 'Official Policy Rate',
      feeType: 'Partner / Official Fee',
      turnaround: 'Same Day',
      turnaroundBucket: 'Instant / Same Day',
      turnaroundOrder: 1,
      deliveryMode: 'Online Portal',
      coverage: 'OSHC, NHS, EMGS & Provincial',
      deliverables: [
        'Embassy-compliant student health policy issue',
        'Side-by-side insurer coverage comparison',
        'Instant certificate delivery for visa filing',
      ],
      popularityScore: 90,
    },
    'flight-ticketing': {
      stage: 'Pre-Departure & Arrival',
      feeLabel: 'Student Discount Fare',
      feeType: 'Rewards & Discounts',
      turnaround: 'Same Day',
      turnaroundBucket: 'Instant / Same Day',
      turnaroundOrder: 1,
      deliveryMode: 'Online & In-Person',
      coverage: 'Emirates, Qatar, SIA & More',
      deliverables: [
        'Up to 40kg student extra baggage allowance',
        'Flexible date-change student fare options',
        'Coordinated arrival windows with airport pickup',
      ],
      popularityScore: 92,
    },
    'airport-pickup': {
      stage: 'Pre-Departure & Arrival',
      feeLabel: 'Partner Rate / Free*',
      feeType: 'Partner / Official Fee',
      turnaround: '24–48 Hours',
      turnaroundBucket: '24–72 Hours',
      turnaroundOrder: 2,
      deliveryMode: 'On-Ground Support',
      coverage: 'Major International Hubs',
      deliverables: [
        'Arrival hall meet-and-greet with name board',
        'Direct transfer to university dorm or apartment',
        '24/7 flight delay monitoring & driver sync',
      ],
      popularityScore: 87,
    },
    'courier-services': {
      stage: 'Living & Ongoing',
      feeLabel: 'Discounted Partner Rate',
      feeType: 'Rewards & Discounts',
      turnaround: '24–72 Hours',
      turnaroundBucket: '24–72 Hours',
      turnaroundOrder: 2,
      deliveryMode: 'On-Ground Support',
      coverage: 'Worldwide Express (DHL/FedEx)',
      deliverables: [
        'Priority dispatch for transcripts & certificates',
        'Door-to-door tracking & customs documentation',
        'Student-tier discounted international courier rates',
      ],
      popularityScore: 76,
    },
    'tour-packages': {
      stage: 'Living & Ongoing',
      feeLabel: 'Group Student Rate',
      feeType: 'Rewards & Discounts',
      turnaround: '24–72 Hours',
      turnaroundBucket: '24–72 Hours',
      turnaroundOrder: 2,
      deliveryMode: 'Online & In-Person',
      coverage: 'Asia, Europe & Oceania',
      deliverables: [
        'Semester-break student group itineraries',
        'Visiting parent convocation travel packages',
        'Verified hotels, transfers & guided excursions',
      ],
      popularityScore: 72,
    },
    'airbnb-short-stay': {
      stage: 'Living & Ongoing',
      feeLabel: 'Corporate Student Rate',
      feeType: 'Rewards & Discounts',
      turnaround: 'Same Day',
      turnaroundBucket: 'Instant / Same Day',
      turnaroundOrder: 1,
      deliveryMode: 'Online Portal',
      coverage: 'Key University Cities',
      deliverables: [
        'Furnished orientation-week & transit stays',
        'Verified host safety & campus transit proximity',
        'Flexible extension while finalizing long-term lease',
      ],
      popularityScore: 78,
    },
    'car-rental': {
      stage: 'Living & Ongoing',
      feeLabel: 'Partner Discount Rate',
      feeType: 'Rewards & Discounts',
      turnaround: 'Same Day',
      turnaroundBucket: 'Instant / Same Day',
      turnaroundOrder: 1,
      deliveryMode: 'Online & In-Person',
      coverage: 'UK, Australia, Canada & MY',
      deliverables: [
        'Flexible short & long-term student vehicle hire',
        'Family convocation & campus move-in rentals',
        'Comprehensive insurance & roadside assistance',
      ],
      popularityScore: 71,
    },
    'money-transfer': {
      stage: 'Living & Ongoing',
      feeLabel: 'Zero Wire Fee',
      feeType: 'Rewards & Discounts',
      turnaround: '24–48 Hours',
      turnaroundBucket: '24–72 Hours',
      turnaroundOrder: 2,
      deliveryMode: 'Online Portal',
      coverage: 'Direct University Tuition Wire',
      deliverables: [
        'Preferential bank-grade FX tuition rates',
        'Direct institutional payment receipt confirmation',
        'Student multi-currency card setup assistance',
      ],
      popularityScore: 89,
    },
    'ielts-preparation': {
      stage: 'Pre-Application',
      feeLabel: 'Official Course Fee',
      feeType: 'Partner / Official Fee',
      turnaround: '1–2 Weeks Start',
      turnaroundBucket: '1–2 Weeks',
      turnaroundOrder: 3,
      deliveryMode: 'Online & In-Person',
      coverage: 'Academic & UKVI IELTS',
      deliverables: [
        'Full 4-module Cambridge trainer mentorship',
        'Weekly timed mock exams with band feedback',
        '1-on-1 speaking & writing score clinics',
      ],
      popularityScore: 95,
    },
    'pte-preparation': {
      stage: 'Pre-Application',
      feeLabel: 'Official Course Fee',
      feeType: 'Partner / Official Fee',
      turnaround: '24–72 Hours Start',
      turnaroundBucket: '24–72 Hours',
      turnaroundOrder: 2,
      deliveryMode: 'Online & In-Person',
      coverage: 'PTE Academic Global',
      deliverables: [
        'AI-scored computer-based mock practice portal',
        'High-scoring speaking & essay templates',
        'Rapid 4-week score-boost drills',
      ],
      popularityScore: 87,
    },
    'linguaskill-preparation': {
      stage: 'Pre-Application',
      feeLabel: 'Official Test Fee',
      feeType: 'Partner / Official Fee',
      turnaround: '48-Hour Results',
      turnaroundBucket: '24–72 Hours',
      turnaroundOrder: 2,
      deliveryMode: 'Online Portal',
      coverage: 'Cambridge Online English',
      deliverables: [
        'Fast adaptive online test preparation',
        'Official results delivered within 48 hours',
        'Accepted across partner Malaysian & UK campuses',
      ],
      popularityScore: 83,
    },
    'b2b-partnership': {
      stage: 'Pre-Application',
      feeLabel: 'Commission Tier',
      feeType: 'Rewards & Discounts',
      turnaround: '24–72 Hours',
      turnaroundBucket: '24–72 Hours',
      turnaroundOrder: 2,
      deliveryMode: 'Online Portal',
      coverage: 'Global Sub-Agent Network',
      deliverables: [
        'Dedicated partner portal with real-time tracking',
        'Direct access to 800+ institutional offers',
        'Fast transparent commission settlements',
      ],
      popularityScore: 82,
    },
  };

  const override = customMap[service.slug];
  const isDestination = service.category === 'Study Destinations';

  const stage =
    override?.stage ||
    (isDestination
      ? 'Pre-Application'
      : service.category === 'Admissions'
        ? 'Admissions & Offers'
        : service.category === 'Immigration'
          ? 'Visa & Compliance'
          : service.category === 'Arrival'
            ? 'Pre-Departure & Arrival'
            : 'Living & Ongoing');

  const feeLabel = override?.feeLabel || (isDestination ? '100% Free Counseling' : '100% Free');
  const feeType =
    override?.feeType || (isDestination ? 'Free Consultancy' : 'Free Consultancy');

  const turnaround = override?.turnaround || (isDestination ? '24–48 Hours' : '1–2 Weeks');
  const turnaroundBucket =
    override?.turnaroundBucket || (isDestination ? '24–72 Hours' : '1–2 Weeks');
  const turnaroundOrder = override?.turnaroundOrder ?? (isDestination ? 2 : 3);

  const deliveryMode =
    override?.deliveryMode || (isDestination ? 'Dedicated Counselor' : 'Online & In-Person');

  const coverage =
    override?.coverage ||
    (isDestination ? `${service.title.replace('Study in ', '')} Universities & Visas` : 'Global Network');

  const deliverables = override?.deliverables || [
    `Personalized ${service.title.replace('Study in ', '')} university shortlisting & fee roadmap`,
    'Scholarship eligibility & entry requirement verification',
    'Complete student visa & post-study work pathway counseling',
  ];

  const highlights: string[] = [];
  if (targetRoute) highlights.push('Dedicated Service Guide');
  if (feeType === 'Free Consultancy') highlights.push('Zero Consultancy Fee');
  if (
    service.category === 'Admissions' ||
    service.category === 'Study Destinations' ||
    service.slug === 'student-accommodation' ||
    service.slug === 'flight-ticketing' ||
    service.slug === 'b2b-partnership'
  ) {
    highlights.push('Direct Partner Network');
  }
  if (turnaroundOrder <= 2) {
    highlights.push('Priority Fast-Track');
  }

  return {
    ...service,
    stage,
    feeLabel,
    feeType,
    turnaround,
    turnaroundBucket,
    turnaroundOrder,
    deliveryMode,
    coverage,
    deliverables,
    targetRoute,
    highlights,
    popularityScore: override?.popularityScore ?? Math.max(68, 94 - index),
  };
}

const ServiceCoverImage: React.FC<{
  service: EnrichedService;
  heightClass?: string;
}> = ({ service, heightClass = 'h-44' }) => {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className={`relative w-full ${heightClass} overflow-hidden bg-slate-900`}>
      {!imgFailed && service.imageUrl ? (
        <img
          src={service.imageUrl}
          alt={service.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setImgFailed(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div
          className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#0a1120] via-slate-800 to-slate-900"
        >
          <span className="material-symbols-outlined text-3xl text-[#fbb034] mb-1.5">
            {service.iconName || 'workspace_premium'}
          </span>
          <span className="text-xs font-bold text-white/90 line-clamp-2">{service.title}</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 text-white pointer-events-none">
        <span className="text-[10.5px] font-bold uppercase tracking-wide text-amber-300 truncate">
          {service.badge || service.category}
        </span>
      </div>
    </div>
  );
};

export const ServicesView: React.FC<ServicesViewProps> = ({
  onBackToHome,
  onOpenConsultation,
  onNavigate,
  initialSelectedServiceSlug,
}) => {
  const enrichedServices = useMemo<EnrichedService[]>(
    () => mockServices.map((service, index) => enrichService(service, index)),
    []
  );

  // Search & Display Controls
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [displayMode, setDisplayMode] = useState<ServiceDisplayMode>('grid');
  const [sortBy, setSortBy] = useState<ServiceSortBy>('featured');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [showAllActiveChips, setShowAllActiveChips] = useState<boolean>(false);
  const [applyConfirmed, setApplyConfirmed] = useState<boolean>(false);

  // Faceted Filter States
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [selectedFeeTypes, setSelectedFeeTypes] = useState<string[]>([]);
  const [selectedDeliveryModes, setSelectedDeliveryModes] = useState<string[]>([]);
  const [selectedTurnarounds, setSelectedTurnarounds] = useState<string[]>([]);
  const [selectedHighlights, setSelectedHighlights] = useState<string[]>([]);

  // Sidebar Accordion Expansion State
  const [expanded, setExpanded] = useState({
    category: true,
    stage: true,
    fee: false,
    delivery: false,
    turnaround: false,
    highlights: false,
  });

  // Shortlist & Compare Persistence
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(SAVED_SERVICES_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [compareIds, setCompareIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(COMPARE_SERVICES_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [bouncingServiceId, setBouncingServiceId] = useState<string | null>(null);

  // Quick Preview Modal
  const [activeModalService, setActiveModalService] = useState<EnrichedService | null>(() => {
    if (initialSelectedServiceSlug) {
      return (
        mockServices
          .map((s, idx) => enrichService(s, idx))
          .find((s) => s.slug === initialSelectedServiceSlug) || null
      );
    }
    return null;
  });

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_SERVICES_STORAGE_KEY, JSON.stringify(savedIds));
    } catch {
      // ignore storage errors
    }
  }, [savedIds]);

  useEffect(() => {
    try {
      localStorage.setItem(COMPARE_SERVICES_STORAGE_KEY, JSON.stringify(compareIds));
    } catch {
      // ignore storage errors
    }
  }, [compareIds]);

  const toggleSave = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    setBouncingServiceId(id);
    window.setTimeout(() => setBouncingServiceId(null), 480);
  };

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= 4) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  const toggleAccordion = (key: keyof typeof expanded) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const hasAnyExpanded = Object.values(expanded).some(Boolean);
  const handleCollapseAll = () => {
    setExpanded({
      category: false,
      stage: false,
      fee: false,
      delivery: false,
      turnaround: false,
      highlights: false,
    });
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedStages([]);
    setSelectedFeeTypes([]);
    setSelectedDeliveryModes([]);
    setSelectedTurnarounds([]);
    setSelectedHighlights([]);
    setCurrentPage(1);
  };

  // Category & Stage Counts
  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    enrichedServices.forEach((s) => {
      map.set(s.category, (map.get(s.category) || 0) + 1);
    });
    return map;
  }, [enrichedServices]);

  const stageCounts = useMemo(() => {
    const map = new Map<string, number>();
    enrichedServices.forEach((s) => {
      map.set(s.stage, (map.get(s.stage) || 0) + 1);
    });
    return map;
  }, [enrichedServices]);

  // Filtered & Sorted Services
  const filteredServices = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    const list = enrichedServices.filter((s) => {
      if (term) {
        const haystack = [
          s.title,
          s.category,
          s.badge || '',
          s.desc,
          s.stage,
          s.feeLabel,
          s.deliveryMode,
          s.coverage,
          ...s.deliverables,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(term)) return false;
      }

      if (selectedCategories.length > 0 && !selectedCategories.includes(s.category)) {
        return false;
      }
      if (selectedStages.length > 0 && !selectedStages.includes(s.stage)) {
        return false;
      }
      if (selectedFeeTypes.length > 0 && !selectedFeeTypes.includes(s.feeType)) {
        return false;
      }
      if (
        selectedDeliveryModes.length > 0 &&
        !selectedDeliveryModes.includes(s.deliveryMode)
      ) {
        return false;
      }
      if (
        selectedTurnarounds.length > 0 &&
        !selectedTurnarounds.includes(s.turnaroundBucket)
      ) {
        return false;
      }
      if (
        selectedHighlights.length > 0 &&
        !selectedHighlights.every((h) => s.highlights.includes(h))
      ) {
        return false;
      }
      return true;
    });

    const sorted = [...list];
    if (sortBy === 'popular') {
      sorted.sort((a, b) => b.popularityScore - a.popularityScore);
    } else if (sortBy === 'fastest') {
      sorted.sort((a, b) => a.turnaroundOrder - b.turnaroundOrder || b.popularityScore - a.popularityScore);
    } else if (sortBy === 'az') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'category') {
      sorted.sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title));
    }
    return sorted;
  }, [
    enrichedServices,
    searchQuery,
    selectedCategories,
    selectedStages,
    selectedFeeTypes,
    selectedDeliveryModes,
    selectedTurnarounds,
    selectedHighlights,
    sortBy,
  ]);

  const effectiveServices = useMemo(() => {
    if (displayMode === 'wishlist') {
      return filteredServices.filter((s) => savedIds.includes(s.id));
    }
    return filteredServices;
  }, [displayMode, filteredServices, savedIds]);

  const comparedServices = useMemo(
    () => enrichedServices.filter((s) => compareIds.includes(s.id)),
    [enrichedServices, compareIds]
  );

  // Active Filter Chips
  const activeFilterChips = useMemo(() => {
    const chips: Array<{
      id: string;
      category: string;
      value: string;
      onRemove: () => void;
    }> = [];

    if (searchQuery.trim()) {
      chips.push({
        id: 'search',
        category: 'Search',
        value: searchQuery.trim(),
        onRemove: () => {
          setSearchQuery('');
          setCurrentPage(1);
        },
      });
    }

    selectedCategories.forEach((cat) => {
      chips.push({
        id: `cat-${cat}`,
        category: 'Category',
        value: cat,
        onRemove: () => {
          setSelectedCategories((prev) => prev.filter((item) => item !== cat));
          setCurrentPage(1);
        },
      });
    });

    selectedStages.forEach((stage) => {
      chips.push({
        id: `stage-${stage}`,
        category: 'Stage',
        value: stage,
        onRemove: () => {
          setSelectedStages((prev) => prev.filter((item) => item !== stage));
          setCurrentPage(1);
        },
      });
    });

    selectedFeeTypes.forEach((fee) => {
      chips.push({
        id: `fee-${fee}`,
        category: 'Fee',
        value: fee,
        onRemove: () => {
          setSelectedFeeTypes((prev) => prev.filter((item) => item !== fee));
          setCurrentPage(1);
        },
      });
    });

    selectedDeliveryModes.forEach((mode) => {
      chips.push({
        id: `mode-${mode}`,
        category: 'Mode',
        value: mode,
        onRemove: () => {
          setSelectedDeliveryModes((prev) => prev.filter((item) => item !== mode));
          setCurrentPage(1);
        },
      });
    });

    selectedTurnarounds.forEach((turnaround) => {
      chips.push({
        id: `turn-${turnaround}`,
        category: 'Turnaround',
        value: turnaround,
        onRemove: () => {
          setSelectedTurnarounds((prev) => prev.filter((item) => item !== turnaround));
          setCurrentPage(1);
        },
      });
    });

    selectedHighlights.forEach((highlight) => {
      chips.push({
        id: `hl-${highlight}`,
        category: 'Highlight',
        value: highlight,
        onRemove: () => {
          setSelectedHighlights((prev) => prev.filter((item) => item !== highlight));
          setCurrentPage(1);
        },
      });
    });

    return chips;
  }, [
    searchQuery,
    selectedCategories,
    selectedStages,
    selectedFeeTypes,
    selectedDeliveryModes,
    selectedTurnarounds,
    selectedHighlights,
  ]);

  const activeFiltersCount = activeFilterChips.length;

  // Pagination Math
  const totalPages = Math.max(1, Math.ceil(effectiveServices.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedServices = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return effectiveServices.slice(start, start + ITEMS_PER_PAGE);
  }, [effectiveServices, safePage]);

  const startIndex = effectiveServices.length === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(safePage * ITEMS_PER_PAGE, effectiveServices.length);

  const getPaginationPages = (): Array<number | '...'> => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: Array<number | '...'> = [1];
    if (safePage > 3) pages.push('...');
    const start = Math.max(2, safePage - 1);
    const end = Math.min(totalPages - 1, safePage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (safePage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  // Service Action Handler: Opens dedicated service page if available, otherwise opens detail modal
  const handleOpenService = (service: EnrichedService) => {
    if (service.targetRoute && onNavigate) {
      onNavigate(service.targetRoute.view, service.targetRoute.payload);
      return;
    }
    setActiveModalService(service);
  };

  // Collapsible Filter Sidebar (Identical Dark Navy Header + Accordion Style to Courses, Universities & Study Abroad)
  const renderFilterSidebar = (isMobile: boolean) => (
    <div
      className={`bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col ${
        isMobile ? 'h-full rounded-none border-0' : 'max-h-[calc(100vh-7rem)]'
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
            {filteredServices.length} results
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
        {/* 1. Service Category */}
        <div className="bg-white">
          <button
            type="button"
            aria-expanded={expanded.category}
            onClick={() => toggleAccordion('category')}
            className="w-full h-11 px-4 flex items-center justify-between hover:bg-slate-50/90 transition-colors focus:outline-none select-none text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <svg
                className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-amber-500 transition-colors"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect x="3.5" y="3.5" width="7" height="7" rx="1.2" />
                <rect x="13.5" y="3.5" width="7" height="7" rx="1.2" />
                <rect x="3.5" y="13.5" width="7" height="7" rx="1.2" />
                <rect x="13.5" y="13.5" width="7" height="7" rx="1.2" />
              </svg>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight shrink-0">
                Service Category
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={selectedCategories.length > 0 ? ACTIVE_BADGE_CLASS : DEFAULT_BADGE_CLASS}>
                {selectedCategories.length > 0 ? `${selectedCategories.length} selected` : 'All'}
              </span>
              <svg
                className={`w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
                  expanded.category ? 'rotate-180' : ''
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
          {expanded.category && (
            <div className="bg-slate-50/70 p-3 border-t border-slate-100">
              <div className="bg-white rounded-xl border border-slate-200 p-2 space-y-1">
                {SERVICE_CATEGORIES.map((category) => {
                  const checked = selectedCategories.includes(category);
                  return (
                    <label
                      key={category}
                      className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            setSelectedCategories((prev) =>
                              prev.includes(category)
                                ? prev.filter((item) => item !== category)
                                : [...prev, category]
                            );
                            setCurrentPage(1);
                          }}
                          className={CHECKBOX_CLASS}
                        />
                        <span className="text-xs font-medium text-slate-700 truncate">{category}</span>
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 tabular-nums">
                        {categoryCounts.get(category) || 0}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 2. Journey Stage */}
        <div className="bg-white">
          <button
            type="button"
            aria-expanded={expanded.stage}
            onClick={() => toggleAccordion('stage')}
            className="w-full h-11 px-4 flex items-center justify-between hover:bg-slate-50/90 transition-colors focus:outline-none select-none text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <svg
                className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-amber-500 transition-colors"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 3v18M5 8l7-5 7 5M5 16l7 5 7-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight shrink-0">
                Journey Stage
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={selectedStages.length > 0 ? ACTIVE_BADGE_CLASS : DEFAULT_BADGE_CLASS}>
                {selectedStages.length > 0 ? `${selectedStages.length} selected` : 'Any'}
              </span>
              <svg
                className={`w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
                  expanded.stage ? 'rotate-180' : ''
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
          {expanded.stage && (
            <div className="bg-slate-50/70 p-3 border-t border-slate-100">
              <div className="bg-white rounded-xl border border-slate-200 p-2 space-y-1">
                {JOURNEY_STAGES.map((stage) => {
                  const checked = selectedStages.includes(stage);
                  return (
                    <label
                      key={stage}
                      className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            setSelectedStages((prev) =>
                              prev.includes(stage)
                                ? prev.filter((item) => item !== stage)
                                : [...prev, stage]
                            );
                            setCurrentPage(1);
                          }}
                          className={CHECKBOX_CLASS}
                        />
                        <span className="text-xs font-medium text-slate-700 truncate">{stage}</span>
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 tabular-nums">
                        {stageCounts.get(stage) || 0}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 3. Fee Structure */}
        <div className="bg-white">
          <button
            type="button"
            aria-expanded={expanded.fee}
            onClick={() => toggleAccordion('fee')}
            className="w-full h-11 px-4 flex items-center justify-between hover:bg-slate-50/90 transition-colors focus:outline-none select-none text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <svg
                className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-amber-500 transition-colors"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v10M15 9.5c0-1.1-1.3-2-3-2s-3 .9-3 2 1.3 2 3 2 3 .9 3 2-1.3 2-3 2-3-.9-3-2" strokeLinecap="round" />
              </svg>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight shrink-0">
                Fee Structure
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={selectedFeeTypes.length > 0 ? ACTIVE_BADGE_CLASS : DEFAULT_BADGE_CLASS}>
                {selectedFeeTypes.length > 0 ? `${selectedFeeTypes.length} selected` : 'Any'}
              </span>
              <svg
                className={`w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
                  expanded.fee ? 'rotate-180' : ''
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
          {expanded.fee && (
            <div className="bg-slate-50/70 p-3 border-t border-slate-100">
              <div className="bg-white rounded-xl border border-slate-200 p-2 space-y-1">
                {FEE_TYPES.map((fee) => {
                  const checked = selectedFeeTypes.includes(fee);
                  return (
                    <label
                      key={fee}
                      className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          setSelectedFeeTypes((prev) =>
                            prev.includes(fee) ? prev.filter((item) => item !== fee) : [...prev, fee]
                          );
                          setCurrentPage(1);
                        }}
                        className={CHECKBOX_CLASS}
                      />
                      <span className="text-xs font-medium text-slate-700">{fee}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 4. Delivery Mode */}
        <div className="bg-white">
          <button
            type="button"
            aria-expanded={expanded.delivery}
            onClick={() => toggleAccordion('delivery')}
            className="w-full h-11 px-4 flex items-center justify-between hover:bg-slate-50/90 transition-colors focus:outline-none select-none text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <svg
                className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-amber-500 transition-colors"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="4" width="18" height="12" rx="2" />
                <path d="M8 20h8M12 16v4" strokeLinecap="round" />
              </svg>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight shrink-0">
                Delivery Mode
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={selectedDeliveryModes.length > 0 ? ACTIVE_BADGE_CLASS : DEFAULT_BADGE_CLASS}>
                {selectedDeliveryModes.length > 0 ? `${selectedDeliveryModes.length} selected` : 'Any'}
              </span>
              <svg
                className={`w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
                  expanded.delivery ? 'rotate-180' : ''
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
          {expanded.delivery && (
            <div className="bg-slate-50/70 p-3 border-t border-slate-100">
              <div className="bg-white rounded-xl border border-slate-200 p-2 space-y-1">
                {DELIVERY_MODES.map((mode) => {
                  const checked = selectedDeliveryModes.includes(mode);
                  return (
                    <label
                      key={mode}
                      className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          setSelectedDeliveryModes((prev) =>
                            prev.includes(mode)
                              ? prev.filter((item) => item !== mode)
                              : [...prev, mode]
                          );
                          setCurrentPage(1);
                        }}
                        className={CHECKBOX_CLASS}
                      />
                      <span className="text-xs font-medium text-slate-700">{mode}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 5. Turnaround Time */}
        <div className="bg-white">
          <button
            type="button"
            aria-expanded={expanded.turnaround}
            onClick={() => toggleAccordion('turnaround')}
            className="w-full h-11 px-4 flex items-center justify-between hover:bg-slate-50/90 transition-colors focus:outline-none select-none text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <svg
                className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-amber-500 transition-colors"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight shrink-0">
                Turnaround Time
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={selectedTurnarounds.length > 0 ? ACTIVE_BADGE_CLASS : DEFAULT_BADGE_CLASS}>
                {selectedTurnarounds.length > 0 ? `${selectedTurnarounds.length} selected` : 'Any'}
              </span>
              <svg
                className={`w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 ${
                  expanded.turnaround ? 'rotate-180' : ''
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
          {expanded.turnaround && (
            <div className="bg-slate-50/70 p-3 border-t border-slate-100">
              <div className="bg-white rounded-xl border border-slate-200 p-2 space-y-1">
                {TURNAROUND_BUCKETS.map((bucket) => {
                  const checked = selectedTurnarounds.includes(bucket);
                  return (
                    <label
                      key={bucket}
                      className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          setSelectedTurnarounds((prev) =>
                            prev.includes(bucket)
                              ? prev.filter((item) => item !== bucket)
                              : [...prev, bucket]
                          );
                          setCurrentPage(1);
                        }}
                        className={CHECKBOX_CLASS}
                      />
                      <span className="text-xs font-medium text-slate-700">{bucket}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 6. Service Highlights */}
        <div className="bg-white">
          <button
            type="button"
            aria-expanded={expanded.highlights}
            onClick={() => toggleAccordion('highlights')}
            className="w-full h-11 px-4 flex items-center justify-between hover:bg-slate-50/90 transition-colors focus:outline-none select-none text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <svg
                className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-amber-500 transition-colors"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[13px] font-bold text-slate-800 tracking-tight shrink-0">
                Highlights
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={selectedHighlights.length > 0 ? ACTIVE_BADGE_CLASS : DEFAULT_BADGE_CLASS}>
                {selectedHighlights.length > 0 ? `${selectedHighlights.length} active` : 'Any'}
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
              <div className="bg-white rounded-xl border border-slate-200 p-2 space-y-1">
                {HIGHLIGHT_OPTIONS.map((highlight) => {
                  const checked = selectedHighlights.includes(highlight);
                  return (
                    <label
                      key={highlight}
                      className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          setSelectedHighlights((prev) =>
                            prev.includes(highlight)
                              ? prev.filter((item) => item !== highlight)
                              : [...prev, highlight]
                          );
                          setCurrentPage(1);
                        }}
                        className={CHECKBOX_CLASS}
                      />
                      <span className="text-xs font-medium text-slate-700">{highlight}</span>
                    </label>
                  );
                })}
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

  // Reusable Clean Action Block (Identical to Courses & Universities Cards)
  const renderCardActions = (service: EnrichedService) => {
    const isSaved = savedIds.includes(service.id);
    const isCompared = compareIds.includes(service.id);

    return (
      <div className="space-y-3.5">
        {/* Clean Inline Utility Actions: Shortlist & Compare */}
        <div className="flex items-center justify-end gap-5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleSave(service.id);
            }}
            aria-label={isSaved ? 'Remove from shortlist' : 'Add to shortlist'}
            title={isSaved ? 'Shortlisted' : 'Shortlist'}
            className={`no-min-touch inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors cursor-pointer ${
              isSaved
                ? 'text-rose-600 dark:text-rose-400 font-semibold'
                : 'text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            <svg
              className="w-[17px] h-[17px] shrink-0"
              viewBox="0 0 24 24"
              fill={isSaved ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
            </svg>
            <span>{isSaved ? 'Shortlisted' : 'Shortlist'}</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleCompare(service.id);
            }}
            title={isCompared ? 'Remove from comparison' : 'Add to comparison'}
            className={`no-min-touch inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors cursor-pointer ${
              isCompared
                ? 'text-amber-600 dark:text-[#fbb034] font-semibold'
                : 'text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            <svg
              className="w-[17px] h-[17px] shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="4" y="7" width="13" height="13" rx="2" />
              <path d="M8 7V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
              {isCompared ? (
                <path d="M8 13.5l2 2 3.5-3.5" />
              ) : (
                <>
                  <path d="M10.5 10.5v6" />
                  <path d="M7.5 13.5h6" />
                </>
              )}
            </svg>
            <span>{isCompared ? 'Comparing' : 'Compare'}</span>
          </button>
        </div>

        {/* Clean Equal-Width Rectangular CTAs: View Service & Book Free */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenService(service);
            }}
            className="w-full h-10 px-2.5 rounded-lg bg-[#FFCC00] hover:bg-[#f2c200] active:scale-[0.98] text-slate-950 font-semibold text-[12.5px] sm:text-[13px] tracking-[-0.01em] transition-all cursor-pointer flex items-center justify-center whitespace-nowrap"
          >
            {service.targetRoute ? 'View Service' : 'View Details'}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenConsultation(service.title);
            }}
            className="w-full h-10 px-2.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] border border-slate-800 dark:border-slate-300 text-slate-900 dark:text-white font-semibold text-[12.5px] sm:text-[13px] tracking-[-0.01em] transition-all cursor-pointer flex items-center justify-center whitespace-nowrap"
          >
            Book Free
          </button>
        </div>
      </div>
    );
  };

  return (
    <ExplorerPageShell>
      {/* 1. Shared Explorer Hero Banner & Full-Width Search Theme */}
      <ExplorerHeroBanner
        dataPurpose="services-hero-banner"
        onNavigateHome={onBackToHome}
        breadcrumbs={
          displayMode === 'compare' || displayMode === 'wishlist'
            ? [
                {
                  label: 'Services',
                  onClick: () => {
                    setDisplayMode('grid');
                    setCurrentPage(1);
                  },
                },
                { label: displayMode === 'compare' ? 'Compare Services' : 'Saved Services' },
              ]
            : [{ label: 'Services' }]
        }
        titleHighlight="Services"
        subtitle={`Explore ${enrichedServices.length}+ admissions, visa, arrival & study abroad support services`}
        search={{
          value: searchQuery,
          onChange: (val) => {
            setSearchQuery(val);
            setCurrentPage(1);
          },
          onSubmit: () => setCurrentPage(1),
          placeholder: 'Search services, visas, admissions, test prep or destinations',
        }}
      />

      <SectionHeader
        title={
          displayMode === 'wishlist'
            ? 'Saved Services'
            : displayMode === 'compare'
            ? 'Compare Student Services'
            : 'Student Support Services Directory'
        }
        subtitle="Filter admissions, visa compliance, pre-departure, and arrival services by category, stage, and turnaround."
        countLabel={`(${effectiveServices.length.toLocaleString()})`}
      />

      {/* 2. Directory Controls & Results */}
      <div className="space-y-3 sm:space-y-6">
        <div className="space-y-3">
          {/* Row 2: Subtle Secondary Metadata & Compact Controls */}
          <div className="flex items-center justify-between gap-2 sm:gap-3 flex-wrap px-1">
            {/* Left Cluster: Mobile Filter Trigger, Result Count & Active Filter Chips */}
            <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden no-min-touch h-8 px-3 rounded-full border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/70 text-slate-600 dark:text-slate-300 text-[11.5px] font-medium inline-flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shrink-0"
              >
                <span className="material-symbols-outlined text-[15px] text-slate-500 dark:text-slate-400">
                  tune
                </span>
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="min-w-[16px] h-[16px] px-1 rounded-full bg-[#FFCC00] text-slate-950 text-[10px] font-bold inline-flex items-center justify-center tabular-nums">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <div className="flex items-baseline gap-1 shrink-0">
                <span className="text-xs font-normal text-slate-400 dark:text-slate-400">
                  {displayMode === 'wishlist' ? 'Saved Services:' : 'Total Services:'}
                </span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 tabular-nums">
                  {effectiveServices.length.toLocaleString()}
                </span>
              </div>

              {activeFilterChips.length > 0 && (
                <>
                  <span className="hidden sm:inline-block h-3.5 w-px bg-slate-200/80 dark:bg-slate-800 mx-0.5 shrink-0" />

                  {(showAllActiveChips
                    ? activeFilterChips
                    : activeFilterChips.slice(0, 3)
                  ).map((chip) => (
                    <span
                      key={chip.id}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-50/80 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 text-[11.5px] max-w-[200px]"
                    >
                      <span className="text-slate-400 font-normal shrink-0">
                        {chip.category}:
                      </span>
                      <span className="text-slate-700 dark:text-slate-200 font-medium truncate">
                        {chip.value}
                      </span>
                      <button
                        type="button"
                        aria-label={`Remove ${chip.category} ${chip.value}`}
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
                      className="no-min-touch inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100/80 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11.5px] font-medium hover:bg-slate-200/70 transition-colors cursor-pointer shrink-0"
                    >
                      {showAllActiveChips
                        ? 'Show less'
                        : `+${activeFilterChips.length - 3} more`}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="no-min-touch inline-flex items-center gap-1 text-[11.5px] font-medium text-slate-400 hover:text-rose-500 transition-colors cursor-pointer shrink-0 ml-0.5"
                  >
                    <span>Clear all</span>
                  </button>
                </>
              )}
            </div>

            {/* Right Cluster: Subtle Page Indicator + Chevrons | Compact Icon Switcher | Quiet Sort Dropdown */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap ml-auto shrink-0">
              {/* Page Counter & Circular Chevrons */}
              <div className="flex items-center gap-1.5 text-[11.5px] text-slate-400 dark:text-slate-400">
                <span className="whitespace-nowrap">
                  Page{' '}
                  <strong className="font-semibold text-slate-700 dark:text-slate-200 tabular-nums">
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
                    className="no-min-touch w-7 h-7 flex items-center justify-center rounded-full border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
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
                    className="no-min-touch w-7 h-7 flex items-center justify-center rounded-full border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>

              <span className="hidden sm:inline-block h-4 w-px bg-slate-200/80 dark:bg-slate-800 mx-0.5 shrink-0" />

              {/* Compact Icon-Only Segmented Pill Switcher: Cards, List, Compare, Wishlist */}
              <div className="inline-flex items-center p-0.5 rounded-full bg-slate-50/80 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 shrink-0 gap-0.5">
                <button
                  type="button"
                  title="Cards view"
                  aria-label="Cards view"
                  aria-pressed={displayMode === 'grid'}
                  onClick={() => {
                    setDisplayMode('grid');
                    setCurrentPage(1);
                  }}
                  className={`no-min-touch w-7 h-7 rounded-full inline-flex items-center justify-center transition-all duration-150 cursor-pointer ${
                    displayMode === 'grid'
                      ? 'bg-slate-800 text-white dark:bg-slate-700 dark:text-white'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  <svg
                    className="w-3.5 h-3.5 shrink-0"
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
                </button>

                <button
                  type="button"
                  title="List view"
                  aria-label="List view"
                  aria-pressed={displayMode === 'list'}
                  onClick={() => {
                    setDisplayMode('list');
                    setCurrentPage(1);
                  }}
                  className={`no-min-touch w-7 h-7 rounded-full inline-flex items-center justify-center transition-all duration-150 cursor-pointer ${
                    displayMode === 'list'
                      ? 'bg-slate-800 text-white dark:bg-slate-700 dark:text-white'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  <svg
                    className="w-3.5 h-3.5 shrink-0"
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
                </button>

                <button
                  type="button"
                  title="Compare services"
                  aria-label="Compare services"
                  aria-pressed={displayMode === 'compare'}
                  onClick={() => {
                    setDisplayMode('compare');
                    setCurrentPage(1);
                  }}
                  className={`no-min-touch h-7 rounded-full inline-flex items-center justify-center gap-1 transition-all duration-150 cursor-pointer ${
                    comparedServices.length > 0 ? 'px-2' : 'w-7'
                  } ${
                    displayMode === 'compare'
                      ? 'bg-slate-800 text-white dark:bg-slate-700 dark:text-white'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  <svg
                    className="w-3.5 h-3.5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.9"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 7H20m0 0-3.5-3.5M20 7l-3.5 3.5" />
                    <path d="M16 17H4m0 0 3.5-3.5M4 17l3.5 3.5" />
                  </svg>
                  {comparedServices.length > 0 && (
                    <span
                      className={`text-[10.5px] font-semibold tabular-nums leading-none ${
                        displayMode === 'compare'
                          ? 'text-[#FFCC00]'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {comparedServices.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  title="Saved wishlist"
                  aria-label="Saved wishlist"
                  aria-pressed={displayMode === 'wishlist'}
                  onClick={() => {
                    setDisplayMode(displayMode === 'wishlist' ? 'grid' : 'wishlist');
                    setCurrentPage(1);
                  }}
                  className={`no-min-touch h-7 rounded-full inline-flex items-center justify-center gap-1 transition-all duration-150 cursor-pointer ${
                    savedIds.length > 0 ? 'px-2' : 'w-7'
                  } ${
                    displayMode === 'wishlist'
                      ? 'bg-slate-800 text-white dark:bg-slate-700 dark:text-white'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  <svg
                    className="w-3.5 h-3.5 shrink-0"
                    fill={displayMode === 'wishlist' ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.85"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5v16l-6-3.5-6 3.5v-16Z" />
                  </svg>
                  {savedIds.length > 0 && (
                    <span
                      className={`text-[10.5px] font-semibold tabular-nums leading-none ${
                        displayMode === 'wishlist'
                          ? 'text-[#FFCC00]'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {savedIds.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Subtle Pill Sort Dropdown */}
              {displayMode !== 'compare' && (
                <div className="relative inline-flex items-center w-[164px] rounded-full bg-slate-50/80 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-colors shrink-0">
                  <svg
                    className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
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
                    aria-label="Sort services"
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value as ServiceSortBy);
                      setCurrentPage(1);
                    }}
                    className="w-full h-[32px] pl-7.5 pr-7.5 rounded-full bg-transparent text-xs font-medium text-slate-600 dark:text-slate-300 focus:outline-none appearance-none cursor-pointer truncate"
                  >
                    <option value="featured">Recommended</option>
                    <option value="popular">Most Popular</option>
                    <option value="fastest">Fastest</option>
                    <option value="az">Name A–Z</option>
                    <option value="category">By Category</option>
                  </select>
                  <svg
                    className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
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
              )}
            </div>
          </div>
        </div>

        {/* 3. Main Grid: Left Filter Sidebar + Right Cards Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-8 items-start">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 lg:sticky lg:top-24">
            {renderFilterSidebar(false)}
          </aside>

          {/* Right Workspace */}
          <div className="lg:col-span-3 min-w-0">
            {displayMode === 'compare' ? (
              /* COMPARE MATRIX VIEW */
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                      Side-by-Side Service Comparison
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                      Compare up to 4 GEES services by fee structure, turnaround time, delivery mode, and deliverables.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <select
                      aria-label="Add service to comparison"
                      value=""
                      onChange={(e) => {
                        if (e.target.value) toggleCompare(e.target.value);
                      }}
                      className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      <option value="">+ Add service to compare...</option>
                      {enrichedServices
                        .filter((s) => !compareIds.includes(s.id))
                        .map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.title} ({s.category})
                          </option>
                        ))}
                    </select>
                    {comparedServices.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setCompareIds([])}
                        className="no-min-touch px-3 h-9 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-rose-600 cursor-pointer"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                </div>

                {comparedServices.length === 0 ? (
                  <div className="p-10 text-center space-y-3">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      No services selected for comparison
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                      Click Compare on any service card or choose services from the dropdown above to inspect them side-by-side.
                    </p>
                    <button
                      type="button"
                      onClick={() => setDisplayMode('grid')}
                      className="px-5 py-2.5 rounded-lg bg-[#FFCC00] hover:bg-[#f2c200] text-slate-950 text-xs font-semibold cursor-pointer"
                    >
                      Browse All Services
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto sleek-scrollbar">
                    <table className="w-full min-w-[680px] text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
                          <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-44">
                            Criteria
                          </th>
                          {comparedServices.map((s) => (
                            <th key={s.id} className="p-4 align-top">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                                    {s.title}
                                  </div>
                                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                                    {s.category}
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => toggleCompare(s.id)}
                                  aria-label={`Remove ${s.title} from comparison`}
                                  className="no-min-touch text-slate-400 hover:text-rose-500 text-xs p-1 cursor-pointer"
                                >
                                  ✕
                                </button>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-[13px]">
                        <tr>
                          <td className="p-4 font-bold text-slate-700 dark:text-slate-300">Journey Stage</td>
                          {comparedServices.map((s) => (
                            <td key={s.id} className="p-4 font-semibold text-slate-900 dark:text-white">
                              {s.stage}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="p-4 font-bold text-slate-700 dark:text-slate-300">Fee Structure</td>
                          {comparedServices.map((s) => (
                            <td key={s.id} className="p-4 font-semibold text-slate-900 dark:text-white">
                              {s.feeLabel}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="p-4 font-bold text-slate-700 dark:text-slate-300">Turnaround</td>
                          {comparedServices.map((s) => (
                            <td key={s.id} className="p-4 text-slate-700 dark:text-slate-300">
                              {s.turnaround}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="p-4 font-bold text-slate-700 dark:text-slate-300">Delivery Mode</td>
                          {comparedServices.map((s) => (
                            <td key={s.id} className="p-4 text-slate-700 dark:text-slate-300">
                              {s.deliveryMode}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="p-4 font-bold text-slate-700 dark:text-slate-300">Coverage</td>
                          {comparedServices.map((s) => (
                            <td key={s.id} className="p-4 text-slate-700 dark:text-slate-300">
                              {s.coverage}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="p-4 font-bold text-slate-700 dark:text-slate-300">Key Deliverables</td>
                          {comparedServices.map((s) => (
                            <td key={s.id} className="p-4 text-slate-600 dark:text-slate-300">
                              <ul className="space-y-1 list-disc pl-4">
                                {s.deliverables.map((item, idx) => (
                                  <li key={idx}>{item}</li>
                                ))}
                              </ul>
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="p-4 font-bold text-slate-700 dark:text-slate-300">Next Steps</td>
                          {comparedServices.map((s) => (
                            <td key={s.id} className="p-4">
                              <div className="flex flex-col gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleOpenService(s)}
                                  className="w-full h-9 px-3 rounded-lg bg-[#FFCC00] hover:bg-[#f2c200] text-slate-950 text-xs font-semibold transition-colors cursor-pointer"
                                >
                                  {s.targetRoute ? 'View Service' : 'View Details'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onOpenConsultation(s.title)}
                                  className="w-full h-9 px-3 rounded-lg border border-slate-800 dark:border-slate-300 text-slate-900 dark:text-white text-xs font-semibold transition-colors cursor-pointer"
                                >
                                  Book Free
                                </button>
                              </div>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : effectiveServices.length === 0 ? (
              /* EMPTY STATE */
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-10 text-center space-y-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {displayMode === 'wishlist'
                    ? 'No shortlisted services yet'
                    : 'No services match your current filters'}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  {displayMode === 'wishlist'
                    ? 'Click Shortlist on any service card to save your preferred admission, visa, or arrival services here.'
                    : 'Try clearing a category, journey stage, or search keyword to view more GEES services.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (displayMode === 'wishlist') setDisplayMode('grid');
                    else resetAllFilters();
                  }}
                  className="px-5 py-2.5 rounded-lg bg-[#FFCC00] hover:bg-[#f2c200] text-slate-950 text-xs font-semibold cursor-pointer"
                >
                  {displayMode === 'wishlist' ? 'Browse All Services' : 'Reset All Filters'}
                </button>
              </div>
            ) : displayMode === 'list' ? (
              /* LIST VIEW — Matching Courses & Universities List Cards */
              <div className="space-y-4">
                {paginatedServices.map((service) => {
                  const isSaved = savedIds.includes(service.id);
                  const isCompared = compareIds.includes(service.id);
                  const isBouncing = bouncingServiceId === service.id;

                  return (
                    <article
                      key={`list-${service.id}`}
                      className={`bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row items-stretch group ${
                        isCompared
                          ? 'border-[#fbb034] ring-2 ring-[#fbb034]/40 bg-amber-50/10'
                          : 'border-slate-200/90 dark:border-slate-800'
                      }`}
                    >
                      {/* Left Cover Image */}
                      <div
                        onClick={() => handleOpenService(service)}
                        className="relative w-full md:w-64 lg:w-72 h-44 md:h-auto shrink-0 overflow-hidden bg-slate-900 cursor-pointer"
                      >
                        <ServiceCoverImage service={service} heightClass="h-full" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSave(service.id);
                          }}
                          aria-label={isSaved ? `Remove ${service.title} from saved` : `Save ${service.title}`}
                          title={isSaved ? 'Saved in Wishlist' : 'Save to Wishlist'}
                          className={`no-min-touch absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-md shadow-md ${
                            isSaved
                              ? 'bg-[#fbb034] text-slate-950 ring-2 ring-white/60'
                              : 'bg-slate-950/60 hover:bg-slate-950/90 text-white hover:text-[#fbb034] border border-white/25'
                          } ${isBouncing ? 'animate-wishlist-bounce' : 'active:scale-90 hover:scale-105'}`}
                        >
                          <span className="material-symbols-outlined text-[15px]">
                            {isSaved ? 'bookmark' : 'bookmark_border'}
                          </span>
                        </button>
                      </div>

                      {/* Center Details */}
                      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between space-y-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[15px] text-[#314158] dark:text-slate-300">
                                {service.iconName || 'workspace_premium'}
                              </span>
                              <span>{service.category}</span>
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{service.stage}</span>
                            <span aria-hidden="true">·</span>
                            <span>{service.deliveryMode}</span>
                          </div>

                          <h3
                            onClick={() => handleOpenService(service)}
                            className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer transition-colors"
                          >
                            {service.title}
                          </h3>

                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                            {service.desc}
                          </p>

                          <div className="pt-1 text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                            {service.deliverables.slice(0, 2).map((item, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px] text-[#314158] dark:text-slate-300">
                                  check_circle
                                </span>
                                <span>{item}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right Side: Fee, Turnaround & Actions */}
                      <div className="w-full md:w-[296px] lg:w-[312px] p-4 sm:p-5 bg-white dark:bg-slate-900 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 flex flex-col justify-between shrink-0 space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-[11px] font-medium text-slate-400 block">
                              Consultancy Fee
                            </span>
                            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                              {service.feeLabel}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[11px] font-medium text-slate-400 block">
                              Turnaround
                            </span>
                            <div className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 mt-1">
                              {service.turnaround}
                            </div>
                          </div>
                        </div>

                        {renderCardActions(service)}
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              /* GRID & WISHLIST CARDS VIEW — Matching Courses & Universities Cards */
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedServices.map((service) => {
                  const isSaved = savedIds.includes(service.id);
                  const isCompared = compareIds.includes(service.id);
                  const isBouncing = bouncingServiceId === service.id;

                  return (
                    <article
                      key={service.id}
                      className={`bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group ${
                        isCompared
                          ? 'border-[#fbb034] ring-2 ring-[#fbb034]/40 bg-amber-50/10'
                          : 'border-slate-200/90 dark:border-slate-800'
                      }`}
                    >
                      {/* Top Media + Body */}
                      <div onClick={() => handleOpenService(service)} className="cursor-pointer">
                        <div className="relative">
                          <ServiceCoverImage service={service} heightClass="h-44" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSave(service.id);
                            }}
                            aria-label={isSaved ? `Remove ${service.title} from saved` : `Save ${service.title}`}
                            title={isSaved ? 'Saved in Wishlist' : 'Save to Wishlist'}
                            className={`no-min-touch absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-md shadow-md ${
                              isSaved
                                ? 'bg-[#fbb034] text-slate-950 ring-2 ring-white/60'
                                : 'bg-slate-950/60 hover:bg-slate-950/90 text-white hover:text-[#fbb034] border border-white/25'
                            } ${isBouncing ? 'animate-wishlist-bounce' : 'active:scale-90 hover:scale-105'}`}
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {isSaved ? 'bookmark' : 'bookmark_border'}
                            </span>
                          </button>
                        </div>

                        <div className="p-4 sm:p-5 pb-3 space-y-2.5">
                          {/* Clean Unboxed Metadata Line with #314158 Icon */}
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                            <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300 shrink-0">
                              <span className="material-symbols-outlined text-[15px] text-[#314158] dark:text-slate-300">
                                {service.iconName || 'workspace_premium'}
                              </span>
                              <span>{service.category}</span>
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="truncate">{service.stage}</span>
                          </div>

                          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                            {service.title}
                          </h3>

                          <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 min-h-[38px]">
                            {service.desc}
                          </p>

                          {/* Compact 2-Column Facts Row */}
                          <div className="grid grid-cols-2 gap-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs">
                            <div>
                              <span className="text-[11px] text-slate-400 font-medium block">
                                Fee Structure
                              </span>
                              <span className="font-bold text-slate-900 dark:text-white mt-0.5 block truncate">
                                {service.feeLabel}
                              </span>
                            </div>
                            <div>
                              <span className="text-[11px] text-slate-400 font-medium block">
                                Turnaround
                              </span>
                              <span className="font-bold text-slate-900 dark:text-white mt-0.5 block truncate">
                                {service.turnaround}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer Action Block */}
                      <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                        {renderCardActions(service)}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls (Identical Gold-Themed shadcn Pagination Across All 4 Pages) */}
            {displayMode !== 'compare' && totalPages > 1 && (
              <div className="mt-8 space-y-3 text-center">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block tabular-nums">
                  Showing{' '}
                  <strong className="text-slate-900 dark:text-white font-semibold">
                    {startIndex}–{endIndex}
                  </strong>{' '}
                  of{' '}
                  <strong className="text-slate-900 dark:text-white font-semibold">
                    {effectiveServices.length}
                  </strong>{' '}
                  services
                </span>
                <Pagination
                  aria-label="Services Directory Pagination"
                  className="w-fit max-w-full rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]"
                >
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        aria-disabled={safePage <= 1}
                        disabled={safePage <= 1}
                        tabIndex={safePage <= 1 ? -1 : undefined}
                        onClick={() => {
                          setCurrentPage((p) => Math.max(1, p - 1));
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      />
                    </PaginationItem>

                    {getPaginationPages().map((pageItem, idx) => {
                      if (pageItem === '...') {
                        return (
                          <PaginationItem key={`ellipsis-${idx}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }

                      const pageNum = Number(pageItem);
                      const isActive = safePage === pageNum;

                      return (
                        <PaginationItem key={`page-${pageNum}`}>
                          <PaginationLink
                            isActive={isActive}
                            onClick={() => {
                              if (!isActive) {
                                setCurrentPage(pageNum);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }
                            }}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    <PaginationItem>
                      <PaginationNext
                        aria-disabled={safePage >= totalPages}
                        disabled={safePage >= totalPages}
                        tabIndex={safePage >= totalPages ? -1 : undefined}
                        onClick={() => {
                          setCurrentPage((p) => Math.min(totalPages, p + 1));
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Compare Tray (when 1+ services selected and not on Compare tab) */}
      {displayMode !== 'compare' && comparedServices.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-[95vw]">
          <div className="bg-[#0a1120] text-white border border-white/15 rounded-full shadow-2xl px-3.5 sm:px-5 py-2 flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold overflow-x-auto no-scrollbar">
              <span className="text-slate-400 hidden sm:inline">Compare:</span>
              {comparedServices.map((s) => (
                <span
                  key={s.id}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-white text-[11px] whitespace-nowrap"
                >
                  <span>{s.title}</span>
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setDisplayMode('compare');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="no-min-touch px-3.5 py-1.5 rounded-full bg-[#FFCC00] hover:bg-[#f2c200] text-slate-950 font-bold text-xs whitespace-nowrap shrink-0 cursor-pointer transition-colors"
            >
              Compare ({comparedServices.length})
            </button>
          </div>
        </div>
      )}

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

      {/* Service Detail Quick Preview Modal */}
      {activeModalService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn"
          onClick={() => setActiveModalService(null)}
        >
          <div
            className="relative w-full max-w-xl bg-white dark:bg-[#0B1329] rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveModalService(null)}
              className="no-min-touch absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer active:scale-95"
              aria-label="Close modal"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>

            <div className="rounded-2xl overflow-hidden mb-5">
              <ServiceCoverImage service={activeModalService} heightClass="h-48" />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                <span className="material-symbols-outlined text-[15px] text-[#314158] dark:text-slate-300">
                  {activeModalService.iconName || 'workspace_premium'}
                </span>
                <span>{activeModalService.category}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>{activeModalService.stage}</span>
              <span aria-hidden="true">·</span>
              <span>{activeModalService.deliveryMode}</span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
              {activeModalService.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
              {activeModalService.desc}
            </p>

            {/* Quick Facts Grid */}
            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 mb-5 text-xs">
              <div>
                <span className="text-[11px] text-slate-400 block">Fee Structure</span>
                <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">
                  {activeModalService.feeLabel}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Turnaround</span>
                <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">
                  {activeModalService.turnaround}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Coverage</span>
                <span className="font-bold text-slate-900 dark:text-white mt-0.5 block truncate">
                  {activeModalService.coverage}
                </span>
              </div>
            </div>

            {/* Key Deliverables */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 mb-6 space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                What GEES Delivers
              </span>
              {activeModalService.deliverables.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-xs font-medium text-slate-700 dark:text-slate-200"
                >
                  <span className="material-symbols-outlined text-[#314158] dark:text-slate-300 text-[15px] mt-0.5 shrink-0">
                    check_circle
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col xs:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => {
                  const serviceName = activeModalService.title;
                  setActiveModalService(null);
                  onOpenConsultation(serviceName);
                }}
                className="flex-1 h-11 px-4 rounded-lg bg-[#FFCC00] hover:bg-[#f2c200] text-slate-950 font-semibold text-sm cursor-pointer active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>Book Free Consultation</span>
              </button>
              {activeModalService.targetRoute && onNavigate && (
                <button
                  type="button"
                  onClick={() => {
                    const route = activeModalService.targetRoute!;
                    setActiveModalService(null);
                    onNavigate(route.view, route.payload);
                  }}
                  className="h-11 px-4 rounded-lg border border-slate-800 dark:border-slate-300 text-slate-900 dark:text-white font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer active:scale-[0.98]"
                >
                  Open Full Guide
                </button>
              )}
              <button
                type="button"
                onClick={() => setActiveModalService(null)}
                className="h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer active:scale-[0.98]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </ExplorerPageShell>
  );
};

export default ServicesView;
