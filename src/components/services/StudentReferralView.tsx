/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Standalone Student Referral & B2B Partner Program Page
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
  // Calculator State
  const [studentCount, setStudentCount] = useState<number>(3);
  const [targetRegion, setTargetRegion] = useState<string>('UK & Europe');
  const [partnerType, setPartnerType] = useState<'ambassador' | 'b2b'>('ambassador');

  // Referral Submission Form State
  const [refStudentName, setRefStudentName] = useState('');
  const [refStudentPhone, setRefStudentPhone] = useState('');
  const [refStudentEmail, setRefStudentEmail] = useState('');
  const [refCountry, setRefCountry] = useState('United Kingdom');
  const [refSubmitted, setRefSubmitted] = useState(false);

  const calculateEarnings = () => {
    let ratePerStudent = 350; // base ambassador rate in USD
    if (targetRegion === 'UK & Europe') ratePerStudent = 500;
    if (targetRegion === 'Australia & NZ') ratePerStudent = 600;
    if (targetRegion === 'USA & Canada') ratePerStudent = 700;
    if (targetRegion === 'Malaysia & Asia') ratePerStudent = 300;

    if (partnerType === 'b2b') {
      ratePerStudent = Math.round(ratePerStudent * 1.5);
    }

    return studentCount * ratePerStudent;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refStudentName || !refStudentPhone) return;
    setRefSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080d1a] text-slate-900 dark:text-slate-100 pb-20 transition-colors duration-200">
      {/* HERO SECTION */}
      <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-950 to-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.25),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-300 font-medium mb-6">
            <button onClick={onBackToHome} className="hover:underline flex items-center gap-1 cursor-pointer">
              <span>Home</span>
            </button>
            <span>/</span>
            <button onClick={() => onNavigate('services')} className="hover:underline flex items-center gap-1 cursor-pointer">
              <span>Services</span>
            </button>
            <span>/</span>
            <span className="text-white font-semibold">Student Referral</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Earn Cash Rewards for Every Successful Student Enrollment</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white">
                Student Referral & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-sky-300">Partner Program</span>
              </h1>

              <p className="text-base sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
                Empower friends and peers to study abroad while earning generous referral rewards. Whether you are a student ambassador or an education agency, GEES provides transparent tracking and guaranteed payouts.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <InteractiveHoverButton
                  text="Submit a Student Referral Now"
                  className="bg-emerald-600 text-white hover:bg-emerald-500 shadow-xl shadow-emerald-900/40 text-sm sm:text-base font-bold py-3.5 px-7 rounded-full"
                  onClick={() => {
                    const el = document.getElementById('referral-form');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                />
                <button
                  onClick={() => {
                    const el = document.getElementById('reward-calculator');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm sm:text-base transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">payments</span>
                  <span>Calculate Earnings</span>
                </button>
              </div>

              {/* Stat Highlights */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">$1,000+</div>
                  <div className="text-xs text-emerald-200">Max Payout per Student</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">100%</div>
                  <div className="text-xs text-emerald-200">Transparent Portal</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-sky-300">14 Days</div>
                  <div className="text-xs text-emerald-200">Post-Enrollment Payout</div>
                </div>
              </div>
            </div>

            {/* Right Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 p-6 shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-lg">
                      🤝
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">Two Flexible Partnership Tracks</h3>
                      <p className="text-xs text-slate-300">For Students, Alumni & B2B Agencies</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🎓</span>
                      <div>
                        <div className="text-xs font-bold text-white">Student & Alumni Ambassadors</div>
                        <div className="text-[11px] text-slate-300">Earn $300 - $700 cash per referred friend</div>
                      </div>
                    </div>
                    <span className="text-xs text-emerald-300 font-semibold font-mono">No Fee</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🏢</span>
                      <div>
                        <div className="text-xs font-bold text-white">B2B Education Agencies & Schools</div>
                        <div className="text-[11px] text-slate-300">Commission sharing & white-label support</div>
                      </div>
                    </div>
                    <span className="text-xs text-sky-300 font-semibold font-mono">B2B Rate</span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenConsultation('B2B Partner Registration')}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg text-center cursor-pointer"
                >
                  Register as an Official GEES Partner →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            3-Step Process
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3">
            How the Referral Program Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
            Simple, stress-free, and completely transparent. We handle all counseling, visa documentation, and university communication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Submit Student Lead',
              desc: 'Enter your referred student details through our online portal or mobile drawer form. Your referral is instantly locked under your partner ID.',
              icon: 'person_add',
              color: 'text-emerald-600'
            },
            {
              step: '02',
              title: 'GEES Admission & Visa Processing',
              desc: 'Our certified counselors guide the student through course selection, university applications, offer letter issuance, and student visa approval.',
              icon: 'school',
              color: 'text-blue-600'
            },
            {
              step: '03',
              title: 'Get Paid Upon Enrollment',
              desc: 'Once your referred student completes campus registration and tuition payment, your reward is transferred directly via bank transfer or digital payout.',
              icon: 'paid',
              color: 'text-amber-500'
            }
          ].map((s) => (
            <div
              key={s.step}
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm relative space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-4xl font-black text-slate-200 dark:text-slate-800">{s.step}</span>
                <span className={`material-symbols-outlined text-[32px] ${s.color}`}>{s.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{s.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* REWARD CALCULATOR */}
      <section id="reward-calculator" className="py-16 bg-white dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Payout Estimator
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Calculate Your Referral Payout Potential
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Rewards increase based on student destination and partnership volume tier. No capping on maximum referral earnings!
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                  <span>Paid directly via direct bank transfer, PayPal, or Wise</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                  <span>Real-time tracking of student offer & visa status</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                  <span>Dedicated referral manager assigned to high-volume B2B partners</span>
                </div>
              </div>
            </div>

            {/* Interactive Calculator */}
            <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Partnership Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPartnerType('ambassador')}
                      className={`py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                        partnerType === 'ambassador'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      Student / Alumni
                    </button>
                    <button
                      type="button"
                      onClick={() => setPartnerType('b2b')}
                      className={`py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                        partnerType === 'b2b'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      B2B Agency
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Target Study Region
                  </label>
                  <select
                    value={targetRegion}
                    onChange={(e) => setTargetRegion(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="UK & Europe">United Kingdom & Europe</option>
                    <option value="Australia & NZ">Australia & New Zealand</option>
                    <option value="USA & Canada">USA & Canada</option>
                    <option value="Malaysia & Asia">Malaysia & Asian Campuses</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  <span>Number of Referred Enrolled Students:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">{studentCount} Students</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={studentCount}
                  onChange={(e) => setStudentCount(Number(e.target.value))}
                  className="w-full accent-emerald-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Total Payout Result */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950 to-slate-900 border border-emerald-500/30 text-white text-center space-y-2">
                <div className="text-xs uppercase tracking-wider text-emerald-300 font-bold">Estimated Total Referral Reward</div>
                <div className="text-4xl sm:text-5xl font-black text-emerald-400">
                  ${calculateEarnings().toLocaleString()} USD
                </div>
                <div className="text-[11px] text-slate-300">
                  Based on {studentCount} student enrollment(s) to {targetRegion} under {partnerType === 'ambassador' ? 'Ambassador Rate' : 'B2B Commission Rate'}.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE REFERRAL SUBMISSION FORM */}
      <section id="referral-form" className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Quick Lead Submission
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Refer a Student Today
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Fill in the student's contact details below. Our team will contact them within 24 hours for a free study abroad profile evaluation.
            </p>
          </div>

          {refSubmitted ? (
            <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center space-y-3">
              <span className="material-symbols-outlined text-[48px] text-emerald-600">check_circle</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Referral Submitted Successfully!</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                Thank you! We have logged your referral for <strong>{refStudentName}</strong>. Our counselor will contact them shortly, and you will receive status updates via email.
              </p>
              <button
                onClick={() => setRefSubmitted(false)}
                className="mt-4 px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors cursor-pointer"
              >
                Submit Another Student Referral
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={refStudentName}
                    onChange={(e) => setRefStudentName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Student Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={refStudentPhone}
                    onChange={(e) => setRefStudentPhone(e.target.value)}
                    placeholder="e.g. +60 12 345 6789"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Student Email Address
                  </label>
                  <input
                    type="email"
                    value={refStudentEmail}
                    onChange={(e) => setRefStudentEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Preferred Study Destination
                  </label>
                  <select
                    value={refCountry}
                    onChange={(e) => setRefCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-lg text-center cursor-pointer"
              >
                Submit Referral & Register Claim →
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FINAL CONSULTATION CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 border border-emerald-500/30 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold">Become an Official GEES B2B Partner Agent</h2>
            <p className="text-sm sm:text-base text-emerald-200">
              For high school counselors, language centers, and education consultancies. Access our global portal with over 1,200 direct university agreements.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <InteractiveHoverButton
              text="Register Agency Partnership"
              className="bg-emerald-400 text-slate-950 hover:bg-emerald-300 font-bold py-3.5 px-8 rounded-full text-sm sm:text-base shadow-xl"
              onClick={() => onOpenConsultation('B2B Partner Agent Registration')}
            />
          </div>
        </div>
      </section>
    </div>
  );
};
