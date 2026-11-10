/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES 1.1 — Authentication Panel Brand Consistency Redesign
 * Colors: Navy #0A1120, Amber #FBB034, White #FFFFFF, Slate Neutrals
 */

import React, { useState } from 'react';
import { UserRole } from '../../types/index.ts';

interface AuthenticationViewProps {
  onNavigate: (view: string, payload?: any) => void;
  onRoleChange: (role: UserRole) => void;
  initialTab?: 'signin' | 'signup';
}

export const AuthenticationView: React.FC<AuthenticationViewProps> = ({
  onNavigate,
  onRoleChange,
  initialTab = 'signin',
}) => {
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>(initialTab);
  const [selectedRole, setSelectedRole] = useState<'student' | 'agent' | 'counselor'>('student');
  const [selectedSignupRole, setSelectedSignupRole] = useState<'student' | 'agent'>('student');

  const handleContinueSignIn = () => {
    onRoleChange(selectedRole);
    if (selectedRole === 'student') {
      onNavigate('student-portal');
    } else if (selectedRole === 'agent') {
      onNavigate('agent-portal');
    } else if (selectedRole === 'counselor') {
      onNavigate('crm');
    }
  };

  const handleContinueSignUp = () => {
    if (selectedSignupRole === 'student') {
      onNavigate('apply');
    } else {
      onNavigate('agent-portal');
    }
  };

  return (
    <div className="w-full bg-slate-50/60 dark:bg-[#070b14] min-h-[calc(100vh-120px)] flex flex-col justify-center items-center px-4 py-8 sm:py-12">
      {/* Container positioning directly underneath the header with natural rhythm */}
      <div className="w-full max-w-md mx-auto">
        {/* Brand header / intro badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/60 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-xs font-semibold mb-3 border border-slate-300/40 dark:border-slate-700/60">
            <span className="w-2 h-2 rounded-full bg-[#fbb034]"></span>
            <span>GEES Portal Gateway</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1120] dark:text-white tracking-tight">
            {authTab === 'signin' ? 'Sign in to GEES' : 'Create an Account'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
            {authTab === 'signin'
              ? 'Select your account type to access your secure portal workspace.'
              : 'Choose your applicant profile to get started with admissions.'}
          </p>
        </div>

        {/* Central Card */}
        <div className="bg-white dark:bg-[#0A1120] rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xl shadow-slate-900/5 dark:shadow-black/60">
          {/* 3. SIGN IN / SIGN UP SELECTOR: Compact Segmented Control */}
          <div className="relative flex items-center p-1 bg-slate-100 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-xl select-none mb-5">
            <div
              className="absolute top-1 left-1 bottom-1 w-[calc(50%-4px)] bg-[#0A1120] dark:bg-slate-800 rounded-lg shadow-xs transition-transform duration-200 ease-out"
              style={{
                transform: authTab === 'signin' ? 'translateX(0%)' : 'translateX(100%)',
              }}
            />
            <button
              onClick={() => setAuthTab('signin')}
              className={`relative flex-1 py-2 px-3 flex items-center justify-center text-center text-xs font-semibold tracking-wide transition-colors duration-150 z-10 cursor-pointer rounded-lg ${
                authTab === 'signin'
                  ? 'text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[#0A1120] dark:hover:text-white'
              }`}
              type="button"
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthTab('signup')}
              className={`relative flex-1 py-2 px-3 flex items-center justify-center text-center text-xs font-semibold tracking-wide transition-colors duration-150 z-10 cursor-pointer rounded-lg ${
                authTab === 'signup'
                  ? 'text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[#0A1120] dark:hover:text-white'
              }`}
              type="button"
            >
              Sign Up
            </button>
          </div>

          {/* 4. ACCOUNT TYPE SELECTION */}
          {authTab === 'signin' ? (
            <div className="space-y-2.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                Select Account Type
              </label>

              {/* Student Login */}
              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                className={`w-full flex items-center gap-3.5 p-3 rounded-xl border transition-all text-left cursor-pointer ${
                  selectedRole === 'student'
                    ? 'bg-[#fff9e6] dark:bg-amber-950/30 border-[#fbb034] ring-1 ring-[#fbb034]/60'
                    : 'bg-white dark:bg-slate-900/60 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/80 dark:hover:bg-slate-850/50'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    selectedRole === 'student'
                      ? 'bg-[#fbb034]/20 text-[#0A1120] dark:text-[#fbb034]'
                      : 'bg-slate-100 dark:bg-slate-800 text-[#0A1120] dark:text-slate-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">school</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span
                    className={`block text-xs font-bold leading-tight ${
                      selectedRole === 'student'
                        ? 'text-[#0A1120] dark:text-white'
                        : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    Student Login
                  </span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5 truncate">
                    Access degrees & applications
                  </span>
                </div>
                <div className="shrink-0 ml-2">
                  {selectedRole === 'student' ? (
                    <div className="w-4.5 h-4.5 rounded-full bg-[#fbb034] flex items-center justify-center shadow-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                    </div>
                  ) : (
                    <div className="w-4.5 h-4.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"></div>
                  )}
                </div>
              </button>

              {/* Agent Login */}
              <button
                type="button"
                onClick={() => setSelectedRole('agent')}
                className={`w-full flex items-center gap-3.5 p-3 rounded-xl border transition-all text-left cursor-pointer ${
                  selectedRole === 'agent'
                    ? 'bg-[#fff9e6] dark:bg-amber-950/30 border-[#fbb034] ring-1 ring-[#fbb034]/60'
                    : 'bg-white dark:bg-slate-900/60 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/80 dark:hover:bg-slate-850/50'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    selectedRole === 'agent'
                      ? 'bg-[#fbb034]/20 text-[#0A1120] dark:text-[#fbb034]'
                      : 'bg-slate-100 dark:bg-slate-800 text-[#0A1120] dark:text-slate-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">handshake</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span
                    className={`block text-xs font-bold leading-tight ${
                      selectedRole === 'agent'
                        ? 'text-[#0A1120] dark:text-white'
                        : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    Agent Login
                  </span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5 truncate">
                    Manage recruited students
                  </span>
                </div>
                <div className="shrink-0 ml-2">
                  {selectedRole === 'agent' ? (
                    <div className="w-4.5 h-4.5 rounded-full bg-[#fbb034] flex items-center justify-center shadow-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                    </div>
                  ) : (
                    <div className="w-4.5 h-4.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"></div>
                  )}
                </div>
              </button>

              {/* Staff Login */}
              <button
                type="button"
                onClick={() => setSelectedRole('counselor')}
                className={`w-full flex items-center gap-3.5 p-3 rounded-xl border transition-all text-left cursor-pointer ${
                  selectedRole === 'counselor'
                    ? 'bg-[#fff9e6] dark:bg-amber-950/30 border-[#fbb034] ring-1 ring-[#fbb034]/60'
                    : 'bg-white dark:bg-slate-900/60 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/80 dark:hover:bg-slate-850/50'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    selectedRole === 'counselor'
                      ? 'bg-[#fbb034]/20 text-[#0A1120] dark:text-[#fbb034]'
                      : 'bg-slate-100 dark:bg-slate-800 text-[#0A1120] dark:text-slate-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">badge</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span
                    className={`block text-xs font-bold leading-tight ${
                      selectedRole === 'counselor'
                        ? 'text-[#0A1120] dark:text-white'
                        : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    Staff Login
                  </span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5 truncate">
                    Admissions & counselor CRM
                  </span>
                </div>
                <div className="shrink-0 ml-2">
                  {selectedRole === 'counselor' ? (
                    <div className="w-4.5 h-4.5 rounded-full bg-[#fbb034] flex items-center justify-center shadow-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                    </div>
                  ) : (
                    <div className="w-4.5 h-4.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"></div>
                  )}
                </div>
              </button>

              {/* Primary Action: Clear Continue button in GEES amber */}
              <button
                type="button"
                onClick={handleContinueSignIn}
                className="mt-4 w-full py-3 px-4 rounded-xl bg-[#fbb034] hover:bg-[#f59e0b] active:scale-[0.98] text-[#0A1120] font-bold text-xs tracking-wide shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>
                  Continue to {selectedRole === 'student' ? 'Student Portal' : selectedRole === 'agent' ? 'Agent Portal' : 'Staff CRM'}
                </span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          ) : (
            /* Sign Up Options */
            <div className="space-y-2.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                Select Registration Type
              </label>

              {/* Student Registration */}
              <button
                type="button"
                onClick={() => setSelectedSignupRole('student')}
                className={`w-full flex items-center gap-3.5 p-3 rounded-xl border transition-all text-left cursor-pointer ${
                  selectedSignupRole === 'student'
                    ? 'bg-amber-500/[0.08] dark:bg-amber-500/[0.12] border-[#fbb034] ring-1 ring-[#fbb034]/60'
                    : 'bg-white dark:bg-slate-900/60 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/80 dark:hover:bg-slate-850/50'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    selectedSignupRole === 'student'
                      ? 'bg-[#fbb034]/20 text-[#0A1120] dark:text-[#fbb034]'
                      : 'bg-slate-100 dark:bg-slate-800 text-[#0A1120] dark:text-slate-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">school</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span
                    className={`block text-xs font-bold leading-tight ${
                      selectedSignupRole === 'student'
                        ? 'text-[#0A1120] dark:text-white'
                        : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    Student Registration
                  </span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5 truncate">
                    Apply to global universities
                  </span>
                </div>
                <div className="shrink-0 ml-2">
                  {selectedSignupRole === 'student' ? (
                    <div className="w-4.5 h-4.5 rounded-full bg-[#fbb034] text-[#0A1120] flex items-center justify-center shadow-xs">
                      <span className="material-symbols-outlined text-[13px] font-bold">check</span>
                    </div>
                  ) : (
                    <div className="w-4.5 h-4.5 rounded-full border border-slate-300 dark:border-slate-700"></div>
                  )}
                </div>
              </button>

              {/* Agent Partner */}
              <button
                type="button"
                onClick={() => setSelectedSignupRole('agent')}
                className={`w-full flex items-center gap-3.5 p-3 rounded-xl border transition-all text-left cursor-pointer ${
                  selectedSignupRole === 'agent'
                    ? 'bg-amber-500/[0.08] dark:bg-amber-500/[0.12] border-[#fbb034] ring-1 ring-[#fbb034]/60'
                    : 'bg-white dark:bg-slate-900/60 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/80 dark:hover:bg-slate-850/50'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    selectedSignupRole === 'agent'
                      ? 'bg-[#fbb034]/20 text-[#0A1120] dark:text-[#fbb034]'
                      : 'bg-slate-100 dark:bg-slate-800 text-[#0A1120] dark:text-slate-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">handshake</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span
                    className={`block text-xs font-bold leading-tight ${
                      selectedSignupRole === 'agent'
                        ? 'text-[#0A1120] dark:text-white'
                        : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    Agent Registration
                  </span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5 truncate">
                    Join GEES global recruitment network
                  </span>
                </div>
                <div className="shrink-0 ml-2">
                  {selectedSignupRole === 'agent' ? (
                    <div className="w-4.5 h-4.5 rounded-full bg-[#fbb034] text-[#0A1120] flex items-center justify-center shadow-xs">
                      <span className="material-symbols-outlined text-[13px] font-bold">check</span>
                    </div>
                  ) : (
                    <div className="w-4.5 h-4.5 rounded-full border border-slate-300 dark:border-slate-700"></div>
                  )}
                </div>
              </button>

              {/* Primary Action: Clear Continue button in GEES amber */}
              <button
                type="button"
                onClick={handleContinueSignUp}
                className="mt-4 w-full py-3 px-4 rounded-xl bg-[#fbb034] hover:bg-[#f59e0b] active:scale-[0.98] text-[#0A1120] font-bold text-xs tracking-wide shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>
                  {selectedSignupRole === 'student' ? 'Start Student Application' : 'Register as Partner Agent'}
                </span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          )}

          {/* Footer note */}
          <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 text-center">
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-[#0A1120] dark:hover:text-[#fbb034] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">help</span>
              <span>Need admissions help? Contact Admissions Desk</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
