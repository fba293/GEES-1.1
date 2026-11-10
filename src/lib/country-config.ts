/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Global Education Expert Services (GEES)
 * Official Country Configuration - Single Source of Truth
 * 
 * Strictly controlled mapping of the 11 approved study destinations:
 * 1. Malaysia
 * 2. United Kingdom
 * 3. Australia
 * 4. New Zealand
 * 5. Cyprus
 * 6. Belgium
 * 7. Finland
 * 8. Greece
 * 9. Mauritius
 * 10. Netherlands
 * 11. India
 */

import { getPartnerUniversitiesByCountry } from '../utils/PartnerUniversityManager.ts';
import { DestinationCountry, University } from '../types/index.ts';

export const APPROVED_COUNTRY_NAMES = [
  'Australia',
  'Canada',
  'Cyprus',
  'Finland',
  'France',
  'Greece',
  'Hungary',
  'India',
  'Malaysia',
  'Malta',
  'New Zealand',
  'South Korea',
  'Sweden',
  'United Kingdom',
  'USA'
] as const;

export type ApprovedCountryName = typeof APPROVED_COUNTRY_NAMES[number];

export interface ApprovedCountryConfig {
  code: string;
  name: ApprovedCountryName;
  flagEmoji: string;
  currency: string;
  citiesText: string;
  studentsCountText: string;
  intakeText: string;
  avgTuitionText: string;
  pswText: string;
  bgImageUrl: string;
  bannerUrl: string;
  overview: string;
  badge: string;
  shortDesc: string;
  studyServiceSlug: string;
  iconName: string;
  bgColor: string;
}

export const COUNTRY_METADATA_REGISTRY: Record<ApprovedCountryName, ApprovedCountryConfig> = {
  'Canada': {
    code: 'CA',
    name: 'Canada',
    flagEmoji: '🇨🇦',
    currency: 'CAD',
    citiesText: 'Toronto, Halifax, Fredericton, Kelowna, Sudbury, Sarnia, Medicine Hat',
    studentsCountText: '500K+ students',
    intakeText: 'Sept, Jan & May',
    avgTuitionText: 'CAD $18,000 - $38,000 / yr',
    pswText: 'Post-Graduation Work Permit (PGWP) up to 3 Years',
    bgImageUrl: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?q=80&w=1665&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    bannerUrl: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?q=80&w=1665&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    overview: 'World-renowned academic institutions, vibrant multicultural cities, and excellent post-graduation work opportunities.',
    badge: '10 Partner Unis',
    shortDesc: '10 partner universities and colleges including Dalhousie, TMU, UNB, Mount Saint Vincent, STU, UBC Okanagan, NIC, Laurentian, Medicine Hat, and Lambton.',
    studyServiceSlug: 'study-in-canada',
    iconName: 'public',
    bgColor: '#d9381e'
  },
  'Cyprus': {
    code: 'CY',
    name: 'Cyprus',
    flagEmoji: '🇨🇾',
    currency: 'EUR',
    citiesText: 'Nicosia, Limassol, Larnaca, Paphos',
    studentsCountText: '40K+ students',
    intakeText: 'Oct & Feb',
    avgTuitionText: '€3,500 - €7,000 / yr',
    pswText: 'EU Degree + Post-Study Career Pathways',
    bgImageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop',
    overview: 'A vibrant European Union education hub in the eastern Mediterranean offering affordable, accredited English-taught degrees.',
    badge: '8 Partner Unis',
    shortDesc: 'Affordable European Union degrees taught in English, Mediterranean lifestyle, and excellent career opportunities across Europe.',
    studyServiceSlug: 'study-in-cyprus',
    iconName: 'wb_sunny',
    bgColor: '#6610f2'
  },
  'Finland': {
    code: 'FI',
    name: 'Finland',
    flagEmoji: '🇫🇮',
    currency: 'EUR',
    citiesText: 'Helsinki, Espoo, Tampere, Turku, Oulu, Jyväskylä',
    studentsCountText: '30K+ students',
    intakeText: 'August & Jan',
    avgTuitionText: '€6,000 - €12,000 / yr',
    pswText: '2-Year Post-Study Job Seeker Visa',
    bgImageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1200&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1200&auto=format&fit=crop',
    overview: 'Consistently ranked the happiest country with the worlds best education system, pioneering clean tech, and high post-study retention.',
    badge: '14 Partner Unis',
    shortDesc: 'Globally acclaimed education system, cutting-edge innovation hubs, English-taught degree programs, and high quality of life.',
    studyServiceSlug: 'study-in-finland',
    iconName: 'ac_unit',
    bgColor: '#0d6efd'
  },
  'Greece': {
    code: 'GR',
    name: 'Greece',
    flagEmoji: '🇬🇷',
    currency: 'EUR',
    citiesText: 'Athens, Thessaloniki, Heraklion, Patras',
    studentsCountText: '35K+ students',
    intakeText: 'Oct & Feb',
    avgTuitionText: '€1,500 - €5,000 / yr',
    pswText: 'EU Residence Permit & Schengen Mobility',
    bgImageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1200&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1200&auto=format&fit=crop',
    overview: 'The historic cradle of higher learning blending European accredited degrees, affordable Mediterranean lifestyle, and rich culture.',
    badge: '6 Partner Unis',
    shortDesc: 'Rich classical heritage combined with modern European degree programs, affordable living costs, and vibrant student life.',
    studyServiceSlug: 'study-in-greece',
    iconName: 'temple_buddhist',
    bgColor: '#e65100'
  },
  'India': {
    code: 'IN',
    name: 'India',
    flagEmoji: '🇮🇳',
    currency: 'INR',
    citiesText: 'Guwahati, New Delhi, Bengaluru, Mumbai, Chennai',
    studentsCountText: '50K+ international',
    intakeText: 'July & August',
    avgTuitionText: '₹120,000 - ₹350,000 / yr',
    pswText: 'Study in India (SII) Visa & Global Placements',
    bgImageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1200&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1200&auto=format&fit=crop',
    overview: 'An emerging global tech powerhouse offering world-renowned STEM, medical, and business programs with exceptionally low tuition and living costs.',
    badge: '1 Partner Uni',
    shortDesc: 'World-class education standards, premier medical & engineering faculties, and exceptionally affordable tuition.',
    studyServiceSlug: 'study-in-india',
    iconName: 'location_city',
    bgColor: '#ffc107'
  },
  'Malaysia': {
    code: 'MY',
    name: 'Malaysia',
    flagEmoji: '🇲🇾',
    currency: 'MYR',
    citiesText: 'Kuala Lumpur, Penang, Johor Bahru, Selangor, Cyberjaya',
    studentsCountText: '170K+ students',
    intakeText: 'March & Oct',
    avgTuitionText: '$4,000 - $9,000 / yr',
    pswText: 'Affordable Global Hub + UK Branch Campuses',
    bgImageUrl: 'https://images.unsplash.com/photo-1508062878650-88b52897f298?q=80&w=1227&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    bannerUrl: 'https://images.unsplash.com/photo-1508062878650-88b52897f298?q=80&w=1227&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    overview: 'The leading educational powerhouse of Southeast Asia, offering dual awards from top UK/Australian universities at one-third the cost.',
    badge: 'Top Asian Hub',
    shortDesc: 'Affordable world-class degrees, dual-award programs with UK/Australia, and streamlined student pass processing in Kuala Lumpur.',
    studyServiceSlug: 'study-in-malaysia',
    iconName: 'flight_takeoff',
    bgColor: '#fbb034'
  },
  'New Zealand': {
    code: 'NZ',
    name: 'New Zealand',
    flagEmoji: '🇳🇿',
    currency: 'NZD',
    citiesText: 'Auckland, Wellington, Christchurch, Dunedin, Hamilton',
    studentsCountText: '120K+ students',
    intakeText: 'Feb & July',
    avgTuitionText: 'NZD $22,000 - $35,000 / yr',
    pswText: 'Post-Study Work Visa up to 3 Years',
    bgImageUrl: 'https://images.zicasso.com/1613b7fe4e02309dcd902b3f19405262.jpg',
    bannerUrl: 'https://images.zicasso.com/1613b7fe4e02309dcd902b3f19405262.jpg',
    overview: 'Consistently ranked among the safest and most peaceful nations on earth, offering world-class universities and pristine natural landscapes.',
    badge: 'Safe & Scenic',
    shortDesc: 'World-class education in innovative institutions like Te Pūkenga, stunning landscapes, and post-study work pathways.',
    studyServiceSlug: 'study-in-new-zealand',
    iconName: 'landscape',
    bgColor: '#0dcaf0'
  },
  'South Korea': {
    code: 'KR',
    name: 'South Korea',
    flagEmoji: '🇰🇷',
    currency: 'KRW',
    citiesText: 'Seoul, Busan, Incheon, Daegu, Daejeon',
    studentsCountText: '200K+ students',
    intakeText: 'March & Sept',
    avgTuitionText: '₩6,000,000 - ₩12,000,000 / yr',
    pswText: 'D-10 Job Seeker Visa & E-7 Professional Employment',
    bgImageUrl: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=1200&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=1200&auto=format&fit=crop',
    overview: 'Global leader in technology, culture (Hallyu), and world-class higher education offering extensive scholarships for international students.',
    badge: 'Tech & K-Culture Hub',
    shortDesc: 'Cutting-edge technology universities, Government Korea Scholarship Program (GKS), and dynamic cultural experiences.',
    studyServiceSlug: 'study-in-south-korea',
    iconName: 'bolt',
    bgColor: '#0047a0'
  },
  'United Kingdom': {
    code: 'UK',
    name: 'United Kingdom',
    flagEmoji: '🇬🇧',
    currency: 'GBP',
    citiesText: 'London, Manchester, Edinburgh, Oxford, Birmingham, Leeds, Glasgow',
    studentsCountText: '600K+ students',
    intakeText: 'Sept & Jan',
    avgTuitionText: '£14,000 - £26,000 / yr',
    pswText: 'PSW 2 Years Guaranteed (3 Years PhD)',
    bgImageUrl: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?q=80&w=1200&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?q=80&w=1200&auto=format&fit=crop',
    overview: 'Centuries of academic tradition, world-renowned research institutions, and the 2-year Graduate Route Post-Study Work Visa.',
    badge: '100 Partner Unis',
    shortDesc: 'World-renowned British education, 1-year master’s degrees, and 2-year Graduate Route Post-Study Work visa privileges.',
    studyServiceSlug: 'study-in-united-kingdom',
    iconName: 'school',
    bgColor: '#003da5'
  },
  'Australia': {
    code: 'AU',
    name: 'Australia',
    flagEmoji: '🇦🇺',
    currency: 'AUD',
    citiesText: 'Sydney, Melbourne, Wollongong, Newcastle, Hobart, Townsville',
    studentsCountText: '500K+ students',
    intakeText: 'Feb & July',
    avgTuitionText: 'AUD $25,000 - $45,000 / yr',
    pswText: 'Temporary Graduate Visa up to 4 Years',
    bgImageUrl: 'https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?q=80&w=2533&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    bannerUrl: 'https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?q=80&w=2533&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    overview: 'World-class higher education, vibrant coastal cities, and excellent post-study work pathways.',
    badge: '10 Partner Unis',
    shortDesc: '10 partner universities including Wollongong, La Trobe Sydney, UTAS, JCU, Charles Sturt, CQUniversity, UNSW, Newcastle, RMIT, and Swinburne.',
    studyServiceSlug: 'study-in-australia',
    iconName: 'public',
    bgColor: '#002b49'
  },
  'France': {
    code: 'FR',
    name: 'France',
    flagEmoji: '🇫🇷',
    currency: 'EUR',
    citiesText: 'Paris, Nancy, Rennes',
    studentsCountText: '350K+ students',
    intakeText: 'Sept & Feb',
    avgTuitionText: '€4,000 - €12,000 / yr',
    pswText: 'Post-Study Work Visa / APS',
    bgImageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop',
    overview: 'World-class higher education, affordable tuition fees, and rich cultural heritage in the heart of Europe.',
    badge: '4 Partner Unis',
    shortDesc: '4 partner business schools and management institutes across Paris, Nancy, and Rennes.',
    studyServiceSlug: 'study-in-france',
    iconName: 'language',
    bgColor: '#002395'
  },
  'Hungary': {
    code: 'HU',
    name: 'Hungary',
    flagEmoji: '🇭🇺',
    currency: 'HUF',
    citiesText: 'Debrecen, Sopron, Budapest',
    studentsCountText: '35K+ students',
    intakeText: 'Sept & Feb',
    avgTuitionText: '€4,000 - €8,000 / yr',
    pswText: 'EU Degree + Post-Study Pathways',
    bgImageUrl: 'https://images.unsplash.com/photo-1549877452-9c387954fbc2?q=80&w=1200&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1549877452-9c387954fbc2?q=80&w=1200&auto=format&fit=crop',
    overview: 'Quality European degrees, affordable cost of living, and historic campuses in Central Europe.',
    badge: '3 Partner Unis',
    shortDesc: '3 official partner universities: University of Debrecen, University of Sopron, and Corvinus University.',
    studyServiceSlug: 'study-in-hungary',
    iconName: 'account_balance',
    bgColor: '#436f4d'
  },
  'Malta': {
    code: 'MT',
    name: 'Malta',
    flagEmoji: '🇲🇹',
    currency: 'EUR',
    citiesText: 'St. Julian’s, Valletta, Sliema',
    studentsCountText: '15K+ students',
    intakeText: 'Oct & Feb',
    avgTuitionText: '€5,000 - €9,000 / yr',
    pswText: 'EU Study & Career Pathways',
    bgImageUrl: 'https://images.unsplash.com/photo-1783703436115-5b02c94944d9?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    bannerUrl: 'https://images.unsplash.com/photo-1783703436115-5b02c94944d9?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    overview: 'English-speaking Mediterranean island offering accredited European higher education and career pathways.',
    badge: '2 Partner Unis',
    shortDesc: '2 official partner institutions: GBS Malta and Malita International College.',
    studyServiceSlug: 'study-in-malta',
    iconName: 'wb_sunny',
    bgColor: '#cc3333'
  },
  'Sweden': {
    code: 'SE',
    name: 'Sweden',
    flagEmoji: '🇸🇪',
    currency: 'SEK',
    citiesText: 'Stockholm, Lund, Uppsala, Gothenburg, Linköping, Jönköping, Umeå, Malmö',
    studentsCountText: '40K+ students',
    intakeText: 'August & January',
    avgTuitionText: 'SEK 90,000 - 150,000 / yr',
    pswText: 'Job Seeker Residence Permit for 1 Year',
    bgImageUrl: 'https://images.unsplash.com/photo-1730653784025-2266f3baa0f8?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    bannerUrl: 'https://images.unsplash.com/photo-1730653784025-2266f3baa0f8?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    overview: 'World-leading innovation, progressive education system, and sustainable Scandinavian lifestyle.',
    badge: '10 Partner Unis',
    shortDesc: '10 leading research universities and institutes in Sweden.',
    studyServiceSlug: 'study-in-sweden',
    iconName: 'eco',
    bgColor: '#006aa7'
  },
  'USA': {
    code: 'US',
    name: 'USA',
    flagEmoji: '🇺🇸',
    currency: 'USD',
    citiesText: 'Wilkes-Barre, Washington D.C., Baltimore, Boston, Pittsburgh, Hoboken',
    studentsCountText: '1M+ students',
    intakeText: 'Fall, Spring & Summer',
    avgTuitionText: 'USD $15,000 - $58,000 / yr',
    pswText: 'OPT up to 3 Years for STEM Majors',
    bgImageUrl: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?q=80&w=1200&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?q=80&w=1200&auto=format&fit=crop',
    overview: 'Home to the world’s top-ranked universities, unmatched campus life, and global career opportunities.',
    badge: '14 Partner Unis',
    shortDesc: '14 partner universities and colleges, OPT work opportunities, and unparalleled STEM & business degrees.',
    studyServiceSlug: 'study-in-usa',
    iconName: 'flag',
    bgColor: '#bf0a30'
  }
};

/**
 * Returns the dynamic count of partner universities for a country
 */
export function getCountryPartnerCount(countryName: string): number {
  return getPartnerUniversitiesByCountry(countryName).length;
}

/**
 * Returns formatted text for partner university count, dynamically calculated
 */
export function getCountryUnisCountText(countryName: string): string {
  const count = getCountryPartnerCount(countryName);
  if (count === 1) return '1 University';
  if (count > 1) return `${count} Universities`;
  return 'Expanding Network';
}

/**
 * Returns a DestinationCountry object for a given approved country
 * with dynamic university counts and partner metadata
 */
export function buildDestinationCountry(countryName: ApprovedCountryName): DestinationCountry {
  const meta = COUNTRY_METADATA_REGISTRY[countryName];
  const count = getCountryPartnerCount(countryName);
  const countText = count > 0 ? (count === 1 ? '1 University' : `${count} Universities`) : meta.badge;

  return {
    code: meta.code,
    name: meta.name,
    flagEmoji: meta.flagEmoji,
    unisCountText: countText,
    studentsCountText: meta.studentsCountText,
    intakeText: meta.intakeText,
    avgTuitionText: meta.avgTuitionText,
    pswText: meta.pswText,
    citiesText: meta.citiesText,
    bgImageUrl: meta.bgImageUrl,
    overview: meta.overview
  };
}

/**
 * Returns all 11 approved DestinationCountry items with dynamically calculated counts
 */
export function getAllApprovedDestinations(): DestinationCountry[] {
  return APPROVED_COUNTRY_NAMES.map(name => buildDestinationCountry(name));
}

/**
 * Returns an approved country's metadata by name (case-insensitive)
 */
export function getApprovedCountryConfig(name: string): ApprovedCountryConfig | undefined {
  const normalized = name.trim().toLowerCase();
  const match = APPROVED_COUNTRY_NAMES.find(c => c.toLowerCase() === normalized);
  return match ? COUNTRY_METADATA_REGISTRY[match] : undefined;
}

export default {
  APPROVED_COUNTRY_NAMES,
  COUNTRY_METADATA_REGISTRY,
  getCountryPartnerCount,
  getCountryUnisCountText,
  buildDestinationCountry,
  getAllApprovedDestinations,
  getApprovedCountryConfig
};
