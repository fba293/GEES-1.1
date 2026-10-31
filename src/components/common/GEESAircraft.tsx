/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEESAircraft - Production Aircraft Component for GEES Website
 * Preserves exact Malaysia Airlines 737 aircraft identity, livery, and proportions from /assets/aistudio/malaysia_plane_45be5f45.png.
 *
 * Features:
 * - Natural crisp rendering in Light Mode.
 * - Night flight illumination in Dark Mode: warm golden cabin window glow, red/green wing navigation lights, and white strobe.
 * - Automatic light/dark theme synchronization without page reload.
 * - Respects prefers-reduced-motion for accessibility.
 */

import React from 'react';

export interface GEESAircraftProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export const GEESAircraft: React.FC<GEESAircraftProps> = ({
  width = 90,
  height = 45,
  className = '',
  style = {}
}) => {
  return (
    <svg
      className={`overflow-visible select-none pointer-events-none ${className}`}
      width={width}
      height={height}
      viewBox="0 0 500 250"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="GEES Malaysia Airlines Aircraft"
      style={style}
    >
        <defs>
          {/* Cabin Window Night Glow Filter */}
          <filter id="windowGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Red Nav Light Glow Filter */}
          <filter id="redNavGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Green Nav Light Glow Filter */}
          <filter id="greenNavGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* White Strobe Flash Glow Filter */}
          <filter id="strobeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Dark Mode CSS Styles for Window Illumination & Wing Navigation Lights */}
          <style>{`
            /* Light Mode Default: Dark Overlays Hidden */
            .gees-plane-dark-overlay {
              opacity: 0;
              transition: opacity 0.4s ease-in-out;
            }

            /* Dark Mode Active: Reveal Night Flight Illumination */
            .dark .gees-plane-dark-overlay,
            [data-theme="dark"] .gees-plane-dark-overlay {
              opacity: 1;
            }

            /* Red Wingtip Navigation Light Pulse */
            .gees-nav-red {
              animation: geesRedNavPulse 1.8s infinite ease-in-out;
            }

            /* Green Wingtip Navigation Light Pulse */
            .gees-nav-green {
              animation: geesGreenNavPulse 1.8s infinite ease-in-out 0.2s;
            }

            /* White Strobe Light Flash */
            .gees-strobe-white {
              animation: geesStrobeFlash 1.5s infinite linear;
            }

            /* Window Glow Warm Ambient Breath */
            .gees-window-glow {
              animation: geesWindowBreath 3s infinite ease-in-out;
            }

            @keyframes geesRedNavPulse {
              0%, 100% { opacity: 0.95; transform: scale(1); }
              50% { opacity: 0.35; transform: scale(0.85); }
            }

            @keyframes geesGreenNavPulse {
              0%, 100% { opacity: 0.95; transform: scale(1); }
              50% { opacity: 0.35; transform: scale(0.85); }
            }

            @keyframes geesStrobeFlash {
              0%, 90%, 100% { opacity: 0.1; transform: scale(0.6); }
              93%, 97% { opacity: 1; transform: scale(1.5); }
            }

            @keyframes geesWindowBreath {
              0%, 100% { opacity: 0.9; }
              50% { opacity: 0.7; }
            }

            /* Accessibility: Disable Animations for Reduced Motion */
            @media (prefers-reduced-motion: reduce) {
              .gees-nav-red,
              .gees-nav-green,
              .gees-strobe-white,
              .gees-window-glow {
                animation: none !important;
              }
            }
          `}</style>
        </defs>

        {/* Base Transparent Malaysia Airlines Aircraft Image */}
        <image
          href="/assets/aistudio/malaysia_plane_45be5f45.png"
          x="0"
          y="0"
          width="500"
          height="250"
          preserveAspectRatio="xMidYMid meet"
        />

        {/* DARK MODE NIGHT FLIGHT OVERLAYS (Visible only in Dark Mode) */}
        <g className="gees-plane-dark-overlay">
          {/* 1. Cabin Windows Warm Golden Night Illumination */}
          <g className="gees-window-glow" filter="url(#windowGlowFilter)">
            {/* Mid Fuselage Window Row */}
            <path
              d="M 152 130 Q 230 118 310 108"
              fill="none"
              stroke="#fef08a"
              strokeWidth="2.8"
              strokeDasharray="2.5 3"
              strokeLinecap="round"
              opacity="0.85"
            />
            {/* Forward Fuselage Window Row */}
            <path
              d="M 330 105 Q 360 98 395 90"
              fill="none"
              stroke="#fef08a"
              strokeWidth="2.8"
              strokeDasharray="2.5 3"
              strokeLinecap="round"
              opacity="0.9"
            />
            {/* Cockpit Window Glow */}
            <path
              d="M 402 83 C 405 80 410 78 414 78"
              fill="none"
              stroke="#fbb034"
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity="0.8"
            />
          </g>

          {/* 2. Port (Left / Foreground Winglet) Red Navigation Light */}
          <g className="gees-nav-red" filter="url(#redNavGlow)">
            <circle cx="347" cy="158" r="3.5" fill="#ef4444" />
            <circle cx="347" cy="158" r="1.5" fill="#ffffff" />
          </g>

          {/* 3. Starboard (Right / Background Winglet) Green Navigation Light */}
          <g className="gees-nav-green" filter="url(#greenNavGlow)">
            <circle cx="121" cy="74" r="3" fill="#22c55e" />
            <circle cx="121" cy="74" r="1.2" fill="#ffffff" />
          </g>

          {/* 4. Tail Fin Strobe Light (White Flash at Vertical Stabilizer Tip) */}
          <g className="gees-strobe-white" filter="url(#strobeGlow)">
            <circle cx="48" cy="24" r="3.8" fill="#ffffff" />
            <circle cx="48" cy="24" r="1.8" fill="#ffffff" />
          </g>
        </g>
      </svg>
  );
};

export default GEESAircraft;
