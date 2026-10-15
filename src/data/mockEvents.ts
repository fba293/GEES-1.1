/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Global Education Expert Services - Seeded Events Database
 */

import { EventItem } from '../types/index.ts';

export const mockEvents: EventItem[] = [
  {
    id: 'evt-1',
    title: 'GEES UK & Australia Grand Education Expo 2026',
    slug: 'uk-australia-grand-expo-2026',
    type: 'Spot Assessment Fair',
    locationType: 'Dhaka',
    venueName: 'Green City Regency, Level 10, Kakrail, Dhaka',
    venueAddress: 'Road 27/1, Level 10, Kakrail, Dhaka 1000, Bangladesh',
    dateText: 'Saturday, November 14, 2026',
    timeText: '11:00 AM – 5:00 PM (BST)',
    isUpcoming: true,
    featured: true,
    bannerUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    participatingUniversities: [
      { name: 'University of Wollongong', country: 'Australia', flagEmoji: '🇦🇺' },
      { name: 'University of Essex', country: 'United Kingdom', flagEmoji: '🇬🇧' },
      { name: 'De Montfort University', country: 'United Kingdom', flagEmoji: '🇬🇧' },
      { name: 'Teesside University', country: 'United Kingdom', flagEmoji: '🇬🇧' },
      { name: 'Macquarie University', country: 'Australia', flagEmoji: '🇦🇺' }
    ],
    highlights: [
      'Direct 1-on-1 interaction with official international university delegates',
      'On-the-spot academic profile assessment & conditional offer letter issuance',
      '100% Application Fee Waiver for all registered event attendees',
      'Scholarship evaluations ranging from £2,000 up to 50% tuition waivers'
    ],
    description: 'Meet official admission delegates from top UK and Australian universities under one roof at the GEES Kakrail Executive Suite. Bring your academic transcripts, certificates, passport copy, and IELTS/PTE scores (if available) for immediate spot assessment and instant application processing.',
    benefits: [
      'Free 1-on-1 counseling session with Founder Fahad Bin Abdullah',
      'Spot application processing with priority CAS & COE issuance',
      'Free bank solvency & financial documentation checklist',
      'Complimentary study abroad guidebook & visa interview checklist'
    ]
  },
  {
    id: 'evt-2',
    title: 'Malaysia Top Universities Spot Assessment & Credit Transfer Day',
    slug: 'malaysia-top-universities-spot-assessment',
    type: 'Spot Assessment Fair',
    locationType: 'Malaysia',
    venueName: 'GEES Regional Hub - USJ 19 City Mall, Subang Jaya',
    venueAddress: 'Level 1, USJ 19 City Mall, Subang Jaya, Selangor 47620, Malaysia',
    dateText: 'Wednesday, November 18, 2026',
    timeText: '2:00 PM – 6:00 PM (MYT)',
    isUpcoming: true,
    featured: true,
    bannerUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
    participatingUniversities: [
      { name: 'APU (Asia Pacific University)', country: 'Malaysia', flagEmoji: '🇲🇾' },
      { name: "Taylor's University", country: 'Malaysia', flagEmoji: '🇲🇾' },
      { name: 'Sunway University', country: 'Malaysia', flagEmoji: '🇲🇾' },
      { name: 'Monash University Malaysia', country: 'Malaysia', flagEmoji: '🇲🇾' }
    ],
    highlights: [
      'Direct interaction with EMGS visa experts and Malaysian university admissions',
      'Dual-degree options with UK & Australian partner universities',
      'Special 15%–30% merit bursaries for high-achieving O/A-Level & HSC graduates',
      'Fast-track VAL (Visa Approval Letter) guidance in under 14 working days'
    ],
    description: 'Discover world-class, affordable higher education in Malaysia. Join GEES counselors and university admission officers in Subang Jaya to evaluate bachelor, master, and credit transfer pathways to Australia and UK campus branches.',
    benefits: [
      'On-site EMGS visa application screening',
      'On-campus hostel and apartment reservation support',
      'Zero application charges & instant eligibility verification'
    ]
  },
  {
    id: 'evt-3',
    title: 'UK Student Visa & Financial Solvency Masterclass 2026',
    slug: 'uk-student-visa-financial-solvency-masterclass',
    type: 'Visa & Scholarship Clinic',
    locationType: 'Hybrid',
    venueName: 'Dhaka Office & Live Stream via Zoom',
    venueAddress: 'Kakrail Suite & Zoom Webinar Room #891-204',
    dateText: 'Friday, November 27, 2026',
    timeText: '4:00 PM – 6:00 PM (BST)',
    isUpcoming: true,
    featured: false,
    bannerUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
    participatingUniversities: [
      { name: 'UKVI Compliance Panel', country: 'United Kingdom', flagEmoji: '🇬🇧' },
      { name: 'GEES Visa Advisory Board', country: 'Global', flagEmoji: '🌐' }
    ],
    highlights: [
      'Led by Visa Compliance Lead Nusrat Jahan & Senior Counselors',
      'In-depth breakdown of UKVI 28-day financial holding rules & bank solvency',
      'Mock credibility interview sessions with live feedback',
      'Common visa refusal mistakes and how to avoid them completely'
    ],
    description: 'Master the UK student visa application process with 98% audited success guidelines. Learn exactly how to present your bank statements, sponsorship affidavits, source of funds, and pass the UKVI credibility interview seamlessly.',
    benefits: [
      'Sample financial affidavit templates & bank letter formats',
      'Personalized document audit checklist',
      'Live Q&A session with former UK international students'
    ]
  },
  {
    id: 'evt-4',
    title: 'Australia GS Statement & Regional Post-Study Work Clinic',
    slug: 'australia-gs-statement-post-study-work-clinic',
    type: 'Webinar',
    locationType: 'Virtual',
    venueName: 'Online Live Interactive Webinar',
    venueAddress: 'Zoom Meeting Room ID sent upon registration',
    dateText: 'Tuesday, December 01, 2026',
    timeText: '7:00 PM – 8:30 PM (BST)',
    isUpcoming: true,
    featured: false,
    bannerUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80',
    participatingUniversities: [
      { name: 'University of Wollongong', country: 'Australia', flagEmoji: '🇦🇺' },
      { name: 'Macquarie University', country: 'Australia', flagEmoji: '🇦🇺' },
      { name: 'Swinburne University', country: 'Australia', flagEmoji: '🇦🇺' }
    ],
    highlights: [
      'Step-by-step drafting workshop for the new Genuine Student (GS) assessment',
      'Unpacking 2026 Subclass 500 financial thresholds & GTE requirements',
      'Regional study perks: Extra 1–2 year Post-Study Work (PSW) visa extensions'
    ],
    description: 'An exclusive digital workshop designed for students aiming for Australian top-tier universities. Get direct tips on crafting a high-scoring GS statement that satisfies both university compliance and Department of Home Affairs guidelines.',
    benefits: [
      'Free 1-on-1 GS draft proofreading by GEES Senior Counselor Syed Ekhlas',
      'List of low-risk regional study hubs with extended work rights'
    ]
  },
  {
    id: 'evt-5',
    title: 'Finland, Belgium & European Higher Education Virtual Summit',
    slug: 'europe-higher-education-virtual-summit',
    type: 'Roadshow',
    locationType: 'Virtual',
    venueName: 'Global European Education Portal',
    venueAddress: 'Online Zoom Conference Room',
    dateText: 'Thursday, December 10, 2026',
    timeText: '5:00 PM – 7:30 PM (BST)',
    isUpcoming: true,
    featured: false,
    bannerUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    participatingUniversities: [
      { name: 'HAMK University of Applied Sciences', country: 'Finland', flagEmoji: '🇫🇮' },
      { name: 'Ghent University', country: 'Belgium', flagEmoji: '🇧🇪' },
      { name: 'University of Twente', country: 'Netherlands', flagEmoji: '🇳🇱' }
    ],
    highlights: [
      'Explore tuition-free and affordable English-taught degree programs in Europe',
      'Post-study job seeker permits (2-year Finland residence permit upon graduation)',
      'Family dependent visa rights for Master’s & PhD candidates'
    ],
    description: 'Discover the European advantage. Learn about high-tech career opportunities in Finland, Netherlands, Belgium, and Greece with flexible admission criteria and generous post-study stayback options.',
    benefits: [
      'Complete breakdown of European tuition fees & living expenses',
      'Residence permit checklist & embassy appointment scheduling guidance'
    ]
  },
  {
    id: 'evt-6',
    title: 'IELTS & PTE Score Boost Diagnostic Strategy Workshop',
    slug: 'ielts-pte-score-boost-workshop',
    type: 'IELTS Workshop',
    locationType: 'Dhaka',
    venueName: 'GEES Kakrail Test Prep Lab',
    venueAddress: 'Level 10, Green City Regency, Kakrail, Dhaka',
    dateText: 'Saturday, December 19, 2026',
    timeText: '10:30 AM – 1:30 PM (BST)',
    isUpcoming: true,
    featured: false,
    bannerUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
    participatingUniversities: [
      { name: 'GEES Test Prep Center', country: 'Global', flagEmoji: '🎓' }
    ],
    highlights: [
      'Free IELTS Speaking & Writing diagnostic evaluation',
      'PTE AI Scoring tricks for 65+ (IELTS 7.0 equivalent) in 3 weeks',
      'MOI (Medium of Instruction) waiver eligibility check for selected universities'
    ],
    description: 'Struggling with IELTS Writing Task 2 or PTE Speaking Read Aloud? Join our certified master trainers at the GEES Kakrail lab for a 3-hour intensive strategy workout and diagnostic test.',
    benefits: [
      'Free mock test voucher & personalized score report',
      'Exclusive GEES IELTS/PTE preparation bundle PDF'
    ]
  }
];
