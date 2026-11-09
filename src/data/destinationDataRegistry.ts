/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Global Education Expert Services (GEES)
 * Official Study Destination Data Registry & Single Source of Truth
 * 
 * Provides verified structured data for all 11 approved study destinations:
 * 1. Malaysia (Reference Implementation)
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

import { ApprovedCountryName, COUNTRY_METADATA_REGISTRY } from '../lib/country-config.ts';

export interface QuickFactItem {
  label: string;
  value: string;
  subtext: string;
  icon: string;
}

export interface BenefitCard {
  title: string;
  desc: string;
  icon: string;
}

export interface LivingCostItem {
  category: string;
  monthlyCost: string;
  details: string;
}

export interface ScholarshipEntry {
  name: string;
  provider: string;
  eligibility: string;
  coverageType: 'Full' | 'Partial' | 'Tuition Waiver' | 'Stipend';
  coverageDetails: string;
  deadline?: string;
  officialUrl?: string;
}

export interface IntakeInfo {
  name: string;
  startMonth: string;
  deadline: string;
  status: 'Open' | 'Upcoming' | 'Closed';
  notes: string;
}

export interface VisaStep {
  stepNumber: number;
  title: string;
  description: string;
  processingTime?: string;
}

export interface DestinationFaq {
  question: string;
  answer: string;
  keyPoints?: string[];
}

export interface StudyDestinationData {
  slug: string;
  countryName: ApprovedCountryName;
  flagEmoji: string;
  code: string;
  currency: string;
  hero: {
    title: string;
    subtitle: string;
    intro: string;
    imageUrl: string;
  };
  quickFacts: QuickFactItem[];
  whyStudy: {
    intro: string;
    benefits: BenefitCard[];
  };
  admissionRequirements: {
    undergraduate: string[];
    postgraduate: string[];
    foundation?: string[];
    englishProficiency: {
      ielts: string;
      alternatives: string[];
      notes: string;
    };
    requiredDocuments: string[];
  };
  costOfStudy: {
    currency: string;
    tuitionRangeAnnual: string;
    livingCostMonthly: string;
    breakdown: LivingCostItem[];
  };
  scholarships: ScholarshipEntry[];
  intakes: IntakeInfo[];
  visaProcess: VisaStep[];
  faqs: DestinationFaq[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
  };
  lastVerifiedDate: string;
}

// ----------------------------------------------------------------------------
// FULL REGISTRY DEFINITION
// ----------------------------------------------------------------------------

export const DESTINATION_REGISTRY: Record<string, StudyDestinationData> = {
  'study-in-canada': {
    slug: 'study-in-canada',
    countryName: 'Canada',
    flagEmoji: '🇨🇦',
    code: 'CA',
    currency: 'CAD',
    hero: {
      title: 'Study in Canada from Bangladesh',
      subtitle: '10 Partner Universities & Colleges, Post-Graduation Work Permits (PGWP) & Top Quality of Life',
      intro: 'Canada is one of the top global destinations for international students, offering world-renowned education, multicultural communities, and up to 3-year post-graduation work opportunities across Ontario, British Columbia, Nova Scotia, New Brunswick, and Alberta.',
      imageUrl: 'https://images.unsplash.com/photo-1503614472348-731f8845d7c2?q=80&w=1200&auto=format&fit=crop'
    },
    quickFacts: [
      { label: 'Annual Tuition Fees', value: 'CAD $14,000 – $32,000', subtext: '10 partner universities and colleges', icon: 'payments' },
      { label: 'Monthly Living Expenses', value: 'CAD $1,100 – $1,800', subtext: 'Halifax, Toronto, Kelowna, Fredericton', icon: 'account_balance_wallet' },
      { label: 'Primary Intakes', value: 'September, January & May', subtext: 'Fall, Winter & Summer terms', icon: 'calendar_month' },
      { label: 'Post-Study Work Visa', value: 'Up to 3 Years PGWP', subtext: 'Direct pathway to Canadian PR', icon: 'card_travel' }
    ],
    whyStudy: {
      intro: 'Globally respected qualifications, welcoming multicultural society, and clear immigration pathways.',
      benefits: [
        { title: '10 Partner Universities & Colleges in Canada', desc: 'Direct representation with Dalhousie University, Toronto Metropolitan University (TMU), University of New Brunswick (UNB), Mount Saint Vincent, St. Thomas, UBC Okanagan, North Island College, Laurentian, Medicine Hat College, and Lambton College.', icon: 'school' },
        { title: 'Post-Graduation Work Permit (PGWP)', desc: 'Gain up to 3 years of unrestricted Canadian work experience after graduation.', icon: 'work_outline' },
        { title: 'World-Class Education & Co-op Opportunities', desc: 'Degrees recognized internationally by employers with built-in cooperative education placements.', icon: 'military_tech' }
      ]
    },
    admissionRequirements: {
      undergraduate: ['HSC / A-Levels with strong grades', 'IELTS 6.0 - 6.5 overall (Duolingo / PTE also accepted)'],
      postgraduate: ['Bachelor’s degree CGPA 2.75 - 3.00+', 'IELTS 6.5 or equivalent'],
      englishProficiency: { ielts: 'Overall 6.0 – 6.5', alternatives: ['TOEFL 85-90', 'PTE 58-60', 'Duolingo 110+'], notes: 'Direct entry requirements vary by institution; college diplomas accept IELTS 6.0.' },
      requiredDocuments: ['Valid Passport', 'Academic Transcripts & Certificates', 'IELTS / Language Scorecard', 'Statement of Purpose', 'Financial Solvency Proof']
    },
    costOfStudy: {
      currency: 'CAD',
      tuitionRangeAnnual: 'CAD $14,000 – $32,000 / year',
      livingCostMonthly: 'CAD $1,100 – $1,800 / month',
      breakdown: [{ category: 'Student Housing', monthlyCost: 'CAD $550 – $1,100', details: 'On-campus residence or apartment sharing in Atlantic or Ontario cities' }]
    },
    scholarships: [],
    intakes: [
      { name: 'Fall Intake', startMonth: 'September', deadline: '15 January - 1 March', status: 'Open', notes: 'Primary academic intake with full program offerings.' },
      { name: 'Winter Intake', startMonth: 'January', deadline: '15 September', status: 'Open', notes: 'Major secondary intake across partner colleges and universities.' }
    ],
    visaProcess: [{ stepNumber: 1, title: 'IRCC Study Permit Application', description: 'Apply online through IRCC with acceptance letter, Provincial Attestation Letter (PAL) where required, biometrics, and medical clearance.' }],
    faqs: [
      { question: 'Which universities and colleges in Canada are represented by GEES?', answer: 'GEES officially represents 10 institutions: Dalhousie University, Toronto Metropolitan University, University of New Brunswick, Mount Saint Vincent University, St. Thomas University, University of British Columbia (Okanagan), North Island College, Laurentian University, Medicine Hat College, and Lambton College.' },
      { question: 'Can international students work while studying in Canada?', answer: 'Yes, international students holding a valid study permit can work up to 24 hours per week off-campus during academic sessions and full-time during scheduled breaks.' }
    ],
    seo: {
      title: 'Study in Canada from Bangladesh | 10 Partner Universities, Fees & PGWP | GEES',
      description: 'Study in Canada from Bangladesh with GEES. Explore 10 partner institutions including Dalhousie, TMU, UNB, UBC Okanagan, and Lambton College with PGWP guidance.',
      keywords: ['Study in Canada from Bangladesh', 'Canada partner universities GEES', 'Dalhousie University GEES', 'Toronto Metropolitan University GEES', 'Lambton College GEES']
    },
    lastVerifiedDate: 'October 2026'
  },
  'study-in-south-korea': {
    slug: 'study-in-south-korea',
    countryName: 'South Korea',
    flagEmoji: '🇰🇷',
    code: 'KR',
    currency: 'KRW',
    hero: {
      title: 'Study in South Korea from Bangladesh',
      subtitle: 'Cutting-Edge Tech Universities, Government Scholarships (GKS) & Dynamic K-Culture',
      intro: 'South Korea is a global innovation leader offering world-class STEM education, generous government scholarships, English-taught degree tracks, and excellent career pathways.',
      imageUrl: 'https://images.unsplash.com/photo-1538485399068-d0aa6e579f94?q=80&w=1200&auto=format&fit=crop'
    },
    quickFacts: [
      { label: 'Annual Tuition Fees', value: '₩6,000,000 – ₩12,000,000', subtext: 'Top research universities in Seoul & Busan', icon: 'payments' },
      { label: 'Monthly Living Expenses', value: '₩800,000 – ₩1,300,000', subtext: 'Accommodation, food & transport', icon: 'account_balance_wallet' },
      { label: 'Primary Intakes', value: 'March & September', subtext: 'Spring & Fall semesters', icon: 'calendar_month' },
      { label: 'Post-Study Work Visa', value: 'D-10 Job Seeker & E-7 Visa', subtext: 'Employment in tech & global corporations', icon: 'card_travel' }
    ],
    whyStudy: {
      intro: 'World-leading technology ecosystems, generous scholarship support, and safe, vibrant metropolitan living.',
      benefits: [
        { title: 'Global Government Scholarships (GKS)', desc: 'Fully funded tuition and living stipends for outstanding international students.', icon: 'card_giftcard' },
        { title: 'Advanced Tech & Research', desc: 'Study at world-class engineering and business institutions like KAIST, SNU, and Yonsei.', icon: 'bolt' }
      ]
    },
    admissionRequirements: {
      undergraduate: ['High School Diploma with excellent grades', 'TOPIK or IELTS 5.5+ / English track available'],
      postgraduate: ['Bachelor’s degree', 'IELTS 6.5 or TOPIK Level 4+'],
      englishProficiency: { ielts: 'Overall 5.5 - 6.5', alternatives: ['TOEFL 80', 'TOPIK Level 3+'], notes: 'English-taught tracks available.' },
      requiredDocuments: ['Passport', 'Academic Transcripts', 'Language Test Score', 'Personal Statement', 'Recommendation Letters']
    },
    costOfStudy: {
      currency: 'KRW',
      tuitionRangeAnnual: '₩6,000,000 – ₩12,000,000 / year',
      livingCostMonthly: '₩800,000 – ₩1,300,000 / month',
      breakdown: [{ category: 'University Dormitory', monthlyCost: '₩300,000 – ₩600,000', details: 'On-campus housing options' }]
    },
    scholarships: [],
    intakes: [{ name: 'March Spring Intake', startMonth: 'March', deadline: '30 November', status: 'Open', notes: 'Primary spring intake.' }],
    visaProcess: [{ stepNumber: 1, title: 'D-2 Student Visa Issuance', description: 'Receive Certificate of Admission (CoA) and apply at Korean Embassy.' }],
    faqs: [{ question: 'Can I study in South Korea without knowing Korean?', answer: 'Yes, many universities offer specialized English-track undergraduate and graduate programs.' }],
    seo: {
      title: 'Study in South Korea from Bangladesh | Universities, GKS Scholarship | GEES',
      description: 'Study in South Korea from Bangladesh with GEES. Explore English-taught programs, GKS scholarships, D-2 visas, and tech universities.',
      keywords: ['Study in South Korea from Bangladesh', 'GKS scholarship Korea', 'Korean student visa D2', 'GEES Korea']
    },
    lastVerifiedDate: 'October 2026'
  },
  'study-in-malaysia': {
    slug: 'study-in-malaysia',
    countryName: 'Malaysia',
    flagEmoji: '🇲🇾',
    code: 'MY',
    currency: 'MYR',
    hero: {
      title: 'Study in Malaysia from Bangladesh',
      subtitle: 'World-Class UK & Australian Dual Degrees at 1/3rd the Cost in Kuala Lumpur',
      intro: 'Malaysia has emerged as Southeast Asia’s top higher education capital. Bangladeshi students enjoy high visa approval rates, 100% English-taught programs, branch campuses of British and Australian universities, and affordable living costs without sacrificing quality.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZd5n2tNuLtUbnkYxop24Dh6YXppoO22AesWMq9Da4U_hH8TSpxJJNI9Y_MBNshJzyKQcfIb8mPPWk0Mn0SVK1To7DY3uHnMLWe0B1YurXdva4mDR3KbXcAyqOo_xz3y4dg9yRenJJnoK3fziRYHUzfqdQ0JTWL0jBgdRRTMm6dwqPU72Xo-wGUcIwNmYEaiAnE_G-NZ9a3pU9GpcdoC78ZFo0PT9BQEGrMrHNQK4240l6syDpLlX3uw'
    },
    quickFacts: [
      {
        label: 'Annual Tuition Fees',
        value: 'RM 18,000 – RM 42,000',
        subtext: 'Approx. $4,000 – $9,000 USD / year',
        icon: 'payments'
      },
      {
        label: 'Monthly Living Expenses',
        value: 'RM 1,800 – RM 2,800',
        subtext: 'Includes accommodation, food & transit',
        icon: 'account_balance_wallet'
      },
      {
        label: 'Primary Intakes',
        value: 'March, July & October',
        subtext: 'Multiple flexible term intakes',
        icon: 'calendar_month'
      },
      {
        label: 'Teaching Language',
        value: '100% English',
        subtext: 'No Bahasa Malaysia required for classes',
        icon: 'translate'
      },
      {
        label: 'Degree Durations',
        value: '3 Yrs (Bachelors) / 1.5 Yrs (Masters)',
        subtext: 'Direct 3+0 UK/AU degree pathways',
        icon: 'schedule'
      },
      {
        label: 'Scholarship Coverage',
        value: 'Up to 50% Tuition Waiver',
        subtext: 'Merit-based awards for HSC / O/A Levels',
        icon: 'card_membership'
      }
    ],
    whyStudy: {
      intro: 'Malaysia combines British, Australian, and American academic excellence with tropical living, cultural diversity, and unmatched affordability for Bangladeshi families.',
      benefits: [
        {
          title: 'UK & Australian Dual Award Degrees',
          desc: 'Earn identical degree certificates from top UK and Australian partner universities (e.g. University of Nottingham, Monash University, Heriot-Watt) while studying in Kuala Lumpur at one-third the cost.',
          icon: 'workspace_premium'
        },
        {
          title: 'Structured Student Visa Process',
          desc: 'Visa decisions are made solely by official immigration authorities (EMGS / Immigration Department of Malaysia). GEES provides comprehensive document verification and submission guidance.',
          icon: 'verified'
        },
        {
          title: 'Affordable World-Class Standard',
          desc: 'Tuition and living costs are significantly lower than Western destinations while maintaining strict MQA (Malaysian Qualifications Agency) international accreditation.',
          icon: 'savings'
        },
        {
          title: '100% English Medium Environment',
          desc: 'All university lectures, exams, and campus life are conducted in English, with English widely spoken across Kuala Lumpur, Penang, and Selangor.',
          icon: 'record_voice_over'
        },
        {
          title: 'Global Career & Internship Links',
          desc: 'Malaysia hosts regional headquarters for Fortune 500 multinationals including Intel, Dell, HSBC, Huawei, and Grab, offering vibrant internship opportunities.',
          icon: 'business_center'
        },
        {
          title: 'Safe, Multicultural & Halal Friendly',
          desc: 'Ranked among Asia’s safest countries with abundant halal food options, modern infrastructure, and a welcoming international student community.',
          icon: 'family_restroom'
        }
      ]
    },
    admissionRequirements: {
      undergraduate: [
        'HSC Certificate with Minimum GPA 3.50 out of 5.00 or A-Levels with 2 C grades',
        'SSC & HSC Marksheets certified by the Board / Ministry',
        'Official Academic Recommendation Letter from Previous Principal or Lecturer',
        'Statement of Purpose (SOP) tailored to selected university and course'
      ],
      postgraduate: [
        'Recognized Bachelor’s Degree with Minimum CGPA 2.50 to 2.75 out of 4.00',
        'Official University Academic Transcripts and Graduation Certificate',
        'Updated Professional CV & 2 Academic/Professional Recommendation Letters',
        'Research Proposal (required for Research Masters & PhD candidates)'
      ],
      foundation: [
        'SSC Certificate with Minimum GPA 3.00 out of 5.00 or O-Levels with 5 passes',
        'For O-Level candidates: Minimum C grade in English & Mathematics'
      ],
      englishProficiency: {
        ielts: 'Overall 5.5 – 6.5 (depending on university and field)',
        alternatives: [
          'PTE Academic: 42 – 58',
          'TOEFL iBT: 46 – 79',
          'Duolingo English Test (DET): 95 – 115',
          'Medium of Instruction (MOI) Certificate from selected recognized institutions'
        ],
        notes: 'Students without IELTS can sit for the university’s internal English Placement Test or enroll in pre-sessional English courses upon arrival.'
      },
      requiredDocuments: [
        'Valid Passport (all pages scan, minimum 18 months remaining validity)',
        'Academic Certificates & Transcripts (SSC, HSC, Bachelor’s as applicable)',
        'IELTS / English Proficiency Score Card (if available)',
        'Passport Size Photographs (Blue & White background, EMGS specification)',
        'Statement of Purpose (SOP) & Updated Academic CV',
        'Medical Self-Declaration Form (EMGS Requirement)'
      ]
    },
    costOfStudy: {
      currency: 'MYR',
      tuitionRangeAnnual: 'RM 18,000 – RM 42,000 (USD $4,000 – $9,000)',
      livingCostMonthly: 'RM 1,800 – RM 2,800 (USD $400 – $600)',
      breakdown: [
        {
          category: 'Accommodation (On-Campus Hostel or Off-Campus Condo)',
          monthlyCost: 'RM 600 – RM 1,200',
          details: 'Shared air-conditioned room or private studio apartment in Cyberjaya / Subang'
        },
        {
          category: 'Food & Groceries',
          monthlyCost: 'RM 700 – RM 1,000',
          details: 'Halal dining, campus cafeterias, and local grocery markets'
        },
        {
          category: 'Local Transport (LRT, MRT, RapidKL & Grab)',
          monthlyCost: 'RM 100 – RM 200',
          details: 'Student concession card available for public transit in Kuala Lumpur'
        },
        {
          category: 'Utilities, Internet & Mobile Data',
          monthlyCost: 'RM 150 – RM 250',
          details: 'High-speed fiber broadband and unlimited local mobile data'
        },
        {
          category: 'Personal Expenses & Recreation',
          monthlyCost: 'RM 250 – RM 400',
          details: 'Books, study supplies, leisure, and personal healthcare'
        }
      ]
    },
    scholarships: [
      {
        name: 'GEES Global Academic Merit Award',
        provider: 'GEES Partner Universities Consortium',
        eligibility: 'Bangladeshi HSC GPA 4.80+ or A-Level AAA/AAB',
        coverageType: 'Tuition Waiver',
        coverageDetails: '25% – 50% waiver on year 1 tuition fees across selected Malaysian partner institutions',
        deadline: '30 Days Before Intake',
        officialUrl: 'https://globaleducationexpert.com'
      },
      {
        name: 'Malaysian International Scholarship (MIS)',
        provider: 'Ministry of Higher Education Malaysia (MOHE)',
        eligibility: 'Master’s & PhD candidates with outstanding CGPA 3.50+',
        coverageType: 'Full',
        coverageDetails: 'Full tuition fee waiver + RM 1,500 monthly living allowance + air travel ticket',
        deadline: 'Annual MOHE Window (April-May)',
        officialUrl: 'https://mohe.gov.my'
      },
      {
        name: 'University Vice-Chancellor Excellence Scholarship',
        provider: 'Taylor’s, Sunway, Asia Pacific University (APU)',
        eligibility: 'High academic achievers applying for Bachelor’s or Master’s programs',
        coverageType: 'Partial',
        coverageDetails: 'RM 5,000 to 30% reduction on total program tuition fees',
        deadline: 'Rolling Assessment Upon Admission'
      }
    ],
    intakes: [
      {
        name: 'Spring Primary Intake',
        startMonth: 'March / April',
        deadline: '15 January',
        status: 'Open',
        notes: 'Ideal for HSC passed candidates and spring applicants. Maximum course availability.'
      },
      {
        name: 'Summer Secondary Intake',
        startMonth: 'July / August',
        deadline: '15 May',
        status: 'Upcoming',
        notes: 'Popular for mid-year transfers and intensive pre-sessional English entry.'
      },
      {
        name: 'Autumn Major Intake',
        startMonth: 'October / November',
        deadline: '15 August',
        status: 'Upcoming',
        notes: 'Largest intake term matching global academic calendar for all faculties.'
      }
    ],
    visaProcess: [
      {
        stepNumber: 1,
        title: 'Free Profile Evaluation & University Shortlisting',
        description: 'Our senior GEES counselors analyze your SSC/HSC transcripts, English level, and budget to select the best Malaysian partner universities.',
        processingTime: '1 - 2 Days'
      },
      {
        stepNumber: 2,
        title: 'Application Submission & Offer Letter Issuance',
        description: 'GEES directly submits your certified application packet to Malaysian university admissions officers, securing your Offer Letter.',
        processingTime: '3 - 7 Working Days'
      },
      {
        stepNumber: 3,
        title: 'EMGS Visa Approval Letter (VAL) Processing',
        description: 'We lodge your student visa application online with Education Malaysia Global Services (EMGS). Receive your e-VAL once approved.',
        processingTime: '14 - 21 Working Days'
      },
      {
        stepNumber: 4,
        title: 'Single Entry Visa (SEV) Stamping in Dhaka',
        description: 'Submit your passport & e-VAL to the Malaysian High Commission in Dhaka for Single Entry Visa stamping prior to travel.',
        processingTime: '3 - 5 Working Days'
      },
      {
        stepNumber: 5,
        title: 'Pre-Departure Briefing & Airport Arrival Support',
        description: 'GEES provides pre-departure guidelines, currency exchange advice, airport pickup arrangement, and university hostel check-in.',
        processingTime: 'Final Week Before Flight'
      }
    ],
    faqs: [
      {
        question: 'How much does it cost to study in Malaysia for Bangladeshi students?',
        answer: 'Annual tuition fees range between RM 18,000 and RM 42,000 (approx. $4,000 to $9,000 USD / BDT 4.8 to 10.8 Lakhs per year). Living expenses in Kuala Lumpur average RM 1,800 to RM 2,800 (approx. $400 to $600 USD) per month.',
        keyPoints: [
          'Tuition fees are 60-70% lower than UK/Australia campuses',
          'Pay tuition in affordable semester instalments',
          'Halal dining and affordable student apartment options'
        ]
      },
      {
        question: 'Can I study in Malaysia without IELTS?',
        answer: 'Yes! While standard IELTS 5.5 - 6.5 is preferred, many Malaysian partner universities accept PTE Academic, Duolingo English Test (DET), Medium of Instruction (MOI) certificates, or allow students to take an internal university English Placement Test upon arrival.',
        keyPoints: [
          'MOI certificates accepted from recognized Bangladeshi English-medium institutions',
          'Duolingo DET scores widely accepted for quick online entry',
          'Pre-sessional English courses available on campus if required'
        ]
      },
      {
        question: 'Is part-time work allowed for international students in Malaysia?',
        answer: 'Yes. International students in Malaysia are permitted to work part-time for up to 20 hours per week during semester breaks, festive holidays, or vacations over 7 days, subject to immigration approval and academic status.',
        keyPoints: [
          'Work permitted in restaurants, petrol kiosks, mini-markets, and hotels',
          'Requires recommendation from university international office',
          'Great opportunity to build international communication skills'
        ]
      },
      {
        question: 'How long does the Malaysian student visa (EMGS VAL) process take?',
        answer: 'The EMGS e-VAL (Visa Approval Letter) digital process typically takes between 14 to 21 working days once all certified documents and medical declarations are uploaded.',
        keyPoints: [
          'Transparent digital tracking via the official EMGS portal',
          'GEES compliance team conducts 100% pre-check on documents',
          'No embassy physical interview required for e-VAL issuance'
        ]
      },
      {
        question: 'What is a 3+0 Dual Degree program in Malaysia?',
        answer: 'A 3+0 program allows students to complete an entire 3-year British or Australian Bachelor’s degree at a Malaysian partner university campus in Kuala Lumpur, graduating with the exact same university degree certificate issued in the UK or Australia.',
        keyPoints: [
          'Save over BDT 50+ Lakhs in total education costs',
          'Option to credit-transfer to UK/Australia after Year 1 or Year 2',
          'Identical parchment degree certificate with no mention of off-campus location'
        ]
      }
    ],
    seo: {
      title: 'Study in Malaysia from Bangladesh | Universities, Costs & Admission | GEES',
      description: 'Explore studying in Malaysia from Bangladesh. Compare top partner universities, tuition fees, scholarships, EMGS student visa process, and entry requirements with GEES.',
      keywords: ['Study in Malaysia', 'Study in Malaysia from Bangladesh', 'Malaysian university tuition fees', 'EMGS student visa Bangladesh', 'GEES Malaysia admission', 'UK degree in Malaysia']
    },
    lastVerifiedDate: 'October 2026'
  },

  // ----------------------------------------------------------------------------
  // UNITED KINGDOM
  // ----------------------------------------------------------------------------
  'study-in-united-kingdom': {
    slug: 'study-in-united-kingdom',
    countryName: 'United Kingdom',
    flagEmoji: '🇬🇧',
    code: 'UK',
    currency: 'GBP',
    hero: {
      title: 'Study in the United Kingdom from Bangladesh',
      subtitle: 'World-Renowned British Degrees & 2-Year Graduate Route Post-Study Work Visa',
      intro: 'The UK remains the pinnacle of international higher education. Complete a 1-year Master’s or 3-year Bachelor’s degree at top British universities with generous scholarships and 2-year Graduate Route work visa privileges.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAn8SidT19xm-Ih2icXb6JpNK_tQqdmojSuthrT5rDbG33SBb7vwcaRsxzZQDYleO10CZl1E0vB-sQ8wKZahU3IiPEGxtlovG9Onwsd82BLPr0dLH6BN51_3NZysN6eCCyfA8USlwCV7w6HHENlvg8LFYqCTJ0tOF5aV_o8HfnK8YGZNsqH11KNogvM5lNGr1lD3K302jYGqKgVsPBOFL05mru2O5htVnecp2iyz7m6MYHtNlyRE_bPRg'
    },
    quickFacts: [
      {
        label: 'Annual Tuition Fees',
        value: '£14,000 – £26,000',
        subtext: 'Master’s programs completed in 1 Year',
        icon: 'payments'
      },
      {
        label: 'Monthly Living Expenses',
        value: '£900 – £1,300',
        subtext: 'London approx. £1,334 / Outside London £1,023',
        icon: 'account_balance_wallet'
      },
      {
        label: 'Primary Intakes',
        value: 'September & January',
        subtext: 'Major global intakes with CAS',
        icon: 'calendar_month'
      },
      {
        label: 'Post-Study Work (PSW)',
        value: '2 Years Graduate Route',
        subtext: '3 Years for PhD Graduates',
        icon: 'card_travel'
      },
      {
        label: 'Degree Durations',
        value: '1 Yr (Masters) / 3 Yrs (Bachelors)',
        subtext: 'Fast-track degree qualification',
        icon: 'schedule'
      },
      {
        label: 'Scholarship Opportunities',
        value: '£2,000 – £10,000 Awards',
        subtext: 'Automatic merit & Chevening options',
        icon: 'card_membership'
      }
    ],
    whyStudy: {
      intro: 'A British qualification opens global doors. Experience rich academic tradition, 1-year intensive Master’s programs, and protected post-study work rights.',
      benefits: [
        {
          title: '1-Year Intensive Master’s Degrees',
          desc: 'Save one full year of tuition and living expenses compared to 2-year programs elsewhere, returning faster to the professional job market.',
          icon: 'speed'
        },
        {
          title: '2-Year Graduate Route Work Visa',
          desc: 'Graduates can stay and work in the UK for up to 2 years without requiring an employer sponsorship threshold.',
          icon: 'work_outline'
        },
        {
          title: 'World-Top Ranked Universities',
          desc: 'Study at Russell Group and top-tier UK research institutions recognized globally by employers and academics.',
          icon: 'military_tech'
        },
        {
          title: 'Part-Time Work Rights',
          desc: 'Work up to 20 hours per week during term time and full-time during official university vacations.',
          icon: 'alarm'
        },
        {
          title: 'Generous International Scholarships',
          desc: 'Access university vice-chancellor awards, GREAT scholarships, and regional merit bursaries for Bangladeshi applicants.',
          icon: 'volunteer_activism'
        },
        {
          title: 'Rich Multicultural Experience',
          desc: 'Thriving Bangladeshi diaspora communities across London, Birmingham, Manchester, and Leeds providing home comfort and support.',
          icon: 'public'
        }
      ]
    },
    admissionRequirements: {
      undergraduate: [
        'HSC with GPA 4.00+ or Foundation / International Year One or A-Levels',
        'Certified SSC & HSC Marksheets certified by Education Board',
        'Academic Reference Letter & Personal Statement'
      ],
      postgraduate: [
        'Recognized 4-Year Bachelor’s Degree with Minimum CGPA 2.75 out of 4.00',
        'Official Academic Transcripts & Graduation Certificate',
        '2 Recommendation Letters (Academic/Professional) & Detailed CV',
        'Statement of Purpose (SOP) tailored to selected university'
      ],
      englishProficiency: {
        ielts: 'Overall 6.0 – 6.5 (Minimum 5.5 in each component for Student Visa SELT requirement)',
        alternatives: [
          'PTE Academic: 54 – 62',
          'Oxford ELLT / Duolingo DET (accepted at selected partner institutions)',
          'MOI Certificate accepted from premier Bangladeshi universities'
        ],
        notes: 'Pre-sessional English courses (4 to 10 weeks) available for students meeting lower IELTS scores.'
      },
      requiredDocuments: [
        'Valid Passport & Birth Certificate',
        'All Academic Transcripts & Certificates (SSC, HSC, Bachelor’s)',
        'IELTS / SELT Score Report',
        'Statement of Purpose (SOP) & Updated Academic CV',
        'Bank Statement (28-day rule for UK Student Visa funds requirement)',
        'TB Test Clearance Certificate from IOM Bangladesh'
      ]
    },
    costOfStudy: {
      currency: 'GBP',
      tuitionRangeAnnual: '£14,000 – £26,000 / year',
      livingCostMonthly: '£920 – £1,335 / month',
      breakdown: [
        {
          category: 'Accommodation (Student Halls or Private Flat)',
          monthlyCost: '£450 – £850',
          details: 'Outer London / Regional UK vs. Central London'
        },
        {
          category: 'Food & Household Groceries',
          monthlyCost: '£180 – £280',
          details: 'Local supermarkets and halal butcher shops'
        },
        {
          category: 'Public Transport (Bus & Student Oyster/Railcard)',
          monthlyCost: '£60 – £120',
          details: 'Discounted student travel cards'
        },
        {
          category: 'Mobile, Internet & Utilities',
          monthlyCost: '£40 – £70',
          details: 'Shared utilities and monthly mobile SIM'
        }
      ]
    },
    scholarships: [
      {
        name: 'GEES UK Excellence Scholarship',
        provider: 'GEES UK University Partners',
        eligibility: 'CGPA 3.25+ or A-Level AAA',
        coverageType: 'Tuition Waiver',
        coverageDetails: '£2,000 to £5,000 direct fee deduction upon CAS issuance'
      },
      {
        name: 'GREAT Scholarships UK',
        provider: 'British Council & UK Universities',
        eligibility: 'Bangladeshi passport holders applying for postgraduate taught courses',
        coverageType: 'Partial',
        coverageDetails: 'Minimum £10,000 towards tuition fees for 1-year Master’s'
      }
    ],
    intakes: [
      {
        name: 'Autumn Major Intake',
        startMonth: 'September / October',
        deadline: '30 June',
        status: 'Open',
        notes: 'Largest intake term with all academic faculties open.'
      },
      {
        name: 'Spring Secondary Intake',
        startMonth: 'January / February',
        deadline: '15 November',
        status: 'Upcoming',
        notes: 'Ideal for mid-year entry with complete course availability.'
      }
    ],
    visaProcess: [
      {
        stepNumber: 1,
        title: 'Free Assessment & Course Selection',
        description: 'Review transcripts, financial capacity, and target UK institutions with GEES counselors.',
        processingTime: '1 - 2 Days'
      },
      {
        stepNumber: 2,
        title: 'University Offer Letter & Condition Clearing',
        description: 'Submit application packet, clear academic conditions, and perform pre-CAS credibility interview.',
        processingTime: '2 - 4 Weeks'
      },
      {
        stepNumber: 3,
        title: 'CAS (Confirmation of Acceptance for Studies) Issuance',
        description: 'Pay deposit, verify 28-day bank statement funds, and obtain CAS statement from university.',
        processingTime: '5 - 10 Days'
      },
      {
        stepNumber: 4,
        title: 'UK Student Visa Online Application & Biometrics',
        description: 'Submit UK Student Visa online application, pay IHS (Immigration Health Surcharge), and attend VFS Dhaka/Chittagong biometrics.',
        processingTime: '3 Weeks (Standard) / 5 Days (Priority)'
      }
    ],
    faqs: [
      {
        question: 'How much bank balance is required for a UK Student Visa in Bangladesh?',
        answer: 'You must show tuition fee for 1st year (minus deposit paid) plus living costs: £1,334/month for London (9 months = £12,006) or £1,023/month outside London (9 months = £9,207). Funds must be held consecutively in bank for at least 28 days.',
        keyPoints: [
          '28-day consecutive bank holding rule strictly enforced by UKVI',
          'Sponsor can be student, parents, or official legal guardians',
          'Education loan certificates from approved banks accepted'
        ]
      },
      {
        question: 'Can I apply for a 1-year Master’s in the UK with a 3-year Bachelor’s from Bangladesh?',
        answer: 'Yes, selected UK universities accept 3-year Honors degrees from recognized Bangladeshi public/private universities. Where a 4-year degree is required, pre-master’s pathway programs are available.',
        keyPoints: [
          'Direct entry for strong CGPA candidates',
          'Pre-Master’s pathways available for profile boosting'
        ]
      }
    ],
    seo: {
      title: 'Study in the UK from Bangladesh | Universities, Costs & CAS | GEES',
      description: 'Study in the United Kingdom from Bangladesh. Explore 1-year Master’s, UK university scholarships, 2-year Graduate Route PSW visa, and CAS processing with GEES.',
      keywords: ['Study in UK from Bangladesh', 'UK university CAS processing', 'UK student visa Bangladesh bank statement', 'UK Graduate Route PSW visa', 'GEES UK education']
    },
    lastVerifiedDate: 'October 2026'
  },



  // ----------------------------------------------------------------------------
  // NEW ZEALAND
  // ----------------------------------------------------------------------------
  'study-in-new-zealand': {
    slug: 'study-in-new-zealand',
    countryName: 'New Zealand',
    flagEmoji: '🇳🇿',
    code: 'NZ',
    currency: 'NZD',
    hero: {
      title: 'Study in New Zealand from Bangladesh',
      subtitle: 'World-Class Innovation, Unmatched Safety & Post-Study Work Visas',
      intro: 'All 8 New Zealand universities rank in the top 3% globally. Enjoy safe, serene living in Auckland, Wellington, or Christchurch with excellent graduate pathways.',
      imageUrl: 'https://images.zicasso.com/1613b7fe4e02309dcd902b3f19405262.jpg'
    },
    quickFacts: [
      {
        label: 'Annual Tuition Fees',
        value: 'NZD $22,000 – $35,000',
        subtext: '100% of NZ universities rank top 3% globally',
        icon: 'payments'
      },
      {
        label: 'Monthly Living Expenses',
        value: 'NZD $1,500 – $2,200',
        subtext: 'Official requirement NZD $20,000 / year',
        icon: 'account_balance_wallet'
      },
      {
        label: 'Primary Intakes',
        value: 'February & July',
        subtext: 'Semester 1 & 2 intakes',
        icon: 'calendar_month'
      },
      {
        label: 'Post-Study Work Visa',
        value: 'Up to 3 Years Open Work Visa',
        subtext: 'Depends on qualification level & region',
        icon: 'card_travel'
      }
    ],
    whyStudy: {
      intro: 'New Zealand delivers practical, research-led education in an unbeatable natural sanctuary with warm kiwi hospitality.',
      benefits: [
        {
          title: '100% Universities Globally Ranked',
          desc: 'All 8 public New Zealand universities rank within the top 3% worldwide in the QS World University Rankings.',
          icon: 'military_tech'
        },
        {
          title: '3-Year Post-Study Work Visa',
          desc: 'Bachelor’s and Master’s degree graduates qualify for up to 3 years open work rights upon completion.',
          icon: 'work_outline'
        }
      ]
    },
    admissionRequirements: {
      undergraduate: ['HSC GPA 4.00+ or Foundation pathway', 'IELTS 6.0 overall'],
      postgraduate: ['Bachelor’s degree CGPA 2.75+', 'IELTS 6.5 overall'],
      englishProficiency: {
        ielts: 'Overall 6.0 - 6.5',
        alternatives: ['PTE 50 - 58', 'TOEFL 79'],
        notes: 'Pathway English packages available.'
      },
      requiredDocuments: [
        'Valid Passport',
        'Certified Academic Marksheets & Certificates',
        'IELTS / PTE Scorecard',
        'INZ Financial Statement'
      ]
    },
    costOfStudy: {
      currency: 'NZD',
      tuitionRangeAnnual: 'NZD $22,000 – $35,000 / year',
      livingCostMonthly: 'NZD $1,500 – $2,200 / month',
      breakdown: [
        { category: 'Accommodation', monthlyCost: 'NZD $700 – $1,200', details: 'Student flat or homestay' }
      ]
    },
    scholarships: [],
    intakes: [
      { name: 'Feb Intake', startMonth: 'February', deadline: '15 November', status: 'Open', notes: 'Main intake term.' }
    ],
    visaProcess: [
      { stepNumber: 1, title: 'Profile Evaluation', description: 'Initial profile review with GEES advisers.' }
    ],
    faqs: [
      { question: 'What is the visa approval rate for New Zealand?', answer: 'With clean academic credentials and verified financial solvency, approval rates remain strong.' }
    ],
    seo: {
      title: 'Study in New Zealand from Bangladesh | Universities & Visa | GEES',
      description: 'Study in New Zealand from Bangladesh. Compare top 8 NZ universities, tuition fees, INZ student visa rules, and 3-year post-study work visas with GEES.',
      keywords: ['Study in New Zealand from Bangladesh', 'NZ student visa requirement', 'GEES New Zealand']
    },
    lastVerifiedDate: 'October 2026'
  },



  // ----------------------------------------------------------------------------
  // FINLAND
  // ----------------------------------------------------------------------------
  'study-in-finland': {
    slug: 'study-in-finland',
    countryName: 'Finland',
    flagEmoji: '🇫🇮',
    code: 'FI',
    currency: 'EUR',
    hero: {
      title: 'Study in Finland from Bangladesh',
      subtitle: 'World’s #1 Education System, High Innovation & 2-Year Job Search Visa',
      intro: 'Finland combines world-leading education quality, high social safety, clean technology innovation, and a generous 2-year post-study job seeker visa.',
      imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1200&auto=format&fit=crop'
    },
    quickFacts: [
      { label: 'Annual Tuition Fees', value: '€6,000 – €12,000', subtext: 'Substantial early-bird scholarships', icon: 'payments' },
      { label: 'Monthly Living Expenses', value: '€700 – €1,000', subtext: 'Subsidized student meals & housing', icon: 'account_balance_wallet' },
      { label: 'Primary Intakes', value: 'August / September', subtext: 'Joint Application Window in Jan', icon: 'calendar_month' },
      { label: 'Post-Study Work Visa', value: '2 Years Job Seeker Permit', subtext: 'Pathway to permanent residence', icon: 'card_travel' }
    ],
    whyStudy: {
      intro: 'The world’s happiest country offers research-backed learning, Nordic equality, and outstanding career retention.',
      benefits: [
        { title: '#1 World Education Ranking', desc: 'Acclaimed educational model prioritizing student innovation and practical skill mastery.', icon: 'school' },
        { title: '2-Year Post-Study Permit', desc: 'Stay and work in Finland after graduation with extended residence permit options.', icon: 'work_outline' }
      ]
    },
    admissionRequirements: {
      undergraduate: ['HSC GPA 4.00+ or Joint Application entrance exam', 'IELTS 6.0'],
      postgraduate: ['4-Year Bachelor’s CGPA 2.75+', 'IELTS 6.5'],
      englishProficiency: { ielts: 'Overall 6.0 - 6.5', alternatives: ['PTE 54', 'TOEFL 79'], notes: 'Joint Application rules apply.' },
      requiredDocuments: ['Passport', 'Certified Transcripts', 'IELTS Score Card', 'Bank Solvency']
    },
    costOfStudy: {
      currency: 'EUR',
      tuitionRangeAnnual: '€6,000 – €12,000 / year',
      livingCostMonthly: '€700 – €1,000 / month',
      breakdown: [{ category: 'HOAS / Student Apartment', monthlyCost: '€350 – €550', details: 'Subsidized Finnish student accommodation' }]
    },
    scholarships: [],
    intakes: [{ name: 'Autumn Intake', startMonth: 'August', deadline: '18 January', status: 'Open', notes: 'National Joint Application.' }],
    visaProcess: [{ stepNumber: 1, title: 'Finnish Residence Permit', description: 'Apply via Enter Finland online portal.' }],
    faqs: [{ question: 'Is tuition free in Finland for international students?', answer: 'Non-EU/EEA students pay tuition (€6,000 - €12,000/yr), but generous 50% - 100% scholarships exist.' }],
    seo: {
      title: 'Study in Finland from Bangladesh | Universities, Joint App & Visa | GEES',
      description: 'Study in Finland from Bangladesh. Compare Finnish Universities of Applied Sciences (UAS), tuition fees, Joint Application, and residence permits with GEES.',
      keywords: ['Study in Finland from Bangladesh', 'Finnish Joint Application', 'Finland student residence permit', 'GEES Finland']
    },
    lastVerifiedDate: 'October 2026'
  },



  // ----------------------------------------------------------------------------
  // CYPRUS
  // ----------------------------------------------------------------------------
  'study-in-cyprus': {
    slug: 'study-in-cyprus',
    countryName: 'Cyprus',
    flagEmoji: '🇨🇾',
    code: 'CY',
    currency: 'EUR',
    hero: {
      title: 'Study in Cyprus from Bangladesh',
      subtitle: 'Affordable EU Degree Gateway & Mediterranean Lifestyle',
      intro: 'Earn accredited European Union university degrees in English at highly budget-friendly tuition fees with flexible entry requirements in Nicosia and Limassol.',
      imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop'
    },
    quickFacts: [
      { label: 'Annual Tuition Fees', value: '€3,500 – €7,000', subtext: 'Budget-friendly EU degrees', icon: 'payments' },
      { label: 'Monthly Living Expenses', value: '€500 – €800', subtext: 'Low Mediterranean cost of living', icon: 'account_balance_wallet' },
      { label: 'Primary Intakes', value: 'October & February', subtext: 'Fall & Spring entry', icon: 'calendar_month' },
      { label: 'Teaching Language', value: '100% English Medium', subtext: 'Accredited EU curriculum', icon: 'translate' }
    ],
    whyStudy: {
      intro: 'EU accredited education, sunny Mediterranean living, high visa success, and direct transfer options across Europe.',
      benefits: [
        { title: 'Affordable EU Degrees', desc: 'European qualifications at tuition rates starting from €3,500 per year.', icon: 'euro' },
        { title: 'Flexible English Admission', desc: 'Universities accept MOI certificates and internal English placement tests.', icon: 'verified' }
      ]
    },
    admissionRequirements: {
      undergraduate: ['HSC GPA 3.00+ or O/A Levels', 'IELTS 5.5 or MOI'],
      postgraduate: ['Bachelor’s degree CGPA 2.50+', 'IELTS 6.0 or MOI'],
      englishProficiency: { ielts: 'Overall 5.5 - 6.0', alternatives: ['MOI Certificate', 'Internal University Test'], notes: 'Flexible entry pathways.' },
      requiredDocuments: ['Passport', 'Academic Transcripts', 'Police Clearance', 'Bank Solvency']
    },
    costOfStudy: {
      currency: 'EUR',
      tuitionRangeAnnual: '€3,500 – €7,000 / year',
      livingCostMonthly: '€500 – €800 / month',
      breakdown: [{ category: 'Student Residence', monthlyCost: '€250 – €450', details: 'Nicosia or Limassol hostel' }]
    },
    scholarships: [],
    intakes: [{ name: 'Fall Intake', startMonth: 'October', deadline: '15 August', status: 'Open', notes: 'Main term.' }],
    visaProcess: [{ stepNumber: 1, title: 'Cyprus Entry Permit', description: 'University processes entry permit with Cyprus Ministry.' }],
    faqs: [{ question: 'Is Cyprus student visa easy for Bangladeshi students?', answer: 'Yes, Cyprus has a straightforward student entry permit process handled directly by university registrars.' }],
    seo: {
      title: 'Study in Cyprus from Bangladesh | Universities & Entry Permit | GEES',
      description: 'Study in Cyprus from Bangladesh. Explore affordable EU university tuition, English-taught programs, and student entry permits with GEES.',
      keywords: ['Study in Cyprus from Bangladesh', 'Cyprus university tuition', 'Cyprus student visa', 'GEES Cyprus']
    },
    lastVerifiedDate: 'October 2026'
  },

  // ----------------------------------------------------------------------------
  // GREECE
  // ----------------------------------------------------------------------------
  'study-in-greece': {
    slug: 'study-in-greece',
    countryName: 'Greece',
    flagEmoji: '🇬🇷',
    code: 'GR',
    currency: 'EUR',
    hero: {
      title: 'Study in Greece from Bangladesh',
      subtitle: 'Cradle of Western Learning, Schengen Mobility & Affordable Tuition',
      intro: 'Combine world-class Mediterranean academic heritage, accredited European degrees, low living costs, and full Schengen zone travel privileges in Athens.',
      imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1200&auto=format&fit=crop'
    },
    quickFacts: [
      { label: 'Annual Tuition Fees', value: '€1,500 – €5,000', subtext: 'Unbeatable European value', icon: 'payments' },
      { label: 'Monthly Living Expenses', value: '€600 – €900', subtext: 'Athens & Thessaloniki', icon: 'account_balance_wallet' },
      { label: 'Primary Intakes', value: 'October & February', subtext: 'Autumn & Spring intakes', icon: 'calendar_month' },
      { label: 'Visa Privilege', value: 'Schengen Area Mobility', subtext: 'Travel across 27 EU nations', icon: 'flight' }
    ],
    whyStudy: {
      intro: 'Historic universities, low living expenses, accredited English-taught degrees, and Schengen European access.',
      benefits: [
        { title: 'Schengen Visa Mobility', desc: 'Study permit grants travel access across 27 Schengen European countries.', icon: 'explore' },
        { title: 'Incredible Affordability', desc: 'Living expenses and tuition fees are among the lowest in Western Europe.', icon: 'savings' }
      ]
    },
    admissionRequirements: {
      undergraduate: ['HSC GPA 3.25+ or A-Levels', 'IELTS 5.5 - 6.0'],
      postgraduate: ['Bachelor’s degree CGPA 2.50+', 'IELTS 6.0 - 6.5'],
      englishProficiency: { ielts: 'Overall 5.5 - 6.5', alternatives: ['TOEFL 72', 'PTE 50'], notes: 'Standard SELT requirements.' },
      requiredDocuments: ['Passport', 'Academic Records', 'Police Clearance', 'Bank Solvency']
    },
    costOfStudy: {
      currency: 'EUR',
      tuitionRangeAnnual: '€1,500 – €5,000 / year',
      livingCostMonthly: '€600 – €900 / month',
      breakdown: [{ category: 'Student Housing', monthlyCost: '€300 – €500', details: 'Athens shared apartment' }]
    },
    scholarships: [],
    intakes: [{ name: 'Autumn Term', startMonth: 'October', deadline: '31 July', status: 'Open', notes: 'Main term.' }],
    visaProcess: [{ stepNumber: 1, title: 'Greek National Visa Type D', description: 'Submit visa packet to Greek Embassy in New Delhi.' }],
    faqs: [{ question: 'Can Bangladeshi students travel in Europe with a Greek student visa?', answer: 'Yes, a Greek Type D student visa permits Schengen area travel across 27 EU nations.' }],
    seo: {
      title: 'Study in Greece from Bangladesh | Universities & Schengen Visa | GEES',
      description: 'Study in Greece from Bangladesh. Explore affordable European university tuition, Schengen visa privileges, and English degrees in Athens with GEES.',
      keywords: ['Study in Greece from Bangladesh', 'Greece university tuition', 'Schengen student visa', 'GEES Greece']
    },
    lastVerifiedDate: 'October 2026'
  },



  // ----------------------------------------------------------------------------
  // INDIA
  // ----------------------------------------------------------------------------
  'study-in-india': {
    slug: 'study-in-india',
    countryName: 'India',
    flagEmoji: '🇮🇳',
    code: 'IN',
    currency: 'INR',
    hero: {
      title: 'Study in India from Bangladesh',
      subtitle: 'Premier STEM, Medical & Business Education with Low Travel & Living Costs',
      intro: 'Study at top-tier Indian institutions like Assam Down Town University offering UGC-recognized nursing, pharmacy, engineering, and MBA degrees right next door.',
      imageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1200&auto=format&fit=crop'
    },
    quickFacts: [
      { label: 'Annual Tuition Fees', value: '$1,500 – $4,500', subtext: 'Extremely affordable tuition in INR/USD', icon: 'payments' },
      { label: 'Monthly Living Expenses', value: '$150 – $300', subtext: 'Very low hostel & food expenses', icon: 'account_balance_wallet' },
      { label: 'Primary Intakes', value: 'July & August', subtext: 'Monsoon academic session', icon: 'calendar_month' },
      { label: 'Proximity', value: 'Direct Neighboring Country', subtext: 'Easy family visits & short flight time', icon: 'flight_takeoff' }
    ],
    whyStudy: {
      intro: 'Proximity to Bangladesh, familiar culture, low living expenses, and world-class medical & technical education.',
      benefits: [
        { title: 'Neighboring Convenience', desc: 'Short transit time and hassle-free travel for Bangladeshi families.', icon: 'directions_bus' },
        { title: 'Premier Health & STEM Faculties', desc: 'World-recognized curriculum in Nursing, Pharmacy, Computer Science, and Engineering.', icon: 'biotech' }
      ]
    },
    admissionRequirements: {
      undergraduate: ['HSC GPA 3.00+ or O/A Levels', 'No IELTS required (English Medium Instruction)'],
      postgraduate: ['Bachelor’s degree CGPA 2.50+', 'No IELTS required'],
      englishProficiency: { ielts: 'Not Mandatory', alternatives: ['English Medium Instruction from Bangladesh'], notes: 'Direct admission based on academic marks.' },
      requiredDocuments: ['Passport', 'SSC & HSC Marksheets & Certificates', 'Passport Photographs', 'National ID']
    },
    costOfStudy: {
      currency: 'INR',
      tuitionRangeAnnual: '$1,500 – $4,500 / year',
      livingCostMonthly: '$150 – $300 / month',
      breakdown: [{ category: 'Campus Hostel & Mess Food', monthlyCost: '$100 – $180', details: 'Full room + 3 meals daily in university mess' }]
    },
    scholarships: [],
    intakes: [{ name: 'Monsoon Session', startMonth: 'July / August', deadline: '30 June', status: 'Open', notes: 'Main annual intake.' }],
    visaProcess: [{ stepNumber: 1, title: 'Indian Student Visa (IVFRT)', description: 'Submit online visa form and attend IVAC Bangladesh.' }],
    faqs: [{ question: 'Is IELTS required for Bangladeshi students to study in India?', answer: 'No, IELTS is not mandatory for Indian university admission as instruction is conducted in English.' }],
    seo: {
      title: 'Study in India from Bangladesh | Universities, Nursing & Fees | GEES',
      description: 'Study in India from Bangladesh. Explore Assam Down Town University, BTech, Nursing, Pharmacy, MBA programs, and low tuition fees with GEES.',
      keywords: ['Study in India from Bangladesh', 'Indian university admission Bangladesh', 'Assam Down Town University GEES', 'GEES India']
    },
    lastVerifiedDate: 'October 2026'
  },
  'study-in-usa': {
    slug: 'study-in-usa',
    countryName: 'USA',
    flagEmoji: '🇺🇸',
    code: 'US',
    currency: 'USD',
    hero: {
      title: 'Study in USA from Bangladesh',
      subtitle: '14 Partner Universities, STEM OPT up to 3 Years & Unmatched Academic Prestige',
      intro: 'The United States is the premier global destination for higher education, home to top research universities, Fortune 500 career networks, and up to 3-year STEM OPT work authorization.',
      imageUrl: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?q=80&w=1200&auto=format&fit=crop'
    },
    quickFacts: [
      { label: 'Annual Tuition Fees', value: '$15,000 – $58,000', subtext: '14 partner universities & colleges', icon: 'payments' },
      { label: 'Monthly Living Expenses', value: '$1,000 – $1,800', subtext: 'Depending on US state and city', icon: 'account_balance_wallet' },
      { label: 'Primary Intakes', value: 'Fall (Aug/Sept) & Spring (Jan)', subtext: 'Summer intake also available', icon: 'calendar_month' },
      { label: 'STEM OPT Work Rights', value: 'Up to 3 Years OPT', subtext: 'Full-time work authorization', icon: 'card_travel' }
    ],
    whyStudy: {
      intro: 'GEES partners with 14 prestigious American institutions offering STEM degree programs, scholarship opportunities, and comprehensive F-1 visa preparation.',
      benefits: [
        { title: '14 Partner Universities in the USA', desc: 'Direct representation with Wilkes University, Stevens Institute, UMBC, Trine, Potomac, Cascadia College, Rowan, and more.', icon: 'school' },
        { title: '3-Year STEM OPT Work Authorization', desc: 'Graduates of STEM-designated programs can work in the United States for up to 36 months after graduation.', icon: 'work_outline' },
        { title: 'Generous Scholarships & Assistantships', desc: 'Merit-based international student scholarships, graduate assistantships, and tuition reductions.', icon: 'military_tech' },
        { title: 'Global Tech & Corporate Ecosystem', desc: 'Direct corporate recruitment networks across Silicon Valley, Wall Street, Boston biotech, and Washington D.C.', icon: 'hub' }
      ]
    },
    admissionRequirements: {
      undergraduate: ['HSC / A-Levels with minimum GPA 3.0 / Grade C', 'SAT/ACT optional at most partner universities', 'IELTS 6.0 - 6.5 or Duolingo 105+'],
      postgraduate: ['4-year Bachelor degree (or recognized 3-year degree) with minimum CGPA 2.75 - 3.0', 'GRE/GMAT waivers available at partner institutions', 'IELTS 6.5 or TOEFL 80+'],
      englishProficiency: { ielts: 'Overall 6.0 – 6.5', alternatives: ['TOEFL iBT 79-90', 'Duolingo 105-120', 'PTE Academic 53-65'], notes: 'Direct English waivers available for students with English-medium medium-of-instruction certificates.' },
      requiredDocuments: ['Valid Passport', 'Official Academic Transcripts & Certificates', 'Statement of Purpose (SOP)', '2-3 Letters of Recommendation (LOR)', 'Affidavit of Financial Support & Bank Statement', 'English Proficiency Score']
    },
    costOfStudy: {
      currency: 'USD',
      tuitionRangeAnnual: '$15,000 – $58,000 / year',
      livingCostMonthly: '$1,000 – $1,800 / month',
      breakdown: [
        { category: 'Campus Residence / Apartment Sharing', monthlyCost: '$550 – $1,100', details: 'Furnished dorms or off-campus apartments' },
        { category: 'Food & Groceries', monthlyCost: '$300 – $500', details: 'Meal plans or local grocery shopping' },
        { category: 'Health Insurance & Local Transport', monthlyCost: '$150 – $250', details: 'Mandatory university medical insurance & transit pass' }
      ]
    },
    scholarships: [
      { name: 'GEES Partner Merit Scholarship', provider: 'US Partner Universities', eligibility: 'CGPA 3.2+ or outstanding academic track record', coverageType: 'Tuition Waiver', coverageDetails: '$3,000 to $18,000 annual tuition deduction' },
      { name: 'Graduate Research & Teaching Assistantships', provider: 'US Academic Departments', eligibility: 'Master and PhD candidates in STEM & Business', coverageType: 'Full', coverageDetails: 'Full tuition waiver + monthly living stipend' }
    ],
    intakes: [
      { name: 'Fall Intake', startMonth: 'August / September', deadline: '1 June', status: 'Open', notes: 'Primary intake with maximum course selections and scholarship options.' },
      { name: 'Spring Intake', startMonth: 'January', deadline: '1 November', status: 'Open', notes: 'Major secondary intake across all 14 partner universities.' }
    ],
    visaProcess: [
      { stepNumber: 1, title: 'Receive Form I-20', description: 'Secure unconditional admission and official I-20 certificate of eligibility from partner university.' },
      { stepNumber: 2, title: 'Pay SEVIS I-901 Fee', description: 'Pay the $350 mandatory SEVIS fee to U.S. Immigration and Customs Enforcement.' },
      { stepNumber: 3, title: 'Submit DS-160 & Schedule Interview', description: 'Complete DS-160 online visa application and schedule F-1 interview at U.S. Embassy Dhaka.' },
      { stepNumber: 4, title: 'GEES Mock Visa Interview Coaching', description: 'Comprehensive mock interviews with senior counselors covering academic intent and financial verification.' }
    ],
    faqs: [
      { question: 'What 14 universities in the USA are represented by GEES?', answer: 'GEES officially represents Wilkes University, University of Potomac, Trine University, Cascadia College, Stevens Institute of Technology, University of Maryland Baltimore County (UMBC), Arkansas State University, Minnesota State University, Rowan University, University of West Florida, Duquesne University, Brandeis University – School of Business and Economics, Marquette University, and Central Michigan University.' },
      { question: 'Can international students work in the USA on an F-1 visa?', answer: 'Yes! International students can work up to 20 hours per week on-campus during academic terms, and engage in Curricular Practical Training (CPT) and up to 3 years of Optional Practical Training (OPT) for STEM majors.' }
    ],
    seo: {
      title: 'Study in USA from Bangladesh | 14 Partner Universities, Fees & F-1 Visa | GEES',
      description: 'Study in USA from Bangladesh with GEES. Explore 14 partner universities including Wilkes, Stevens, UMBC, Trine, Cascadia, Rowan, and Duquesne. Scholarships, fees, and F-1 visa guidance.',
      keywords: ['Study in USA from Bangladesh', 'USA partner universities GEES', 'F1 visa Bangladesh', 'Wilkes University GEES', 'Stevens Institute GEES']
    },
    lastVerifiedDate: 'October 2026'
  },
  'study-in-australia': {
    slug: 'study-in-australia',
    countryName: 'Australia',
    flagEmoji: '🇦🇺',
    code: 'AU',
    currency: 'AUD',
    hero: {
      title: 'Study in Australia from Bangladesh',
      subtitle: '10 Partner Universities, Post-Study Work Visa up to 4 Years & Top Quality of Life',
      intro: 'Australia offers globally ranked universities, pristine coastal cities, generous post-study work rights, and high student satisfaction across Sydney, Melbourne, Wollongong, Newcastle, Hobart, and Queensland.',
      imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1200&auto=format&fit=crop'
    },
    quickFacts: [
      { label: 'Annual Tuition Fees', value: 'AUD $20,000 – $38,000', subtext: '10 partner universities & colleges', icon: 'payments' },
      { label: 'Monthly Living Expenses', value: 'AUD $1,500 – $2,200', subtext: 'Sydney, Melbourne, Wollongong, Hobart', icon: 'account_balance_wallet' },
      { label: 'Primary Intakes', value: 'February & July', subtext: 'Semester 1 & 2', icon: 'calendar_month' },
      { label: 'Post-Study Work Visa', value: 'Subclass 485 up to 4 Yrs', subtext: 'Full unrestricted work rights', icon: 'card_travel' }
    ],
    whyStudy: {
      intro: 'World-recognized qualifications, safe welcoming society, and high post-graduation career opportunities.',
      benefits: [
        { title: '10 Partner Universities & Colleges in Australia', desc: 'Direct representation with University of Wollongong, La Trobe University Sydney, University of Tasmania, James Cook University, Charles Sturt University, CQUniversity Australia, University of New South Wales, University of Newcastle, RMIT University, and Swinburne University of Technology.', icon: 'school' },
        { title: 'Global Top Rankings & Industry Co-ops', desc: 'UNSW (Top 20 global), Wollongong, RMIT, Swinburne, and Newcastle deliver world-class research and employer connections.', icon: 'military_tech' },
        { title: 'Extended Regional Work Rights', desc: 'Universities in Tasmania, Wollongong, Newcastle, Townsville, and regional campuses qualify for extra years of post-study graduate visas.', icon: 'work_outline' }
      ]
    },
    admissionRequirements: {
      undergraduate: ['HSC with 65%+ or A-Levels with 3 passes', 'IELTS 6.0 – 6.5 overall'],
      postgraduate: ['Bachelor degree CGPA 2.75+ out of 4.0', 'IELTS 6.5 with no band less than 6.0'],
      englishProficiency: { ielts: 'Overall 6.0 – 6.5', alternatives: ['PTE Academic 58-65', 'TOEFL iBT 79-90'], notes: 'PTE Academic is widely accepted across all Australian partner institutions.' },
      requiredDocuments: ['Valid Passport', 'Academic Transcripts & Certificates', 'IELTS / PTE Certificate', 'Genuine Student (GS) Statement', 'Financial Evidence']
    },
    costOfStudy: {
      currency: 'AUD',
      tuitionRangeAnnual: 'AUD $20,000 – $38,000 / year',
      livingCostMonthly: 'AUD $1,500 – $2,200 / month',
      breakdown: [{ category: 'Student Accommodation', monthlyCost: 'AUD $750 – $1,350', details: 'University residence, managed student apartment or homestay' }]
    },
    scholarships: [],
    intakes: [
      { name: 'Semester 1 (Feb)', startMonth: 'February', deadline: '30 November', status: 'Open', notes: 'Main annual intake.' },
      { name: 'Semester 2 (July)', startMonth: 'July', deadline: '30 April', status: 'Open', notes: 'Mid-year major intake across all partner institutions.' }
    ],
    visaProcess: [{ stepNumber: 1, title: 'Student Visa (Subclass 500)', description: 'Apply online with CoE, OSHC health cover, and Genuine Student (GS) assessment.' }],
    faqs: [
      { question: 'Which universities in Australia are represented by GEES?', answer: 'GEES officially represents all 10 partner institutions: University of Wollongong, La Trobe University Sydney, University of Tasmania, James Cook University, Charles Sturt University, CQUniversity Australia, University of New South Wales, University of Newcastle, RMIT University, and Swinburne University of Technology.' },
      { question: 'Can international students work in Australia?', answer: 'Yes, international student visa holders can work up to 48 hours per fortnight during study terms and unlimited during scheduled breaks.' }
    ],
    seo: {
      title: 'Study in Australia from Bangladesh | 10 Partner Universities, Fees & Visa | GEES',
      description: 'Study in Australia with GEES Bangladesh. Explore 10 partner universities including Wollongong, UNSW, RMIT, Swinburne, UTAS, and Newcastle with Subclass 500 visa guidance.',
      keywords: ['Study in Australia from Bangladesh', 'Australia partner universities GEES', 'University of Wollongong GEES', 'UNSW GEES', 'RMIT GEES']
    },
    lastVerifiedDate: 'October 2026'
  },
  'study-in-france': {
    slug: 'study-in-france',
    countryName: 'France',
    flagEmoji: '🇫🇷',
    code: 'FR',
    currency: 'EUR',
    hero: {
      title: 'Study in France from Bangladesh',
      subtitle: '4 Partner Business Schools & Grandes Écoles, Triple Crown Accreditations & Schengen Mobility',
      intro: 'France offers prestigious higher education in the heart of Europe, combining cutting-edge research, business excellence, and accessible tuition across Paris, Nancy, and Rennes.',
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop'
    },
    quickFacts: [
      { label: 'Annual Tuition Fees', value: '€4,500 – €12,500', subtext: '4 partner business schools & institutes', icon: 'payments' },
      { label: 'Monthly Living Expenses', value: '€650 – €1,200', subtext: 'Paris, Nancy & Rennes', icon: 'account_balance_wallet' },
      { label: 'Primary Intakes', value: 'September & February', subtext: 'Fall & Spring intakes', icon: 'calendar_month' },
      { label: 'Post-Study Work Visa', value: '1 to 2 Years APS Visa', subtext: 'Post-study job search authorization', icon: 'card_travel' }
    ],
    whyStudy: {
      intro: 'English-taught degree programs, generous government housing subsidies (CAF), and European career mobility.',
      benefits: [
        { title: '4 Partner Business Schools & Institutes', desc: 'Direct representation with ICN Business School, ISTEC Business School, Rennes School of Business, and Rennes Graduate School of Management.', icon: 'school' },
        { title: 'Triple Crown Accreditations', desc: 'ICN and Rennes School of Business hold prestigious EQUIS, AMBA, and AACSB accreditations in the global top 1%.', icon: 'military_tech' },
        { title: 'French Government Housing Subsidy (CAF)', desc: 'International students receive up to 40% rebate on monthly rent from the French government.', icon: 'home' }
      ]
    },
    admissionRequirements: {
      undergraduate: ['HSC / A-Levels with good grades', 'IELTS 6.0 overall'],
      postgraduate: ['Bachelor degree in relevant field', 'IELTS 6.0 – 6.5 or English MOI certificate'],
      englishProficiency: { ielts: 'Overall 6.0', alternatives: ['TOEFL 80', 'Duolingo 105'], notes: 'Hundreds of degrees taught entirely in English without French requirement.' },
      requiredDocuments: ['Passport', 'Academic Transcripts', 'CV & Motivation Letter', 'English Proficiency', 'Campus France Profile']
    },
    costOfStudy: {
      currency: 'EUR',
      tuitionRangeAnnual: '€4,500 – €12,500 / year',
      livingCostMonthly: '€650 – €1,200 / month',
      breakdown: [{ category: 'Student Housing (after CAF)', monthlyCost: '€300 – €600', details: 'CROUS student residences or private studios in Paris, Nancy, or Rennes' }]
    },
    scholarships: [],
    intakes: [{ name: 'Fall Intake', startMonth: 'September', deadline: '31 May', status: 'Open', notes: 'Main academic session.' }],
    visaProcess: [{ stepNumber: 1, title: 'Campus France & Long-Stay Visa (VLS-TS)', description: 'Complete Études en France interview and visa appointment at Embassy of France Dhaka.' }],
    faqs: [
      { question: 'Which universities and business schools in France are represented by GEES?', answer: 'GEES officially represents 4 partner institutions: ICN Business School, ISTEC Business School, Rennes School of Business, and Rennes Graduate School of Management.' },
      { question: 'Do I need to speak French to study in France?', answer: 'No, degree programs at our partner institutions are conducted 100% in English.' }
    ],
    seo: {
      title: 'Study in France from Bangladesh | 4 Partner Business Schools, Fees & Visa | GEES',
      description: 'Study in France from Bangladesh with GEES. Explore ICN, ISTEC, Rennes SB, and Rennes Graduate School of Management with VLS-TS student visa guidance.',
      keywords: ['Study in France from Bangladesh', 'France partner universities GEES', 'ICN Business School GEES', 'Rennes School of Business GEES']
    },
    lastVerifiedDate: 'October 2026'
  },
  'study-in-hungary': {
    slug: 'study-in-hungary',
    countryName: 'Hungary',
    flagEmoji: '🇭🇺',
    code: 'HU',
    currency: 'HUF',
    hero: {
      title: 'Study in Hungary from Bangladesh',
      subtitle: 'Premier Medical & STEM Universities, Affordable EU Living & Schengen Access',
      intro: 'Hungary is Central Europe’s premier educational destination, celebrated for historic universities, world-renowned medical and engineering faculties, and low cost of living.',
      imageUrl: 'https://images.unsplash.com/photo-1549877452-9c387954fbc2?q=80&w=1200&auto=format&fit=crop'
    },
    quickFacts: [
      { label: 'Annual Tuition Fees', value: '€4,000 – €8,000', subtext: '3 partner universities & colleges', icon: 'payments' },
      { label: 'Monthly Living Expenses', value: '€450 – €700', subtext: 'Debrecen, Sopron, Budapest', icon: 'account_balance_wallet' },
      { label: 'Primary Intakes', value: 'September & February', subtext: 'Fall & Spring sessions', icon: 'calendar_month' },
      { label: 'Post-Study Pathways', value: '9-Month Job Search Visa', subtext: 'EU career pathways', icon: 'card_travel' }
    ],
    whyStudy: {
      intro: 'European Union accredited degrees, affordable tuition fees, and rich student life across Debrecen, Sopron, and Budapest.',
      benefits: [
        { title: '3 Official Partner Universities', desc: 'Direct representation with University of Debrecen, University of Sopron, and Corvinus University.', icon: 'school' },
        { title: 'Premier Medical, Green Tech & Business', desc: 'Medicine and IT at Debrecen, environmental engineering at Sopron, and triple-accredited business at Corvinus.', icon: 'medical_services' },
        { title: 'Affordable European Living', desc: 'Monthly living expenses starting at only €450 including accommodation and food.', icon: 'savings' }
      ]
    },
    admissionRequirements: {
      undergraduate: ['HSC / A-Levels with 60%+', 'IELTS 5.5 – 6.0 or university entrance test'],
      postgraduate: ['Bachelor degree in related discipline', 'IELTS 6.0 – 6.5'],
      englishProficiency: { ielts: 'Overall 5.5 – 6.0', alternatives: ['Internal University English Test', 'Duolingo 100+'], notes: 'Internal entrance exams frequently accepted.' },
      requiredDocuments: ['Passport', 'Transcripts & Diplomas', 'Motivation Letter', 'Medical Report', 'Bank Statement']
    },
    costOfStudy: {
      currency: 'EUR',
      tuitionRangeAnnual: '€4,000 – €8,000 / year',
      livingCostMonthly: '€450 – €700 / month',
      breakdown: [{ category: 'Student Dormitory / Flatshare', monthlyCost: '€180 – €350', details: 'University dormitory or shared flat in Debrecen, Sopron, or Budapest' }]
    },
    scholarships: [],
    intakes: [{ name: 'Fall Intake', startMonth: 'September', deadline: '30 June', status: 'Open', notes: 'Main intake.' }],
    visaProcess: [{ stepNumber: 1, title: 'Hungarian D-Type Student Visa', description: 'Apply through Embassy of Hungary with letter of acceptance and accommodation proof.' }],
    faqs: [
      { question: 'Which universities in Hungary are represented by GEES?', answer: 'GEES officially represents all 3 premier Hungarian institutions: University of Debrecen, University of Sopron, and Corvinus University.' },
      { question: 'Are Hungarian medical degrees recognized globally?', answer: 'Yes, Hungarian medical degrees from University of Debrecen are fully accredited and listed in the WHO World Directory of Medical Schools.' }
    ],
    seo: {
      title: 'Study in Hungary from Bangladesh | Debrecen, Sopron & Corvinus | GEES',
      description: 'Study in Hungary from Bangladesh with GEES. Explore University of Debrecen, University of Sopron, Corvinus University, affordable tuition fees, and D-type visa guidance.',
      keywords: ['Study in Hungary from Bangladesh', 'Hungary student visa Bangladesh', 'University of Debrecen GEES', 'University of Sopron GEES', 'Corvinus University GEES']
    },
    lastVerifiedDate: 'October 2026'
  },
  'study-in-malta': {
    slug: 'study-in-malta',
    countryName: 'Malta',
    flagEmoji: '🇲🇹',
    code: 'MT',
    currency: 'EUR',
    hero: {
      title: 'Study in Malta from Bangladesh',
      subtitle: '2 Official Partner Institutions: GBS Malta & Malita International College',
      intro: 'Malta is an English-speaking European Union destination in the Mediterranean, offering accredited degrees, year-round sunshine, and high student visa success in St. Julian’s and Valletta.',
      imageUrl: 'https://images.unsplash.com/photo-1541427422271-1d5cf6cc675c?q=80&w=1200&auto=format&fit=crop'
    },
    quickFacts: [
      { label: 'Annual Tuition Fees', value: '€5,200 – €6,500', subtext: '2 official partner institutions', icon: 'payments' },
      { label: 'Monthly Living Expenses', value: '€550 – €850', subtext: 'St. Julian’s, Valletta & Sliema', icon: 'account_balance_wallet' },
      { label: 'Primary Intakes', value: 'October & February', subtext: 'Autumn & Spring intakes', icon: 'calendar_month' },
      { label: 'Part-Time Work', value: '20 Hours / Week', subtext: 'Legal work permit after 90 days', icon: 'card_travel' }
    ],
    whyStudy: {
      intro: 'Official English language, British educational traditions, Schengen zone travel, and affordable European degrees.',
      benefits: [
        { title: '2 Official Partner Institutions', desc: 'Direct representation with GBS Malta in St. Julian’s and Malita International College in Valletta.', icon: 'school' },
        { title: '100% English-Speaking Nation', desc: 'English is an official language spoken by 90%+ of the population with British-accredited diplomas and degrees.', icon: 'language' },
        { title: 'High Student Visa Success Rate', desc: 'Straightforward visa criteria through Identità Malta with GEES documentation guidance.', icon: 'verified' }
      ]
    },
    admissionRequirements: {
      undergraduate: ['HSC / A-Levels with pass marks', 'IELTS 5.5 or English MOI'],
      postgraduate: ['Bachelor degree CGPA 2.5+', 'IELTS 6.0 or alternative proficiency'],
      englishProficiency: { ielts: 'Overall 5.5 – 6.0', alternatives: ['English MOI certificate from previous institution', 'Duolingo 95+'], notes: 'Flexible English assessment for international applicants.' },
      requiredDocuments: ['Valid Passport', 'Academic Certificates', 'Curriculum Vitae', 'Bank Statement', 'Acceptance Letter']
    },
    costOfStudy: {
      currency: 'EUR',
      tuitionRangeAnnual: '€5,200 – €6,500 / year',
      livingCostMonthly: '€550 – €850 / month',
      breakdown: [{ category: 'Shared Apartment / Student Room', monthlyCost: '€250 – €450', details: 'Furnished apartment sharing in St. Julian’s, Sliema, or Valletta' }]
    },
    scholarships: [],
    intakes: [{ name: 'Autumn Session', startMonth: 'October', deadline: '31 August', status: 'Open', notes: 'Main intake.' }],
    visaProcess: [{ stepNumber: 1, title: 'National D Visa (Schengen)', description: 'Apply via VFS Global Dhaka for Malta National D Visa with approval in principle.' }],
    faqs: [
      { question: 'Which partner institutions in Malta are represented by GEES?', answer: 'GEES officially represents GBS Malta and Malita International College, offering recognized European undergraduate, master, and career diploma programs.' },
      { question: 'Can international students work in Malta?', answer: 'Yes, international students are permitted to work up to 20 hours per week after the first 90 days of study.' }
    ],
    seo: {
      title: 'Study in Malta from Bangladesh | GBS Malta & Malita College | GEES',
      description: 'Study in Malta with GEES Bangladesh. Explore GBS Malta, Malita International College, tuition fees, and Schengen student visa processing.',
      keywords: ['Study in Malta from Bangladesh', 'GBS Malta GEES', 'Malita International College GEES', 'Malta student visa Bangladesh']
    },
    lastVerifiedDate: 'October 2026'
  },
  'study-in-sweden': {
    slug: 'study-in-sweden',
    countryName: 'Sweden',
    flagEmoji: '🇸🇪',
    code: 'SE',
    currency: 'SEK',
    hero: {
      title: 'Study in Sweden from Bangladesh',
      subtitle: '10 Partner Universities, Top 100 QS Rankings & 1-Year Job Search Residence Permit',
      intro: 'Sweden is the birthplace of global tech giants like Spotify, Ericsson, and Skype, offering world-class research universities and generous post-study residence permits.',
      imageUrl: 'https://images.unsplash.com/photo-1509356843159-d6e2e8f99497?q=80&w=1200&auto=format&fit=crop'
    },
    quickFacts: [
      { label: 'Annual Tuition Fees', value: 'SEK 90,000 – 160,000', subtext: '10 partner universities & technical institutes', icon: 'payments' },
      { label: 'Monthly Living Expenses', value: 'SEK 8,500 – 12,000', subtext: 'Stockholm, Lund, Uppsala, Gothenburg', icon: 'account_balance_wallet' },
      { label: 'Primary Intakes', value: 'August (Autumn) & January', subtext: 'Main annual session', icon: 'calendar_month' },
      { label: 'Post-Study Residence', value: '1-Year Job Search Permit', subtext: 'Direct pathway to EU work permit', icon: 'card_travel' }
    ],
    whyStudy: {
      intro: 'Pioneering research, English-taught master degrees, and an innovative society that values creativity and equality.',
      benefits: [
        { title: '10 Partner Universities & Institutes', desc: 'Direct representation with Lund University, Jönköping University, Uppsala University, Chalmers University of Technology, Stockholm University, University of Gothenburg, Linköping University (LiU), Luleå University of Technology, Umeå University, and Malmö University.', icon: 'school' },
        { title: 'Top 100 Ranked Research Universities', desc: 'Lund University, Uppsala University, and Stockholm University rank among the world elite.', icon: 'military_tech' },
        { title: 'Leader in Sustainability & Tech', desc: 'Access innovative industry partnerships with Volvo, Ericsson, AstraZeneca, and Spotify.', icon: 'bolt' }
      ]
    },
    admissionRequirements: {
      undergraduate: ['HSC / A-Levels with strong STEM background', 'IELTS 6.5 with min 5.5 in each section'],
      postgraduate: ['4-year Bachelor degree (or Honours) in relevant field', 'IELTS 6.5 (Academic)'],
      englishProficiency: { ielts: 'Overall 6.5 (English 6 equivalent)', alternatives: ['TOEFL iBT 90 (min 20 writing)', 'PTE Academic 62'], notes: 'Strict Swedish National Admissions English 6 requirement.' },
      requiredDocuments: ['Valid Passport', 'Degree Certificates & Transcripts', 'English Certificate', 'Motivational Letter', 'Proof of Citizenship']
    },
    costOfStudy: {
      currency: 'SEK',
      tuitionRangeAnnual: 'SEK 90,000 – 160,000 / year',
      livingCostMonthly: 'SEK 8,500 – 12,000 / month',
      breakdown: [{ category: 'Student Housing (SSSB / LU Accommodation)', monthlyCost: 'SEK 4,000 – 6,500', details: 'Guaranteed or queuing corridor rooms' }]
    },
    scholarships: [],
    intakes: [{ name: 'Autumn Semester', startMonth: 'August', deadline: '15 January (Round 1)', status: 'Open', notes: 'National centralized UniversityAdmissions.se round.' }],
    visaProcess: [{ stepNumber: 1, title: 'Swedish Residence Permit for Higher Education', description: 'Apply online with the Swedish Migration Agency (Migrationsverket).' }],
    faqs: [
      { question: 'Which universities in Sweden are represented by GEES?', answer: 'GEES officially represents 10 leading Swedish universities and technical institutes: Lund University, Jönköping University, Uppsala University, Chalmers University of Technology, Stockholm University, University of Gothenburg, Linköping University (LiU), Luleå University of Technology, Umeå University, and Malmö University.' },
      { question: 'Can students bring family or dependents to Sweden?', answer: 'Yes, international students admitted to master or PhD degrees can bring spouses and children with full work rights.' }
    ],
    seo: {
      title: 'Study in Sweden from Bangladesh | 10 Partner Universities, Fees & Visa | GEES',
      description: 'Study in Sweden from Bangladesh with GEES. Explore 10 partner universities including Lund, Jönköping, Uppsala, Chalmers, Stockholm, and Gothenburg.',
      keywords: ['Study in Sweden from Bangladesh', 'Sweden partner universities GEES', 'Lund University GEES', 'Chalmers University GEES']
    },
    lastVerifiedDate: 'October 2026'
  }
};

// ----------------------------------------------------------------------------
// HELPER LOOKUP FUNCTIONS
// ----------------------------------------------------------------------------

/**
 * Normalizes any string or path into a destination slug (e.g. "Malaysia" -> "study-in-malaysia", "/study-in-malaysia" -> "study-in-malaysia")
 */
export function normalizeDestinationSlug(input: string): string {
  if (!input) return 'study-in-malaysia';
  let cleaned = input.trim().toLowerCase();
  
  // Strip leading slashes or .html
  cleaned = cleaned.replace(/^\/+/, '').replace(/\.html$/, '');

  if (cleaned.startsWith('study-in-')) return cleaned;
  if (cleaned.startsWith('study-')) {
    const country = cleaned.replace('study-', '');
    return `study-in-${country}`;
  }

  // Handle direct country names like "Malaysia" or "United Kingdom"
  const slugMap: Record<string, string> = {
    'usa': 'study-in-usa',
    'united states': 'study-in-usa',
    'us': 'study-in-usa',
    'america': 'study-in-usa',
    'australia': 'study-in-australia',
    'canada': 'study-in-canada',
    'cyprus': 'study-in-cyprus',
    'finland': 'study-in-finland',
    'france': 'study-in-france',
    'greece': 'study-in-greece',
    'hungary': 'study-in-hungary',
    'india': 'study-in-india',
    'malaysia': 'study-in-malaysia',
    'malta': 'study-in-malta',
    'new zealand': 'study-in-new-zealand',
    'south korea': 'study-in-south-korea',
    'korea': 'study-in-south-korea',
    'sweden': 'study-in-sweden',
    'united kingdom': 'study-in-united-kingdom',
    'uk': 'study-in-united-kingdom'
  };

  return slugMap[cleaned] || 'study-in-malaysia';
}

/**
 * Returns destination data by slug (e.g. 'study-in-malaysia')
 */
export function getDestinationDataBySlug(slug: string): StudyDestinationData {
  const normalized = normalizeDestinationSlug(slug);
  return DESTINATION_REGISTRY[normalized] || DESTINATION_REGISTRY['study-in-malaysia'];
}

/**
 * Returns destination data by country name (e.g. 'Malaysia' or 'United Kingdom')
 */
export function getDestinationDataByCountry(countryName: string): StudyDestinationData {
  const slug = normalizeDestinationSlug(countryName);
  return DESTINATION_REGISTRY[slug] || DESTINATION_REGISTRY['study-in-malaysia'];
}

/**
 * Returns all available destination slugs
 */
export function getAllDestinationSlugs(): string[] {
  return Object.keys(DESTINATION_REGISTRY);
}

/**
 * Returns all destination data objects
 */
export function getAllDestinationData(): StudyDestinationData[] {
  return Object.values(DESTINATION_REGISTRY);
}

export default {
  DESTINATION_REGISTRY,
  normalizeDestinationSlug,
  getDestinationDataBySlug,
  getDestinationDataByCountry,
  getAllDestinationSlugs,
  getAllDestinationData
};
