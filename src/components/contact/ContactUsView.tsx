/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES - Global Education Expert Services
 * Contact Us Page featuring the 3D Orbit Globe & Animated Courier Hero
 * and the exact "Send your details / Send us a message" high-converting intake form.
 */

import React, { useState, useEffect } from 'react';
import { OrbitPlanetWorld } from './OrbitPlanetWorld.tsx';

interface ContactUsViewProps {
  onNavigate: (view: string, payload?: any) => void;
  onOpenConsultationModal?: (counselorName?: string) => void;
}

export const ContactUsView: React.FC<ContactUsViewProps> = ({
  onNavigate,
  onOpenConsultationModal
}) => {
  // Form fields state matching the uploaded design
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [studyLevel, setStudyLevel] = useState('');
  const [studyDestination, setStudyDestination] = useState('');
  const [academicQualification, setAcademicQualification] = useState('');
  const [englishProficiency, setEnglishProficiency] = useState('');
  const [overallScore, setOverallScore] = useState('');
  const [applyPlan, setApplyPlan] = useState('');
  const [consultationMode, setConsultationMode] = useState('');
  const [message, setMessage] = useState('');

  // Confirmation Modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalData, setModalData] = useState<{
    waUrl: string;
    deskName: string;
    phoneNum: string;
  } | null>(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Calculate dynamic readiness percentage
  const inputsList = [
    name,
    mobile,
    email,
    studyLevel,
    studyDestination,
    academicQualification,
    englishProficiency,
    overallScore,
    applyPlan,
    consultationMode,
    message
  ];

  const filledCount = inputsList.filter((val) => val.trim().length > 0).length;
  const progressPercentage = Math.round((filledCount / inputsList.length) * 100);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !mobile.trim()) {
      showToast('Please enter your full name and mobile number.');
      return;
    }

    // Determine routing destination
    let phoneNum = '8801805529578';
    let deskName = 'GEES Dhaka Central Headquarters (+880 1805-529578)';

    const isMalaysiaTarget =
      studyDestination.toLowerCase().includes('malaysia') ||
      mobile.startsWith('+60') ||
      mobile.startsWith('60') ||
      mobile.startsWith('011') ||
      consultationMode.includes('Malaysia');

    if (isMalaysiaTarget) {
      phoneNum = '601112376224';
      deskName = 'GEES Malaysia Regional Hub (+60 11-1237 6224)';
    }

    const messageLines = [
      `*Hello GEES Team! Here are my study abroad details:*`,
      ``,
      `*Full Name:* ${name.trim()}`,
      `*Mobile Number:* ${mobile.trim()}`,
      `*Email:* ${email.trim() || 'N/A'}`,
      `*Interested Level:* ${studyLevel || 'Not selected'}`,
      `*Destination:* ${studyDestination || 'Not selected'}`,
      `*Academic Background:* ${academicQualification.trim() || 'N/A'}`,
      `*English Proficiency:* ${englishProficiency || 'Not taken'} (Score: ${overallScore.trim() || 'N/A'})`,
      `*Intended Intake / Timing:* ${applyPlan || 'Flexible'}`,
      `*Preferred Mode:* ${consultationMode || 'WhatsApp Chat'}`,
      `*Additional Notes:* ${message.trim() || 'Ready for profile evaluation'}`
    ];

    const encodedMessage = encodeURIComponent(messageLines.join('\n'));
    const waUrl = `https://wa.me/${phoneNum}?text=${encodedMessage}`;

    setModalData({
      waUrl,
      deskName,
      phoneNum
    });
    setShowConfirmModal(true);
    showToast('Preparing WhatsApp consultation session...');
  };

  return (
    <div className="w-full min-h-screen bg-[#f7f9fd] dark:bg-[#070D1E] text-slate-800 dark:text-slate-100 transition-colors">
      {/* Subtle Atmospheric Top Glow */}
      <div className="absolute top-0 inset-x-0 h-96 pointer-events-none overflow-hidden select-none z-0">
        <div className="w-full h-full bg-radial from-blue-200/40 via-amber-100/20 to-transparent dark:from-blue-900/20 dark:via-transparent dark:to-transparent opacity-80" />
      </div>

      {/* Main Content Layout Container */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-12 sm:pb-16">
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4 sm:mb-6">
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-blue-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
          >
            Home
          </button>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">/</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">Contact Us</span>
        </nav>

        {/* 2-Column Hero & Intake Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* LEFT PANE: 3D Interactive Orbit Delivery Hero / Courier Planet */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            {/* Hero Copy */}
            <div className="mb-4 sm:mb-6">
              <p className="text-[11px] sm:text-xs font-black uppercase tracking-[0.32em] text-[#2563eb] dark:text-[#60a5fa] mb-3">
                GOOD THINGS, ON THEIR WAY
              </p>
              <h1 className="text-[34px] sm:text-[42px] lg:text-[48px] font-black tracking-[-0.04em] text-[#0d1424] dark:text-white leading-[1.05] mb-4">
                Good things.<br />
                Delivered<br />
                <em className="font-serif italic font-normal text-[#2563eb] dark:text-[#60a5fa]">with care.</em>
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-md">
                Admissions, visas, and a little peace of mind. From your dreams to top world universities across UK, Australia, New Zealand, Malaysia & Europe.
              </p>
            </div>

            {/* 3D WebGL Orbit Planet Canvas Container with Runner Courier */}
            <div className="w-full bg-linear-to-b from-white/60 to-blue-50/40 dark:from-slate-900/60 dark:to-slate-950/60 rounded-[32px] border border-slate-200/80 dark:border-slate-800/80 shadow-md shadow-slate-200/50 dark:shadow-none overflow-hidden relative">
              <OrbitPlanetWorld />
            </div>

            {/* Quick Contact Micro-Cards under 3D Scene */}
            <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
              <a
                href="https://wa.me/8801805529578"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500 transition-colors flex items-center gap-2.5 shadow-2xs"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-[11px] text-slate-900 dark:text-white block truncate">Dhaka Desk</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">+880 1805-529578</span>
                </div>
              </a>

              <a
                href="https://wa.me/601112376224"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500 transition-colors flex items-center gap-2.5 shadow-2xs"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-[11px] text-slate-900 dark:text-white block truncate">Malaysia Desk</span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono">+60 11-1237 6224</span>
                </div>
              </a>
            </div>
          </div>

          {/* RIGHT PANE: Exact "Send your details / Send us a message" Form */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900 rounded-[28px] sm:rounded-[34px] p-6 sm:p-8 md:p-10 shadow-xl shadow-slate-200/70 dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
              
              {/* Header Row: Title & Readiness Tracker */}
              <div className="flex items-center justify-between gap-4 mb-7 sm:mb-8">
                <h2 className="text-[28px] sm:text-[34px] md:text-[38px] font-black tracking-[-0.035em] text-[#0d1424] dark:text-white leading-tight">
                  Send us a message
                </h2>

                {/* Progress indicator */}
                <div className="flex flex-col items-end shrink-0">
                  <span className="text-[11px] sm:text-[12px] font-extrabold tracking-wider text-slate-400 uppercase mb-1">
                    {progressPercentage}% READY
                  </span>
                  <div className="w-20 sm:w-24 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* The Lead Intake Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4" noValidate>
                
                {/* Row 1: Full name (full width) */}
                <div className="field-pill rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 px-4 sm:px-5 py-3 sm:py-3.5 flex items-center gap-3 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-600/10 transition-all">
                  <span className="material-symbols-outlined text-[19px] sm:text-[20px] text-slate-500 shrink-0 select-none">
                    person
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent border-none p-0 text-sm sm:text-[15px] font-medium text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-0"
                  />
                </div>

                {/* Row 2: Mobile number & Email (2 columns desktop, 1 col mobile) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  {/* Mobile number */}
                  <div className="field-pill rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 px-4 sm:px-5 py-3 sm:py-3.5 flex items-center gap-3 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-600/10 transition-all">
                    <span className="material-symbols-outlined text-[19px] sm:text-[20px] text-slate-500 shrink-0 select-none">
                      call
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="Mobile number"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full bg-transparent border-none p-0 text-sm sm:text-[15px] font-medium text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-0"
                    />
                  </div>

                  {/* Email */}
                  <div className="field-pill rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 px-4 sm:px-5 py-3 sm:py-3.5 flex items-center gap-3 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-600/10 transition-all">
                    <span className="material-symbols-outlined text-[19px] sm:text-[20px] text-slate-500 shrink-0 select-none">
                      mail
                    </span>
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent border-none p-0 text-sm sm:text-[15px] font-medium text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>

                {/* Row 3: Interested level of study & Study destination */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  {/* Interested level of study */}
                  <div className="field-pill relative rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 px-4 sm:px-5 py-3 sm:py-3.5 flex items-center gap-3 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-600/10 transition-all">
                    <span className="material-symbols-outlined text-[19px] sm:text-[20px] text-slate-500 shrink-0 select-none">
                      school
                    </span>
                    <select
                      value={studyLevel}
                      onChange={(e) => setStudyLevel(e.target.value)}
                      className="w-full bg-transparent border-none p-0 pr-6 text-[13px] sm:text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-0 appearance-none"
                    >
                      <option value="" disabled className="text-slate-400 dark:bg-slate-900">
                        Interested level of study
                      </option>
                      <option value="Foundation / Pathway" className="dark:bg-slate-900">Foundation / Pathway</option>
                      <option value="Diploma" className="dark:bg-slate-900">Diploma</option>
                      <option value="Bachelor's Degree" className="dark:bg-slate-900">Bachelor's Degree</option>
                      <option value="Master's Degree" className="dark:bg-slate-900">Master's Degree</option>
                      <option value="PhD / Doctorate" className="dark:bg-slate-900">PhD / Doctorate</option>
                    </select>
                    <span className="material-symbols-outlined text-[18px] text-slate-400 pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 select-none">
                      expand_more
                    </span>
                  </div>

                  {/* Study destination */}
                  <div className="field-pill relative rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 px-4 sm:px-5 py-3 sm:py-3.5 flex items-center gap-3 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-600/10 transition-all">
                    <span className="material-symbols-outlined text-[19px] sm:text-[20px] text-slate-500 shrink-0 select-none">
                      location_on
                    </span>
                    <select
                      value={studyDestination}
                      onChange={(e) => setStudyDestination(e.target.value)}
                      className="w-full bg-transparent border-none p-0 pr-6 text-[13px] sm:text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-0 appearance-none"
                    >
                      <option value="" disabled className="text-slate-400 dark:bg-slate-900">
                        Study destination
                      </option>
                      <option value="Malaysia" className="dark:bg-slate-900">Malaysia</option>
                      <option value="United Kingdom" className="dark:bg-slate-900">United Kingdom</option>
                      <option value="Australia" className="dark:bg-slate-900">Australia</option>
                      <option value="New Zealand" className="dark:bg-slate-900">New Zealand</option>
                      <option value="Cyprus" className="dark:bg-slate-900">Cyprus</option>
                      <option value="Belgium" className="dark:bg-slate-900">Belgium</option>
                      <option value="Finland" className="dark:bg-slate-900">Finland</option>
                      <option value="Greece" className="dark:bg-slate-900">Greece</option>
                      <option value="Mauritius" className="dark:bg-slate-900">Mauritius</option>
                      <option value="Netherlands" className="dark:bg-slate-900">Netherlands</option>
                      <option value="India" className="dark:bg-slate-900">India</option>
                    </select>
                    <span className="material-symbols-outlined text-[18px] text-slate-400 pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 select-none">
                      expand_more
                    </span>
                  </div>
                </div>

                {/* Row 4: Academic qualification (full width) */}
                <div className="field-pill rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 px-4 sm:px-5 py-3 sm:py-3.5 flex items-center gap-3 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-600/10 transition-all">
                  <span className="material-symbols-outlined text-[19px] sm:text-[20px] text-slate-500 shrink-0 select-none">
                    verified
                  </span>
                  <input
                    type="text"
                    placeholder="Academic qualification, e.g. HSC GPA 4.80, City College, 2024"
                    value={academicQualification}
                    onChange={(e) => setAcademicQualification(e.target.value)}
                    className="w-full bg-transparent border-none p-0 text-sm sm:text-[15px] font-medium text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-0"
                  />
                </div>

                {/* Row 5: English proficiency & Overall score */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  {/* English proficiency */}
                  <div className="field-pill relative rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 px-4 sm:px-5 py-3 sm:py-3.5 flex items-center gap-3 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-600/10 transition-all">
                    <span className="material-symbols-outlined text-[19px] sm:text-[20px] text-slate-500 shrink-0 select-none">
                      translate
                    </span>
                    <select
                      value={englishProficiency}
                      onChange={(e) => setEnglishProficiency(e.target.value)}
                      className="w-full bg-transparent border-none p-0 pr-6 text-[13px] sm:text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-0 appearance-none"
                    >
                      <option value="" disabled className="text-slate-400 dark:bg-slate-900">
                        English proficiency
                      </option>
                      <option value="IELTS" className="dark:bg-slate-900">IELTS</option>
                      <option value="PTE Academic" className="dark:bg-slate-900">PTE Academic</option>
                      <option value="TOEFL" className="dark:bg-slate-900">TOEFL</option>
                      <option value="Duolingo / MOI" className="dark:bg-slate-900">MOI / Duolingo</option>
                      <option value="Not yet taken" className="dark:bg-slate-900">Not yet taken</option>
                    </select>
                    <span className="material-symbols-outlined text-[18px] text-slate-400 pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 select-none">
                      expand_more
                    </span>
                  </div>

                  {/* Overall score */}
                  <div className="field-pill rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 px-4 sm:px-5 py-3 sm:py-3.5 flex items-center gap-3 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-600/10 transition-all">
                    <span className="material-symbols-outlined text-[19px] sm:text-[20px] text-slate-500 shrink-0 select-none">
                      trending_up
                    </span>
                    <input
                      type="text"
                      placeholder="Overall score"
                      value={overallScore}
                      onChange={(e) => setOverallScore(e.target.value)}
                      className="w-full bg-transparent border-none p-0 text-sm sm:text-[15px] font-medium text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>

                {/* Row 6: When do you plan to apply & Consultation mode */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  {/* When do you plan to apply */}
                  <div className="field-pill relative rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 px-4 sm:px-5 py-3 sm:py-3.5 flex items-center gap-3 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-600/10 transition-all">
                    <span className="material-symbols-outlined text-[19px] sm:text-[20px] text-slate-500 shrink-0 select-none">
                      calendar_today
                    </span>
                    <select
                      value={applyPlan}
                      onChange={(e) => setApplyPlan(e.target.value)}
                      className="w-full bg-transparent border-none p-0 pr-6 text-[13px] sm:text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-0 appearance-none"
                    >
                      <option value="" disabled className="text-slate-400 dark:bg-slate-900">
                        When do you plan to apply?
                      </option>
                      <option value="Immediate (This Month)" className="dark:bg-slate-900">Immediate (This Month)</option>
                      <option value="Next Upcoming Intake (1–3 Months)" className="dark:bg-slate-900">Upcoming Intake (1–3 Months)</option>
                      <option value="Within 6 Months" className="dark:bg-slate-900">Within 6 Months</option>
                      <option value="Just Exploring" className="dark:bg-slate-900">Just Exploring</option>
                    </select>
                    <span className="material-symbols-outlined text-[18px] text-slate-400 pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 select-none">
                      expand_more
                    </span>
                  </div>

                  {/* Consultation mode */}
                  <div className="field-pill relative rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 px-4 sm:px-5 py-3 sm:py-3.5 flex items-center gap-3 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-600/10 transition-all">
                    <span className="material-symbols-outlined text-[19px] sm:text-[20px] text-slate-500 shrink-0 select-none">
                      chat
                    </span>
                    <select
                      value={consultationMode}
                      onChange={(e) => setConsultationMode(e.target.value)}
                      className="w-full bg-transparent border-none p-0 pr-6 text-[13px] sm:text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-0 appearance-none"
                    >
                      <option value="" disabled className="text-slate-400 dark:bg-slate-900">
                        Consultation mode
                      </option>
                      <option value="WhatsApp Direct Chat" className="dark:bg-slate-900">WhatsApp Direct Chat</option>
                      <option value="Phone Call Assessment" className="dark:bg-slate-900">Phone Call Assessment</option>
                      <option value="Office Walk-in (Dhaka Hub)" className="dark:bg-slate-900">Office Walk-in (Dhaka Hub)</option>
                      <option value="Office Walk-in (Malaysia Hub)" className="dark:bg-slate-900">Office Walk-in (Malaysia Hub)</option>
                      <option value="Online Video Session" className="dark:bg-slate-900">Online Video Session</option>
                    </select>
                    <span className="material-symbols-outlined text-[18px] text-slate-400 pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 select-none">
                      expand_more
                    </span>
                  </div>
                </div>

                {/* Row 7: Message / additional notes (Textarea) */}
                <div className="field-pill relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 px-4 sm:px-5 py-3.5 flex items-start gap-3 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-600/10 transition-all">
                  <span className="material-symbols-outlined text-[19px] sm:text-[20px] text-slate-500 shrink-0 mt-0.5 select-none">
                    chat_bubble_outline
                  </span>
                  <div className="w-full">
                    <textarea
                      rows={3}
                      maxLength={280}
                      placeholder="Message / additional notes"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-transparent border-none p-0 text-sm sm:text-[15px] font-medium text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-0 resize-none"
                    />
                    <div className="text-right pt-1">
                      <span className="text-[11px] sm:text-[12px] font-bold text-slate-400">
                        {message.length}/280
                      </span>
                    </div>
                  </div>
                </div>

                {/* Row 8: Big Blue WhatsApp Button Matching Exactly */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full h-14 bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white font-bold text-base sm:text-[16px] rounded-full shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-[0.99] cursor-pointer"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                    <span>Open WhatsApp message</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Physical Office Hubs Cards Section */}
        <div className="mt-14 sm:mt-18 pt-10 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="max-w-xl mx-auto text-center mb-8">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#2563eb] dark:text-[#60a5fa] block mb-1">
              Visit Our Authorized Centers
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Physical Offices in Dhaka & Malaysia
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Prefer face-to-face academic counseling? Walk into our branches during working hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Dhaka Office Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="text-2xl">🇧🇩</span>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                    GEES Central Headquarters (Dhaka)
                  </h4>
                  <span className="text-[11px] text-slate-500 font-medium">Kakrail, Dhaka 1000</span>
                </div>
              </div>
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                <p><strong>Address:</strong> Green City Regency, Road 27/1, Level 10, Kakrail, Dhaka 1000.</p>
                <p><strong>Landmark:</strong> Opposite to Kakrail Mosque / Near Shantinagar Intersection.</p>
                <p><strong>Timing:</strong> Sunday – Thursday | 10:00 AM – 5:00 PM</p>
                <p><strong>Phone / WhatsApp:</strong> <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">+880 1805-529578</span></p>
              </div>
              <div className="flex gap-2.5">
                <a
                  href="https://maps.app.goo.gl/TgoFcTtKpkXC1KK88"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs text-center transition-colors"
                >
                  View on Google Maps ↗
                </a>
                <a
                  href="https://wa.me/8801805529578"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs text-center transition-colors shadow-xs"
                >
                  Chat with Dhaka Desk
                </a>
              </div>
            </div>

            {/* Malaysia Office Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="text-2xl">🇲🇾</span>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                    GEES Southeast Asia Regional Hub
                  </h4>
                  <span className="text-[11px] text-slate-500 font-medium">Subang Jaya, Selangor</span>
                </div>
              </div>
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                <p><strong>Address:</strong> USJ 19 City Mall, Level 1, Subang Jaya, Selangor 47620.</p>
                <p><strong>Landmark:</strong> USJ 19 Digital Mall / Next to Wawasan LRT Station.</p>
                <p><strong>Timing:</strong> Monday – Friday | 9:30 AM – 6:00 PM</p>
                <p><strong>Phone / WhatsApp:</strong> <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">+60 11-1237 6224</span></p>
              </div>
              <div className="flex gap-2.5">
                <a
                  href="https://maps.app.goo.gl/8UQxEMhP4u1Bwpa66"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs text-center transition-colors"
                >
                  View on Google Maps ↗
                </a>
                <a
                  href="https://wa.me/601112376224"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs text-center transition-colors shadow-xs"
                >
                  Chat with Malaysia Desk
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal Matching Exact Snippet */}
      {showConfirmModal && modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 text-center transform scale-100 transition-transform">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-2xl">
              <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">
              Connecting to WhatsApp
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              Your study profile has been formatted for <strong>{modalData.deskName}</strong>. Our counselor is ready to assist your admission.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 px-4 rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Edit Form
              </button>
              <a
                href={modalData.waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 px-4 rounded-full bg-blue-600 text-white font-bold text-xs sm:text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/25"
              >
                <span>Continue</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-3 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2.5 shadow-xl z-50 animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
