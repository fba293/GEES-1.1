/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Standalone K-12 International & Boarding School Admissions Services Page
 * Parent-Focused Guidance, Curricula Comparison, Age Matrix & Guardian Visa Support
 */

import React, { useState } from 'react';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';

interface SchoolAdmissionViewProps {
  onBackToHome: () => void;
  onOpenConsultation: (serviceName?: string) => void;
  onNavigate: (view: string, payload?: any) => void;
}

interface AgeMatrixItem {
  age: number;
  stage: string;
  britishYear: string;
  americanGrade: string;
  ibProgram: string;
  bangladeshEquiv: string;
  keyExam: string;
  boardingEligible: boolean;
  notes: string;
}

const AGE_MATRIX_DATA: AgeMatrixItem[] = [
  {
    age: 4,
    stage: 'Early Years / Foundation',
    britishYear: 'Reception (EYFS)',
    americanGrade: 'Pre-K / Kindergarten',
    ibProgram: 'Early Years (PYP)',
    bangladeshEquiv: 'Playgroup / Nursery',
    keyExam: 'Play-based observation',
    boardingEligible: false,
    notes: 'Focus on social development, phonics, motor skills, and inquiry-based play.'
  },
  {
    age: 6,
    stage: 'Lower Primary (KS1)',
    britishYear: 'Year 2 (Key Stage 1)',
    americanGrade: 'Grade 1 (Elementary)',
    ibProgram: 'Primary Years (PYP)',
    bangladeshEquiv: 'Class 1',
    keyExam: 'Phonics screening, basic numeracy',
    boardingEligible: false,
    notes: 'Introduction to structured reading, mathematics, science, and creative arts.'
  },
  {
    age: 8,
    stage: 'Upper Primary (KS2)',
    britishYear: 'Year 4 (Key Stage 2)',
    americanGrade: 'Grade 3 (Elementary)',
    ibProgram: 'Primary Years (PYP)',
    bangladeshEquiv: 'Class 3',
    keyExam: 'In-house reading & arithmetic tests',
    boardingEligible: false,
    notes: 'Subject expansion into humanities, physical education, and digital literacy.'
  },
  {
    age: 10,
    stage: 'Upper Primary Transition',
    britishYear: 'Year 6 (End of KS2)',
    americanGrade: 'Grade 5 (Elementary)',
    ibProgram: 'PYP Exhibition Year',
    bangladeshEquiv: 'Class 5',
    keyExam: 'CAT4 baseline, Primary Checkpoint',
    boardingEligible: true,
    notes: 'Preparation for transition into senior/middle school environment. Junior boarding available at select schools.'
  },
  {
    age: 12,
    stage: 'Lower Secondary / Middle',
    britishYear: 'Year 8 (Key Stage 3)',
    americanGrade: 'Grade 7 (Middle School)',
    ibProgram: 'Middle Years (MYP)',
    bangladeshEquiv: 'Class 7',
    keyExam: 'Lower Secondary Checkpoint, CAT4',
    boardingEligible: true,
    notes: 'Subject specialist teaching in science labs, modern foreign languages, and sports teams.'
  },
  {
    age: 14,
    stage: 'Upper Secondary / IGCSE',
    britishYear: 'Year 10 (Start of KS4)',
    americanGrade: 'Grade 9 (Freshman High)',
    ibProgram: 'MYP Year 4 / Pre-IB',
    bangladeshEquiv: 'Class 9',
    keyExam: 'Cambridge / Edexcel IGCSE Prep',
    boardingEligible: true,
    notes: 'Selection of 7 to 9 IGCSE examination subjects. Crucial milestone for global university prerequisite planning.'
  },
  {
    age: 16,
    stage: 'Sixth Form / Pre-University',
    britishYear: 'Year 12 (Sixth Form - AS/A2)',
    americanGrade: 'Grade 11 (Junior High - AP)',
    ibProgram: 'IB Diploma Programme (IBDP Year 1)',
    bangladeshEquiv: 'HSC / College 1st Year',
    keyExam: 'Cambridge A-Levels, IBDP, AP Exams',
    boardingEligible: true,
    notes: 'Pre-university specialization. Intensive pastoral support, UCAS / Common App preparation, and leadership.'
  }
];

interface CurriculumDetail {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  flag: string;
  structure: string;
  assessmentStyle: string;
  universityRecognition: string;
  bestFitFor: string;
  keySubjects: string[];
}

const CURRICULA_DATA: CurriculumDetail[] = [
  {
    id: 'british',
    name: 'British National Curriculum (Cambridge & Pearson Edexcel)',
    badge: 'Most Popular in Malaysia & UK',
    tagline: 'Deep Subject Mastery, Rigorous Academic Foundations & Global Recognition',
    flag: '🇬🇧',
    structure: 'Key Stages 1–4 culminating in IGCSEs at Age 16 (Years 10–11), followed by 2-year Cambridge International A-Levels (Years 12–13).',
    assessmentStyle: 'Standardized external examinations (Cambridge / Pearson Edexcel boards) with percentage marks and letter grades (A* to E / 9 to 1). Highly structured linear syllabus.',
    universityRecognition: '100% accepted by Oxford, Cambridge, Russell Group, Ivy League, Group of Eight Australia, and top universities in Malaysia, Singapore, and Canada.',
    bestFitFor: 'Students who excel in focused subject depths (e.g. 3–4 subjects at A-Level like Math, Physics, Chemistry for Engineering, or Biology & Chemistry for Medicine).',
    keySubjects: ['IGCSE 7-9 Subjects', 'A-Level 3-4 Specializations', 'Cambridge Lower Secondary', 'English as First / Second Language']
  },
  {
    id: 'ib',
    name: 'International Baccalaureate (IB PYP, MYP & IBDP)',
    badge: 'Holistic & Inquiry-Based',
    tagline: 'Fostering Inquiring Minds, Critical Thinking & Global Citizenship',
    flag: '🌐',
    structure: 'Full continuum covering Primary Years Programme (PYP: ages 3–12), Middle Years Programme (MYP: ages 11–16), and the 2-year IB Diploma Programme (IBDP: ages 16–19).',
    assessmentStyle: 'Holistic grading on a 1–7 scale across 6 subject groups plus the Core: Theory of Knowledge (TOK), Extended Essay (4,000 words), and CAS (Creativity, Activity, Service).',
    universityRecognition: 'Universally revered worldwide. Top universities grant sophomore credits and scholarship advantages for IB scores of 36+ points.',
    bestFitFor: 'Well-rounded students who enjoy writing, independent research, social impact, and balanced studies across languages, sciences, math, and humanities.',
    keySubjects: ['6 Subject Groups (HL & SL)', 'Theory of Knowledge (TOK)', '4,000-Word Extended Essay', 'CAS Community Projects']
  },
  {
    id: 'american',
    name: 'American Curriculum (US Common Core + Advanced Placement)',
    badge: 'Flexible & Continuous',
    tagline: 'Broad Academic Flexibility, Continuous GPA Assessment & AP College Credits',
    flag: '🇺🇸',
    structure: 'Kindergarten to Grade 12. Students accumulate graduation credits over 4 years of high school (Grades 9–12) to receive the accredited US High School Diploma.',
    assessmentStyle: 'Cumulative Grade Point Average (GPA 4.0 scale) assessed through continuous coursework, quizzes, projects, plus optional College Board AP exams (scored 1 to 5).',
    universityRecognition: 'Standard for US and Canadian university entry; recognized by UK, Australian, and Malaysian universities when paired with strong AP scores or SAT.',
    bestFitFor: 'Students seeking a collaborative, participation-heavy classroom environment with the flexibility to choose diverse electives alongside rigorous AP coursework.',
    keySubjects: ['US High School Diploma', 'Advanced Placement (AP) Courses', 'College Board SAT / ACT', 'Extracurricular Electives']
  }
];

interface VerifiedSchool {
  name: string;
  location: string;
  country: 'Malaysia' | 'United Kingdom';
  type: string;
  curriculum: string;
  ageRange: string;
  boardingOption: string;
  highlight: string;
  badge: string;
}

const VERIFIED_SCHOOLS: VerifiedSchool[] = [
  {
    name: 'Epsom College in Malaysia (ECiM)',
    location: 'Bandar Enstek, Negeri Sembilan (near KLIA)',
    country: 'Malaysia',
    type: 'Co-Educational British Boarding & Day School',
    curriculum: 'British (Cambridge IGCSE & A-Levels)',
    ageRange: 'Ages 3 – 18 (Boarding from Age 10)',
    boardingOption: 'Full, Weekly & Day Boarding',
    highlight: 'Sister school of Epsom College UK. 80-acre world-class campus with Mouratoglou Tennis Academy, ECM Golf, and LaLiga football partnerships.',
    badge: 'Elite British Boarding'
  },
  {
    name: 'Marlborough College Malaysia',
    location: 'Iskandar Puteri, Johor',
    country: 'Malaysia',
    type: 'Co-Educational British Heritage School',
    curriculum: 'British Curriculum & IB Diploma Programme (IBDP)',
    ageRange: 'Ages 3 – 18 (Boarding from Age 9)',
    boardingOption: 'Full, Weekly & Day Boarding',
    highlight: 'Direct expansion of Marlborough College Wiltshire UK. 90-acre campus featuring organic farm, lake, boarding houses, and holistic pastoral traditions.',
    badge: 'Historic Heritage'
  },
  {
    name: 'King’s Henry VIII School',
    location: 'Cyberjaya, Greater Kuala Lumpur',
    country: 'Malaysia',
    type: 'British Boarding & Day School',
    curriculum: 'British (Cambridge IGCSE & A-Levels)',
    ageRange: 'Ages 3 – 18 (Boarding from Age 11)',
    boardingOption: 'Full & Day Boarding',
    highlight: 'First overseas sister school of the 480-year-old Christ College Brecon, Wales. Modern science facilities, indoor swimming complex, and drama theatre.',
    badge: 'Sister of Christ College Wales'
  },
  {
    name: 'Fairview International School',
    location: 'Kuala Lumpur, Subang, Penang, Johor',
    country: 'Malaysia',
    type: 'IB World School Continuum',
    curriculum: 'Full International Baccalaureate (PYP, MYP, IBDP)',
    ageRange: 'Ages 3 – 18 (Day School)',
    boardingOption: 'Day School with Homestay Guidance',
    highlight: 'Malaysia’s largest network of authorized IB World Schools. Proven academic track record with graduates entering Oxford, Cambridge, and Ivy League.',
    badge: 'Authorized IB Continuum'
  },
  {
    name: 'Sunway International School (SIS)',
    location: 'Sunway City, Kuala Lumpur & Sunway Iskandar',
    country: 'Malaysia',
    type: 'Canadian & IB World School',
    curriculum: 'Ontario (Canada) Curriculum (OSSD) & IB Diploma',
    ageRange: 'Ages 3 – 18 (Day & Boarding from Age 12)',
    boardingOption: 'Modern Residence Boarding & Day',
    highlight: 'First school in Malaysia to offer the prestigious Ontario Secondary School Diploma (OSSD) alongside the IB Diploma. Taught by certified Canadian educators.',
    badge: 'Canadian OSSD & IBDP'
  },
  {
    name: 'Taylor’s International School',
    location: 'Kuala Lumpur & Puchong',
    country: 'Malaysia',
    type: 'British International Day School',
    curriculum: 'National Curriculum for England (Cambridge IGCSE)',
    ageRange: 'Ages 4 – 16 (Early Years to Year 11)',
    boardingOption: 'Day School (Parent Accompanied)',
    highlight: 'Part of the reputable Taylor’s Education Group. Character-building Quantum Learning framework, modern campus, and seamless progression to Taylor’s College/University.',
    badge: 'Affordable British Excellence'
  },
  {
    name: 'Cardiff Sixth Form College',
    location: 'Cardiff & Cambridge, United Kingdom',
    country: 'United Kingdom',
    type: 'Co-Educational Elite Sixth Form College',
    curriculum: 'British A-Levels (2-Year & 1-Year Fast Track)',
    ageRange: 'Ages 15 – 19',
    boardingOption: 'Full Boarding with 24/7 Pastoral Care',
    highlight: 'Consistently ranked #1 in the UK for A-Level academic results. Specialized pre-med, engineering, and Oxbridge preparation programs.',
    badge: 'UK #1 A-Level College'
  },
  {
    name: 'Abbey DLD Colleges',
    location: 'London, Cambridge & Manchester, United Kingdom',
    country: 'United Kingdom',
    type: 'Independent Day & Boarding Colleges',
    curriculum: 'GCSE, A-Levels & International Foundation',
    ageRange: 'Ages 13 – 19',
    boardingOption: 'Full Boarding (Urban Campus)',
    highlight: 'Iconic London South Bank campus and historic Cambridge locations offering tailor-made pastoral support for international boarders.',
    badge: 'Premier UK Urban Boarding'
  }
];

export const SchoolAdmissionView: React.FC<SchoolAdmissionViewProps> = ({
  onBackToHome,
  onOpenConsultation,
  onNavigate
}) => {
  // Interactive Age Matcher State
  const [selectedAge, setSelectedAge] = useState<number>(12);
  const matchedAgeData = AGE_MATRIX_DATA.find((item) => item.age === selectedAge) || AGE_MATRIX_DATA[4];

  // Curriculum Selector State
  const [activeCurriculum, setActiveCurriculum] = useState<string>('british');
  const selectedCurriculum = CURRICULA_DATA.find((c) => c.id === activeCurriculum) || CURRICULA_DATA[0];

  // School Destination Filter State
  const [schoolCountryFilter, setSchoolCountryFilter] = useState<'all' | 'Malaysia' | 'United Kingdom'>('all');

  // Interactive Checklist State (Child Document Preparation)
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({
    childPassport: true,
    parentPassport: true,
    schoolReports: true,
    birthCertificate: false,
    vaccinationRecords: false,
    recommendationLetter: false,
    marriageCertificate: false
  });

  const toggleDoc = (id: string) => {
    setCheckedDocs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getDocProgress = () => {
    const total = Object.keys(checkedDocs).length;
    const completed = Object.values(checkedDocs).filter(Boolean).length;
    return Math.round((completed / total) * 100);
  };

  // FAQ Accordion State
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const filteredSchools = schoolCountryFilter === 'all'
    ? VERIFIED_SCHOOLS
    : VERIFIED_SCHOOLS.filter((s) => s.country === schoolCountryFilter);

  // Honest WhatsApp consultation handler with pre-filled parent inquiry
  const handleWhatsAppConsultation = (specificTopic?: string) => {
    const message = encodeURIComponent(
      `Hello GEES Admissions, I am a parent inquiring about International & Boarding School Admissions for my child${
        specificTopic ? ` (${specificTopic})` : ''
      }. Please guide me on curriculum selection, fees, and the guardian visa process.`
    );
    window.open(`https://wa.me/601121855680?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  // Honest email consultation handler
  const handleEmailConsultation = (specificTopic?: string) => {
    const subject = encodeURIComponent(
      `Parent Consultation Request - International School Admission${specificTopic ? ` (${specificTopic})` : ''}`
    );
    const body = encodeURIComponent(
      `Dear GEES Admissions Team,\n\nI am interested in exploring international/boarding school options for my child.\n\nChild's Current Age / Grade: \nTarget Curriculum (British / IB / American): \nTarget Country (Malaysia / UK / Australia / Singapore): \nPreferred Intake (September / January): \nAccompanying Parent Visa Needed (Yes / No): \n\nPlease provide guidance on suitable schools, estimated fees, and upcoming assessment deadlines.\n\nThank you,\nParent Name: \nContact Number: `
    );
    window.location.href = `mailto:info@gees-edu.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b19] text-slate-900 dark:text-slate-100 pb-20 transition-colors duration-200">
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-14 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24 overflow-hidden bg-gradient-to-b from-[#070b19] via-[#0d152c] to-[#070b19] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,176,52,0.18),transparent_55%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_50%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 font-medium mb-6">
            <button
              onClick={onBackToHome}
              className="hover:text-[#fbb034] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Home</span>
            </button>
            <span className="text-slate-500">/</span>
            <button
              onClick={() => onNavigate('services')}
              className="hover:text-[#fbb034] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Services</span>
            </button>
            <span className="text-slate-500">/</span>
            <span className="text-[#fbb034] font-semibold">School Admission</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Heading, Subhead, Badges, CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fbb034]/15 border border-[#fbb034]/30 text-[#fbb034] text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-[#fbb034] animate-pulse" />
                <span>Parent-Focused K-12 Placement & Guardian Visa Services</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
                International School &amp;{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fbb034] via-amber-200 to-sky-300">
                  Boarding Admissions
                </span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-slate-200 font-normal leading-relaxed max-w-2xl">
                Lay the ultimate educational foundation for your child. GEES guides families from Bangladesh and across Asia into accredited British, IB World, and American international schools, premier boarding houses, and seamless parent guardian visa arrangements.
              </p>

              {/* Distinguishing School Admissions Banner */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-xs sm:text-sm text-slate-300 space-y-1.5">
                <div className="flex items-center gap-2 text-[#fbb034] font-bold text-xs uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  <span>Specialized Care for Young Learners (Ages 3–18)</span>
                </div>
                <p className="leading-relaxed">
                  Unlike university applications, school admissions prioritize child safeguarding, 24/7 boarding pastoral care, age-to-grade matching, and legal guardian visas for accompanying parents.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <InteractiveHoverButton
                  text="Book Parent Consultation"
                  className="bg-[#fbb034] text-slate-950 hover:bg-amber-400 shadow-xl shadow-amber-500/20 text-sm sm:text-base font-bold py-3.5 px-7 rounded-full"
                  onClick={() => onOpenConsultation('International School Placement')}
                />

                <button
                  onClick={() => handleWhatsAppConsultation()}
                  className="px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm sm:text-base transition-all shadow-lg shadow-emerald-900/30 flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                  <span>WhatsApp a Counselor</span>
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('age-grade-matcher');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-xs sm:text-sm transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">child_care</span>
                  <span>Age-Grade Matcher</span>
                </button>
              </div>

              {/* Trust Metric Counters */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">60+</div>
                  <div className="text-xs text-slate-300">Partner K-12 Campuses</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#fbb034]">100%</div>
                  <div className="text-xs text-slate-300">Guardian Visa Guidance</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-sky-300">Ages 3–18</div>
                  <div className="text-xs text-slate-300">Full K-12 Continuum</div>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Feature Card & Quick Overview */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden bg-slate-900/80 backdrop-blur-xl border border-white/15 p-6 sm:p-7 shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#fbb034] text-slate-950 flex items-center justify-center font-bold text-xl shadow-md">
                      🏫
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm sm:text-base">K-12 Global Gateways</h3>
                      <p className="text-xs text-slate-300">Official Assistance &amp; Direct Enrolment</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold">
                    ACTIVE 2026 INTAKES
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🇲🇾</span>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-white">Malaysia International Schools</div>
                        <div className="text-[11px] text-slate-300">British, IB &amp; American | Guardian Pass for Parents</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#fbb034] font-mono">Hub #1</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🇬🇧</span>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-white">UK Boarding &amp; Sixth Form</div>
                        <div className="text-[11px] text-slate-300">Years 7–13 | Pastoral Care &amp; Oxbridge Tracks</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-sky-300 font-mono">Elite UK</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🇦🇺</span>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-white">Australia &amp; Singapore Campuses</div>
                        <div className="text-[11px] text-slate-300">Independent private colleges &amp; IB World Schools</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-300 font-mono">Regional</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="material-symbols-outlined text-emerald-400 text-sm">lock</span>
                    <span>100% Confidential Child Profile Review</span>
                  </div>
                  <button
                    onClick={() => onOpenConsultation('Campus Visit & Admission Guide')}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#fbb034] to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg text-center cursor-pointer"
                  >
                    Request Free Parent Admissions Guide →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW SCHOOL ADMISSIONS DIFFER FROM UNIVERSITY ADMISSIONS */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-[#070b19] dark:text-[#fbb034] font-bold text-xs uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
            Crucial Distinction
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-3">
            Why School Admissions Require a Dedicated Parent Strategy
          </h2>
          <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 mt-2">
            Enrolling a minor student into an international or boarding school involves unique legal safeguards, family logistics, and developmental considerations that do not apply to independent university students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-[#fbb034] flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[26px]">family_restroom</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
              Legal Parent Guardian Visas
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Minor students under 18 cannot live alone abroad. We facilitate official Parent Guardian Passes (e.g. Malaysia LTSVP Guardian Pass) enabling mothers or fathers to reside legally with their children.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[26px]">health_and_safety</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
              24/7 Safeguarding &amp; Pastoral Care
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              For boarding students, schools act <em>in loco parentis</em>. We evaluate housemasters, dorm security, dedicated on-campus health clinics, nutritious dining, and pastoral wellness frameworks.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[26px]">psychology</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
              CAT4 &amp; Diagnostic Assessments
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Rather than GPA or IELTS, international schools use cognitive ability tests (CAT4, CEM, or WIDA) to gauge reasoning and potential. We provide diagnostic orientation and interview guidance.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[26px]">directions_bus</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
              Family Relocation Logistics
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              We assist day-school families with choosing residential neighborhoods along trusted school bus routes, arranging local medical insurance, and opening family bank accounts.
            </p>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE AGE & GRADE LEVEL ALIGNMENT MATRIX */}
      <section id="age-grade-matcher" className="py-14 sm:py-20 bg-white dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
              Interactive Alignment Tool
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-3">
              Age to Academic Grade Placement Matrix
            </h2>
            <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 mt-2">
              Cut-off dates differ between educational systems. British schools determine grade level based on the student's age on August 31st, whereas American and Asian calendars may vary. Select your child's age to inspect the exact equivalents across curricula.
            </p>
          </div>

          {/* Age Selection Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
            {AGE_MATRIX_DATA.map((item) => (
              <button
                key={item.age}
                onClick={() => setSelectedAge(item.age)}
                className={`px-4 sm:px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedAge === item.age
                    ? 'bg-[#070b19] dark:bg-[#fbb034] text-white dark:text-slate-950 shadow-lg scale-105'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>Age {item.age}</span>
                <span className="text-[10px] opacity-75">({item.britishYear.split(' ')[0]})</span>
              </button>
            ))}
          </div>

          {/* Dynamic Placement Result Card */}
          <div className="bg-slate-50 dark:bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5 mb-6">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    Child Age: {matchedAgeData.age} Years Old
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold">
                    {matchedAgeData.stage}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Cut-off benchmark: Reached age {matchedAgeData.age} before 1st September of the academic intake year.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                  matchedAgeData.boardingEligible
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                }`}>
                  {matchedAgeData.boardingEligible ? '✓ Boarding House Eligible' : 'Day Student (Parent Accompanied)'}
                </span>
              </div>
            </div>

            {/* Equivalent Systems Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                  <span>🇬🇧</span>
                  <span>British System</span>
                </div>
                <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {matchedAgeData.britishYear}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">National Curriculum for England</div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                  <span>🇺🇸</span>
                  <span>American System</span>
                </div>
                <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {matchedAgeData.americanGrade}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">US Common Core &amp; AP Tracks</div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                  <span>🌐</span>
                  <span>IB Continuum</span>
                </div>
                <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {matchedAgeData.ibProgram}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">PYP / MYP / IB Diploma</div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                  <span>🇧🇩</span>
                  <span>Bangladesh Equiv.</span>
                </div>
                <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {matchedAgeData.bangladeshEquiv}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Direct transition benchmark</div>
              </div>
            </div>

            {/* Assessment & Academic Note */}
            <div className="p-4 sm:p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-lg">school</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                    Typical Assessment Benchmark: {matchedAgeData.keyExam}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  {matchedAgeData.notes}
                </p>
              </div>

              <button
                onClick={() => onOpenConsultation(`School Placement Assessment for Age ${selectedAge}`)}
                className="whitespace-nowrap px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer shadow-sm"
              >
                Inquire for Age {selectedAge} →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMPREHENSIVE CURRICULA COMPARISON */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-[#070b19] dark:text-[#fbb034] font-bold text-xs uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
            Curriculum Selection
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-3">
            British vs. IB vs. American: Choosing the Right Academic Path
          </h2>
          <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 mt-2">
            Every curriculum nurtures different learning styles. Review the key distinctions to align with your child's personality, strengths, and long-term university ambitions.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {CURRICULA_DATA.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCurriculum(c.id)}
              className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
                activeCurriculum === c.id
                  ? 'bg-[#070b19] dark:bg-[#fbb034] text-white dark:text-slate-950 shadow-lg'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-400'
              }`}
            >
              <span className="text-lg">{c.flag}</span>
              <span>{c.name.split(' ')[0]} Curriculum</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 dark:bg-black/10 font-medium">
                {c.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Selected Curriculum Breakdown Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/90 dark:border-slate-800 shadow-xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedCurriculum.flag}</span>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {selectedCurriculum.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#070b19] dark:text-[#fbb034] font-semibold mt-0.5">
                    {selectedCurriculum.tagline}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedCurriculum.keySubjects.map((sub, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium"
                >
                  {sub}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-blue-500">account_tree</span>
                  <span>Curriculum Structure &amp; Stages</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedCurriculum.structure}
                </p>
              </div>

              <div>
                <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-amber-500">assignment_turned_in</span>
                  <span>Assessment &amp; Examination Style</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedCurriculum.assessmentStyle}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-emerald-500">public</span>
                  <span>University Recognition &amp; Pathways</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedCurriculum.universityRecognition}
                </p>
              </div>

              <div>
                <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-indigo-500">sentiment_very_satisfied</span>
                  <span>Ideal Student Profile</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedCurriculum.bestFitFor}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Not sure which curriculum suits your child? GEES counselors provide academic mapping against your child's past school performance.
            </span>
            <button
              onClick={() => onOpenConsultation(`Curriculum Guidance - ${selectedCurriculum.name}`)}
              className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs sm:text-sm font-bold hover:bg-[#070b19] transition-colors cursor-pointer"
            >
              Discuss {selectedCurriculum.name.split(' ')[0]} Admissions →
            </button>
          </div>
        </div>
      </section>

      {/* 5. VERIFIED PARTNER SCHOOLS & BOARDING HOUSES */}
      <section className="py-14 sm:py-20 bg-slate-100 dark:bg-slate-950/60 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                Authorized Institution Profiles
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-3">
                Featured International &amp; Boarding Schools
              </h2>
              <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-2xl">
                GEES assists parents with applications to accredited international schools in Malaysia, the UK, Australia, and Singapore. Only authorized and officially accredited schools are represented.
              </p>
            </div>

            {/* Country Filter Filter */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSchoolCountryFilter('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  schoolCountryFilter === 'all'
                    ? 'bg-[#070b19] dark:bg-[#fbb034] text-white dark:text-slate-950'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                }`}
              >
                All Campuses ({VERIFIED_SCHOOLS.length})
              </button>
              <button
                onClick={() => setSchoolCountryFilter('Malaysia')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  schoolCountryFilter === 'Malaysia'
                    ? 'bg-[#070b19] dark:bg-[#fbb034] text-white dark:text-slate-950'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                }`}
              >
                🇲🇾 Malaysia
              </button>
              <button
                onClick={() => setSchoolCountryFilter('United Kingdom')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  schoolCountryFilter === 'United Kingdom'
                    ? 'bg-[#070b19] dark:bg-[#fbb034] text-white dark:text-slate-950'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                }`}
              >
                🇬🇧 United Kingdom
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchools.map((school, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-[#070b19] dark:text-[#fbb034] border border-amber-200 dark:border-amber-800/60">
                      {school.badge}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {school.country === 'Malaysia' ? '🇲🇾 Malaysia' : '🇬🇧 UK'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                    {school.name}
                  </h3>

                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-slate-400">location_on</span>
                      <span>{school.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-blue-500">menu_book</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{school.curriculum}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-emerald-500">bed</span>
                      <span>{school.boardingOption}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-indigo-500">badge</span>
                      <span>{school.ageRange}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-800">
                    {school.highlight}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => onOpenConsultation(`Admissions Prospectus for ${school.name}`)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-[#070b19] dark:hover:bg-slate-700 text-white text-xs font-bold transition-all text-center cursor-pointer"
                  >
                    Request Prospectus
                  </button>
                  <button
                    onClick={() => handleWhatsAppConsultation(school.name)}
                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer flex items-center justify-center"
                    title="Inquire via WhatsApp"
                  >
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. STEP-BY-STEP ADMISSION ROADMAP */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
            Structured 6-Stage Roadmap
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-3">
            From Family Consultation to Day One in the Classroom
          </h2>
          <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 mt-2">
            GEES manages every step of your child’s enrollment journey to avoid delays, ensure smooth curriculum transition, and secure visa compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Family Profile & Academic Audit',
              desc: 'Comprehensive review of the child’s past 2-3 years report cards, academic strengths, language level, learning style, and family relocation preferences.',
              icon: 'assessment',
              badge: 'Step 1'
            },
            {
              step: '02',
              title: 'School Shortlisting & Campus Visits',
              desc: 'Tailored selection of 2–3 best-fit schools. Coordination of virtual meetings with admissions directors or physical VIP campus walkthroughs.',
              icon: 'domain',
              badge: 'Step 2'
            },
            {
              step: '03',
              title: 'Entry Assessment & CAT4 Prep',
              desc: 'Diagnostic review and practice resources for cognitive abilities (CAT4), reading comprehension, mathematics, and conversational interview preparation.',
              icon: 'quiz',
              badge: 'Step 3'
            },
            {
              step: '04',
              title: 'Application Lodgement',
              desc: 'Official submission of application forms, certified report translations, medical questionnaires, and principal recommendation references.',
              icon: 'post_add',
              badge: 'Step 4'
            },
            {
              step: '05',
              title: 'Offer Letter & Seat Deposit',
              desc: 'Receipt of formal Offer Letter. Assistance with registration fee settlement, refundable security deposit payment, and uniform/device ordering.',
              icon: 'mark_email_read',
              badge: 'Step 5'
            },
            {
              step: '06',
              title: 'Student Visa & Guardian Pass',
              desc: 'Complete filing of the child’s Student Pass and the accompanying mother/father Long-Term Social Visit Pass (Guardian Visa), housing, and settling in.',
              icon: 'airplane_ticket',
              badge: 'Step 6'
            }
          ].map((s) => (
            <div
              key={s.step}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-200 relative group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-black text-[#fbb034] opacity-35 group-hover:opacity-100 transition-opacity">
                  {s.step}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {s.badge}
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-[#070b19] dark:text-[#fbb034] flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[26px]">{s.icon}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">{s.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FAMILY RELOCATION & GUARDIAN VISA CONSIDERATIONS */}
      <section className="py-14 sm:py-20 bg-white dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-amber-600 dark:text-[#fbb034] font-bold text-xs uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                  Family Welfare &amp; Legal Stay
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-3 leading-tight">
                  Parent Guardian Visas &amp; Family Relocation
                </h2>
                <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  Moving your child to an international school involves the whole family. We provide end-to-end guidance on country-specific immigration laws for accompanying parents.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm mb-1">
                    <span>🇲🇾</span>
                    <span>Malaysia Parent Guardian Pass (LTSVP)</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    One parent (mother or father) can obtain an official Long-Term Social Visit Pass tied to the child's Student Pass, valid for 12 months and renewable annually throughout the child's school attendance.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm mb-1">
                    <span>🇬🇧</span>
                    <span>UK Parent of a Child Student Visa</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Parents of children aged 4 to 11 attending an independent fee-paying day school in the UK can apply for a Parent of a Child Student visa. For students aged 12+, full boarding school pastoral arrangements or registered UK guardians are required.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm mb-1">
                    <span>🇦🇺</span>
                    <span>Australia Student Guardian Visa (Subclass 590)</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Enables a parent, legal custodian, or relative over 21 to live in Australia to provide care and support for an international student under 18 years of age.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => onOpenConsultation('Guardian Visa Assistance')}
                  className="px-6 py-3 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs sm:text-sm hover:bg-[#070b19] transition-all cursor-pointer shadow-md"
                >
                  Check Guardian Visa Eligibility →
                </button>
                <button
                  onClick={() => onNavigate('dependent-visa')}
                  className="px-5 py-3 rounded-full border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  View Dependent Visa Details
                </button>
              </div>
            </div>

            {/* Relocation Checklist Box */}
            <div className="lg:col-span-6 bg-slate-50 dark:bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#fbb034]">home_pin</span>
                <span>Family Relocation Settling-In Checklist</span>
              </h3>

              <div className="space-y-3">
                {[
                  {
                    title: 'Condominium & Housing Selection',
                    desc: 'Safe, gated residential communities within 10–20 minutes of campus or along secured school bus routes.'
                  },
                  {
                    title: 'School Transport & Bus Service',
                    desc: 'Door-to-door vetted school bus registration with live GPS tracking and onboard female bus monitors.'
                  },
                  {
                    title: 'Family Comprehensive Health Insurance',
                    desc: 'Private medical coverage for inpatient/outpatient hospitalizations, clinic visits, and emergency evacuation.'
                  },
                  {
                    title: 'Local Banking & Currency Remittance',
                    desc: 'Assistance with opening local resident bank accounts for school fee wire transfers and living expenses.'
                  },
                  {
                    title: 'Community & Cultural Integration',
                    desc: 'Connecting with parent associations, language clubs, and local Bangladeshi and expat family networks.'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                    <span className="material-symbols-outlined text-emerald-500 text-lg mt-0.5">check_circle</span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. INTERACTIVE REQUIRED DOCUMENTS CHECKLIST & CHILD PRIVACY */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                Application Readiness
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-3">
                Required Documents Checklist
              </h2>
              <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 mt-2">
                International schools require official academic, medical, and civil records. Check off the items you currently have ready to assess your file completeness.
              </p>
            </div>

            {/* Child Privacy Disclaimer Notice */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 text-xs text-slate-800 dark:text-slate-200 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
                <span className="material-symbols-outlined text-base">privacy_tip</span>
                <span>Child Privacy &amp; Data Safeguarding Commitment</span>
              </div>
              <p className="leading-relaxed">
                GEES strictly adheres to international child data protection principles. We <strong>never request sensitive child identity records or biometric passports through public web forms</strong>, nor do we store minor personal data in unauthenticated public databases. All document verification is conducted in private, encrypted 1-on-1 consultations with certified counselors.
              </p>
            </div>

            {/* Interactive Document Checklist */}
            <div className="space-y-2.5">
              {[
                {
                  id: 'childPassport',
                  title: "Child's Passport (Min 18 Months Validity)",
                  desc: 'Clear full-color copy of bio-data page and all blank visa pages'
                },
                {
                  id: 'parentPassport',
                  title: "Accompanying Parent's Passport",
                  desc: 'Required for Guardian Visa eligibility and legal custody proof'
                },
                {
                  id: 'schoolReports',
                  title: 'Last 2 to 3 Years Academic School Reports',
                  desc: 'Official report cards with English translation from current school'
                },
                {
                  id: 'birthCertificate',
                  title: 'Official Birth Certificate (English Translated)',
                  desc: 'Attested document clearly showing both parents’ names'
                },
                {
                  id: 'vaccinationRecords',
                  title: 'Immunization & Health Record',
                  desc: 'Polio, MMR, Hepatitis, and standard childhood vaccination history'
                },
                {
                  id: 'recommendationLetter',
                  title: 'Principal / Teacher Conduct Reference',
                  desc: 'Confidential character assessment letter from current school'
                },
                {
                  id: 'marriageCertificate',
                  title: "Parents' Marriage Certificate",
                  desc: 'Mandatory for Malaysian and UK Guardian / Dependent visa filing'
                }
              ].map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => toggleDoc(doc.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    checkedDocs[doc.id]
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                        checkedDocs[doc.id]
                          ? 'bg-emerald-600 text-white'
                          : 'border border-slate-300 dark:border-slate-700 text-transparent'
                      }`}
                    >
                      ✓
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {doc.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{doc.desc}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold ${
                      checkedDocs[doc.id]
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {checkedDocs[doc.id] ? 'Ready' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Readiness Scorecard & Pre-Check CTA */}
          <div className="lg:col-span-6 sticky top-28">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    File Preparation Readiness
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Calculated from your checked checklist items
                  </p>
                </div>
                <div className="text-3xl font-black text-[#070b19] dark:text-[#fbb034]">
                  {getDocProgress()}%
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#fbb034] to-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${getDocProgress()}%` }}
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                  <span className="material-symbols-outlined text-blue-500 text-sm">support_agent</span>
                  <span>How GEES Counselors Assist:</span>
                </div>
                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400 list-disc list-inside">
                  <li>Notarial English translation verification for Bengali documents</li>
                  <li>Ministry of Foreign Affairs (MOFA) attestation guidance</li>
                  <li>Medical immunization schedule mapping against host country rules</li>
                  <li>Drafting confidential counselor reference forms</li>
                </ul>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() => onOpenConsultation('Document Pre-Check & Assessment')}
                  className="w-full py-3.5 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-[#070b19] text-white dark:text-slate-900 font-bold text-xs sm:text-sm transition-all shadow-md text-center cursor-pointer"
                >
                  Request Confidential Document Review →
                </button>
                <button
                  onClick={() => handleEmailConsultation('Document Checklist Help')}
                  className="w-full py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 text-center cursor-pointer"
                >
                  Email Us Your Checklist Questions
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. VERIFIED SCHOOL FEES & TRANSPARENT COST GUIDANCE */}
      <section className="py-14 sm:py-20 bg-slate-100 dark:bg-slate-950/60 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              Honest Financial Planning
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-3">
              Transparent Tuition &amp; Fee Structure
            </h2>
            <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 mt-2">
              International school costs consist of application fees, registration deposits, and annual tuition. All official fees are paid directly to the schools. GEES provides transparent budgeting with zero hidden markups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Malaysia Day School */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Malaysia • Day School
                  </span>
                  <span className="text-2xl">🇲🇾</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Mid-Tier International Day
                </h3>
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    RM 25,000 – 55,000
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Per Year (Approx. $5,500 – $12,000 USD)
                  </div>
                </div>
                <hr className="border-slate-100 dark:border-slate-800" />
                <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2">✓ Application / Assessment: RM 500 – 1,000</li>
                  <li className="flex items-center gap-2">✓ Registration Fee: RM 3,000 – 5,000 (one-off)</li>
                  <li className="flex items-center gap-2">✓ Refundable Security Deposit: ~1 Term Tuition</li>
                  <li className="flex items-center gap-2">✓ Parent Guardian Pass: RM 1,500/year</li>
                  <li className="flex items-center gap-2">✓ British Cambridge IGCSE Curriculum</li>
                </ul>
              </div>
              <button
                onClick={() => onOpenConsultation('Malaysia Day School Fee Guide')}
                className="w-full mt-8 py-3 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-[#070b19] text-white font-bold text-xs transition-colors text-center cursor-pointer"
              >
                Inquire for Malaysia Day Schools
              </button>
            </div>

            {/* Malaysia Elite Boarding (Featured) */}
            <div className="bg-gradient-to-b from-slate-900 via-[#0d152c] to-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-[#fbb034] shadow-2xl text-white relative flex flex-col justify-between transform lg:-translate-y-2">
              <div className="absolute -top-3.5 right-6 bg-[#fbb034] text-slate-950 px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-wider">
                PREMIER FULL BOARDING
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#fbb034] uppercase tracking-wider">
                    Malaysia • Full Boarding
                  </span>
                  <span className="text-2xl">🏰</span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  British Boarding Heritage
                </h3>
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-black text-white">
                    RM 75,000 – 140,000
                  </div>
                  <div className="text-xs text-slate-300">
                    Per Year (Tuition + Full Boarding + Meals)
                  </div>
                </div>
                <hr className="border-white/10" />
                <ul className="space-y-2.5 text-xs text-slate-200">
                  <li className="flex items-center gap-2">✓ Includes 24/7 Boarding House &amp; Dining</li>
                  <li className="flex items-center gap-2">✓ Pastoral Housemasters &amp; Onsite Nurses</li>
                  <li className="flex items-center gap-2">✓ Weekend Activities, Sports Academies &amp; Excursions</li>
                  <li className="flex items-center gap-2">✓ Epsom College, Marlborough, King's Henry VIII</li>
                  <li className="flex items-center gap-2">✓ Direct Route to Top Global Universities</li>
                </ul>
              </div>
              <button
                onClick={() => onOpenConsultation('Malaysia Boarding School Full Guide')}
                className="w-full mt-8 py-3.5 rounded-xl bg-[#fbb034] hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors text-center shadow-lg cursor-pointer"
              >
                Request Boarding Prospectus Pack
              </button>
            </div>

            {/* UK Historic Boarding */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    United Kingdom • Boarding
                  </span>
                  <span className="text-2xl">🇬🇧</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  British Independent Boarding
                </h3>
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    £30,000 – £48,000
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Per Year (Tuition, Boarding &amp; Pastoral Care)
                  </div>
                </div>
                <hr className="border-slate-100 dark:border-slate-800" />
                <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2">✓ Registration Fee: £150 – £350</li>
                  <li className="flex items-center gap-2">✓ Acceptance Deposit: ~1 Term Fee</li>
                  <li className="flex items-center gap-2">✓ UK Child Student Visa &amp; CAS Sponsorship</li>
                  <li className="flex items-center gap-2">✓ AEGIS-Accredited Guardian Facilitation</li>
                  <li className="flex items-center gap-2">✓ Cardiff Sixth Form, Concord, Abbey DLD</li>
                </ul>
              </div>
              <button
                onClick={() => onOpenConsultation('UK Boarding School Admissions')}
                className="w-full mt-8 py-3 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-[#070b19] text-white font-bold text-xs transition-colors text-center cursor-pointer"
              >
                Inquire for UK Boarding Schools
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 10. COMMON PITFALLS FOR PARENTS TO AVOID */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider bg-rose-50 dark:bg-rose-950/60 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-800">
            Admissions Advisory
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-3">
            Common Pitfalls Parents Face (And How to Avoid Them)
          </h2>
          <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 mt-2">
            Avoid common mistakes that lead to unnecessary grade demotions, visa rejections, or seat waitlists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-lg">
                ⚠️
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                1. Misinterpreting the August 31st Cut-Off Date
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              British curriculum schools adhere strictly to an August 31st age cut-off. If a child turns 14 on September 2nd, they must enter Year 9 rather than Year 10 in many institutions. GEES reviews birthdates to avoid registration disputes and appeal placement where appropriate.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-[#fbb034] flex items-center justify-center font-bold text-lg">
                ⚠️
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                2. Ignoring EAL (English as Additional Language) Quotas
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Most top international schools cap their EAL (English support) intake to maintain classroom balance. Applying late when EAL seats are full can lead to conditional deferrals. We ensure early diagnostic benchmarking to secure placement.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg">
                ⚠️
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                3. Underestimating Guardian Visa Lead Times
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              In Malaysia and the UK, parent guardian visas require marriage certificate translations, police verifications, and immigration attestations that take 4 to 8 weeks. Applying too close to term opening risks family separation.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-lg">
                ⚠️
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                4. Choosing a Curriculum Incompatible with Degree Goals
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Transitioning into UK Medical schools or competitive engineering programs requires specific A-Level subjects (Chemistry + Biology + Math) or 38+ IB points. We reverse-engineer your child’s university target into their secondary school subject choices.
            </p>
          </div>
        </div>
      </section>

      {/* 11. PARENT FAQ ACCORDION */}
      <section className="py-14 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
            Common Questions from International School Parents
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'Can a mother or father accompany their child on a Guardian Visa while attending an international school?',
              a: 'Yes. In Malaysia, one parent (mother or father) is legally entitled to apply for an official Long-Term Social Visit Pass (LTSVP Guardian Visa) tied to the minor child’s Student Pass. The visa is issued for 12 months and renewed annually. In the UK, parents of children aged 4 to 11 can apply for a Parent of a Child Student Visa. In Australia, parents can apply under the Subclass 590 Student Guardian Visa.'
            },
            {
              q: 'Can both parents accompany the child at the same time?',
              a: 'Standard immigration policy in Malaysia and most host nations allows one parent to hold the primary Guardian Pass. However, the second parent can visit frequently via multiple-entry tourist visas, obtain a digital nomad visa (DE Rantau in Malaysia), or explore MM2H (Malaysia My Second Home) residency for the entire family.'
            },
            {
              q: 'Can my child transfer from a Bangladeshi national curriculum (English or Bangla medium) to an international school?',
              a: 'Yes. Many students smoothly transition from Bangladeshi national curriculum schools into British Cambridge (IGCSE) or IB programmes. Schools evaluate past academic reports and administer age-appropriate entrance assessments. Most international schools offer English as an Additional Language (EAL) transition support.'
            },
            {
              q: 'What is the CAT4 test and how can my child prepare?',
              a: 'The Cognitive Abilities Test (CAT4) is an online standardized assessment used widely by British and international schools. It measures four core cognitive batteries: Verbal, Non-Verbal, Quantitative, and Spatial Reasoning. Unlike memory-based exams, it assesses potential. GEES provides sample orientation materials to familiarize students with the testing format and reduce test anxiety.'
            },
            {
              q: 'How safe are boarding schools for younger international students?',
              a: 'Accredited boarding schools in Malaysia and the UK maintain rigorous safeguarding standards with 24/7 campus security, live-in housemasters and matrons, on-site medical nurses, and strictly monitored campus boundaries. Boarders follow structured daily routines including supervised study periods, balanced meals, athletic coaching, and weekend excursions.'
            },
            {
              q: 'When are the main school intake dates and when should we apply?',
              a: 'The primary intake for British, IB, and American international schools is in August / September. A secondary intake occurs in January, with rolling admissions available in select grades throughout the year. We advise parents to begin the school shortlisting and assessment process 4 to 6 months prior to the intended start date.'
            },
            {
              q: 'Can our child transfer back to a Bangladeshi school or progress directly to top global universities?',
              a: 'International school qualifications such as Cambridge IGCSE, Cambridge A-Levels, and the International Baccalaureate (IBDP) are globally recognized. Students can seamlessly progress to top universities in the UK, USA, Australia, Canada, or Malaysia, or return to Bangladesh where A-Levels and IBDP are officially recognized by the Ministry of Education.'
            },
            {
              q: 'How does GEES protect our child’s sensitive data?',
              a: 'GEES treats child privacy with utmost gravity. We never publish minor student names, photos, or confidential academic results online. We do not ask parents to upload sensitive documents to unencrypted public web forms. All documentation is reviewed directly and confidentially by senior certified education counselors.'
            }
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                  {item.q}
                </span>
                <span className={`material-symbols-outlined text-slate-400 transition-transform duration-200 ${activeFaq === i ? 'rotate-180 text-[#fbb034]' : ''}`}>
                  expand_more
                </span>
              </button>
              {activeFaq === i && (
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-4">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 12. PROMINENT PARENT CONSULTATION CTA & DIRECT CONTACT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="p-8 sm:p-12 lg:p-14 rounded-3xl bg-gradient-to-r from-[#070b19] via-[#0d162f] to-[#070b19] border border-[#fbb034]/30 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#fbb034]/10 blur-3xl pointer-events-none" />

          <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fbb034]/15 border border-[#fbb034]/30 text-[#fbb034] text-xs font-semibold">
              <span className="material-symbols-outlined text-sm">handshake</span>
              <span>Dedicated Family Admissions Counselors</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Give Your Child the World-Class Education They Deserve
            </h2>

            <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Schedule a 1-on-1 private consultation with a GEES Senior K-12 Specialist. We provide customized school shortlists, fee schedules, entrance assessment guides, and complete guardian visa processing.
            </p>

            {/* Direct Channels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 max-w-xl mx-auto text-left">
              <div
                onClick={() => handleWhatsAppConsultation()}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-xl">chat</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Direct WhatsApp</div>
                  <div className="text-[11px] text-slate-300">+60 11-2185 5680 (Kuala Lumpur)</div>
                </div>
              </div>

              <div
                onClick={() => handleEmailConsultation()}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-xl">mail</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Official Email</div>
                  <div className="text-[11px] text-slate-300">info@gees-edu.com</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <InteractiveHoverButton
                text="Book Parent Consultation Session"
                className="bg-[#fbb034] text-slate-950 hover:bg-amber-400 font-bold py-3.5 px-8 rounded-full text-sm sm:text-base shadow-xl"
                onClick={() => onOpenConsultation('Comprehensive K-12 School Admissions')}
              />
            </div>

            {/* Transparent Disclaimer */}
            <p className="text-[11px] text-slate-400 max-w-xl mx-auto leading-normal pt-2">
              <strong>Honesty Disclosure:</strong> Admission acceptance decisions are strictly made by the independent schools and colleges based on their entry criteria, seat availability, and assessment outcomes. GEES does not guarantee admission decisions. All official fees are paid directly to the registered institutions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
