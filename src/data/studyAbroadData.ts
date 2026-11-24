/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Global Education Expert Services (GEES)
 * Study Abroad Explorer Data Model & Enriched Destination Directory (/study-abroad)
 *
 * Combines live university/course counts from mockDatabase with structured
 * destination metrics inspired by IDP Study Abroad, QS Where to Study, and IES Abroad.
 */

import {
  APPROVED_COUNTRY_NAMES,
  ApprovedCountryName,
  COUNTRY_METADATA_REGISTRY,
} from '../lib/country-config.ts';
import { DESTINATION_REGISTRY } from './destinationDataRegistry.ts';
import { mockCourses, mockUniversities } from './mockDatabase.ts';
import { University } from '../types/index.ts';

export type StudyRegion = 'Asia' | 'Europe' | 'Oceania' | 'North America';

export type PswTier =
  | 'Up to 4 Years'
  | 'Up to 3 Years'
  | 'Up to 2 Years'
  | '1 Year / EU Pathway';

export type IntakeSeason =
  | 'Jan / Winter'
  | 'Feb – Mar / Spring'
  | 'May – Jun / Summer'
  | 'Jul – Aug / Mid-Year'
  | 'Sep – Oct / Fall';

export type StudyHighlightFlag =
  | '100% English-Taught'
  | 'IELTS 5.5 Accessible'
  | 'Government Scholarships'
  | 'Strong PR Pathway'
  | 'Schengen / EU Mobility'
  | 'Dual-Award UK/AU Degrees';

export interface StudyAbroadDestination {
  id: string;
  slug: string;
  countryName: ApprovedCountryName;
  code: string;
  flagEmoji: string;
  region: StudyRegion;
  currency: string;
  bgImageUrl: string;
  accentColor: string;
  tagline: string;
  overview: string;

  // Live metrics from registry
  universityCount: number;
  courseCount: number;
  internationalStudentsText: string;

  // Cost metrics (normalized USD for live slider & currency conversion)
  tuitionMinUSD: number;
  tuitionMaxUSD: number;
  tuitionAvgUSD: number;
  tuitionDisplayLocal: string;
  livingMonthlyMinUSD: number;
  livingMonthlyMaxUSD: number;
  livingMonthlyAvgUSD: number;
  livingDisplayLocal: string;

  // Work & Visa
  pswYears: number;
  pswTier: PswTier;
  pswLabel: string;
  partTimeWork: string;
  visaProcessingTime: string;

  // Admissions & Intakes
  minIelts: number;
  ieltsLabel: string;
  intakeText: string;
  intakeSeasons: IntakeSeason[];
  topCities: string[];
  popularFields: string[];
  scholarshipHighlights: string[];
  highlightFlags: StudyHighlightFlag[];

  // Editorial notes (QS / IDP / IES inspired)
  bestFor: string;
  campusLifeNote: string;
  featuredRank: number;
}

export const STUDY_ABROAD_MAX_TUITION_USD = 55000;
export const STUDY_ABROAD_MAX_LIVING_USD = 2500;

export const STUDY_ABROAD_REGIONS: StudyRegion[] = [
  'Asia',
  'Europe',
  'Oceania',
  'North America',
];

export const STUDY_ABROAD_PSW_TIERS: PswTier[] = [
  'Up to 4 Years',
  'Up to 3 Years',
  'Up to 2 Years',
  '1 Year / EU Pathway',
];

export const STUDY_ABROAD_INTAKES: IntakeSeason[] = [
  'Jan / Winter',
  'Feb – Mar / Spring',
  'May – Jun / Summer',
  'Jul – Aug / Mid-Year',
  'Sep – Oct / Fall',
];

export const STUDY_ABROAD_HIGHLIGHTS: StudyHighlightFlag[] = [
  '100% English-Taught',
  'IELTS 5.5 Accessible',
  'Government Scholarships',
  'Strong PR Pathway',
  'Schengen / EU Mobility',
  'Dual-Award UK/AU Degrees',
];

interface CountryEnrichment {
  region: StudyRegion;
  tagline: string;
  tuitionMinUSD: number;
  tuitionMaxUSD: number;
  livingMonthlyMinUSD: number;
  livingMonthlyMaxUSD: number;
  livingDisplayLocal: string;
  pswYears: number;
  pswTier: PswTier;
  pswLabel: string;
  partTimeWork: string;
  visaProcessingTime: string;
  minIelts: number;
  ieltsLabel: string;
  intakeSeasons: IntakeSeason[];
  popularFields: string[];
  scholarshipHighlights: string[];
  highlightFlags: StudyHighlightFlag[];
  bestFor: string;
  campusLifeNote: string;
  featuredRank: number;
}

const COUNTRY_ENRICHMENT: Record<ApprovedCountryName, CountryEnrichment> = {
  Malaysia: {
    region: 'Asia',
    tagline: 'UK & Australian branch campuses at one-third the global tuition cost',
    tuitionMinUSD: 3800,
    tuitionMaxUSD: 9500,
    livingMonthlyMinUSD: 400,
    livingMonthlyMaxUSD: 650,
    livingDisplayLocal: 'RM 1,800 – RM 2,800 / mo',
    pswYears: 1,
    pswTier: '1 Year / EU Pathway',
    pswLabel: '1-Year Graduate Pass + Global Transfer Pathways',
    partTimeWork: 'Up to 20 hrs/wk (semester breaks)',
    visaProcessingTime: '4 – 6 weeks (EMGS eVAL)',
    minIelts: 5.0,
    ieltsLabel: 'IELTS 5.0 – 6.0 (MOI / MUET / Intensive English accepted)',
    intakeSeasons: ['Jan / Winter', 'Feb – Mar / Spring', 'May – Jun / Summer', 'Sep – Oct / Fall'],
    popularFields: ['Computer Science & AI', 'Business & Finance', 'Engineering', 'Medicine & Health'],
    scholarshipHighlights: ['MIS Government Scholarship', 'University Merit Waivers (up to 50%)', 'High Achiever Bursaries'],
    highlightFlags: ['100% English-Taught', 'IELTS 5.5 Accessible', 'Government Scholarships', 'Dual-Award UK/AU Degrees'],
    bestFor: 'Affordable UK/AU dual degrees, fast EMGS visa approval & safe halal-friendly living',
    campusLifeNote: 'Kuala Lumpur ranks consistently among QS Best Student Cities for affordability and cosmopolitan campus communities.',
    featuredRank: 1,
  },
  'United Kingdom': {
    region: 'Europe',
    tagline: 'Centuries-old Russell Group excellence & fast-track 1-year Master’s degrees',
    tuitionMinUSD: 17500,
    tuitionMaxUSD: 33000,
    livingMonthlyMinUSD: 1250,
    livingMonthlyMaxUSD: 1950,
    livingDisplayLocal: '£1,023 – £1,483 / mo',
    pswYears: 2,
    pswTier: 'Up to 2 Years',
    pswLabel: '2-Year Graduate Route PSW (3 Years for PhD)',
    partTimeWork: '20 hrs/wk during term, full-time holidays',
    visaProcessingTime: '3 weeks (Priority 5 days)',
    minIelts: 6.0,
    ieltsLabel: 'IELTS 6.0 – 6.5 (OIETC / PTE / MOI accepted at select unis)',
    intakeSeasons: ['Jan / Winter', 'May – Jun / Summer', 'Sep – Oct / Fall'],
    popularFields: ['Business & Analytics', 'Law & Finance', 'Computing & Cyber', 'Public Health'],
    scholarshipHighlights: ['Chevening Scholarship', 'Commonwealth Scholarship', 'GREAT Scholarships (£10,000)'],
    highlightFlags: ['100% English-Taught', 'Government Scholarships'],
    bestFor: '1-year Master’s ROI, global employer prestige & guaranteed 2-year Graduate Route visa',
    campusLifeNote: 'Home to London, Edinburgh, and Manchester — three of the world’s highest-rated QS student cities.',
    featuredRank: 2,
  },
  Australia: {
    region: 'Oceania',
    tagline: 'Group of Eight research leadership, sunny coastal cities & generous PSW rights',
    tuitionMinUSD: 16500,
    tuitionMaxUSD: 31000,
    livingMonthlyMinUSD: 1350,
    livingMonthlyMaxUSD: 2100,
    livingDisplayLocal: 'AUD $2,000 – $3,100 / mo',
    pswYears: 4,
    pswTier: 'Up to 4 Years',
    pswLabel: 'Temporary Graduate Visa (Subclass 485, up to 4 yrs)',
    partTimeWork: '48 hrs/fortnight during study, unlimited breaks',
    visaProcessingTime: '4 – 8 weeks (Subclass 500)',
    minIelts: 6.0,
    ieltsLabel: 'IELTS 6.0 – 6.5 (PTE Academic widely accepted)',
    intakeSeasons: ['Feb – Mar / Spring', 'Jul – Aug / Mid-Year', 'Sep – Oct / Fall'],
    popularFields: ['Data Science & IT', 'Nursing & Healthcare', 'Civil Engineering', 'Accounting & MBA'],
    scholarshipHighlights: ['Australia Awards', 'Destination Australia', '20% – 30% Regional Merit Grants'],
    highlightFlags: ['100% English-Taught', 'Government Scholarships', 'Strong PR Pathway'],
    bestFor: 'High graduate salaries, skilled migration pathways & up to 4-year regional PSW',
    campusLifeNote: 'Melbourne and Sydney sit inside the QS Top 10 Best Student Cities with thriving international student networks.',
    featuredRank: 3,
  },
  Canada: {
    region: 'North America',
    tagline: 'Co-op work-integrated degrees & direct 3-year Post-Graduation Work Permits',
    tuitionMinUSD: 11000,
    tuitionMaxUSD: 27000,
    livingMonthlyMinUSD: 900,
    livingMonthlyMaxUSD: 1550,
    livingDisplayLocal: 'CAD $1,100 – $1,800 / mo',
    pswYears: 3,
    pswTier: 'Up to 3 Years',
    pswLabel: 'Post-Graduation Work Permit (PGWP, up to 3 yrs)',
    partTimeWork: '24 hrs/wk off-campus during term',
    visaProcessingTime: '6 – 10 weeks (IRCC Study Permit)',
    minIelts: 6.0,
    ieltsLabel: 'IELTS 6.0 – 6.5 (Duolingo / PTE accepted)',
    intakeSeasons: ['Jan / Winter', 'May – Jun / Summer', 'Sep – Oct / Fall'],
    popularFields: ['Software Engineering', 'Supply Chain & MBA', 'Health Sciences', 'Clean Energy'],
    scholarshipHighlights: ['Vanier & Lester B. Pearson', 'Provincial Entrance Awards', 'Co-op Paid Placements'],
    highlightFlags: ['100% English-Taught', 'Government Scholarships', 'Strong PR Pathway'],
    bestFor: 'Clear Express Entry & Provincial Nominee PR pathways with paid university co-op terms',
    campusLifeNote: 'Multicultural campuses across Toronto, Halifax, Kelowna, and Fredericton with welcoming student support.',
    featuredRank: 4,
  },
  USA: {
    region: 'North America',
    tagline: 'Unrivaled research funding, flexible majors & 3-year STEM OPT career launch',
    tuitionMinUSD: 15000,
    tuitionMaxUSD: 52000,
    livingMonthlyMinUSD: 1200,
    livingMonthlyMaxUSD: 2300,
    livingDisplayLocal: 'USD $1,200 – $2,300 / mo',
    pswYears: 3,
    pswTier: 'Up to 3 Years',
    pswLabel: 'OPT 1 Year + 24-Month STEM Extension (3 yrs total)',
    partTimeWork: '20 hrs/wk on-campus + CPT internships',
    visaProcessingTime: '2 – 6 weeks (F-1 Interview)',
    minIelts: 6.0,
    ieltsLabel: 'IELTS 6.0 – 6.5 / TOEFL 80+ / Duolingo 105+',
    intakeSeasons: ['Jan / Winter', 'May – Jun / Summer', 'Sep – Oct / Fall'],
    popularFields: ['AI & Computer Science', 'FinTech & Economics', 'Biomedical Engineering', 'Media & Film'],
    scholarshipHighlights: ['Fulbright Foreign Student', 'Merit Presidential Waivers', 'Graduate Assistantships (GA/RA)'],
    highlightFlags: ['100% English-Taught', 'Government Scholarships'],
    bestFor: 'Flexible liberal arts & STEM research innovation with direct Fortune 500 CPT/OPT access',
    campusLifeNote: 'Vibrant residential college towns and innovation corridors across Boston, Washington D.C., and the Northeast.',
    featuredRank: 5,
  },
  'New Zealand': {
    region: 'Oceania',
    tagline: 'All 8 universities ranked in QS Top 3% globally with peaceful outdoor living',
    tuitionMinUSD: 13500,
    tuitionMaxUSD: 23000,
    livingMonthlyMinUSD: 1050,
    livingMonthlyMaxUSD: 1650,
    livingDisplayLocal: 'NZD $1,700 – $2,600 / mo',
    pswYears: 3,
    pswTier: 'Up to 3 Years',
    pswLabel: 'Post-Study Work Visa up to 3 Years',
    partTimeWork: '20 hrs/wk during semester, full-time holidays',
    visaProcessingTime: '4 – 6 weeks (INZ Online)',
    minIelts: 6.0,
    ieltsLabel: 'IELTS 6.0 (UG) / 6.5 (PG) or PTE equivalent',
    intakeSeasons: ['Feb – Mar / Spring', 'Jul – Aug / Mid-Year'],
    popularFields: ['AgriTech & Sustainability', 'Hospitality & Tourism', 'IT & Cloud', 'Civil Engineering'],
    scholarshipHighlights: ['Manaaki New Zealand Scholarship', 'University International Excellence Awards'],
    highlightFlags: ['100% English-Taught', 'Government Scholarships', 'Strong PR Pathway'],
    bestFor: 'Safety, work-life balance, Green List skilled residency & partner work rights for PG',
    campusLifeNote: 'Ranked among the world’s safest countries with close-knit academic mentorship in Auckland and Wellington.',
    featuredRank: 6,
  },
  Finland: {
    region: 'Europe',
    tagline: 'World’s #1 education & happiness index with 2-year EU job seeker residency',
    tuitionMinUSD: 6500,
    tuitionMaxUSD: 13500,
    livingMonthlyMinUSD: 780,
    livingMonthlyMaxUSD: 1150,
    livingDisplayLocal: '€750 – €1,100 / mo',
    pswYears: 2,
    pswTier: 'Up to 2 Years',
    pswLabel: '2-Year Post-Study Job Seeker Residence Permit',
    partTimeWork: '30 hrs/wk average across the year',
    visaProcessingTime: '4 – 8 weeks (Enter Finland)',
    minIelts: 6.0,
    ieltsLabel: 'IELTS 6.0 (UG) / 6.5 (PG) for English-taught degrees',
    intakeSeasons: ['Jan / Winter', 'Jul – Aug / Mid-Year'],
    popularFields: ['Clean Tech & Energy', 'Game Design & ICT', 'Robotics & AI', 'International Business'],
    scholarshipHighlights: ['Finland Scholarship (50% – 100%)', 'Early-Bird Tuition Discounts (up to €3,000)'],
    highlightFlags: ['100% English-Taught', 'Government Scholarships', 'Strong PR Pathway', 'Schengen / EU Mobility'],
    bestFor: 'Nordic tech careers, family-friendly residency & generous 30 hrs/wk student work allowance',
    campusLifeNote: 'Ultra-safe, high-trust Nordic campuses in Helsinki, Tampere, and Turku with digitalized student life.',
    featuredRank: 7,
  },
  Sweden: {
    region: 'Europe',
    tagline: 'Home of Spotify & Nobel innovation with sustainability-led English degrees',
    tuitionMinUSD: 9000,
    tuitionMaxUSD: 15500,
    livingMonthlyMinUSD: 850,
    livingMonthlyMaxUSD: 1250,
    livingDisplayLocal: 'SEK 9,000 – 13,000 / mo',
    pswYears: 1,
    pswTier: '1 Year / EU Pathway',
    pswLabel: '1-Year Job Seeker / Startup Residence Permit',
    partTimeWork: 'No official weekly hour cap during studies',
    visaProcessingTime: '6 – 10 weeks (Migrationsverket)',
    minIelts: 6.5,
    ieltsLabel: 'IELTS 6.5 overall (5.5 min band)',
    intakeSeasons: ['Jan / Winter', 'Jul – Aug / Mid-Year'],
    popularFields: ['Sustainability & Climate', 'Industrial Design', 'Computer Engineering', 'Life Sciences'],
    scholarshipHighlights: ['Swedish Institute (SI) Scholarships', 'University Tuition Waivers (25% – 100%)'],
    highlightFlags: ['100% English-Taught', 'Government Scholarships', 'Schengen / EU Mobility'],
    bestFor: 'Startup ecosystems, unlimited legal student work hours & tuition-free PhD positions',
    campusLifeNote: 'Flat hierarchy, group-based innovation projects, and vibrant student nations in Stockholm, Lund, and Uppsala.',
    featuredRank: 8,
  },
  France: {
    region: 'Europe',
    tagline: 'Triple-accredited Grandes Écoles business schools & subsidized student housing',
    tuitionMinUSD: 4400,
    tuitionMaxUSD: 14500,
    livingMonthlyMinUSD: 820,
    livingMonthlyMaxUSD: 1350,
    livingDisplayLocal: '€750 – €1,250 / mo (CAF housing subsidy available)',
    pswYears: 2,
    pswTier: 'Up to 2 Years',
    pswLabel: 'APS / RECE Job Search Permit (1–2 yrs for Master’s)',
    partTimeWork: '964 hrs/year (~20 hrs/wk)',
    visaProcessingTime: '3 – 5 weeks (Campus France)',
    minIelts: 6.0,
    ieltsLabel: 'IELTS 6.0 (English-taught tracks; no French required to start)',
    intakeSeasons: ['Feb – Mar / Spring', 'Sep – Oct / Fall'],
    popularFields: ['Luxury Brand Management', 'Global Finance & MBA', 'Aerospace & Data', 'Culinary & Hospitality'],
    scholarshipHighlights: ['Eiffel Excellence Scholarship', 'Charpak & Campus France Grants', 'CAF 30% Housing Aid'],
    highlightFlags: ['100% English-Taught', 'Government Scholarships', 'Schengen / EU Mobility'],
    bestFor: 'Elite European business schools, CAF rent subsidies & Schengen travel across 29 countries',
    campusLifeNote: 'Paris, Rennes, and Nancy blend historic architecture with paid corporate alternance internships.',
    featuredRank: 9,
  },
  Cyprus: {
    region: 'Europe',
    tagline: 'Budget-friendly English-taught EU degrees under sunny Mediterranean skies',
    tuitionMinUSD: 3800,
    tuitionMaxUSD: 7800,
    livingMonthlyMinUSD: 520,
    livingMonthlyMaxUSD: 800,
    livingDisplayLocal: '€480 – €750 / mo',
    pswYears: 1,
    pswTier: '1 Year / EU Pathway',
    pswLabel: 'EU Accredited Degree + Regional Career Pathways',
    partTimeWork: '20 hrs/wk during semester, 38 hrs/wk holidays',
    visaProcessingTime: '4 – 6 weeks',
    minIelts: 5.5,
    ieltsLabel: 'IELTS 5.5 or university internal English placement test',
    intakeSeasons: ['Feb – Mar / Spring', 'Sep – Oct / Fall'],
    popularFields: ['Hospitality Management', 'Business Administration', 'Computer Science', 'Maritime Studies'],
    scholarshipHighlights: ['Merit Tuition Discounts (20% – 50%)', 'Athletic & Early Registration Bursaries'],
    highlightFlags: ['100% English-Taught', 'IELTS 5.5 Accessible'],
    bestFor: 'Low-cost European Union higher education with flexible English entry & year-round sunshine',
    campusLifeNote: 'Compact, friendly Mediterranean student hubs in Nicosia and Limassol with high personal safety.',
    featuredRank: 10,
  },
  Hungary: {
    region: 'Europe',
    tagline: 'Stipendium Hungaricum full scholarships & historic Central European campuses',
    tuitionMinUSD: 4400,
    tuitionMaxUSD: 9000,
    livingMonthlyMinUSD: 550,
    livingMonthlyMaxUSD: 850,
    livingDisplayLocal: '€500 – €780 / mo',
    pswYears: 1,
    pswTier: '1 Year / EU Pathway',
    pswLabel: '9-Month Study-to-Work EU Job Seeking Permit',
    partTimeWork: '30 hrs/wk during term, 66 days full-time',
    visaProcessingTime: '4 – 8 weeks (Schengen D Visa)',
    minIelts: 5.5,
    ieltsLabel: 'IELTS 5.5 – 6.0 (Online university English test accepted)',
    intakeSeasons: ['Feb – Mar / Spring', 'Sep – Oct / Fall'],
    popularFields: ['Medicine & Dentistry', 'Economics & Finance', 'Mechatronics', 'Agriculture & Forestry'],
    scholarshipHighlights: ['Stipendium Hungaricum (Full Tuition + Dorm + Stipend)', 'Diaspora & Merit Grants'],
    highlightFlags: ['100% English-Taught', 'IELTS 5.5 Accessible', 'Government Scholarships', 'Schengen / EU Mobility'],
    bestFor: 'Full Stipendium Hungaricum government funding & accredited European medical/business degrees',
    campusLifeNote: 'Budapest and Debrecen combine low European living costs with vibrant student nightlife and Schengen transit.',
    featuredRank: 11,
  },
  Greece: {
    region: 'Europe',
    tagline: 'Accredited UK-validated & European degrees in the cradle of Mediterranean culture',
    tuitionMinUSD: 2000,
    tuitionMaxUSD: 6200,
    livingMonthlyMinUSD: 580,
    livingMonthlyMaxUSD: 880,
    livingDisplayLocal: '€540 – €820 / mo',
    pswYears: 1,
    pswTier: '1 Year / EU Pathway',
    pswLabel: 'EU Residence & Schengen Mobility',
    partTimeWork: '20 hrs/wk during academic term',
    visaProcessingTime: '4 – 6 weeks (Type D Schengen)',
    minIelts: 5.5,
    ieltsLabel: 'IELTS 5.5 – 6.0 for English-medium programs',
    intakeSeasons: ['Feb – Mar / Spring', 'Sep – Oct / Fall'],
    popularFields: ['Shipping & Maritime', 'Tourism & Hospitality', 'Psychology & Arts', 'Business & Computing'],
    scholarshipHighlights: ['IKY State Scholarships', 'UK-Partner Tuition Bursaries'],
    highlightFlags: ['100% English-Taught', 'IELTS 5.5 Accessible', 'Schengen / EU Mobility', 'Dual-Award UK/AU Degrees'],
    bestFor: 'Affordable Schengen living paired with British-validated dual degrees in Athens & Thessaloniki',
    campusLifeNote: 'Historic sunlit campuses with coastal lifestyle, rich cuisine, and easy weekend flights across Europe.',
    featuredRank: 12,
  },
  Malta: {
    region: 'Europe',
    tagline: 'English-speaking EU island hub for FinTech, business & hospitality careers',
    tuitionMinUSD: 5500,
    tuitionMaxUSD: 10000,
    livingMonthlyMinUSD: 700,
    livingMonthlyMaxUSD: 1050,
    livingDisplayLocal: '€650 – €980 / mo',
    pswYears: 1,
    pswTier: '1 Year / EU Pathway',
    pswLabel: '9-Month Post-Study Job Seeker Visa (Schengen)',
    partTimeWork: '20 hrs/wk after first 90 days',
    visaProcessingTime: '4 – 6 weeks (Identità Malta)',
    minIelts: 5.5,
    ieltsLabel: 'IELTS 5.5 – 6.0 (English is an official national language)',
    intakeSeasons: ['Feb – Mar / Spring', 'May – Jun / Summer', 'Sep – Oct / Fall'],
    popularFields: ['FinTech & Banking', 'International Business', 'Tourism & Events', 'Digital Marketing'],
    scholarshipHighlights: ['Malta Government Endeavour Grants', 'Partner College Early-Bird Waivers'],
    highlightFlags: ['100% English-Taught', 'IELTS 5.5 Accessible', 'Schengen / EU Mobility'],
    bestFor: 'Official English-speaking Schengen nation with fast-growing European FinTech & hospitality hiring',
    campusLifeNote: 'Safe island living in St. Julian’s and Valletta where every street sign, business, and campus operates in English.',
    featuredRank: 13,
  },
  'South Korea': {
    region: 'Asia',
    tagline: 'Global robotics & semiconductor powerhouse with fully funded GKS scholarships',
    tuitionMinUSD: 4500,
    tuitionMaxUSD: 9200,
    livingMonthlyMinUSD: 620,
    livingMonthlyMaxUSD: 1000,
    livingDisplayLocal: '₩800,000 – ₩1,300,000 / mo',
    pswYears: 2,
    pswTier: 'Up to 2 Years',
    pswLabel: 'D-10 Job Seeker Visa (up to 2 yrs) → E-7 Work Visa',
    partTimeWork: '20 – 30 hrs/wk (with TOPIK/university approval)',
    visaProcessingTime: '2 – 4 weeks (D-2 Visa)',
    minIelts: 5.5,
    ieltsLabel: 'IELTS 5.5 – 6.5 (English tracks) or TOPIK Level 3+',
    intakeSeasons: ['Feb – Mar / Spring', 'Sep – Oct / Fall'],
    popularFields: ['Semiconductors & AI', 'Media & Global Business', 'Mechanical Engineering', 'Biotech'],
    scholarshipHighlights: ['Global Korea Scholarship (GKS 100%)', 'University Admission Waivers (30% – 100%)'],
    highlightFlags: ['IELTS 5.5 Accessible', 'Government Scholarships'],
    bestFor: 'Full GKS scholarships, world-leading STEM labs & booming global tech careers in Seoul',
    campusLifeNote: 'Seoul sits inside the QS Top 3 Best Student Cities globally with ultra-fast transit and 24/7 campus safety.',
    featuredRank: 14,
  },
  India: {
    region: 'Asia',
    tagline: 'Premier STEM, engineering & medical universities with unmatched affordability',
    tuitionMinUSD: 1600,
    tuitionMaxUSD: 4500,
    livingMonthlyMinUSD: 250,
    livingMonthlyMaxUSD: 480,
    livingDisplayLocal: '₹20,000 – ₹38,000 / mo',
    pswYears: 1,
    pswTier: '1 Year / EU Pathway',
    pswLabel: 'Global Campus Placement & Research Pathways',
    partTimeWork: 'On-campus internships & industrial training',
    visaProcessingTime: '2 – 3 weeks (e-Student Visa)',
    minIelts: 5.0,
    ieltsLabel: 'English-medium HSC / MOI accepted (No IELTS mandatory)',
    intakeSeasons: ['Jul – Aug / Mid-Year'],
    popularFields: ['Computer Engineering', 'Pharmacy & Medicine', 'BBA & Commerce', 'Biotechnology'],
    scholarshipHighlights: ['ICCR Full Scholarships', 'Study in India (SII) Fee Waivers (up to 50%)'],
    highlightFlags: ['100% English-Taught', 'IELTS 5.5 Accessible', 'Government Scholarships'],
    bestFor: 'Ultra-affordable English-medium STEM, pharmacy & engineering degrees close to home',
    campusLifeNote: 'Self-contained residential campuses with multicultural student clubs and strong South Asian cultural familiarity.',
    featuredRank: 15,
  },
};

export function getStudyAbroadDestinations(): StudyAbroadDestination[] {
  return APPROVED_COUNTRY_NAMES.map((countryName) => {
    const meta = COUNTRY_METADATA_REGISTRY[countryName];
    const enrich = COUNTRY_ENRICHMENT[countryName];
    const destDetail = DESTINATION_REGISTRY[meta.studyServiceSlug];

    const matchedUnis = mockUniversities.filter(
      (u) => u.country.toLowerCase() === countryName.toLowerCase()
    );
    const matchedCourses = mockCourses.filter(
      (c) => (c.country || '').toLowerCase() === countryName.toLowerCase()
    );

    const citiesList = meta.citiesText
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    return {
      id: `sa-${meta.code.toLowerCase()}`,
      slug: meta.studyServiceSlug,
      countryName,
      code: meta.code,
      flagEmoji: meta.flagEmoji,
      region: enrich.region,
      currency: meta.currency,
      bgImageUrl: meta.bgImageUrl,
      accentColor: meta.bgColor,
      tagline: enrich.tagline,
      overview: destDetail?.hero.intro || meta.overview,
      universityCount: matchedUnis.length,
      courseCount: matchedCourses.length,
      internationalStudentsText: meta.studentsCountText,
      tuitionMinUSD: enrich.tuitionMinUSD,
      tuitionMaxUSD: enrich.tuitionMaxUSD,
      tuitionAvgUSD: Math.round((enrich.tuitionMinUSD + enrich.tuitionMaxUSD) / 2),
      tuitionDisplayLocal: meta.avgTuitionText,
      livingMonthlyMinUSD: enrich.livingMonthlyMinUSD,
      livingMonthlyMaxUSD: enrich.livingMonthlyMaxUSD,
      livingMonthlyAvgUSD: Math.round(
        (enrich.livingMonthlyMinUSD + enrich.livingMonthlyMaxUSD) / 2
      ),
      livingDisplayLocal: enrich.livingDisplayLocal,
      pswYears: enrich.pswYears,
      pswTier: enrich.pswTier,
      pswLabel: enrich.pswLabel,
      partTimeWork: enrich.partTimeWork,
      visaProcessingTime: enrich.visaProcessingTime,
      minIelts: enrich.minIelts,
      ieltsLabel: enrich.ieltsLabel,
      intakeText: meta.intakeText,
      intakeSeasons: enrich.intakeSeasons,
      topCities: citiesList,
      popularFields: enrich.popularFields,
      scholarshipHighlights: enrich.scholarshipHighlights,
      highlightFlags: enrich.highlightFlags,
      bestFor: enrich.bestFor,
      campusLifeNote: enrich.campusLifeNote,
      featuredRank: enrich.featuredRank,
    };
  }).sort((a, b) => a.featuredRank - b.featuredRank);
}

/**
 * Returns all real partner universities belonging to the currently filtered Study Abroad destinations
 * so the interactive Leaflet UniversityMap renders accurate pins across every filtered country.
 */
export function getUniversitiesForStudyAbroad(
  destinations: StudyAbroadDestination[]
): University[] {
  const allowed = new Set(destinations.map((d) => d.countryName.toLowerCase()));
  return mockUniversities.filter((u) => allowed.has(u.country.toLowerCase()));
}
