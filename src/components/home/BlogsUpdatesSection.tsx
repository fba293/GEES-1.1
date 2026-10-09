/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES - Global Education Expert Services
 * Homepage "Blogs, News & Visa Updates" Section (Original GEES Design)
 * 
 * Features:
 * - Signature GEES typography & golden pill badge header ("Blogs & [Updates]")
 * - Smooth 120 FPS animated category tabs (All, Canada, UK, Australia, Visa & Immigration)
 * - High-converting editorial article cards with image zoom, tags, metadata, and key takeaways checklist
 * - Interactive full reading modal with copy link & counselor consultation intake
 * - Prominent "More Articles" button that redirects to the updated /blog.html hub
 * - Mobile-first refinement with 44×44px touch targets and responsive card stacking
 */

import React, { useState, useEffect } from 'react';
import { mockBlogPosts } from '../../data/mockDatabase.ts';
import { BlogPost } from '../../types/index.ts';
import { AnimatedTabs, AnimatedTabItem } from '../ui/animated-tabs.tsx';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';

interface BlogsUpdatesSectionProps {
  onOpenConsultation: () => void;
  onNavigate?: (view: string, payload?: any) => void;
}

export const BlogsUpdatesSection: React.FC<BlogsUpdatesSectionProps> = ({
  onOpenConsultation,
  onNavigate
}) => {
  // Active Filter Category
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Bookmarks & local state for posts
  const [posts, setPosts] = useState<BlogPost[]>(() => mockBlogPosts);

  // Active Article Reading Modal
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);

  // Copied Link Feedback
  const [copiedLink, setCopiedLink] = useState(false);

  // Tabs Definition
  const tabs: AnimatedTabItem[] = [
    { id: 'all', label: 'All Updates' },
    { id: 'malaysia', label: 'Malaysia 🇲🇾' },
    { id: 'uk', label: 'UK Guide 🇬🇧' },
    { id: 'australia', label: 'Australia 🇦🇺' },
    { id: 'visa', label: 'Visa & Immigration ✈️' }
  ];

  // Keyboard navigation for escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedArticle(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter Logic
  const filteredPosts = posts.filter((post) => {
    if (activeCategory === 'all') return true;
    const cat = post.category.toLowerCase();
    const title = post.title.toLowerCase();

    if (activeCategory === 'malaysia') {
      return cat.includes('malaysia') || title.includes('malaysia');
    }
    if (activeCategory === 'uk') {
      return cat.includes('uk') || title.includes('russell') || title.includes('uk');
    }
    if (activeCategory === 'australia') {
      return cat.includes('australia') || title.includes('australia');
    }
    if (activeCategory === 'visa') {
      return cat.includes('visa') || title.includes('visa') || title.includes('evidence');
    }
    return true;
  });

  // Toggle Bookmark
  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, saved: !p.saved } : p))
    );
  };

  // Copy Link Handler
  const handleCopyLink = (post: BlogPost, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/blog.html#${post.slug || post.id}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Redirect to Updated blog.html
  const handleRedirectToBlog = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      // Direct redirection to blog.html as explicitly requested
      window.location.href = '/blog.html';
    } else if (onNavigate) {
      onNavigate('blog');
    }
  };

  return (
    <section
      id="blogs-section"
      className="w-full bg-slate-50 dark:bg-[#070D1E] py-14 sm:py-20 border-t border-slate-100 dark:border-slate-800 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Header (Classic GEES Signature Style) */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 px-2">
          <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 mb-2 text-center max-w-full px-2">
            <h2 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Blogs &
            </h2>
            <span className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 px-3.5 sm:px-6 py-0.5 sm:py-1 rounded-xl sm:rounded-2xl bg-[#fbb034] inline-flex items-center shadow-xs leading-tight">
              Updates
            </span>
          </div>
          <p className="mt-2.5 sm:mt-3 text-sm sm:text-lg text-slate-500 dark:text-slate-400 font-normal leading-relaxed px-2">
            Latest immigration advisories, university admission trends, and scholarship guides.
          </p>

          {/* Category Tabs */}
          <div className="mt-6 sm:mt-8 w-full flex justify-center">
            <AnimatedTabs
              tabs={tabs}
              activeId={activeCategory}
              onChange={(id) => setActiveCategory(id)}
              size="md"
            />
          </div>
        </div>

        {/* 2. Responsive 3-Column Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {filteredPosts.slice(0, 6).map((post) => {
            return (
              <article
                key={post.id}
                onClick={() => setSelectedArticle(post)}
                className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer active:scale-[0.99]"
              >
                {/* Image Banner */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Top Category Badge */}
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-slate-900/80 backdrop-blur-md text-[#fbb034] border border-amber-400/20 shadow-xs">
                      {post.category}
                    </span>
                  </div>

                  {/* Top Right Bookmark Action with 44px hit area */}
                  <div className="absolute top-2.5 right-2.5 z-10 flex items-center">
                    <button
                      type="button"
                      aria-label={post.saved ? 'Remove bookmark' : 'Bookmark article'}
                      onClick={(e) => toggleBookmark(post.id, e)}
                      className="w-11 h-11 flex items-center justify-center rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md transition-colors cursor-pointer"
                    >
                      <span
                        className={`material-symbols-outlined text-[20px] transition-transform active:scale-125 ${
                          post.saved ? 'text-[#fbb034] fill-current font-variation-fill' : 'text-white'
                        }`}
                      >
                        {post.saved ? 'bookmark' : 'bookmark_border'}
                      </span>
                    </button>
                  </div>

                  {/* Read time pill */}
                  <div className="absolute bottom-3 left-3.5 z-10 flex items-center gap-2 text-white/90 text-xs font-semibold">
                    <span className="flex items-center gap-1 bg-black/50 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                      <span className="material-symbols-outlined text-xs text-[#fbb034]">schedule</span>
                      <span>{post.readTime}</span>
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Author & Published Date */}
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-500 flex items-center justify-center text-[10px] font-bold">
                          ✍️
                        </span>
                        <span>{post.author}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">visibility</span>
                        <span>{post.viewsCount.toLocaleString()}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-[#fbb034] transition-colors tracking-tight leading-snug mb-2.5">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
                      {post.excerpt}
                    </p>

                    {/* Key Takeaways Box (Signature GEES Feature) */}
                    {post.takeaways && post.takeaways.length > 0 && (
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80 mb-4 space-y-1.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block">
                          Key Highlights
                        </span>
                        {post.takeaways.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                            <span className="material-symbols-outlined text-emerald-500 text-sm shrink-0 leading-tight">
                              check_circle
                            </span>
                            <span className="line-clamp-1 leading-snug">{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setSelectedArticle(post)}
                      className="min-h-[44px] inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-[#fbb034] dark:hover:text-amber-300 transition-colors py-2 cursor-pointer"
                    >
                      <span>Read Full Guide</span>
                      <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </button>

                    <button
                      type="button"
                      aria-label="Share article"
                      onClick={(e) => handleCopyLink(post, e)}
                      className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[18px]">share</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* 3. Bottom CTA: "More Articles" Redirect Button */}
        <div className="mt-12 sm:mt-16 text-center flex flex-col items-center justify-center gap-3">
          <a
            href="/blog.html"
            onClick={handleRedirectToBlog}
            className="inline-flex items-center justify-center focus:outline-none"
          >
            <InteractiveHoverButton
              text="More Articles"
              className="min-h-[44px] text-sm sm:text-base py-3 px-8 shadow-md cursor-pointer"
            />
          </a>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Explore 50+ detailed destination guides, scholarship roadmaps & visa checklists.
          </p>
        </div>
      </div>

      {/* 4. Full Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl max-w-3xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Close Button with 44px touch target */}
            <button
              onClick={() => setSelectedArticle(null)}
              aria-label="Close modal"
              className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {/* Modal Header */}
            <div className="pr-10 mb-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#fbb034]/20 text-[#fbb034] border border-amber-400/30 uppercase tracking-wider mb-2">
                {selectedArticle.category}
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                {selectedArticle.title}
              </h2>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  By {selectedArticle.author}
                </span>
                <span>•</span>
                <span>{selectedArticle.publishedDate}</span>
                <span>•</span>
                <span>{selectedArticle.readTime}</span>
                <span>•</span>
                <span>{selectedArticle.viewsCount.toLocaleString()} views</span>
              </div>
            </div>

            {/* Modal Banner Image */}
            <div className="rounded-2xl overflow-hidden mb-6 aspect-[16/9] bg-slate-100 dark:bg-slate-800">
              <img
                src={selectedArticle.imageUrl}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Key Takeaways */}
            {selectedArticle.takeaways && selectedArticle.takeaways.length > 0 && (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-6">
                <h4 className="text-xs uppercase font-extrabold text-amber-600 dark:text-amber-400 tracking-wider mb-2.5">
                  Key Takeaways
                </h4>
                <ul className="space-y-2">
                  {selectedArticle.takeaways.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                      <span className="material-symbols-outlined text-emerald-500 text-base shrink-0">
                        check_circle
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Body Content */}
            <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed space-y-4 mb-8">
              <p>{selectedArticle.body}</p>
            </div>

            {/* Modal Bottom CTA */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 items-center justify-between">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={(e) => handleCopyLink(selectedArticle, e)}
                  className="min-h-[44px] flex-1 sm:flex-none px-4 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <span className="material-symbols-outlined text-sm">
                    {copiedLink ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedLink ? 'Copied Link!' : 'Copy Link'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setSelectedArticle(null);
                    onOpenConsultation();
                  }}
                  className="min-h-[44px] flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm tracking-wide text-center cursor-pointer shadow-lg shadow-blue-600/30 transition active:scale-95 flex items-center justify-center"
                >
                  Book Free Consultation for This Guide
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Copied Toast */}
      {copiedLink && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200 flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
          <span>Article link copied to clipboard!</span>
        </div>
      )}
    </section>
  );
};
