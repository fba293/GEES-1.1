/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Feedback Toast for Course Wishlist
 * Displays temporary feedback with subtle bounce/slide animation,
 * course title preview, and direct navigation action.
 */

import React from 'react';
import { useWishlist } from '../../context/WishlistContext.tsx';

interface WishlistToastProps {
  onNavigateToWishlist?: () => void;
}

export const WishlistToast: React.FC<WishlistToastProps> = ({ onNavigateToWishlist }) => {
  const { toast, dismissToast } = useWishlist();

  if (!toast) return null;

  const isAdded = toast.message.toLowerCase().includes('added');

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-4 sm:right-8 z-50 max-w-sm sm:max-w-md w-[calc(100%-2rem)] transition-all duration-300 animate-slideInUp pointer-events-auto"
    >
      <div className="bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-xl border border-amber-400/30 text-white rounded-2xl p-4 shadow-2xl flex items-start gap-3.5 ring-1 ring-black/10">
        {/* Animated Badge Icon */}
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
            isAdded
              ? 'bg-[#fbb034] text-slate-950 animate-bounce-subtle'
              : 'bg-slate-700 text-slate-300'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {isAdded ? 'bookmark_added' : 'bookmark_remove'}
          </span>
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-amber-300 tracking-tight">
              {isAdded ? 'Added!' : 'Wishlist Updated'}
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300 font-bold uppercase">
              Success
            </span>
          </div>

          <p className="text-xs text-slate-200 font-medium mt-0.5 leading-snug">
            {toast.courseTitle ? (
              <>
                <span className="text-white font-semibold">"{toast.courseTitle}"</span> has been saved to your wishlist.
              </>
            ) : (
              toast.message
            )}
          </p>

          {/* Quick Action Link */}
          {onNavigateToWishlist && isAdded && (
            <button
              type="button"
              onClick={() => {
                dismissToast();
                onNavigateToWishlist();
              }}
              className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold text-[#fbb034] hover:text-amber-300 transition-colors cursor-pointer group"
            >
              <span>View Saved Courses</span>
              <span className="material-symbols-outlined text-xs group-hover:translate-x-0.5 transition-transform">
                arrow_forward
              </span>
            </button>
          )}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={dismissToast}
          aria-label="Dismiss toast"
          className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10 shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">close</span>
        </button>
      </div>
    </div>
  );
};
