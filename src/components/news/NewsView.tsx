/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Global Education Expert Services - Global News & Visa Bulletins View
 */

import React, { useState, useMemo } from 'react';
import { mockNews } from '../../data/mockNews.ts';
import { NewsArticle } from '../../types/index.ts';

interface NewsViewProps {
  onBackToHome?: () => void;
  onOpenConsultation?: (topic?: string) => void;
  onNavigate?: (view: string, payload?: any) => void;
}

export const NewsView: React.FC<NewsViewProps> = ({
  onBackToHome,
  onOpenConsultation,
  onNavigate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticleModal, setActiveArticleModal] = useState<NewsArticle | null>(null);

  const categories = ['All', 'Visa Update', 'Scholarship Alert', 'Immigration Policy', 'GEES Announcement'];

  // Filtered news articles
  const filteredArticles = useMemo(() => {
    return mockNews.filter((article) => {
      const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.countryTag && article.countryTag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const urgentAlerts = useMemo(() => mockNews.filter((a) => a.isUrgent), []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#070D1E] text-slate-900 dark:text-slate-100 pt-20 pb-20 px-3 xs:px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Back & Breadcrumb Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToHome || (() => onNavigate?.('home'))}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 transition-all shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back to Home</span>
          </button>

          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Official GEES Media & Visa Bulletins
          </span>
        </div>

        {/* Hero Section */}
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl border border-slate-800">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              <span>Global Study Abroad News Desk</span>
            </div>

            <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Latest Visa Rules, Scholarships & University Policy Updates
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              Stay ahead with verified official announcements from the UK Home Office, Australia Dept of Home Affairs, EMGS Malaysia, European Ministries, and top partner universities.
            </p>

            {/* Quick Search */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search by keyword, UK, Australia, Visa, Scholarship..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/10 dark:bg-black/30 border border-white/20 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all backdrop-blur-md"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Urgent Visa Alerts Banner */}
        {urgentAlerts.length > 0 && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-950/40 dark:to-amber-950/30 border border-red-200 dark:border-red-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                <span className="material-symbols-outlined text-[20px]">notifications_active</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-red-600 dark:text-red-400 block">
                  Urgent Visa Advisory
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {urgentAlerts[0].title}
                </h3>
              </div>
            </div>
            <button
              onClick={() => setActiveArticleModal(urgentAlerts[0])}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
            >
              Read Bulletin
            </button>
          </div>
        )}

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* News Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
            <span className="material-symbols-outlined text-4xl text-slate-400">newspaper</span>
            <h3 className="text-lg font-bold">No news articles found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search query or select another category filter above.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                onClick={() => setActiveArticleModal(article)}
                className="group bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Card Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold">
                        {article.category}
                      </span>
                      {article.flagEmoji && (
                        <span className="px-2 py-0.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-xs shadow-xs">
                          {article.flagEmoji} {article.countryTag}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      <span>{article.publishedDate}</span>
                      <span>{article.readTime}</span>
                    </div>

                    <h2 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {article.title}
                    </h2>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 mt-4">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
                    Source: {article.source}
                  </span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read Article
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Bottom Consultation CTA Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-black">
              Need personalized advice on visa rules or university applications?
            </h3>
            <p className="text-xs sm:text-sm text-blue-100">
              Book a 1-on-1 session with a certified GEES study abroad counselor today.
            </p>
          </div>
          <button
            onClick={() => onOpenConsultation?.('General Consultation')}
            className="px-6 py-3 rounded-full bg-[#fbb034] hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            Book Free Consultation
          </button>
        </div>

      </div>

      {/* Article Detail Modal Reader */}
      {activeArticleModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-white dark:bg-[#0F172A] rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 relative">
            
            {/* Close Modal Button */}
            <button
              onClick={() => setActiveArticleModal(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            {/* Header Tags */}
            <div className="flex items-center gap-2 flex-wrap pt-2">
              <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold">
                {activeArticleModal.category}
              </span>
              {activeArticleModal.flagEmoji && (
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold">
                  {activeArticleModal.flagEmoji} {activeArticleModal.countryTag}
                </span>
              )}
              <span className="text-xs font-medium text-slate-500">
                {activeArticleModal.publishedDate} • {activeArticleModal.readTime}
              </span>
            </div>

            {/* Article Title */}
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
              {activeArticleModal.title}
            </h2>

            {/* Author & Source */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-500">
              <span>By {activeArticleModal.author}</span>
              <span>Official Source: <strong className="text-slate-700 dark:text-slate-300">{activeArticleModal.source}</strong></span>
            </div>

            {/* Banner Image */}
            <img
              src={activeArticleModal.imageUrl}
              alt={activeArticleModal.title}
              className="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-sm"
            />

            {/* Key Takeaways Box */}
            {activeArticleModal.keyPoints.length > 0 && (
              <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 space-y-3">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Key Official Takeaways</span>
                </div>
                <ul className="space-y-2 text-xs text-amber-950 dark:text-amber-100 font-medium">
                  {activeArticleModal.keyPoints.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Main Content Paragraphs */}
            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              {activeArticleModal.content.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {/* Modal Actions */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={() => setActiveArticleModal(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-slate-300 dark:border-slate-700 text-xs font-bold cursor-pointer"
              >
                Close Article
              </button>
              <button
                onClick={() => {
                  setActiveArticleModal(null);
                  onOpenConsultation?.(activeArticleModal.title);
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Inquire About This Bulletin
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
