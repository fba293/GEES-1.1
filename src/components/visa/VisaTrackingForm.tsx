/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Global Education Expert Services (GEES)
 * EMGS Student Visa Tracking Form Component
 */

import React, { useState } from 'react';
import {
  POPULAR_NATIONALITIES,
  validatePassportNumber,
  OFFICIAL_EMGS_TRACKER_URL
} from '../../services/visaTrackingService.ts';
import { VisaTrackingFormValues } from '../../types/visaTracking.ts';

interface VisaTrackingFormProps {
  onSubmit: (values: VisaTrackingFormValues) => void;
  onPreviewSample: (passportNumber: string, nationalityName: string) => void;
  isLoading: boolean;
  errorMessage?: string | null;
  suggestOfficialPortal?: boolean;
}

export const VisaTrackingForm: React.FC<VisaTrackingFormProps> = ({
  onSubmit,
  onPreviewSample,
  isLoading,
  errorMessage,
  suggestOfficialPortal
}) => {
  const [passport, setPassport] = useState('');
  const [nationalityCode, setNationalityCode] = useState('BD');
  const [consentAgreed, setConsentAgreed] = useState(true);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const selectedNationality = POPULAR_NATIONALITIES.find((n) => n.code === nationalityCode || n.emgsCode === nationalityCode) || POPULAR_NATIONALITIES[0];

  const handlePassportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    setPassport(val);
    if (fieldError) setFieldError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError(null);

    const validation = validatePassportNumber(passport);
    if (!validation.isValid) {
      setFieldError(validation.error || 'Please enter a valid passport number.');
      return;
    }

    if (!consentAgreed) {
      setFieldError('Please agree to the privacy statement to proceed.');
      return;
    }

    onSubmit({
      passportNumber: validation.normalized,
      nationalityCode,
      consentAgreed
    });
  };

  const [copiedFeedback, setCopiedFeedback] = useState(false);

  const handleCopyPassportBeforeOpen = () => {
    if (passport.trim()) {
      try {
        navigator.clipboard.writeText(passport.trim().toUpperCase());
        setCopiedFeedback(true);
        setTimeout(() => setCopiedFeedback(false), 3500);
      } catch {
        // Clipboard may be restricted in some iframe contexts
      }
    }
  };

  const handleRunSampleDemo = () => {
    const samplePassport = passport.trim() ? passport.trim().toUpperCase() : 'A01234567';
    onPreviewSample(samplePassport, selectedNationality.name);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-10 px-4" data-purpose="visa-tracking-form-card">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-5 sm:p-8 transition-colors">
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-5 items-end">
            {/* Passport Input */}
            <div className="sm:col-span-5 flex flex-col">
              <label 
                htmlFor="passport-input" 
                className="text-[11px] min-[390px]:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center justify-between"
              >
                <span>PASSPORT NUMBER</span>
              </label>
              <div className="relative">
                <input
                  id="passport-input"
                  type="text"
                  value={passport}
                  onChange={handlePassportChange}
                  placeholder="e.g. A01234567"
                  autoComplete="off"
                  spellCheck="false"
                  maxLength={15}
                  className={`w-full h-12 min-h-[44px] px-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border text-slate-900 dark:text-white font-mono font-semibold text-sm sm:text-base tracking-wider uppercase placeholder:normal-case placeholder:font-sans placeholder:font-normal placeholder:text-slate-400 transition-all focus:outline-none focus:ring-2 ${
                    fieldError
                      ? 'border-red-500 focus:ring-red-400/20'
                      : 'border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:ring-amber-400/20'
                  }`}
                />
              </div>
            </div>

            {/* Nationality Dropdown */}
            <div className="sm:col-span-4 flex flex-col">
              <label 
                htmlFor="nationality-select" 
                className="text-[11px] min-[390px]:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center justify-between"
              >
                <span>NATIONALITY</span>
              </label>
              <div className="relative">
                <select
                  id="nationality-select"
                  value={nationalityCode}
                  onChange={(e) => setNationalityCode(e.target.value)}
                  className="w-full h-12 min-h-[44px] pl-3.5 pr-8 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm transition-all focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20 cursor-pointer appearance-none truncate"
                >
                  {POPULAR_NATIONALITIES.map((n) => (
                    <option key={n.code} value={n.code} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {n.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <span className="material-symbols-outlined text-[18px]">expand_more</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="sm:col-span-3 flex flex-col justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 min-h-[44px] px-4 rounded-2xl bg-[#fbb034] hover:bg-[#f59e0b] active:bg-[#d97706] text-slate-950 font-bold text-sm tracking-tight flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed select-none"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Checking...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[19px]">travel_explore</span>
                    <span>Check status</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Validation Error Message */}
          {fieldError && (
            <p className="mt-2.5 text-xs text-red-600 dark:text-red-400 font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px]">error</span>
              <span>{fieldError}</span>
            </p>
          )}

          {/* Reassurance Trust Signals Strip */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-500 font-bold shrink-0">✓</span>
              <span>Free, no sign-up</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-500 font-bold shrink-0">✓</span>
              <span>Read from official EMGS</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-500 font-bold shrink-0">✓</span>
              <span>Your passport stays private</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-500 font-bold shrink-0">✓</span>
              <span>Stages in plain words</span>
            </div>
          </div>
        </form>

        {/* Operational Fallback & Educational Demo Bar */}
        {(errorMessage || suggestOfficialPortal) && (
          <div className="mt-6 p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/80">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-[22px] shrink-0 mt-0.5">
                verified_user
              </span>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Direct Official EMGS Verification
                </h4>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {errorMessage || 'For 100% verified real-time government status, check directly on the official EMGS portal using your passport and nationality.'}
                </p>
                <div className="mt-3 flex flex-wrap gap-2.5 items-center">
                  <a
                    href={OFFICIAL_EMGS_TRACKER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleCopyPassportBeforeOpen}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-xs transition-colors cursor-pointer select-none"
                  >
                    <span>Check on Official EMGS Website</span>
                    <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleRunSampleDemo}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-xs transition-colors cursor-pointer select-none"
                  >
                    <span className="material-symbols-outlined text-[15px] text-amber-500">timeline</span>
                    <span>Preview Sample Visa Timeline</span>
                  </button>
                </div>
                {copiedFeedback && (
                  <p className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 animate-fade-in">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    <span>Passport number copied to clipboard! Paste it into the EMGS Travel Document field.</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
