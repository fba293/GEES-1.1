/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES B2B Sub-Agent Portal & Commission Tracking System
 */

import React, { useState } from 'react';
import { mockAgents, mockCommissions } from '../../data/mockDatabase.ts';
import { Agent, Commission } from '../../types/index.ts';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';

export const AgentPortalView: React.FC = () => {
  const [agents] = useState<Agent[]>(mockAgents);
  const [selectedAgentId, setSelectedAgentId] = useState<string>(mockAgents[0].id);
  const [commissions, setCommissions] = useState<Commission[]>(mockCommissions);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showReferModal, setShowReferModal] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState<string | null>(null);

  // New Student Referral State
  const [referStudentName, setReferStudentName] = useState('');
  const [referEmail, setReferEmail] = useState('');
  const [referUni, setReferUni] = useState('Monash University');
  const [referTuition, setReferTuition] = useState('32000');

  const currentAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  const agentCommissions = commissions.filter(c => 
    c.agentId === currentAgent.id &&
    (filterStatus === 'all' || c.status === filterStatus)
  );

  const handleCreateReferral = (e: React.FormEvent) => {
    e.preventDefault();
    const tuition = parseFloat(referTuition) || 30000;
    const commPct = currentAgent.commissionRatePct;
    const amount = Math.round((tuition * commPct) / 100);

    const newCommission: Commission = {
      id: `comm-${Date.now()}`,
      applicationId: `app-${Date.now()}`,
      studentName: referStudentName,
      universityName: referUni,
      agentId: currentAgent.id,
      agentName: currentAgent.agencyName,
      tuitionFeePaidUSD: tuition,
      commissionPct: commPct,
      amountUSD: amount,
      status: 'pending',
      invoiceDate: new Date().toISOString().split('T')[0]
    };

    setCommissions([newCommission, ...commissions]);
    setShowReferModal(false);
    setReferStudentName('');
    setReferEmail('');
  };

  const handleRequestPayout = () => {
    setPayoutSuccess(`Payout request for $${currentAgent.pendingCommissionsUSD.toLocaleString()} USD submitted to GEES Finance.`);
    setShowPayoutModal(false);
    setTimeout(() => setPayoutSuccess(null), 4000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Alert toast */}
      {payoutSuccess && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-center gap-3">
          <span className="material-symbols-outlined text-emerald-500">check_circle</span>
          <p className="text-sm font-semibold">{payoutSuccess}</p>
        </div>
      )}

      {/* Agent Header banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold">
                <span className="material-symbols-outlined text-sm">stars</span>
                <span>{currentAgent.tier} Partner</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
                ID: {currentAgent.id}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-semibold">
                {currentAgent.country}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              {currentAgent.agencyName}
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Primary Rep: <strong className="text-white">{currentAgent.contactPerson}</strong> • {currentAgent.email} • {currentAgent.phone}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowPayoutModal(true)}
              className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-900/30 flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">payments</span>
              <span>Request Payout</span>
            </button>
            <InteractiveHoverButton
              text="Refer New Student"
              className="h-10 text-xs rounded-full"
              onClick={() => setShowReferModal(true)}
            />
          </div>
        </div>

        {/* Agency Switcher (for multi-agency preview) */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 mr-2 font-medium">Switch Agency Partner View:</span>
          {agents.map(a => (
            <button
              key={a.id}
              onClick={() => setSelectedAgentId(a.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                a.id === currentAgent.id
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {a.agencyName} ({a.tier})
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Earned Commissions</span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            ${currentAgent.totalCommissionsEarnedUSD.toLocaleString()}
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>All time verified earnings</span>
          </p>
        </div>

        <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Payout</span>
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <span className="material-symbols-outlined text-xl">hourglass_top</span>
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
            ${currentAgent.pendingCommissionsUSD.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Awaiting university fee reconciliation
          </p>
        </div>

        <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Students Referred</span>
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <span className="material-symbols-outlined text-xl">school</span>
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {currentAgent.totalStudentsReferred}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {currentAgent.activeApplicationsCount} actively enrolled in pipeline
          </p>
        </div>

        <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Commission Tier</span>
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <span className="material-symbols-outlined text-xl">percent</span>
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {currentAgent.commissionRatePct}%
          </div>
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1 font-semibold">
            {currentAgent.tier} level contractual split
          </p>
        </div>
      </div>

      {/* Commission Ledger Table */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Commission Ledger & Invoicing
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Detailed list of student admissions linked to your sub-agent ID
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Filter:</span>
            {(['all', 'paid', 'pending', 'approved'] as const).map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize cursor-pointer transition-colors ${
                  filterStatus === st
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3.5 rounded-l-xl">Invoice Ref</th>
                <th className="px-4 py-3.5">Student Name</th>
                <th className="px-4 py-3.5">University</th>
                <th className="px-4 py-3.5">Tuition (USD)</th>
                <th className="px-4 py-3.5">Split</th>
                <th className="px-4 py-3.5">Payout</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {agentCommissions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    No commission items found under this filter.
                  </td>
                </tr>
              ) : (
                agentCommissions.map(comm => (
                  <tr key={comm.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-4 font-mono text-xs font-semibold text-slate-900 dark:text-white">
                      {comm.id.toUpperCase()}
                    </td>
                    <td className="px-4 py-4 font-bold text-slate-900 dark:text-white">
                      {comm.studentName}
                    </td>
                    <td className="px-4 py-4 text-xs font-medium">
                      {comm.universityName}
                    </td>
                    <td className="px-4 py-4 font-mono font-medium">
                      ${comm.tuitionFeePaidUSD.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 font-mono text-xs font-bold text-purple-600 dark:text-purple-400">
                      {comm.commissionPct}%
                    </td>
                    <td className="px-4 py-4 font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      ${comm.amountUSD.toLocaleString()}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                        comm.status === 'paid'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : comm.status === 'approved'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {comm.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => alert(`Downloading official PDF tax receipt for invoice ${comm.id.toUpperCase()} ($${comm.amountUSD} USD)`)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Download Invoice PDF"
                      >
                        <span className="material-symbols-outlined text-lg">download</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refer Student Modal */}
      {showReferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <button
              onClick={() => setShowReferModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              Refer a New Student
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Lock in your contractual {currentAgent.commissionRatePct}% commission rate upon enrollment.
            </p>

            <form onSubmit={handleCreateReferral} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Student Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Farhan Ahmed"
                  value={referStudentName}
                  onChange={e => setReferStudentName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Student Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="farhan@example.com"
                  value={referEmail}
                  onChange={e => setReferEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Target University
                  </label>
                  <select
                    value={referUni}
                    onChange={e => setReferUni(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Monash University">Monash University</option>
                    <option value="University of Toronto">University of Toronto</option>
                    <option value="University of Manchester">University of Manchester</option>
                    <option value="University of Melbourne">University of Melbourne</option>
                    <option value="Universiti Malaya">Universiti Malaya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Tuition Estimate ($USD)
                  </label>
                  <input
                    type="number"
                    value={referTuition}
                    onChange={e => setReferTuition(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300 flex items-center justify-between">
                <span>Estimated Payout ({currentAgent.commissionRatePct}%):</span>
                <strong className="text-sm font-black">
                  ${Math.round(((parseFloat(referTuition) || 0) * currentAgent.commissionRatePct) / 100).toLocaleString()} USD
                </strong>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowReferModal(false)}
                  className="px-5 py-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 text-sm font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  Submit Referral
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request Payout Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative text-center">
            <span className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-3xl">account_balance</span>
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Confirm Payout Request
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
              You are requesting wire transfer settlement of <strong>${currentAgent.pendingCommissionsUSD.toLocaleString()} USD</strong> to {currentAgent.agencyName}'s verified corporate account.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowPayoutModal(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRequestPayout}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 cursor-pointer"
              >
                Confirm Wire
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
