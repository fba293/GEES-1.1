/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Global Education Expert Services - About Us View
 */

import React from 'react';
import {
  GraduationCap,
  Globe,
  Building2,
  Users,
  Award,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  HeartHandshake,
  MapPin,
  Star,
  Target,
  Compass,
  Briefcase,
  ChevronRight,
  TrendingUp,
  FileCheck,
  MessageSquare
} from 'lucide-react';

interface AboutUsViewProps {
  onBackToHome?: () => void;
  onOpenConsultation?: () => void;
  onNavigate?: (view: string) => void;
}

export const AboutUsView: React.FC<AboutUsViewProps> = ({
  onBackToHome,
  onOpenConsultation,
  onNavigate
}) => {
  const stats = [
    { label: 'Students Placed Globally', value: '15,000+', icon: GraduationCap, color: 'from-blue-600 to-indigo-600' },
    { label: 'Visa Approval Rate', value: '98.4%', icon: FileCheck, color: 'from-emerald-600 to-teal-600' },
    { label: 'Partner Universities', value: '500+', icon: Building2, color: 'from-amber-500 to-orange-600' },
    { label: 'Global Study Destinations', value: '25+', icon: Globe, color: 'from-purple-600 to-pink-600' }
  ];

  const coreValues = [
    {
      icon: HeartHandshake,
      title: 'Student-First Integrity',
      description: 'Unbiased, transparent counseling tailored exclusively to each student’s academic aptitude, career aspirations, and financial goals.'
    },
    {
      icon: ShieldCheck,
      title: '100% Direct Partnerships',
      description: 'Official direct representation agreements with top-tier universities across UK, USA, Australia, Canada, Europe, and New Zealand.'
    },
    {
      icon: Compass,
      title: 'End-to-End Guidance',
      description: 'From course selection and SOP writing to mock visa interviews, forex assistance, and pre-departure briefings.'
    },
    {
      icon: TrendingUp,
      title: 'Proven Track Record',
      description: 'Over 14 years of excellence in international education advisory with high visa success rates and $2.5M+ in scholarships secured.'
    }
  ];

  const milestones = [
    { year: '2012', title: 'GEES Founded', desc: 'Established with a vision to democratize access to world-class higher education for ambitious international students.' },
    { year: '2016', title: '50 Direct Tie-ups', desc: 'Expanded direct university partnerships across the UK and Australia, introducing guaranteed scholarship screening.' },
    { year: '2019', title: 'Global Office Expansion', desc: 'Opened regional advisory centers in London, Toronto, Sydney, New Delhi, and Kathmandu.' },
    { year: '2022', title: '10,000 Student Milestone', desc: 'Crossed 10,000 successful placements with an industry-leading 98.4% visa approval record.' },
    { year: '2026', title: 'AI-Powered Education Matching', desc: 'Launched direct university application tracking, smart visa guidance, and 24/7 student portal access.' }
  ];

  const leadership = [
    {
      name: 'Dr. Alistair Vance',
      role: 'Founder & Chief Executive Officer',
      credentials: 'Ph.D. Education Governance (Oxon), Ex-Admissions Board Officer',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      bio: 'Over 20 years of international higher education strategy. Passionate about empowering students to study at world-leading institutions.'
    },
    {
      name: 'Elena Rostova',
      role: 'Head of Global Admissions & Compliance',
      credentials: 'M.Ed. Higher Ed Administration (Melbourne), British Council Certified Specialist',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
      bio: 'Expert in international student visa regulations and admissions criteria across UK, Australia, Canada, and Schengen states.'
    },
    {
      name: 'Rajesh Sharma',
      role: 'Director of Student Relations & Scholarships',
      credentials: 'MBA International Business (Toronto), ICEF Trained Agent Specialist',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      bio: 'Has personally guided over 3,500 students in securing merit scholarships, tuition fee waivers, and assistantships.'
    }
  ];

  const accreditations = [
    { name: 'British Council Certified', code: 'UK-EDU-9942', icon: ShieldCheck },
    { name: 'AIRC Certified Agency', code: 'US-AIRC-8821', icon: Award },
    { name: 'ICEF Trained Specialists', code: 'ICEF-IAS-4109', icon: CheckCircle2 },
    { name: 'PIER Qualified Education Agent', code: 'QEAC-AUS-1102', icon: Star }
  ];

  const officeLocations = [
    { city: 'London', country: 'United Kingdom', address: '124 Regent Street, Mayfair, London W1B 5SE', phone: '+44 20 7946 0912' },
    { city: 'Toronto', country: 'Canada', address: '200 Bay Street, Suite 1400, Toronto, ON M5J 2J2', phone: '+1 416 555 0198' },
    { city: 'Sydney', country: 'Australia', address: 'Level 22, 100 Miller St, North Sydney NSW 2060', phone: '+61 2 9123 4567' },
    { city: 'New Delhi', country: 'India', address: 'Barakhamba Road, Connaught Place, New Delhi 110001', phone: '+91 11 4321 8765' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans pb-16">
      {/* HEADER BREADCRUMB STRIP */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-2 overflow-x-auto">
            <button
              onClick={onBackToHome}
              className="hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors cursor-pointer"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
            <span className="text-slate-900 dark:text-white font-semibold whitespace-nowrap">About Us</span>
          </div>
          <div className="hidden sm:flex items-center space-x-2 text-xs text-blue-600 dark:text-blue-400 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Official University Representative</span>
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white overflow-hidden py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Global Education Expert Services</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Empowering Ambitious Minds to <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">
              Study Anywhere in the World
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg lg:text-xl text-slate-300 font-normal leading-relaxed">
            GEES is a premier international education consultancy dedicated to connecting students with accredited universities across 25+ countries through transparent advice, visa precision, and direct institutional partnerships.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={onOpenConsultation}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base transition-all transform active:scale-95 shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Book Free Global Advisory</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            {onNavigate && (
              <button
                onClick={() => onNavigate('universities')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-base border border-white/20 backdrop-blur-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Building2 className="w-5 h-5 text-blue-300" />
                <span>Explore 500+ Partner Universities</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* STATS HIGHLIGHT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col items-start justify-between space-y-3 transform transition-all hover:-translate-y-1"
              >
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white shadow-md`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* OUR MISSION & VISION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs sm:text-sm uppercase tracking-wider">
              <Target className="w-4 h-4" />
              <span>Our Purpose & Direction</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
              Bridging the Gap Between Student Dreams & World-Class Qualifications
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              Navigating international university applications, complex visa documentation, and tuition scholarship applications can be daunting. At GEES, we simplify every step into a seamless, transparent journey.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start space-x-3.5 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 mt-0.5">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Our Mission</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
                    To deliver unethical-free, student-focused educational advice and ensure every qualified candidate secures admission and visa approval for their dream program.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 mt-0.5">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Our Vision</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
                    To remain the most trusted global education advisory network, recognized by top universities and diplomatic missions for our integrity and student outcomes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200"
                alt="GEES Global Advisory Team consulting with international students"
                className="w-full h-[380px] sm:h-[480px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6 sm:p-8">
                <div className="text-white space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-400 text-sm font-bold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>4.9 / 5 Student Rating across 2,800+ Verified Reviews</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200">
                    "GEES handled my UK CAS application and visa interview seamlessly. I secured a £4,000 scholarship!"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CORE VALUES */}
      <div className="bg-slate-100 dark:bg-slate-900/60 py-16 sm:py-20 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <h2 className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
              Why Students & Parents Trust GEES
            </h2>
            <p className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Built on Transparency, Precision, & Care
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                    {value.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MILESTONES & HISTORY */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Our Growth Journey</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            14 Years of Excellence in Global Advisory
          </h2>
        </div>

        <div className="relative border-l-2 border-blue-200 dark:border-blue-900/60 ml-4 sm:ml-8 lg:ml-12 space-y-8 pl-6 sm:pl-8">
          {milestones.map((m, i) => (
            <div key={i} className="relative group">
              <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-600 border-4 border-white dark:border-slate-950 shadow-md flex items-center justify-center text-white" />
              <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-3xl">
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 font-extrabold text-xs sm:text-sm">
                  {m.year}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
                  {m.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {m.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LEADERSHIP TEAM */}
      <div className="bg-slate-100 dark:bg-slate-900/60 py-16 sm:py-20 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
              <Users className="w-3.5 h-3.5" />
              <span>Leadership & Senior Counselors</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Guided by Senior Education Leaders
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Our leadership brings decades of experience from university admissions boards, diplomatic education attachés, and international student advisory bodies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadership.map((leader, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div>
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-full h-56 sm:h-64 object-cover object-top"
                  />
                  <div className="p-6 space-y-3">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                        {leader.name}
                      </h3>
                      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                        {leader.role}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        {leader.credentials}
                      </p>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {leader.bio}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ACCREDITATIONS & GLOBAL CERTIFICATIONS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <h2 className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
            Recognized Global Standards
          </h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Official Accreditations & Certifications
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {accreditations.map((acc, idx) => {
            const Icon = acc.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center space-x-4 shadow-sm"
              >
                <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    {acc.name}
                  </h4>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    ID: {acc.code}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* OFFICE LOCATIONS */}
      <div className="bg-slate-900 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold">
              <MapPin className="w-3.5 h-3.5" />
              <span>Worldwide Presence</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Visit GEES Advisory Centers
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Walk in for a 1-on-1 counseling session with our expert country advisors or schedule a virtual appointment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {officeLocations.map((office, idx) => (
              <div
                key={idx}
                className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-3 hover:border-blue-500/60 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-white text-lg">{office.city}</h3>
                  <span className="text-xs text-blue-400 font-medium px-2 py-0.5 bg-blue-900/50 rounded-md">
                    {office.country}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {office.address}
                </p>
                <div className="text-xs text-blue-300 font-semibold pt-1">
                  {office.phone}
                </div>
              </div>
            ))}
          </div>

          {/* CTA BOTTOM BANNER */}
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 sm:p-10 text-center space-y-4 shadow-2xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to Start Your International Education Journey?
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl mx-auto">
              Schedule a personalized consultation with a senior advisor today. We evaluate your profile, match eligible programs, and guide your visa application step-by-step.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onOpenConsultation}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-blue-700 hover:bg-slate-100 font-bold text-sm transition-all transform active:scale-95 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span>Book Free Consultation Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
