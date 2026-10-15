/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Global Education Expert Services (GEES)
 * Official Production Domain & Centralized SEO Configuration
 *
 * LOCK THE OFFICIAL PRODUCTION ORIGIN:
 * https://globaleducationexpert.com
 */

export const SITE_URL = 'https://globaleducationexpert.com';
export const SITE_NAME = 'Global Education Expert Services (GEES)';
export const SITE_SHORT_NAME = 'GEES';
export const OFFICIAL_PHONE = '+8801805529578';
export const OFFICIAL_EMAIL = 'info@globaleducationexpert.com';
export const OFFICIAL_WHATSAPP = '8801805529578';

export const SOCIAL_PROFILES = [
  'https://facebook.com/geesbd',
  'https://linkedin.com/company/geesbd',
  'https://youtube.com/@geesbd'
];

/**
 * Normalizes and formats a path into an absolute canonical URL on the official domain.
 */
export function getCanonicalUrl(path: string): string {
  let cleanPath = (path || '').trim();
  cleanPath = cleanPath.replace(/^https?:\/\/[^\/]+/, '');
  cleanPath = cleanPath.replace(/^\/+/, '').replace(/\.html$/, '');

  if (!cleanPath) {
    return SITE_URL;
  }

  return `${SITE_URL}/${cleanPath}`;
}

export default {
  SITE_URL,
  SITE_NAME,
  SITE_SHORT_NAME,
  OFFICIAL_PHONE,
  OFFICIAL_EMAIL,
  OFFICIAL_WHATSAPP,
  SOCIAL_PROFILES,
  getCanonicalUrl
};
