/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Global Education Expert Services - Seeded Global Education News & Visa Bulletins
 */

import { NewsArticle } from '../types/index.ts';

export const mockNews: NewsArticle[] = [
  {
    id: 'news-1',
    slug: 'uk-student-visa-financial-proof-updates-2026',
    title: 'UK Home Office Updates Financial Requirement Thresholds for Student Visa Applicants',
    category: 'Visa Update',
    countryTag: 'United Kingdom',
    flagEmoji: '🇬🇧',
    publishedDate: 'October 10, 2026',
    readTime: '3 min read',
    author: 'GEES UK Immigration Desk',
    source: 'UK Visas & Immigration (UKVI)',
    isUrgent: true,
    featured: true,
    summary: 'The UK Home Office has announced revised maintenance fund requirements for international students applying for the Student Visa (Subclass Route). Here is what students from Bangladesh, Malaysia, and worldwide need to know.',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
    keyPoints: [
      'Outer London monthly maintenance fund revised to £1,085 per month (up to 9 months).',
      'Inner London monthly maintenance fund revised to £1,380 per month (up to 9 months).',
      'Electronic Bank Statements must strictly show funds held continuously for 28 consecutive days.',
      'Sponsor financial declarations must match CAS details exactly to avoid delays.'
    ],
    content: [
      'The United Kingdom Home Office has issued fresh guidance regarding maintenance thresholds for international students applying for 2026/2027 academic intakes. These changes ensure students have adequate living support while pursuing higher education across British universities.',
      'For applicants applying from South Asia, Southeast Asia, and the Middle East, bank statements submitted during visa appointments must reflect funds maintained for at least 28 consecutive days ending no earlier than 31 days prior to the application date.',
      'GEES certified visa counselors recommend verifying CAS deposit receipts before booking biometric appointments at VFS Global centers in Dhaka, Chittagong, Kuala Lumpur, and Dubai.'
    ]
  },
  {
    id: 'news-2',
    slug: 'australia-genuine-student-gs-criterion-guide',
    title: 'Australia Department of Home Affairs Clarifies Genuine Student (GS) Guidelines',
    category: 'Immigration Policy',
    countryTag: 'Australia',
    flagEmoji: '🇦🇺',
    publishedDate: 'October 08, 2026',
    readTime: '4 min read',
    author: 'GEES Australia Compliance Team',
    source: 'Australia Dept of Home Affairs',
    isUrgent: false,
    featured: true,
    summary: 'Detailed Breakdown of Australia’s Genuine Student (GS) assessment framework replacing the former GTE requirement, emphasizing realistic study pathways and regional employment options.',
    imageUrl: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=1200&q=80',
    keyPoints: [
      'Replaces GTE statement with targeted 150-word answer prompts in the ImmiAccount portal.',
      'Focuses on academic history, realistic progression, and value of qualifications to career goals back home or internationally.',
      'Post-study work rights remain active for accredited Bachelor, Masters, and PhD graduates in regional universities.'
    ],
    content: [
      'Australia continues to welcome talented international students into its top Go8 and regional universities. The Genuine Student (GS) criterion is designed to ensure applicants are genuine students seeking high-quality qualifications.',
      'Key areas evaluated include current circumstances, ties to home country, reasons for choosing Australia over local alternatives, and expected career trajectory upon graduation.',
      'GEES Australia Desk provides free mock GS review sessions to ensure applicant responses comply with immigration standards.'
    ]
  },
  {
    id: 'news-3',
    slug: 'malaysia-top-universities-100-percent-scholarship-scheme-2027',
    title: 'Ministry of Higher Education Malaysia Unveils International Excellence Scholarships',
    category: 'Scholarship Alert',
    countryTag: 'Malaysia',
    flagEmoji: '🇲🇾',
    publishedDate: 'October 05, 2026',
    readTime: '3 min read',
    author: 'GEES Regional Academic Desk',
    source: 'MOHE Malaysia',
    isUrgent: false,
    featured: false,
    summary: 'Malaysian Ministry of Higher Education announces up to 100% tuition waivers for high-achieving international applicants targeting Engineering, Computer Science, and Business courses.',
    imageUrl: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80',
    keyPoints: [
      'Covers tuition fees for top-tier Malaysian public and branch campuses (Monash Malaysia, Taylor’s, Sunway, APU).',
      'Minimum academic threshold: CGPA 3.50+ or equivalent A-Level / IB grades.',
      'Applications open through official GEES processing centers with priority EMGS student pass approval.'
    ],
    content: [
      'Malaysia has reinforced its position as Southeast Asia’s premier higher education hub with the launch of the 2027 International Excellence Scholarship Scheme.',
      'Students enrolling through GEES partner institutions receive accelerated EMGS visa processing, complimentary airport pick-up services, and guaranteed campus accommodation allocations.'
    ]
  },
  {
    id: 'news-4',
    slug: 'gees-expands-direct-partnerships-with-25-new-global-universities',
    title: 'GEES Global Education Announces 25 New Direct University Tie-Ups across Europe & New Zealand',
    category: 'GEES Announcement',
    countryTag: 'Global',
    flagEmoji: '🌐',
    publishedDate: 'October 02, 2026',
    readTime: '2 min read',
    author: 'GEES Executive Office',
    source: 'GEES Global Media Relations',
    isUrgent: false,
    featured: false,
    summary: 'GEES expands institutional partnerships across New Zealand, Finland, Netherlands, and Germany, enabling direct application fee waivers and fast-track offer letters for qualified students.',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
    keyPoints: [
      '25 newly added universities in Auckland, Wellington, Helsinki, Amsterdam, and Berlin.',
      'Students applying through GEES qualify for application fee waivers ($100–$250 value).',
      'Direct admission decisions within 5–10 business days for complete profile submissions.'
    ],
    content: [
      'In a major step forward for prospective international students, GEES Global Education Expert Services has signed official direct agreements with 25 distinguished universities across Europe and Australasia.',
      'These partnerships streamline application processing, guarantee scholarship consideration for eligible candidates, and grant access to exclusive university interview sessions at upcoming GEES expos.'
    ]
  }
];
