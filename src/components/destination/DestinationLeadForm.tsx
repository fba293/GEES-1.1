/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Study Destination Page - Section 12: Conversion Lead Form & Enquiry
 */

import React, { useState } from 'react';
import { StudyDestinationData } from '../../data/destinationDataRegistry.ts';
import { APPROVED_COUNTRY_NAMES } from '../../lib/country-config.ts';

interface DestinationLeadFormProps {
  data: StudyDestinationData;
}

export const DestinationLeadForm: React.FC<DestinationLeadFormProps> = ({ data }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    destination: data.countryName,
    studyLevel: 'Undergraduate (Bachelor)',
    preferredCourse: '',
    expectedIntake: '2027 Spring (March/April)',
    englishProficiency: 'IELTS Completed',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 8) {
      setErrorMessage('Please enter a valid Bangladesh mobile or WhatsApp number.');
      return;
    }

    setIsSubmitting(true);

    // Simulate reliable form processing
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  const handleWhatsAppRedirect = () => {
    const text = encodeURIComponent(
      `Hello GEES Team! I am interested in Studying in ${data.countryName}.\nName: ${formData.fullName || 'Student'}\nLevel: ${formData.studyLevel}\nPhone: ${formData.phone}`
    );
    window.open(`https://wa.me/8801805529578?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="lead-form-section" className="w-full bg-slate-50 dark:bg-[#070D1E] py-12 sm:py-20 border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 md:p-12 border border-slate-200/80 dark:border-slate-800 shadow-xl">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider inline-block mb-3">
              100% Free Consultation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
              Apply or Book Free Counselling for {data.countryName}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
              Fill in your details below and a senior GEES admissions counselor will contact you within 24 hours.
            </p>
          </div>

          {isSubmitted ? (
            <div className="p-8 text-center bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800">
              <span className="material-symbols-outlined text-5xl text-emerald-500 mb-2">check_circle</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Enquiry Submitted Successfully!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-6">
                Thank you, <span className="font-bold">{formData.fullName}</span>. Your enquiry for <span className="font-bold">{data.countryName}</span> has been received. Our counselor will contact you at <span className="font-bold">{formData.phone}</span> shortly.
              </p>
              <button
                type="button"
                onClick={handleWhatsAppRedirect}
                className="py-3 px-6 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
              >
                <span>Connect via WhatsApp Now</span>
                <span className="material-symbols-outlined text-sm">chat</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs font-bold text-red-600 dark:text-red-400">
                  ⚠️ {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tanvir Ahmed"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none min-h-[44px]"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="tanvir@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Mobile / WhatsApp */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Bangladesh Mobile / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+880 1700 000000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none min-h-[44px]"
                  />
                </div>

                {/* Preferred Destination */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Preferred Destination
                  </label>
                  <select
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-amber-400 focus:outline-none min-h-[44px]"
                  >
                    {APPROVED_COUNTRY_NAMES.map((cName) => (
                      <option key={cName} value={cName}>
                        {cName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Study Level */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Intended Study Level
                  </label>
                  <select
                    value={formData.studyLevel}
                    onChange={(e) => setFormData({ ...formData, studyLevel: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none min-h-[44px]"
                  >
                    <option value="Undergraduate (Bachelor)">Undergraduate (Bachelor)</option>
                    <option value="Postgraduate (Master)">Postgraduate (Master)</option>
                    <option value="Doctorate (PhD)">Doctorate (PhD)</option>
                    <option value="Foundation / Diploma">Foundation / Diploma</option>
                  </select>
                </div>

                {/* Expected Intake */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Expected Intake
                  </label>
                  <select
                    value={formData.expectedIntake}
                    onChange={(e) => setFormData({ ...formData, expectedIntake: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none min-h-[44px]"
                  >
                    <option value="2027 Spring (March/April)">2027 Spring (March/April)</option>
                    <option value="2027 Summer (July/August)">2027 Summer (July/August)</option>
                    <option value="2027 Autumn (Sept/Oct)">2027 Autumn (Sept/Oct)</option>
                  </select>
                </div>

                {/* English Proficiency */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    English Proficiency
                  </label>
                  <select
                    value={formData.englishProficiency}
                    onChange={(e) => setFormData({ ...formData, englishProficiency: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none min-h-[44px]"
                  >
                    <option value="IELTS Completed">IELTS Completed</option>
                    <option value="PTE / Duolingo">PTE / Duolingo Completed</option>
                    <option value="MOI Certificate Available">MOI Certificate Available</option>
                    <option value="No Test Yet / Planning Test">No Test Yet / Planning Test</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Specific Questions / Preferred Course
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. I want to apply for BSc Computer Science with scholarship options..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>

              {/* Submit Button & WhatsApp Option */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-full bg-[#fbb034] hover:bg-amber-400 text-slate-950 font-black text-sm shadow-md active:scale-95 transition-all cursor-pointer min-h-[48px]"
                >
                  {isSubmitting ? 'Submitting Enquiry...' : 'Submit Counselling Request'}
                </button>
                <button
                  type="button"
                  onClick={handleWhatsAppRedirect}
                  className="w-full sm:w-auto py-3.5 px-6 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer min-h-[48px] flex items-center justify-center gap-2 shrink-0"
                >
                  <span>Chat on WhatsApp</span>
                  <span className="material-symbols-outlined text-sm">chat</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-400 text-center font-medium mt-2">
                🔒 Your privacy is protected. GEES never charges consultancy fees or sells student contact information.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default DestinationLeadForm;
