/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Global Education Expert Services (GEES)
 * Structured Data Generator Utility for Search Engines & AI Discovery
 *
 * Adheres strictly to Schema.org standards & Google Search Guidelines using
 * the official production domain: https://globaleducationexpert.com
 */

import { SITE_URL, SITE_NAME, OFFICIAL_PHONE, OFFICIAL_EMAIL, SOCIAL_PROFILES, getCanonicalUrl } from '../lib/seo-config.ts';
import { StudyDestinationData } from '../data/destinationDataRegistry.ts';

export interface SchemaOrgGraph {
  '@context': string;
  '@graph': any[];
}

/**
 * Generates comprehensive, valid JSON-LD graph structure for a GEES Study Destination Page.
 */
export function generateDestinationSchemaGraph(data: StudyDestinationData): SchemaOrgGraph {
  const canonicalUrl = getCanonicalUrl(data.slug);

  // 1. GEES Educational Consultancy Organization Entity
  const organizationEntity = {
    '@type': 'EducationalOrganization',
    '@id': `${SITE_URL}/#organization`,
    'name': SITE_NAME,
    'alternateName': 'GEES International Education Consultancy',
    'url': SITE_URL,
    'logo': {
      '@type': 'ImageObject',
      'url': `${SITE_URL}/logo.png`,
      'caption': 'GEES Logo'
    },
    'description': 'Leading international student recruitment and education consultancy in Bangladesh specializing in university admissions, student visas, and career counseling.',
    'telephone': OFFICIAL_PHONE,
    'email': OFFICIAL_EMAIL,
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': 'Dhaka',
      'addressCountry': 'BD'
    },
    'sameAs': SOCIAL_PROFILES
  };

  // 2. WebSite Entity
  const websiteEntity = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    'url': SITE_URL,
    'name': SITE_NAME,
    'description': 'Official portal for Global Education Expert Services (GEES) - Study abroad admissions, university rankings, and visa assistance.',
    'publisher': {
      '@id': `${SITE_URL}/#organization`
    },
    'inLanguage': 'en-US'
  };

  // 3. WebPage Entity for the Study Destination Page
  const webpageEntity = {
    '@type': 'WebPage',
    '@id': `${canonicalUrl}#webpage`,
    'url': canonicalUrl,
    'name': data.seo.title,
    'description': data.seo.description,
    'isPartOf': {
      '@id': `${SITE_URL}/#website`
    },
    'about': {
      '@type': 'Country',
      'name': data.countryName
    },
    'primaryImageOfPage': {
      '@type': 'ImageObject',
      'url': data.hero.imageUrl
    },
    'inLanguage': 'en-US',
    'datePublished': '2026-01-01',
    'dateModified': '2026-10-15'
  };

  // 4. BreadcrumbList Entity
  const breadcrumbEntity = {
    '@type': 'BreadcrumbList',
    '@id': `${canonicalUrl}#breadcrumb`,
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': SITE_URL
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Study Destinations',
        'item': `${SITE_URL}/countries.html`
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': `Study in ${data.countryName}`,
        'item': canonicalUrl
      }
    ]
  };

  // 5. FAQPage Entity (AEO & AI Search grounding)
  const faqEntity = {
    '@type': 'FAQPage',
    '@id': `${canonicalUrl}#faq`,
    'mainEntity': data.faqs.map((faq) => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      organizationEntity,
      websiteEntity,
      webpageEntity,
      breadcrumbEntity,
      faqEntity
    ]
  };
}

export default {
  generateDestinationSchemaGraph
};
