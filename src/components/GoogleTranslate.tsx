/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES - Global Education Expert Services
 * Google Translate Integration Component with Premium Glassmorphism Styling
 */

import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: {
          new (options: any, elementId: string): any;
          InlineLayout: {
            SIMPLE: number;
            HORIZONTAL: number;
            VERTICAL: number;
          };
        };
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

interface GoogleTranslateProps {
  className?: string;
  compact?: boolean;
}

export const GoogleTranslate: React.FC<GoogleTranslateProps> = ({
  className = '',
  compact = false,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isScriptAdded, setIsScriptAdded] = useState(false);

  useEffect(() => {
    // 1. Define global init callback
    window.googleTranslateElementInit = () => {
      try {
        if (window.google?.translate?.TranslateElement) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
              multilanguagePage: true,
            },
            'google_translate_element'
          );
          setIsLoaded(true);
        }
      } catch (err) {
        console.warn('[Google Translate] Initialization notice:', err);
      }
    };

    // 2. If google object already initialized, trigger callback directly
    if (window.google?.translate?.TranslateElement) {
      window.googleTranslateElementInit();
      setIsLoaded(true);
      return;
    }

    // 3. Prevent duplicate script tags
    const SCRIPT_ID = 'google-translate-script';
    let scriptTag = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = SCRIPT_ID;
      scriptTag.type = 'text/javascript';
      scriptTag.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      scriptTag.async = true;
      scriptTag.defer = true;
      scriptTag.onload = () => {
        setIsScriptAdded(true);
      };
      scriptTag.onerror = (e) => {
        console.warn('[Google Translate] Script load failed or offline:', e);
      };
      document.body.appendChild(scriptTag);
    } else {
      setIsScriptAdded(true);
      if (window.google?.translate) {
        window.googleTranslateElementInit();
      }
    }

    return () => {
      // Keep script cached in DOM for navigation without re-fetching
    };
  }, []);

  return (
    <div
      className={`gees-google-translate-wrapper relative inline-flex items-center rounded-full bg-slate-100/95 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 p-0.5 sm:p-1 shadow-xs transition-all duration-200 backdrop-blur-xs select-none ${
        compact ? 'h-7 sm:h-8 px-1 text-[11px]' : 'h-8 sm:h-9 px-1.5 sm:px-2 text-xs'
      } ${className}`}
      title="Translate Website into Any Language"
    >
      {/* Globe Icon */}
      <div className="flex items-center gap-1 pl-1 text-slate-500 dark:text-slate-400 pointer-events-none shrink-0">
        <span className="material-symbols-outlined text-[15px] sm:text-[17px] text-amber-500">
          translate
        </span>
      </div>

      {/* Official Google Translate DOM target container */}
      <div
        id="google_translate_element"
        className="gees-translate-container overflow-hidden flex items-center min-w-[70px] max-w-[140px]"
      />
    </div>
  );
};

export default GoogleTranslate;
