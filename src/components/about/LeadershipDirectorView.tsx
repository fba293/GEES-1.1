/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Standalone Leadership & Director Page
 */

import React, { useState } from 'react';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';

interface LeadershipDirectorViewProps {
  onBackToHome?: () => void;
  onOpenConsultation?: (counselorName?: string) => void;
  onNavigate?: (view: string, payload?: any) => void;
}

export const LeadershipDirectorView: React.FC<LeadershipDirectorViewProps> = ({
  onBackToHome,
  onOpenConsultation,
}) => {
  const [selectedLeaderModal, setSelectedLeaderModal] = useState<any | null>(null);

  const executiveBoard = [
    {
      id: 'md-director',
      name: 'Engr. Mohammad Reaz',
      role: 'Founder & Managing Director',
      credentials: 'B.Sc. Engr., M.Sc. (UK), British Council Certified',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
      bio: 'Over 14+ years of visionary leadership in higher education consulting. Established official partnerships with 500+ global universities across UK, Australia, Malaysia, USA, and Canada.',
      quote: 'Our mandate is simple: Every student who walks through GEES doors deserves honest, transparent, and world-class academic guidance without hidden commercial motives.',
      specialties: ['International Strategy', 'University Alliances', 'Ethical Standards']
    },
    {
      id: 'director-admissions',
      name: 'Dr. Sarah Al-Mansoor',
      role: 'Director of International Admissions',
      credentials: 'Ph.D. Higher Ed Admin (University of Malaya)',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
      bio: 'Former university admissions dean specializing in scholarship evaluation, credit transfer compliance, and fast-track offer processing across South East Asia and Europe.',
      quote: 'We evaluate every student profile holistically, matching academic strengths with university scholarship opportunities.',
      specialties: ['Credit Transfers', 'Scholarship Advisory', 'Academic Compliance']
    },
    {
      id: 'coo-operations',
      name: 'Tanvir Hossain',
      role: 'Chief Operating Officer & Head of Visa Compliance',
      credentials: 'M.A. International Law, MARA Registered Advisor',
      photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
      bio: 'Oversees 100% document compliance and visa audit operations. Maintained GEES industry-leading 98.4% visa approval record over 12 consecutive years.',
      quote: 'A student visa application is not paperwork — it is a student’s life dream. We verify every bank statement and document with zero tolerance for error.',
      specialties: ['Visa Audit Operations', 'Embassy Compliance', 'Student Support']
    }
  ];

  const accreditations = [
    { name: 'British Council Certified', desc: 'Officially trained and certified UK education agency.', icon: 'verified' },
    { name: 'ICEF Accredited Agency', desc: 'Verified international education provider compliance.', icon: 'award_star' },
    { name: 'PIER Australia Qualified', desc: 'Certified Qualified Education Agent Counselor (QEAC).', icon: 'workspace_premium' },
    { name: 'EMGS Official Partner', desc: 'Direct registered visa support for Malaysian universities.', icon: 'domain' }
  ];

  return (
    <div className="w-full bg-white dark:bg-[#070b19] min-h-screen pb-20">
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-blue-900 via-blue-950 to-slate-950 text-white pt-12 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,176,52,0.15),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-300 hover:text-amber-400 mb-6 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Back to Home</span>
          </button>

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
              <span className="material-symbols-outlined text-sm">military_tech</span>
              <span>Executive Board & Leadership</span>
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display text-white leading-tight">
              Leadership & <span className="text-[#fbb034]">Managing Director</span>
            </h1>
            <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed">
              Guiding 15,000+ students with uncompromising integrity, certified expertise, and direct official relationships with 500+ global universities.
            </p>
          </div>

          {/* Core Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/10 text-xs">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#fbb034]">14+ Years</div>
              <div className="text-slate-300 font-medium mt-1">Excellence in Service</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white">98.4%</div>
              <div className="text-slate-300 font-medium mt-1">Visa Success Record</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#fbb034]">500+</div>
              <div className="text-slate-300 font-medium mt-1">Partner Universities</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white">100%</div>
              <div className="text-slate-300 font-medium mt-1">Transparent Fee Policy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* Director's Personal Note Column */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl mb-12 flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/3 shrink-0 text-center md:text-left">
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600"
              alt="Managing Director"
              className="w-48 h-48 sm:w-60 sm:h-60 rounded-3xl object-cover mx-auto md:mx-0 border-4 border-[#fbb034] shadow-lg"
            />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-4 font-display">Engr. Mohammad Reaz</h3>
            <p className="text-xs text-amber-500 font-bold uppercase tracking-wider">Founder & Managing Director</p>
          </div>

          <div className="w-full md:w-2/3 space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <span className="text-xs uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400 block">Message from the Managing Director</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display leading-tight">
              "Empowering students to achieve world-class education with honesty and precision."
            </h2>
            <p>
              When I founded GEES over 14 years ago, international student placement was plagued by misleading promises, hidden fees, and inaccurate visa guidance. My mission was to build a student-first agency anchored in complete transparency, accredited expertise, and genuine care.
            </p>
            <p>
              Today, having placed over 15,000 students across the UK, Australia, Malaysia, USA, and Canada, GEES stands as a beacon of trust. Our team treats every student's application as if it were for our own family member.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <InteractiveHoverButton
                text="Book Direct Executive Consultation"
                onClick={() => onOpenConsultation?.('Executive Leadership Session')}
                className="font-bold text-xs"
              />
            </div>
          </div>
        </div>

        {/* Executive Board Grid */}
        <div className="mb-16">
          <div className="max-w-2xl mb-8">
            <span className="text-xs uppercase font-bold tracking-wider text-amber-500 block mb-1">Executive Governance</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              Meet Our Board of Directors
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
              Industry veterans bringing legal, academic, and administrative rigor to global student placement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {executiveBoard.map((member) => (
              <div
                key={member.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-24 h-24 rounded-2xl object-cover mb-4 border-2 border-slate-200 dark:border-slate-700 shadow-sm"
                  />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500 block">{member.role}</span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 font-display">{member.name}</h3>
                  <p className="text-xs text-slate-400 font-medium mb-3">{member.credentials}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic mb-4">
                    "{member.quote}"
                  </p>
                </div>

                <button
                  onClick={() => setSelectedLeaderModal(member)}
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#fbb034] hover:text-slate-950 text-slate-900 dark:text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  View Director Profile
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Accreditations Grid */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg mb-16">
          <div className="max-w-2xl mb-8">
            <span className="text-xs uppercase font-bold tracking-wider text-amber-500 block mb-1">Global Compliance</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              Accreditations & Certifications
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
              Recognized and certified by major international education authorities and embassies.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {accreditations.map((acc, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="material-symbols-outlined text-3xl text-[#fbb034] mb-2 block">{acc.icon}</span>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{acc.name}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{acc.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Leader Profile Modal */}
        {selectedLeaderModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#0f172a] rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
              <button
                onClick={() => setSelectedLeaderModal(null)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <div className="flex items-center gap-4 mb-6">
                <img
                  src={selectedLeaderModal.photo}
                  alt={selectedLeaderModal.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-[#fbb034]"
                />
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider block">{selectedLeaderModal.role}</span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedLeaderModal.name}</h3>
                  <p className="text-xs text-slate-400 font-medium">{selectedLeaderModal.credentials}</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                {selectedLeaderModal.bio}
              </p>

              <div className="mb-6 space-y-2">
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Key Executive Focus Areas:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedLeaderModal.specialties.map((spec: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setSelectedLeaderModal(null);
                    onOpenConsultation?.(`Consultation session with ${selectedLeaderModal.name}'s team`);
                  }}
                  className="flex-1 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm text-center shadow-lg cursor-pointer"
                >
                  Book Session with Leadership Team
                </button>
                <button
                  onClick={() => setSelectedLeaderModal(null)}
                  className="px-6 py-3 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pre-Footer Banner CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
              Begin your journey with GEES accredited guidance
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-blue-100 leading-relaxed">
              Connect with our senior counselors for official university admission, scholarship assessment, and visa preparation.
            </p>
          </div>
          <InteractiveHoverButton
            text="Schedule Free Consultation"
            onClick={() => onOpenConsultation?.()}
            className="shrink-0 font-bold"
          />
        </div>
      </div>
    </div>
  );
};
