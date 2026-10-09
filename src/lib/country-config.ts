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
  'Malaysia',
  'United Kingdom',
  'Australia',
  'New Zealand',
  'Cyprus',
  'Belgium',
  'Finland',
  'Greece',
  'Mauritius',
  'Netherlands',
  'India'
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
    bgImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZd5n2tNuLtUbnkYxop24Dh6YXppoO22AesWMq9Da4U_hH8TSpxJJNI9Y_MBNshJzyKQcfIb8mPPWk0Mn0SVK1To7DY3uHnMLWe0B1YurXdva4mDR3KbXcAyqOo_xz3y4dg9yRenJJnoK3fziRYHUzfqdQ0JTWL0jBgdRRTMm6dwqPU72Xo-wGUcIwNmYEaiAnE_G-NZ9a3pU9GpcdoC78ZFo0PT9BQEGrMrHNQK4240l6syDpLlX3uw',
    bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZd5n2tNuLtUbnkYxop24Dh6YXppoO22AesWMq9Da4U_hH8TSpxJJNI9Y_MBNshJzyKQcfIb8mPPWk0Mn0SVK1To7DY3uHnMLWe0B1YurXdva4mDR3KbXcAyqOo_xz3y4dg9yRenJJnoK3fziRYHUzfqdQ0JTWL0jBgdRRTMm6dwqPU72Xo-wGUcIwNmYEaiAnE_G-NZ9a3pU9GpcdoC78ZFo0PT9BQEGrMrHNQK4240l6syDpLlX3uw',
    overview: 'The leading educational powerhouse of Southeast Asia, offering dual awards from top UK/Australian universities at one-third the cost.',
    badge: 'Top Asian Hub',
    shortDesc: 'Affordable world-class degrees, dual-award programs with UK/Australia, and streamlined student pass processing in Kuala Lumpur.',
    studyServiceSlug: 'study-in-malaysia',
    iconName: 'flight_takeoff',
    bgColor: '#fbb034'
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
    bgImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAn8SidT19xm-Ih2icXb6JpNK_tQqdmojSuthrT5rDbG33SBb7vwcaRsxzZQDYleO10CZl1E0vB-sQ8wKZahU3IiPEGxtlovG9Onwsd82BLPr0dLH6BN51_3NZysN6eCCyfA8USlwCV7w6HHENlvg8LFYqCTJ0tOF5aV_o8HfnK8YGZNsqH11KNogvM5lNGr1lD3K302jYGqKgVsPBOFL05mru2O5htVnecp2iyz7m6MYHtNlyRE_bPRg',
    bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAn8SidT19xm-Ih2icXb6JpNK_tQqdmojSuthrT5rDbG33SBb7vwcaRsxzZQDYleO10CZl1E0vB-sQ8wKZahU3IiPEGxtlovG9Onwsd82BLPr0dLH6BN51_3NZysN6eCCyfA8USlwCV7w6HHENlvg8LFYqCTJ0tOF5aV_o8HfnK8YGZNsqH11KNogvM5lNGr1lD3K302jYGqKgVsPBOFL05mru2O5htVnecp2iyz7m6MYHtNlyRE_bPRg',
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
    citiesText: 'Melbourne, Sydney, Brisbane, Perth, Adelaide',
    studentsCountText: '700K+ students',
    intakeText: 'Feb & July',
    avgTuitionText: 'AUD $24,000 - $45,000 / yr',
    pswText: 'Subclass 485 Temporary Graduate Visa 2-4 Years',
    bgImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHYlN5zXQ-dzjZHyIlwvfZcc2UWexdtmJFkTXVGzcaLfA_7dJQv7S82aFKUGhZRLClGa4BUZBdZ1QZudkqRCZ4doIlOOrnWPNoj3cdp-6-_Xfa3ec3Stitcm67A-2aNdthXMyfUs1D3GlgQnaVdfXExgN0pNouD198US-ufi3wNKdZ3X7zM8ZRo1v9zM_3SuvLZHkqSMJqA8t5MCLGzk_D6KMM6StuU1E0Nc7BW-7PZHiFJ849Af4pvA',
    bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHYlN5zXQ-dzjZHyIlwvfZcc2UWexdtmJFkTXVGzcaLfA_7dJQv7S82aFKUGhZRLClGa4BUZBdZ1QZudkqRCZ4doIlOOrnWPNoj3cdp-6-_Xfa3ec3Stitcm67A-2aNdthXMyfUs1D3GlgQnaVdfXExgN0pNouD198US-ufi3wNKdZ3X7zM8ZRo1v9zM_3SuvLZHkqSMJqA8t5MCLGzk_D6KMM6StuU1E0Nc7BW-7PZHiFJ849Af4pvA',
    overview: 'World-leading Group of Eight institutions, sunny lifestyle, protected minimum student wage rates, and generous graduate visas.',
    badge: 'Group of Eight',
    shortDesc: 'Prestigious Group of Eight universities, exceptional lifestyle, part-time work rights, and post-study work visas.',
    studyServiceSlug: 'study-in-australia',
    iconName: 'public',
    bgColor: '#198754'
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
    bgImageUrl: 'https://images.unsplash.com/photo-1507699622108-4be3ab695d3f?q=80&w=1200&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1507699622108-4be3ab695d3f?q=80&w=1200&auto=format&fit=crop',
    overview: 'Consistently ranked among the safest and most peaceful nations on earth, offering world-class universities and pristine natural landscapes.',
    badge: 'Safe & Scenic',
    shortDesc: 'World-class education in innovative institutions like Te Pūkenga, stunning landscapes, and post-study work pathways.',
    studyServiceSlug: 'study-in-new-zealand',
    iconName: 'landscape',
    bgColor: '#0dcaf0'
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
  'Belgium': {
    code: 'BE',
    name: 'Belgium',
    flagEmoji: '🇧🇪',
    currency: 'EUR',
    citiesText: 'Brussels, Leuven, Ghent, Antwerp, Liège',
    studentsCountText: '50K+ students',
    intakeText: 'Sept & Feb',
    avgTuitionText: '€1,000 - €4,500 / yr',
    pswText: '1-Year European Search Year Visa',
    bgImageUrl: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1200&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1200&auto=format&fit=crop',
    overview: 'The heart of the European Union, home to world-renowned research powerhouses like KU Leuven and unparalleled international diplomacy links.',
    badge: 'Heart of Europe',
    shortDesc: 'Multilingual academic excellence in Brussels and Flanders, rich cultural heritage, and central European mobility.',
    studyServiceSlug: 'study-in-belgium',
    iconName: 'castle',
    bgColor: '#d63384'
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
  'Mauritius': {
    code: 'MU',
    name: 'Mauritius',
    flagEmoji: '🇲🇺',
    currency: 'USD',
    citiesText: 'Port Louis, Moka, Rose Hill, Grand Baie',
    studentsCountText: '15K+ students',
    intakeText: 'Sept & March',
    avgTuitionText: '$3,000 - $6,500 / yr',
    pswText: 'YEP Post-Study Work Permit Scheme',
    bgImageUrl: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=1200&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=1200&auto=format&fit=crop',
    overview: 'A safe, tropical bilingual island and rising African higher-education capital hosting official branch campuses of top UK & French universities.',
    badge: 'Tropical Study Haven',
    shortDesc: 'Safe, bilingual island nation hosting international branch campuses of UK and French universities with affordable tuition.',
    studyServiceSlug: 'study-in-mauritius',
    iconName: 'beach_access',
    bgColor: '#20c997'
  },
  'Netherlands': {
    code: 'NL',
    name: 'Netherlands',
    flagEmoji: '🇳🇱',
    currency: 'EUR',
    citiesText: 'Amsterdam, Rotterdam, Utrecht, Eindhoven, Delft',
    studentsCountText: '122K+ students',
    intakeText: 'Sept & Feb',
    avgTuitionText: '€8,000 - €16,000 / yr',
    pswText: 'Zoekjaar (1-Year Orientation Year Visa)',
    bgImageUrl: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?q=80&w=1200&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?q=80&w=1200&auto=format&fit=crop',
    overview: 'Continental Europe’s leader in English-taught programs, boasting 13 universities in the global top 200 and a booming tech ecosystem.',
    badge: 'English-Taught Leader',
    shortDesc: 'Over 2,100 English-taught programs, highly international campuses, vibrant innovation ecosystems, and orientation year visas.',
    studyServiceSlug: 'study-in-netherlands',
    iconName: 'directions_bike',
    bgColor: '#fd7e14'
  },
  'India': {
    code: 'IN',
    name: 'India',
    flagEmoji: '🇮🇳',
    currency: 'INR',
    citiesText: 'Guwahati, New Delhi, Bengaluru, Mumbai, Chennai',
    studentsCountText: '50K+ international',
    intakeText: 'July & August',
    avgTuitionText: '$1,500 - $4,500 / yr',
    pswText: 'Study in India (SII) Visa & Global Placements',
    bgImageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1200&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1200&auto=format&fit=crop',
    overview: 'An emerging global tech powerhouse offering world-renowned STEM, medical, and business programs with exceptionally low tuition and living costs.',
    badge: '1 Partner Uni',
    shortDesc: 'World-class education standards, premier medical & engineering faculties, and exceptionally affordable tuition.',
    studyServiceSlug: 'study-in-india',
    iconName: 'location_city',
    bgColor: '#ffc107'
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
