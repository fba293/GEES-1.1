/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES "Blogs, News & Updates" with Live Bookmarks, Reading Drawer, Social Sharing,
 * Framer Motion Staggered Entrance & Modern Newsletter Subscription.
 */

import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { mockBlogPosts } from '../../data/mockDatabase.ts';
import { BlogPost } from '../../types/index.ts';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';
import { AnimatedTabs, AnimatedTabItem } from '../ui/animated-tabs.tsx';

interface BlogsUpdatesSectionProps {
  onOpenConsultation: () => void;
}

export const BlogsUpdatesSection: React.FC<BlogsUpdatesSectionProps> = ({ onOpenConsultation }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [posts, setPosts] = useState<BlogPost[]>(mockBlogPosts);
  const [activeReadingModal, setActiveReadingModal] = useState<BlogPost | null>(null);
  const [activeShareModal, setActiveShareModal] = useState<BlogPost | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const savedCount = posts.filter(p => p.saved).length;

  const blogTabs: AnimatedTabItem[] = [
    { label: 'All Posts', id: 'all' },
    { label: 'Articles', id: 'article' },
    { label: 'News & Events', id: 'news' },
    { label: 'Scholarships', id: 'scholarship' },
    { label: 'Visa Updates', id: 'visa' },
    { 
      label: 'Saved', 
      id: 'saved',
      icon: <span className="material-symbols-outlined text-[15px] text-red-500">bookmark</span>,
      badge: (
        <span className="px-1.5 py-0.2 text-[10px] font-black rounded-full bg-red-600 text-white leading-none">
          {savedCount}
        </span>
      )
    }
  ];

  const handleCategoryChange = (categoryKey: string) => {
    setSelectedCategory(categoryKey);
  };

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, saved: !p.saved };
      }
      return p;
    }));
  };

  const filteredPosts = selectedCategory === 'all'
    ? posts
    : selectedCategory === 'saved'
    ? posts.filter(p => p.saved)
    : posts.filter(p => p.category.toLowerCase().includes(selectedCategory));

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareSocial = (e: React.MouseEvent, platform: 'linkedin' | 'twitter' | 'facebook', post: BlogPost) => {
    e.stopPropagation();
    const url = encodeURIComponent(window.location.origin + `/blog/${post.slug}`);
    const text = encodeURIComponent(post.title);
    if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'noopener,noreferrer');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'noopener,noreferrer');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'noopener,noreferrer');
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setNewsletterSubscribed(false), 4000);
  };

  // Framer motion container and card variants for staggered animation
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05
      }
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 24, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.45,
        ease: 'easeOut'
      }
    }
  };

  return (
    <section className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 bg-white dark:bg-[#070b19]">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-8 pb-4 px-2">
        <h2 className="text-base xs:text-xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight flex items-center justify-center flex-nowrap sm:flex-wrap whitespace-nowrap overflow-hidden text-ellipsis sm:whitespace-normal gap-1.5 sm:gap-2.5">
          <span>Blogs, News &</span>
          <span className="bg-[#fbb034] text-slate-950 px-2 sm:px-5 py-0.5 sm:py-1 rounded-lg sm:rounded-2xl shadow-xs">
            Updates
          </span>
        </h2>
        <p className="text-xs sm:text-base text-slate-600 dark:text-slate-400 mt-2 sm:mt-2.5 font-medium truncate sm:whitespace-normal">
          Latest news, visa updates & student success stories.
        </p>
      </div>

      {/* Filter Tabs with Universal 120 FPS Sliding Indicator */}
      <div className="w-full mb-8 sm:mb-10 flex justify-center">
        <AnimatedTabs
          tabs={blogTabs}
          activeId={selectedCategory}
          onChange={handleCategoryChange}
          size="md"
        />
      </div>

      {/* Grid with Framer Motion Staggered Entrance */}
      <motion.div
        key={selectedCategory}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="space-y-7"
      >
        {/* Row 1: Horizontal Split Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPosts.slice(0, 2).map((post) => (
            <motion.article
              key={post.id}
              variants={cardVariants}
              onClick={() => setActiveReadingModal(post)}
              className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 flex flex-col-reverse sm:flex-row items-stretch justify-between gap-6 shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1.5 will-change-transform cursor-pointer relative overflow-hidden"
            >
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  {/* Metadata Row with Estimated Reading Time and Social Share Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-0.5 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {post.category}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {post.publishedDate}
                      </span>
                      {/* Estimated Reading Time Badge */}
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        <span className="material-symbols-outlined text-[13px]">schedule</span>
                        <span>{post.readTime || '4 min read'}</span>
                      </span>
                    </div>

                    {/* Inline Social Share Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        title="Share on LinkedIn"
                        onClick={(e) => handleShareSocial(e, 'linkedin', post)}
                        className="p-1 rounded-md text-slate-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <span className="text-xs font-bold leading-none">in</span>
                      </button>
                      <button
                        title="Share on X / Twitter"
                        onClick={(e) => handleShareSocial(e, 'twitter', post)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <span className="text-xs font-bold leading-none">𝕏</span>
                      </button>
                      <button
                        title="Share on Facebook"
                        onClick={(e) => handleShareSocial(e, 'facebook', post)}
                        className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <span className="text-xs font-bold leading-none">fb</span>
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors mb-2">
                    {post.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 mb-4 font-normal">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:underline flex items-center gap-1">
                    <span>Read More</span>
                    <span>→</span>
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveShareModal(post);
                      }}
                      className="p-1.5 rounded-full text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">share</span>
                    </button>
                    <button
                      onClick={(e) => toggleBookmark(post.id, e)}
                      className={`p-1.5 rounded-full transition-transform active:scale-125 cursor-pointer ${
                        post.saved ? 'text-red-600' : 'text-slate-400 hover:text-red-600'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {post.saved ? 'bookmark' : 'bookmark_border'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Image with subtle drop-shadow filter */}
              <div className="w-full sm:w-52 h-48 sm:h-auto shrink-0 relative overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 drop-shadow-md shadow-md">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 duration-500 transition-transform"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </motion.article>
          ))}
        </div>

        {/* Row 2: 3-Column Standard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.slice(2).map((post) => (
            <motion.article
              key={post.id}
              variants={cardVariants}
              onClick={() => setActiveReadingModal(post)}
              className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 flex flex-col justify-between shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1.5 will-change-transform cursor-pointer relative overflow-hidden"
            >
              <div>
                {/* Image with subtle drop-shadow */}
                <div className="w-full h-48 relative overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 mb-4 drop-shadow-md shadow-md">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 duration-500 transition-transform"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {/* Metadata Row with Estimated Reading Time and Social Share Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2.5 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                      {post.category}
                    </span>
                    <span className="text-slate-400">• {post.publishedDate}</span>
                  </div>
                  {/* Estimated Reading Time */}
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    <span className="material-symbols-outlined text-[12px]">schedule</span>
                    <span>{post.readTime || '4 min read'}</span>
                  </span>
                </div>

                {/* Micro Social Share Row */}
                <div className="flex items-center gap-2 mb-3 text-slate-400 text-xs">
                  <span className="text-[11px] font-medium">Share:</span>
                  <button
                    title="Share on LinkedIn"
                    onClick={(e) => handleShareSocial(e, 'linkedin', post)}
                    className="hover:text-sky-600 transition-colors font-bold text-xs"
                  >
                    LinkedIn
                  </button>
                  <span>•</span>
                  <button
                    title="Share on X"
                    onClick={(e) => handleShareSocial(e, 'twitter', post)}
                    className="hover:text-slate-900 dark:hover:text-white transition-colors font-bold text-xs"
                  >
                    𝕏
                  </button>
                  <span>•</span>
                  <button
                    title="Share on Facebook"
                    onClick={(e) => handleShareSocial(e, 'facebook', post)}
                    className="hover:text-blue-600 transition-colors font-bold text-xs"
                  >
                    FB
                  </button>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors mb-2">
                  {post.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 mb-4">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:underline flex items-center gap-1">
                  <span>Read More</span>
                  <span>→</span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveShareModal(post);
                    }}
                    className="p-1.5 rounded-full text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">share</span>
                  </button>
                  <button
                    onClick={(e) => toggleBookmark(post.id, e)}
                    className={`p-1.5 rounded-full transition-transform active:scale-125 cursor-pointer ${
                      post.saved ? 'text-red-600' : 'text-slate-400 hover:text-red-600'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {post.saved ? 'bookmark' : 'bookmark_border'}
                    </span>
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Empty state when filtering Saved with 0 bookmarks */}
        {filteredPosts.length === 0 && (
          <div className="py-16 text-center bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-8">
            <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">bookmark_border</span>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Saved Articles Yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Click the bookmark ribbon on any article card to save it for quick reading.
            </p>
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className="mt-4 px-4 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs cursor-pointer"
            >
              Browse All Articles
            </button>
          </div>
        )}
      </motion.div>

      {/* Modern Newsletter Subscription Box */}
      <div className="mt-14 max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-50 via-amber-50/40 to-slate-50 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-700 dark:text-amber-300 text-xs font-bold mb-3">
          <span className="material-symbols-outlined text-sm">mail</span>
          <span>Stay Updated</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
          Subscribe to the GEES International Digest
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-5">
          Get weekly scholarship alerts, immigration law updates, and university intake deadlines sent straight to your inbox.
        </p>

        {newsletterSubscribed ? (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-sm font-semibold flex items-center justify-center gap-2 animate-fadeIn">
            <span className="material-symbols-outlined text-emerald-500">check_circle</span>
            <span>Thank you for subscribing! Check your email for our welcome guide.</span>
          </div>
        ) : (
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-center gap-2.5 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Enter your email address..."
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#fbb034] shadow-xs"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#fbb034] hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shrink-0 transition-colors shadow-md shadow-amber-500/20 cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>

      {/* View More Articles Footer Link */}
      <div className="mt-10 sm:mt-12 text-center">
        <a
          href="blog.html"
          className="inline-block"
        >
          <InteractiveHoverButton
            type="button"
            text="More Articles"
            className="px-8 py-3.5 rounded-full bg-white dark:bg-slate-900 text-slate-950 dark:text-white border-slate-300 dark:border-slate-700 font-bold text-sm sm:text-base shadow-md cursor-pointer"
          />
        </a>
      </div>

      {/* Reading Article Modal with subtle drop-shadow on image */}
      {activeReadingModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-[#0f172a] w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 max-h-[90vh] flex flex-col animate-fadeIn">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-700">
                {activeReadingModal.category}
              </span>
              <button
                onClick={() => setActiveReadingModal(null)}
                className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 sm:px-8 py-6 overflow-y-auto space-y-5 no-scrollbar">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                {activeReadingModal.title}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span>Published: {activeReadingModal.publishedDate}</span>
                <span className="text-amber-600 font-bold">• {activeReadingModal.readTime}</span>
                <span>• By {activeReadingModal.author}</span>
                <span>• {activeReadingModal.viewsCount} views</span>
              </div>
              <div className="w-full h-64 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 drop-shadow-md shadow-lg border border-slate-200/50 dark:border-slate-700/50">
                <img src={activeReadingModal.imageUrl} alt={activeReadingModal.title} className="w-full h-full object-cover" />
              </div>
              <div className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 font-normal space-y-3">
                <p>{activeReadingModal.body}</p>
              </div>

              {/* Key Takeaways */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 mb-2">
                  Key Strategic Takeaways:
                </h4>
                <ul className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1.5 pl-4 list-disc">
                  {activeReadingModal.takeaways.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setActiveShareModal(activeReadingModal)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">share</span>
                <span>Share Story</span>
              </button>
              <button
                onClick={() => {
                  setActiveReadingModal(null);
                  onOpenConsultation();
                }}
                className="px-5 py-2.5 rounded-full bg-[#fbb034] hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-sm cursor-pointer"
              >
                Book IELTS & Visa Consultation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Social Share Sheet Modal */}
      {activeShareModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-[#0f172a] w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800 animate-fadeIn">
            <button
              onClick={() => setActiveShareModal(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">
              Share Article
            </h3>
            <p className="text-xs text-slate-500 mb-4 truncate">
              {activeShareModal.title}
            </p>
            <div className="grid grid-cols-4 gap-2.5 text-center mb-6">
              {[
                { label: 'WhatsApp', color: 'bg-emerald-500', action: () => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(activeShareModal.title + ' ' + activeShareModal.slug)}`) },
                { label: 'Facebook', color: 'bg-blue-600', action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`) },
                { label: 'X (Twitter)', color: 'bg-black', action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(activeShareModal.title)}`) },
                { label: 'LinkedIn', color: 'bg-sky-600', action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`) }
              ].map((s, i) => (
                <button
                  key={i}
                  onClick={s.action}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <div className={`w-11 h-11 rounded-2xl ${s.color} text-white flex items-center justify-center shadow-sm`}>
                    <span className="material-symbols-outlined text-[18px]">share</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{s.label}</span>
                </button>
              ))}
            </div>
            {/* Copy Link */}
            <div className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-300 truncate px-2">
                https://gees.education/blog/{activeShareModal.slug}
              </span>
              <button
                onClick={() => handleCopyLink(`https://gees.education/blog/${activeShareModal.slug}`)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shrink-0 cursor-pointer"
              >
                {copiedLink ? 'Copied! ✓' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
