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
  // AUSTRALIA
  // ----------------------------------------------------------------------------
  'study-in-australia': {
    slug: 'study-in-australia',
    countryName: 'Australia',
    flagEmoji: '🇦🇺',
    code: 'AU',
    currency: 'AUD',
    hero: {
      title: 'Study in Australia from Bangladesh',
      subtitle: 'Group of Eight Research Excellence, High Wages & Post-Study Work Visas',
      intro: 'Australia offers world-leading universities, protected minimum wages for student workers, and up to 4-year Subclass 485 Temporary Graduate visas.',
      imageUrl: 'https://www.worldbank.org/ext/en/country/media_15f31f5babc696917cc95a74bc9e62ceca811efec.jpg?width=1200&format=pjpg&optimize=medium'
    },
    quickFacts: [
      {
        label: 'Annual Tuition Fees',
        value: 'AUD $24,000 – $45,000',
        subtext: 'World top 100 Group of Eight institutions',
        icon: 'payments'
      },
      {
        label: 'Monthly Living Expenses',
        value: 'AUD $1,800 – $2,500',
        subtext: 'Official CRICOS maintenance threshold AUD $29,710/yr',
        icon: 'account_balance_wallet'
      },
      {
        label: 'Primary Intakes',
        value: 'February & July',
        subtext: 'Semester 1 & Semester 2 entries',
        icon: 'calendar_month'
      },
      {
        label: 'Post-Study Work Visa',
        value: '2 – 4 Years Subclass 485',
        subtext: 'Extended stay for regional campus graduates',
        icon: 'card_travel'
      },
      {
        label: 'Part-Time Work Limit',
        value: '48 Hours per Fortnight',
        subtext: 'Protected statutory minimum hourly wage',
        icon: 'alarm'
      },
      {
        label: 'Scholarship Support',
        value: '15% – 30% Tuition Reduction',
        subtext: 'Destination Australia & Vice-Chancellor grants',
        icon: 'card_membership'
      }
    ],
    whyStudy: {
      intro: 'Australia delivers top QS ranked universities, enviable quality of life, clear visa pathways, and exceptional global career recognition.',
      benefits: [
        {
          title: 'Group of Eight (Go8) World Leadership',
          desc: '7 Australian universities rank in the global top 50, delivering research power in IT, engineering, biotechnology, and healthcare.',
          icon: 'military_tech'
        },
        {
          title: 'Generous Post-Study Work Rights',
          desc: 'Subclass 485 Temporary Graduate visa enables international graduates to live, work, and gain Australian industry experience.',
          icon: 'work_outline'
        },
        {
          title: 'Protected High Minimum Student Wages',
          desc: 'Australia enforces statutory minimum wages (AUD $23.23+/hr) for student workers, ensuring fair workplace compensation.',
          icon: 'monetization_on'
        },
        {
          title: 'Vibrant Multicultural Lifestyle',
          desc: 'Sydney, Melbourne, and Brisbane consistently feature among the world’s top 10 most liveable cities.',
          icon: 'emoji_emotions'
        }
      ]
    },
    admissionRequirements: {
      undergraduate: [
        'HSC with GPA 4.00+ or Foundation / Diploma pathway entry',
        'IELTS Overall 6.0 - 6.5 (Minimum 6.0 in each band)'
      ],
      postgraduate: [
        '4-Year Bachelor’s Degree with Minimum CGPA 2.75 out of 4.00',
        'IELTS Overall 6.5 (Minimum 6.0 in each band) or PTE 58'
      ],
      englishProficiency: {
        ielts: 'Overall 6.0 - 6.5 required for Subclass 500 Student Visa',
        alternatives: ['PTE Academic: 50 - 58', 'TOEFL iBT: 64 - 79'],
        notes: 'English ELICOS pre-sessional packages available.'
      },
      requiredDocuments: [
        'Valid Passport & National ID',
        'Certified Academic Transcripts (SSC, HSC, Bachelor’s)',
        'IELTS / PTE Official Test Report',
        'Genuine Student (GS) Assessment Statement',
        'Bank Solvency & Financial Source Proof'
      ]
    },
    costOfStudy: {
      currency: 'AUD',
      tuitionRangeAnnual: 'AUD $24,000 – $45,000 / year',
      livingCostMonthly: 'AUD $1,800 – $2,500 / month',
      breakdown: [
        {
          category: 'Accommodation (Shared Apartment / Student Housing)',
          monthlyCost: 'AUD $800 – $1,400',
          details: 'Melbourne/Sydney vs. Adelaide/Perth'
        },
        {
          category: 'Food & Daily Groceries',
          monthlyCost: 'AUD $400 – $600',
          details: 'Supermarkets and local Asian food markets'
        }
      ]
    },
    scholarships: [
      {
        name: 'Australian Government Destination Australia Award',
        provider: 'Department of Education Australia',
        eligibility: 'Students studying at regional Australian campuses',
        coverageType: 'Partial',
        coverageDetails: 'Up to AUD $15,000 per year towards tuition & living'
      }
    ],
    intakes: [
      {
        name: 'Semester 1 Primary Intake',
        startMonth: 'February / March',
        deadline: '30 November',
        status: 'Open',
        notes: 'Main intake term across all universities.'
      },
      {
        name: 'Semester 2 Mid-Year Intake',
        startMonth: 'July / August',
        deadline: '30 April',
        status: 'Upcoming',
        notes: 'Secondary intake term for major faculties.'
      }
    ],
    visaProcess: [
      {
        stepNumber: 1,
        title: 'Profile Evaluation & Genuine Student (GS) Check',
        description: 'GEES counselors review your academic history, English score, and financial capacity.',
        processingTime: '1 - 2 Days'
      },
      {
        stepNumber: 2,
        title: 'University Offer & CoE (Confirmation of Enrolment) Issuance',
        description: 'Obtain Offer Letter, pay 1st semester deposit & OSHC insurance, receive official CoE.',
        processingTime: '2 - 3 Weeks'
      },
      {
        stepNumber: 3,
        title: 'Subclass 500 Student Visa Lodgement',
        description: 'Lodge visa online via ImmiAccount with GS statement, biometric appointment, and medical exam.',
        processingTime: '3 - 6 Weeks'
      }
    ],
    faqs: [
      {
        question: 'What is the Genuine Student (GS) requirement for Australia student visa?',
        answer: 'The GS requirement assesses whether an applicant genuinely intends to obtain a quality education in Australia, considering academic background, career plan, and economic ties to Bangladesh.',
        keyPoints: [
          'GEES conducts thorough GS statement drafting assistance',
          'Clear progression between previous education and chosen course required'
        ]
      }
    ],
    seo: {
      title: 'Study in Australia from Bangladesh | Universities, Visa & CoE | GEES',
      description: 'Study in Australia from Bangladesh. Compare Go8 universities, CRICOS courses, AUD tuition fees, Subclass 500 student visa, and 485 PSW visas with GEES.',
      keywords: ['Study in Australia from Bangladesh', 'Australia student visa Subclass 500', 'Australia CoE processing', 'GEES Australia university']
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
  // NETHERLANDS
  // ----------------------------------------------------------------------------
  'study-in-netherlands': {
    slug: 'study-in-netherlands',
    countryName: 'Netherlands',
    flagEmoji: '🇳🇱',
    code: 'NL',
    currency: 'EUR',
    hero: {
      title: 'Study in the Netherlands from Bangladesh',
      subtitle: 'Continental Europe’s #1 English-Taught Higher Education Leader',
      intro: 'The Netherlands offers over 2,100 English-taught degree programs, 13 global top-200 universities, and the 1-year Zoekjaar Orientation Year job visa.',
      imageUrl: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?q=80&w=1200&auto=format&fit=crop'
    },
    quickFacts: [
      { label: 'Annual Tuition Fees', value: '€8,000 – €16,000', subtext: 'Top research & applied sciences unis', icon: 'payments' },
      { label: 'Monthly Living Expenses', value: '€900 – €1,400', subtext: 'Amsterdam, Rotterdam, Utrecht', icon: 'account_balance_wallet' },
      { label: 'Primary Intakes', value: 'September & February', subtext: 'Fall & Spring semesters', icon: 'calendar_month' },
      { label: 'Post-Study Work Visa', value: '1 Year Zoekjaar (Orientation Year)', subtext: 'Search for high-skilled tech jobs', icon: 'card_travel' }
    ],
    whyStudy: {
      intro: 'Innovative problem-based learning, highly international student environment, and direct gateway to European career markets.',
      benefits: [
        { title: '#1 English-Taught Programs in EU', desc: 'Over 2,100 accredited degree programs taught 100% in English.', icon: 'translate' },
        { title: 'Zoekjaar 1-Year Job Search Visa', desc: 'Graduates can search for high-skilled jobs across the Dutch innovation economy.', icon: 'work_outline' }
      ]
    },
    admissionRequirements: {
      undergraduate: ['HSC + 1 Year University or A-Levels', 'IELTS 6.0'],
      postgraduate: ['Bachelor’s degree CGPA 3.00+', 'IELTS 6.5'],
      englishProficiency: { ielts: 'Overall 6.0 - 6.5', alternatives: ['TOEFL 80', 'PTE 58'], notes: 'Internal tests not accepted.' },
      requiredDocuments: ['Passport', 'Transcripts', 'IELTS Score', 'Nuffic Certificate (if required)']
    },
    costOfStudy: {
      currency: 'EUR',
      tuitionRangeAnnual: '€8,000 – €16,000 / year',
      livingCostMonthly: '€900 – €1,400 / month',
      breakdown: [{ category: 'Student Housing', monthlyCost: '€450 – €850', details: 'Student housing corporation rooms' }]
    },
    scholarships: [],
    intakes: [{ name: 'September Intake', startMonth: 'September', deadline: '1 May', status: 'Open', notes: 'Primary intake.' }],
    visaProcess: [{ stepNumber: 1, title: 'MVV / VVR Visa Process', description: 'Dutch university lodges MVV visa on your behalf.' }],
    faqs: [{ question: 'Do Dutch universities teach in English?', answer: 'Yes, over 2,100 programs are taught 100% in English.' }],
    seo: {
      title: 'Study in the Netherlands from Bangladesh | Universities & Visa | GEES',
      description: 'Study in the Netherlands from Bangladesh. Compare Dutch research universities, English-taught programs, tuition fees, and Zoekjaar orientation visa with GEES.',
      keywords: ['Study in Netherlands from Bangladesh', 'Dutch university tuition', 'Zoekjaar visa', 'GEES Netherlands']
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
  // BELGIUM
  // ----------------------------------------------------------------------------
  'study-in-belgium': {
    slug: 'study-in-belgium',
    countryName: 'Belgium',
    flagEmoji: '🇧🇪',
    code: 'BE',
    currency: 'EUR',
    hero: {
      title: 'Study in Belgium from Bangladesh',
      subtitle: 'Capital of the European Union & Home to Historic KU Leuven',
      intro: 'Study at the heart of European diplomacy and business in Brussels, Leuven, or Ghent with low public university tuition and high global recognition.',
      imageUrl: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=1200&auto=format&fit=crop'
    },
    quickFacts: [
      { label: 'Annual Tuition Fees', value: '€1,000 – €4,500', subtext: 'Affordable public European tuition', icon: 'payments' },
      { label: 'Monthly Living Expenses', value: '€800 – €1,100', subtext: 'Brussels & Flanders region', icon: 'account_balance_wallet' },
      { label: 'Primary Intakes', value: 'September & February', subtext: 'Fall & Spring terms', icon: 'calendar_month' },
      { label: 'Post-Study Work', value: '1-Year EU Search Year', subtext: 'Work across EU headquarters', icon: 'card_travel' }
    ],
    whyStudy: {
      intro: 'Unrivalled proximity to EU institutions, NATO, and global corporate headquarters with highly affordable tuition.',
      benefits: [
        { title: 'EU Headquarters Location', desc: 'Direct exposure to international law, diplomacy, tech, and multilateral business.', icon: 'apartment' },
        { title: 'Very Low Tuition Fees', desc: 'Public university tuition starts as low as €1,000 to €4,500 per year.', icon: 'savings' }
      ]
    },
    admissionRequirements: {
      undergraduate: ['HSC / A-Levels + APS / Equivalency', 'IELTS 6.0'],
      postgraduate: ['Bachelor’s degree CGPA 2.75+', 'IELTS 6.5'],
      englishProficiency: { ielts: 'Overall 6.0 - 6.5', alternatives: ['TOEFL 79'], notes: 'Standard SELT requirements.' },
      requiredDocuments: ['Passport', 'Transcripts', 'IELTS Score', 'Sponsorship proof']
    },
    costOfStudy: {
      currency: 'EUR',
      tuitionRangeAnnual: '€1,000 – €4,500 / year',
      livingCostMonthly: '€800 – €1,100 / month',
      breakdown: [{ category: 'Student Room (Kot)', monthlyCost: '€380 – €600', details: 'Standard Belgian student accommodation' }]
    },
    scholarships: [],
    intakes: [{ name: 'Fall Intake', startMonth: 'September', deadline: '1 April', status: 'Open', notes: 'Main intake.' }],
    visaProcess: [{ stepNumber: 1, title: 'Belgian Student Visa (Type D)', description: 'Lodge application via Embassy / VFS in Dhaka/Delhi.' }],
    faqs: [{ question: 'How much does it cost to study in Belgium?', answer: 'Tuition is among Europe’s lowest, averaging €1,000 to €4,500 per year.' }],
    seo: {
      title: 'Study in Belgium from Bangladesh | Universities & Visa | GEES',
      description: 'Study in Belgium from Bangladesh. Explore low-cost public European universities, KU Leuven programs, EU search year, and Type D visa with GEES.',
      keywords: ['Study in Belgium from Bangladesh', 'Belgium university tuition', 'Belgian student visa', 'GEES Belgium']
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
  // MAURITIUS
  // ----------------------------------------------------------------------------
  'study-in-mauritius': {
    slug: 'study-in-mauritius',
    countryName: 'Mauritius',
    flagEmoji: '🇲🇺',
    code: 'MU',
    currency: 'USD',
    hero: {
      title: 'Study in Mauritius from Bangladesh',
      subtitle: 'Tropical Island Higher Education Capital & UK Branch Campuses',
      intro: 'Earn prestigious British and French degrees at Middlesex University Mauritius or Curtin Mauritius on a safe, sun-drenched island in the Indian Ocean.',
      imageUrl: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=1200&auto=format&fit=crop'
    },
    quickFacts: [
      { label: 'Annual Tuition Fees', value: '$3,000 – $6,500', subtext: 'Affordable UK & Australian branch campuses', icon: 'payments' },
      { label: 'Monthly Living Expenses', value: '$350 – $550', subtext: 'Low cost of island living', icon: 'account_balance_wallet' },
      { label: 'Primary Intakes', value: 'September & March', subtext: 'Fall & Spring terms', icon: 'calendar_month' },
      { label: 'Post-Study Work', value: 'YEP Work Permit Scheme', subtext: 'Post-study employment pathways', icon: 'card_travel' }
    ],
    whyStudy: {
      intro: 'Direct branch campuses of Middlesex UK and Curtin Australia in a safe, tropical, bilingual environment.',
      benefits: [
        { title: 'UK Branch Campuses', desc: 'Study at Middlesex University Mauritius and receive the exact same UK degree parchment.', icon: 'school' },
        { title: 'Safe Tropical Haven', desc: 'Ranked Africa’s safest nation with warm hospitality and familiar island climate.', icon: 'beach_access' }
      ]
    },
    admissionRequirements: {
      undergraduate: ['HSC GPA 3.00+ or O/A Levels', 'IELTS 5.5 or MOI'],
      postgraduate: ['Bachelor’s degree CGPA 2.50+', 'IELTS 6.0 or MOI'],
      englishProficiency: { ielts: 'Overall 5.5 - 6.0', alternatives: ['MOI Certificate', 'Internal English Test'], notes: 'Flexible criteria.' },
      requiredDocuments: ['Passport', 'Transcripts', 'Medical Check', 'Bank Solvency']
    },
    costOfStudy: {
      currency: 'USD',
      tuitionRangeAnnual: '$3,000 – $6,500 / year',
      livingCostMonthly: '$350 – $550 / month',
      breakdown: [{ category: 'Student Residence / Flat', monthlyCost: '$200 – $350', details: 'Uniciti Student Residence in Moka' }]
    },
    scholarships: [],
    intakes: [{ name: 'September Intake', startMonth: 'September', deadline: '31 July', status: 'Open', notes: 'Main intake.' }],
    visaProcess: [{ stepNumber: 1, title: 'Mauritius Student Visa', description: 'Passport endorsement handled by university registrar upon arrival.' }],
    faqs: [{ question: 'Is Mauritius good for Bangladeshi students?', answer: 'Yes, it offers UK branch campus degrees at very low tuition with smooth visa processing.' }],
    seo: {
      title: 'Study in Mauritius from Bangladesh | UK Branch Campuses & Visa | GEES',
      description: 'Study in Mauritius from Bangladesh. Compare Middlesex University Mauritius tuition, Curtin Australia courses, and student visa process with GEES.',
      keywords: ['Study in Mauritius from Bangladesh', 'Middlesex Mauritius tuition', 'Mauritius student visa', 'GEES Mauritius']
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
    'malaysia': 'study-in-malaysia',
    'united kingdom': 'study-in-united-kingdom',
    'uk': 'study-in-united-kingdom',
    'australia': 'study-in-australia',
    'new zealand': 'study-in-new-zealand',
    'netherlands': 'study-in-netherlands',
    'finland': 'study-in-finland',
    'belgium': 'study-in-belgium',
    'cyprus': 'study-in-cyprus',
    'greece': 'study-in-greece',
    'mauritius': 'study-in-mauritius',
    'india': 'study-in-india'
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
