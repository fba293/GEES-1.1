/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Standalone Student Referral Programme Page
 * Authentic GEES Branding: Deep Navy (#0B1329), Gold (#fbb034), Royal Blue
 * Transparent Peer-to-Peer Referrals with Mandatory Consent Verification & Honest Handoff
 */

import React, { useState } from 'react';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';

interface StudentReferralViewProps {
  onBackToHome: () => void;
  onOpenConsultation: (serviceName?: string) => void;
  onNavigate: (view: string, payload?: any) => void;
}

export const StudentReferralView: React.FC<StudentReferralViewProps> = ({
  onBackToHome,
  onOpenConsultation,
  onNavigate
}) => {
  // Referrer Info
  const [referrerName, setReferrerName] = useState('');
  const [referrerPhone, setReferrerPhone] = useState('');
  const [referrerRelation, setReferrerRelation] = useState<'friend' | 'alumni' | 'parent' | 'other'>('friend');

  // Student Info
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [targetDestination, setTargetDestination] = useState('Malaysia');
  const [studyLevel, setStudyLevel] = useState('Undergraduate');
  const [hasConsent, setHasConsent] = useState(false);
  const [submittedChannel, setSubmittedChannel] = useState<'whatsapp' | 'email' | null>(null);

  // Pre-compose WhatsApp text
  const composeWhatsAppMessage = () => {
    return encodeURIComponent(
      `*GEES Student Referral Introduction*\n\n` +
      `*Referrer Details:*\n` +
      `• Name: ${referrerName || 'N/A'}\n` +
      `• Contact: ${referrerPhone || 'N/A'}\n` +
      `• Relation to Student: ${referrerRelation}\n\n` +
      `*Referred Student Details:*\n` +
      `• Student Name: ${studentName}\n` +
      `• Phone/WhatsApp: ${studentPhone}\n` +
      `• Email: ${studentEmail || 'Not provided'}\n` +
      `• Preferred Destination: ${targetDestination}\n` +
      `• Study Level: ${studyLevel}\n\n` +
      `*Consent Confirmation:* Referrer confirmed they have permission from the student to share details with GEES.`
    );
  };

  const handleWhatsAppHandoff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !studentPhone || !hasConsent) return;
    const msg = composeWhatsAppMessage();
    setSubmittedChannel('whatsapp');
    window.open(`https://wa.me/8801805529578?text=${msg}`, '_blank');
  };

  const handleEmailHandoff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !studentPhone || !hasConsent) return;
    const subject = encodeURIComponent(`Student Referral: ${studentName} - GEES Admissions`);
    const body = composeWhatsAppMessage();
    setSubmittedChannel('email');
    window.location.href = `mailto:info@gees-edu.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B1329] text-slate-900 dark:text-slate-100 pb-20 transition-colors duration-200">
      {/* HERO SECTION */}
      <section className="relative pt-24 pb-14 sm:pt-32 sm:pb-20 overflow-hidden bg-gradient-to-b from-slate-950 via-[#0B1329] to-[#0B1329] text-white border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,176,52,0.12),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 font-medium mb-6">
            <button onClick={onBackToHome} className="hover:text-[#fbb034] transition-colors cursor-pointer">
              Home
            </button>
            <span>/</span>
            <button onClick={() => onNavigate('services')} className="hover:text-[#fbb034] transition-colors cursor-pointer">
              Services
            </button>
            <span>/</span>
            <span className="text-white font-semibold">Student Referral Programme</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide">
                <span className="flex h-2 w-2 rounded-full bg-[#fbb034] animate-pulse" />
                <span>Peer-to-Peer Student Ambassador Network</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
                Help a Friend Study Abroad With <span className="text-[#fbb034]">GEES</span>
              </h1>

              <p className="text-sm sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
                Know a friend, classmate, or relative who dreams of studying at a top global university? Introduce them to GEES. Our certified counselors will provide 100% free personalized guidance, university applications, and visa support.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('referral-form');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="min-h-[44px] px-6 py-3 rounded-full bg-[#fbb034] hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">person_add</span>
                  <span>Introduce a Student Now</span>
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('how-it-works');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="min-h-[44px] px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">help_outline</span>
                  <span>How Programme Works</span>
                </button>
              </div>

              {/* Verified Program Terms Notice */}
              <div className="pt-4 border-t border-white/10 text-xs text-slate-400 flex items-start gap-2">
                <span className="material-symbols-outlined text-amber-400 text-sm shrink-0 mt-0.5">verified_user</span>
                <span>
                  Transparent & compliant: Student referrals are peer introductions. Recognition awards or token grants are subject to formal confirmation upon the student's official university enrollment and intake fee clearance.
                </span>
              </div>
            </div>

            {/* Right Card: Quick Overview Box */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-5">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#fbb034] text-slate-950 flex items-center justify-center font-black text-xl shadow-md">
                    🎓
                  </div>
                  <div>
                    <h2 className="font-bold text-white text-base">Student Referral Guidelines</h2>
                    <p className="text-xs text-slate-400">Guaranteed ethical counseling for your friend</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <span className="text-amber-400 text-lg">✓</span>
                    <div>
                      <strong className="text-white block font-semibold">100% Free Counseling for Students</strong>
                      <span>Referred students never pay agency fees or service charges to GEES.</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <span className="text-amber-400 text-lg">✓</span>
                    <div>
                      <strong className="text-white block font-semibold">Consent-First Introduction</strong>
                      <span>Ensure your friend knows and agrees before submitting their details.</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <span className="text-amber-400 text-lg">✓</span>
                    <div>
                      <strong className="text-white block font-semibold">Official University Verification</strong>
                      <span>Counselors guide the student with accredited admissions and official offer letters.</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/40 text-[11px] text-blue-200">
                  Are you an education agency, high school, or language center? Visit our{' '}
                  <button
                    onClick={() => onOpenConsultation('Institutional B2B Partnership')}
                    className="text-[#fbb034] font-bold underline cursor-pointer"
                  >
                    B2B Agency Partnership Desk
                  </button>
                  .
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHO CAN REFER */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[#fbb034] font-bold text-xs uppercase tracking-wider bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Eligibility
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3">
            Who Can Refer a Student?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
            Anyone in the GEES global community who wants to help friends access honest, top-tier study abroad counseling.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              icon: 'school',
              title: 'Current Students',
              desc: 'Enrolled students currently studying in Malaysia, UK, Australia, or Europe through GEES.'
            },
            {
              icon: 'workspace_premium',
              title: 'GEES Alumni',
              desc: 'Graduates who successfully used GEES and want to guide the next generation of students.'
            },
            {
              icon: 'family_restroom',
              title: 'Parents & Relatives',
              desc: 'Parents whose children are enrolled overseas and who want to assist other family friends.'
            },
            {
              icon: 'diversity_3',
              title: 'Community Members',
              desc: 'Teachers, mentors, and community peers helping prospective Bangladeshi students.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-3"
            >
              <div className="w-11 h-11 rounded-xl bg-amber-400/20 text-[#fbb034] flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">{item.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-12 sm:py-16 bg-slate-50 dark:bg-[#0B1329] border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[#fbb034] font-bold text-xs uppercase tracking-wider bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              4-Step Process
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3">
              How the Referral Journey Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
              Simple, transparent, and respectful of student privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Confirm Consent',
                desc: 'Speak with your friend first and make sure they are interested in speaking with a GEES education counselor.',
                icon: 'check_circle'
              },
              {
                step: '02',
                title: 'Send Introduction',
                desc: 'Submit your friend’s details via WhatsApp or email using our pre-composed referral template below.',
                icon: 'send'
              },
              {
                step: '03',
                title: 'Expert Counseling',
                desc: 'GEES provides free course evaluation, university application processing, and full visa guidance.',
                icon: 'support_agent'
              },
              {
                step: '04',
                title: 'Enrollment & Token',
                desc: 'When your friend confirms enrollment and arrives on campus, reward token details are reviewed and finalized.',
                icon: 'verified'
              }
            ].map((s) => (
              <div
                key={s.step}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-slate-200 dark:text-slate-800">{s.step}</span>
                  <span className="material-symbols-outlined text-amber-500 text-[26px]">{s.icon}</span>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{s.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REFERRAL FORM SECTION */}
      <section id="referral-form" className="py-12 sm:py-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#fbb034] uppercase tracking-wider bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Direct Referral Handoff
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Introduce a Student to GEES
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Fill in the verified details below. You can send the introduction directly to GEES admissions via WhatsApp or Email.
            </p>
          </div>

          {submittedChannel ? (
            <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-center space-y-3">
              <span className="material-symbols-outlined text-[44px] text-[#fbb034]">check_circle</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Referral Handoff Prepared!</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                Thank you for introducing <strong>{studentName}</strong>! Your message was formatted and dispatched via {submittedChannel === 'whatsapp' ? 'WhatsApp' : 'Email'}. A GEES counselor will review the profile and reach out to the student.
              </p>
              <button
                onClick={() => {
                  setSubmittedChannel(null);
                  setStudentName('');
                  setStudentPhone('');
                  setStudentEmail('');
                  setHasConsent(false);
                }}
                className="mt-3 min-h-[44px] px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs cursor-pointer active:scale-95"
              >
                Introduce Another Student
              </button>
            </div>
          ) : (
            <form className="space-y-4">
              {/* Referrer Details */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Your Details (The Referrer)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={referrerName}
                      onChange={(e) => setReferrerName(e.target.value)}
                      placeholder="e.g. Tanvir Ahmed"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-[#fbb034]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Your Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={referrerPhone}
                      onChange={(e) => setReferrerPhone(e.target.value)}
                      placeholder="e.g. +880 1711 000000"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-[#fbb034]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Relationship
                    </label>
                    <select
                      value={referrerRelation}
                      onChange={(e) => setReferrerRelation(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-[#fbb034]"
                    >
                      <option value="friend">Friend / Classmate</option>
                      <option value="alumni">GEES Alumni</option>
                      <option value="parent">Parent / Relative</option>
                      <option value="other">Community Member</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Referred Student Details */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Prospective Student Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Student Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. Sayeeda Khanam"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-[#fbb034]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Student Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(e.target.value)}
                      placeholder="e.g. +880 1811 000000"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-[#fbb034]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Student Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      placeholder="student@example.com"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-[#fbb034]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Target Destination
                    </label>
                    <select
                      value={targetDestination}
                      onChange={(e) => setTargetDestination(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-[#fbb034]"
                    >
                      <option value="Malaysia">Malaysia</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="New Zealand">New Zealand</option>
                      <option value="Cyprus">Cyprus</option>
                      <option value="Europe">Europe (Finland, Belgium, Greece, Netherlands)</option>
                      <option value="Undecided">Undecided / Exploring Options</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Mandatory Consent Checkbox */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-400/30 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="consent-check"
                  checked={hasConsent}
                  onChange={(e) => setHasConsent(e.target.checked)}
                  className="mt-0.5 accent-[#fbb034] cursor-pointer"
                />
                <label htmlFor="consent-check" className="text-xs text-slate-700 dark:text-slate-300 leading-snug cursor-pointer">
                  <strong>Consent Confirmation:</strong> I confirm that I have informed this student about GEES and have obtained their explicit permission to share their contact details for higher education counseling.
                </label>
              </div>

              {/* Honest Dual-Action Handoff Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  disabled={!studentName || !studentPhone || !hasConsent}
                  onClick={handleWhatsAppHandoff}
                  className="min-h-[44px] py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-98"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  <span>Send via WhatsApp (+8801805529578)</span>
                </button>
                <button
                  type="button"
                  disabled={!studentName || !studentPhone || !hasConsent}
                  onClick={handleEmailHandoff}
                  className="min-h-[44px] py-3 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-98"
                >
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                  <span>Send via Email (info@gees-edu.com)</span>
                </button>
              </div>

              <p className="text-[11px] text-center text-slate-400 pt-1">
                Note: Submissions are not automatically written to an unverified database. This directly dispatches your referral to official GEES admissions advisors for immediate follow-up.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200/80 dark:border-slate-800">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Referral Programme FAQs
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
            Clear, honest answers regarding eligibility, consent, and enrollment terms.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'Will my referred friend have to pay GEES any consultancy fees?',
              a: 'No. GEES provides 100% free guidance, course shortlisting, application filing, and visa counseling to prospective students. We never charge consultancy fees or surprise deposits.'
            },
            {
              q: 'Why is student consent required before submitting a referral?',
              a: 'We respect personal data privacy. We only contact prospective students who are genuinely interested and have consented to be contacted by our senior counseling team.'
            },
            {
              q: 'How are referral recognition tokens or rewards handled?',
              a: 'Referral tokens or ambassador recognition grants are determined based on participating partner university policies, formal enrollment confirmation, and tuition settlement for the intake term. Terms vary by institution and country.'
            },
            {
              q: 'Can educational agencies or language schools use this form?',
              a: 'This form is reserved for personal, peer-to-peer student introductions. Educational agencies, coaching centers, and schools should register directly through our official Institutional B2B Partnership Desk.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1.5"
            >
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">{item.q}</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SEPARATE B2B AGENCY NOTICE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 text-white border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs font-bold text-[#fbb034] uppercase tracking-wider">
              Institutional Channel
            </span>
            <h3 className="text-xl sm:text-2xl font-black">Are You an Education Agency or School?</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Access formal institutional representation agreements, direct university portal submissions, and counselor training across 167+ global partner institutions.
            </p>
          </div>
          <InteractiveHoverButton
            text="Institutional B2B Desk"
            className="min-h-[44px] px-6 py-3 rounded-full bg-[#fbb034] text-slate-950 font-bold text-xs sm:text-sm shrink-0 shadow-md"
            onClick={() => onOpenConsultation('Institutional B2B Partnership')}
          />
        </div>
      </section>
    </div>
  );
};
