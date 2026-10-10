/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Reusable Sliding Entrance Animation Wrapper & Slide Panel Component
 * Hardware-Accelerated 120 FPS GPU Transitions
 */

import React, { useEffect, useRef } from 'react';

export type SlideDirection = 'right' | 'left' | 'up' | 'down';

export interface SlideTransitionProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: SlideDirection;
  delayMs?: number;
  durationMs?: number;
  children: React.ReactNode;
}

/**
 * Reusable slide entrance wrapper component
 * Encapsulates buttery-smooth slide-in transitions with customizable direction.
 */
export const SlideTransition: React.FC<SlideTransitionProps> = ({
  direction = 'right',
  delayMs = 0,
  durationMs = 320,
  className = '',
  children,
  style,
  ...props
}) => {
  const getAnimationClass = () => {
    switch (direction) {
      case 'left':
        return 'animate-slide-in-left';
      case 'up':
      case 'down':
        return 'animate-slide-in-top';
      case 'right':
      default:
        return 'animate-slide-in-right';
    }
  };

  const inlineStyle: React.CSSProperties = {
    animationDuration: `${durationMs}ms`,
    animationDelay: `${delayMs}ms`,
    animationFillMode: 'both',
    willChange: 'transform, opacity',
    ...style,
  };

  return (
    <div
      className={`${getAnimationClass()} ${className}`}
      style={inlineStyle}
      {...props}
    >
      {children}
    </div>
  );
};

export interface SlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  side?: 'right' | 'left';
  widthClass?: string;
  children: React.ReactNode;
}

/**
 * Reusable sliding modal/drawer panel with backdrop blur and smooth entrance
 */
export const SlidePanel: React.FC<SlidePanelProps> = ({
  isOpen,
  onClose,
  title,
  side = 'right',
  widthClass = 'w-full max-w-md',
  children,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden isolate" role="dialog" aria-modal="true">
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sliding Drawer Container */}
      <div
        ref={panelRef}
        className={`fixed top-0 bottom-0 ${
          side === 'right' ? 'right-0 animate-slide-in-right' : 'left-0 animate-slide-in-left'
        } ${widthClass} bg-white dark:bg-[#0B1329] shadow-2xl z-50 flex flex-col justify-between overflow-y-auto no-scrollbar border-l border-slate-200 dark:border-slate-800`}
        style={{
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
      >
        {title && (
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer active:scale-95"
              aria-label="Close panel"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        )}

        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default SlideTransition;
