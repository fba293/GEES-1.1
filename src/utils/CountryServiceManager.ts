/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Global Education Expert Services (GEES)
 * Official CountryServiceManager Utility
 * 
 * Centralized Single Source of Truth for the 11 officially partnered study destinations:
 * 1. Malaysia (MY)
 * 2. United Kingdom (UK)
 * 3. Australia (AU)
 * 4. New Zealand (NZ)
 * 5. Cyprus (CY)
 * 6. Belgium (BE)
 * 7. Finland (FI)
 * 8. Greece (GR)
 * 9. Mauritius (MU)
 * 10. Netherlands (NL)
 * 11. India (IN)
 * 
 * Provides consistent metadata, high-resolution visual assets, service mappings,
 * and filtering utilities across all pages including ServicesView and countries.html.
 */

import { DestinationCountry, ServiceItem } from '../types/index.ts';
import { MenuItem } from '../components/ui/connoisseur-stack-interactor.tsx';

export interface OfficialCountryData extends DestinationCountry {
  currency: string;
  studyServiceSlug: string;
  badge: string;
  shortDesc: string;
  popularUniversities: string[];
  bannerUrl: string;
  iconName: string;
  bgColor: string;
}

import { 
  APPROVED_COUNTRY_NAMES, 
  COUNTRY_METADATA_REGISTRY, 
  ApprovedCountryName 
} from '../lib/country-config.ts';
import { getPartnerUniversitiesByCountry } from './PartnerUniversityManager.ts';

export const OFFICIAL_COUNTRY_NAMES = APPROVED_COUNTRY_NAMES;
export type OfficialCountryName = ApprovedCountryName;

export const OFFICIAL_COUNTRIES: OfficialCountryData[] = APPROVED_COUNTRY_NAMES.map((name) => {
  const meta = COUNTRY_METADATA_REGISTRY[name];
  const partnerUnis = getPartnerUniversitiesByCountry(name);
  const count = partnerUnis.length;
  const countText = count > 0 ? (count === 1 ? '1 University' : `${count} Universities`) : meta.badge;
  const popular = partnerUnis.length > 0
    ? partnerUnis.slice(0, 4).map((u) => u.name)
    : [meta.badge];

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
    bannerUrl: meta.bannerUrl,
    overview: meta.overview,
    currency: meta.currency,
    studyServiceSlug: meta.studyServiceSlug,
    badge: meta.badge,
    shortDesc: meta.shortDesc,
    popularUniversities: popular,
    iconName: meta.iconName,
    bgColor: meta.bgColor
  };
});


/**
 * Service Manager class to query, format and guarantee country validity
 */
export class CountryServiceManager {
  /**
   * Return all 11 official countries with full metadata
   */
  static getCountries(): OfficialCountryData[] {
    return OFFICIAL_COUNTRIES;
  }

  /**
   * Return official country names
   */
  static getCountryNames(): string[] {
    return OFFICIAL_COUNTRIES.map(c => c.name);
  }

  /**
   * Check if a country name belongs to the 11 official partners
   */
  static isOfficialCountry(countryName?: string | null): boolean {
    if (!countryName) return false;
    const normalized = countryName.trim().toLowerCase();
    return OFFICIAL_COUNTRIES.some(c => 
      c.name.toLowerCase() === normalized || 
      c.code.toLowerCase() === normalized
    );
  }

  /**
   * Filter any array of objects with a country property to only official destinations
   */
  static filterToOfficialCountries<T>(
    items: T[], 
    getCountryProp: (item: T) => string | undefined | null
  ): T[] {
    return items.filter(item => {
      const country = getCountryProp(item);
      return country ? this.isOfficialCountry(country) : false;
    });
  }

  /**
   * Lookup country by name or code
   */
  static getCountry(identifier: string): OfficialCountryData | undefined {
    const query = identifier.trim().toLowerCase();
    return OFFICIAL_COUNTRIES.find(c => 
      c.name.toLowerCase() === query || 
      c.code.toLowerCase() === query ||
      c.studyServiceSlug.toLowerCase() === query
    );
  }

  /**
   * Search official countries by keyword (name, cities, features)
   */
  static searchCountries(query: string): OfficialCountryData[] {
    if (!query || !query.trim()) return OFFICIAL_COUNTRIES;
    const q = query.toLowerCase().trim();
    return OFFICIAL_COUNTRIES.filter(c => 
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.citiesText.toLowerCase().includes(q) ||
      c.overview.toLowerCase().includes(q) ||
      c.badge.toLowerCase().includes(q)
    );
  }

  /**
   * Return the 11 study destination ServiceItems for ServicesView
   */
  static getCountryServiceItems(): ServiceItem[] {
    return OFFICIAL_COUNTRIES.map((c, index) => ({
      id: `srv-${20 + index}`,
      title: `Study in ${c.name}`,
      slug: c.studyServiceSlug,
      category: 'Admissions' as const, // Categorized under study destinations/admissions
      badge: c.badge,
      desc: c.shortDesc,
      bgColor: c.bgColor,
      iconName: c.iconName,
      imageUrl: c.bgImageUrl
    }));
  }

  /**
   * Return default MenuItem array for ConnoisseurStackInteractor or ServicesView
   */
  static getDefaultCountryMenuItems(): MenuItem[] {
    const clipVariants = ['clip-original', 'clip-hexagons', 'clip-pixels'];
    return OFFICIAL_COUNTRIES.map((c, index) => ({
      num: String(index + 1).padStart(2, '0'),
      name: `STUDY IN ${c.name.toUpperCase()}`,
      clipId: clipVariants[index % clipVariants.length],
      image: c.bgImageUrl,
      category: 'Study Destinations',
      desc: c.shortDesc,
      badge: c.badge,
      slug: c.studyServiceSlug
    }));
  }

  /**
   * Return country options for selects and dropdowns
   */
  static getDropdownOptions(): { label: string; value: string; flag: string; code: string }[] {
    return OFFICIAL_COUNTRIES.map(c => ({
      label: c.name,
      value: c.name,
      flag: c.flagEmoji,
      code: c.code
    }));
  }
}

export default CountryServiceManager;
