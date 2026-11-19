/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Hero Section Dotted World Map & Subtle Animated Flight Paths
 *
 * Features:
 * - Subtle, ambient world-map silhouette sitting quietly behind the hero header
 * - Displays Bangladesh (Origin) and all 15 approved GEES study destinations:
 *   Australia, Canada, Cyprus, Finland, France, Greece, Hungary, India,
 *   Malaysia, Malta, New Zealand, South Korea, Sweden, United Kingdom, USA
 * - Low-contrast, non-distracting flight paths and gentle airliner movement
 *   so primary visual focus stays on the hero search bar
 * - Full dark mode & light mode harmony and prefers-reduced-motion support
 */

import React, { useEffect, useState, useMemo } from 'react';
import dotsData from './mapDotsData.json';

interface HeroWorldMapBackgroundProps {
  className?: string;
}

interface DestinationRoutePoint {
  id: string;
  name: string;
  shortName?: string;
  code: string;
  x: number;
  y: number;
  color: string;
  labelPos: {
    lx: number;
    ly: number;
    textAnchor: 'start' | 'middle' | 'end';
  };
  routePath: string;
  duration: number;
  beginOffset: number;
  delay: number;
}

// Bangladesh Origin Point
const ORIGIN = {
  name: 'Bangladesh',
  code: 'BD',
  x: 708,
  y: 236,
  labelPos: { lx: 708, ly: 214, textAnchor: 'middle' as const },
};

// All 15 Approved Foreign Study Destinations from Bangladesh (708, 236)
const STUDY_COUNTRIES: DestinationRoutePoint[] = [
  {
    id: 'australia',
    name: 'Australia',
    code: 'AU',
    x: 864,
    y: 384,
    color: '#10b981',
    labelPos: { lx: 842, ly: 398, textAnchor: 'end' },
    routePath: 'M 708 236 C 760 300, 820 345, 864 384',
    duration: 28,
    beginOffset: -4,
    delay: 0.2,
  },
  {
    id: 'canada',
    name: 'Canada',
    code: 'CA',
    x: 208,
    y: 114,
    color: '#f59e0b',
    labelPos: { lx: 184, ly: 98, textAnchor: 'end' },
    routePath: 'M 708 236 C 560 95, 360 70, 208 114',
    duration: 36,
    beginOffset: -11,
    delay: 0.5,
  },
  {
    id: 'cyprus',
    name: 'Cyprus',
    code: 'CY',
    x: 564,
    y: 188,
    color: '#8b5cf6',
    labelPos: { lx: 584, ly: 204, textAnchor: 'start' },
    routePath: 'M 708 236 Q 635 204 564 188',
    duration: 25,
    beginOffset: -8,
    delay: 0.8,
  },
  {
    id: 'finland',
    name: 'Finland',
    code: 'FI',
    x: 544,
    y: 84,
    color: '#6366f1',
    labelPos: { lx: 568, ly: 70, textAnchor: 'start' },
    routePath: 'M 708 236 C 655 145, 605 95, 544 84',
    duration: 29,
    beginOffset: -15,
    delay: 1.1,
  },
  {
    id: 'france',
    name: 'France',
    code: 'FR',
    x: 472,
    y: 148,
    color: '#3b82f6',
    labelPos: { lx: 434, ly: 152, textAnchor: 'end' },
    routePath: 'M 708 236 C 625 175, 540 148, 472 148',
    duration: 31,
    beginOffset: -19,
    delay: 1.4,
  },
  {
    id: 'greece',
    name: 'Greece',
    code: 'GR',
    x: 534,
    y: 176,
    color: '#0ea5e9',
    labelPos: { lx: 530, ly: 214, textAnchor: 'end' },
    routePath: 'M 708 236 Q 620 198 534 176',
    duration: 27,
    beginOffset: -6,
    delay: 1.7,
  },
  {
    id: 'hungary',
    name: 'Hungary',
    code: 'HU',
    x: 524,
    y: 144,
    color: '#14b8a6',
    labelPos: { lx: 564, ly: 136, textAnchor: 'start' },
    routePath: 'M 708 236 C 645 180, 580 150, 524 144',
    duration: 28,
    beginOffset: -22,
    delay: 2.0,
  },
  {
    id: 'india',
    name: 'India',
    code: 'IN',
    x: 684,
    y: 248,
    color: '#fbb034',
    labelPos: { lx: 660, ly: 268, textAnchor: 'end' },
    routePath: 'M 708 236 Q 696 242 684 248',
    duration: 22,
    beginOffset: -3,
    delay: 2.3,
  },
  {
    id: 'malaysia',
    name: 'Malaysia',
    code: 'MY',
    x: 756,
    y: 276,
    color: '#fbb034',
    labelPos: { lx: 778, ly: 292, textAnchor: 'start' },
    routePath: 'M 708 236 Q 736 252 756 276',
    duration: 24,
    beginOffset: -9,
    delay: 2.6,
  },
  {
    id: 'malta',
    name: 'Malta',
    code: 'MT',
    x: 504,
    y: 188,
    color: '#f43f5e',
    labelPos: { lx: 472, ly: 198, textAnchor: 'end' },
    routePath: 'M 708 236 C 635 212, 565 196, 504 188',
    duration: 30,
    beginOffset: -14,
    delay: 2.9,
  },
  {
    id: 'nz',
    name: 'New Zealand',
    shortName: 'New Zealand',
    code: 'NZ',
    x: 925,
    y: 405,
    color: '#06b6d4',
    labelPos: { lx: 942, ly: 382, textAnchor: 'end' },
    routePath: 'M 708 236 C 785 305, 870 365, 925 405',
    duration: 33,
    beginOffset: -17,
    delay: 3.2,
  },
  {
    id: 'south-korea',
    name: 'South Korea',
    shortName: 'S. Korea',
    code: 'KR',
    x: 820,
    y: 172,
    color: '#3b82f6',
    labelPos: { lx: 842, ly: 168, textAnchor: 'start' },
    routePath: 'M 708 236 Q 768 196 820 172',
    duration: 26,
    beginOffset: -12,
    delay: 3.5,
  },
  {
    id: 'sweden',
    name: 'Sweden',
    code: 'SE',
    x: 512,
    y: 92,
    color: '#0284c7',
    labelPos: { lx: 488, ly: 74, textAnchor: 'end' },
    routePath: 'M 708 236 C 642 150, 575 102, 512 92',
    duration: 30,
    beginOffset: -24,
    delay: 3.8,
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    shortName: 'UK',
    code: 'UK',
    x: 456,
    y: 122,
    color: '#2563eb',
    labelPos: { lx: 428, ly: 116, textAnchor: 'end' },
    routePath: 'M 708 236 C 625 155, 535 115, 456 122',
    duration: 32,
    beginOffset: -7,
    delay: 4.1,
  },
  {
    id: 'usa',
    name: 'USA',
    code: 'US',
    x: 220,
    y: 172,
    color: '#6366f1',
    labelPos: { lx: 194, ly: 184, textAnchor: 'end' },
    routePath: 'M 708 236 C 555 130, 365 125, 220 172',
    duration: 38,
    beginOffset: -21,
    delay: 4.4,
  },
];

/**
 * Subtle, Low-Focus Commercial Airliner SVG Icon
 * Scaled down and softened so it never competes with foreground UI
 */
const AirlinerIcon: React.FC<{ color?: string }> = ({ color = '#fbb034' }) => {
  return (
    <g className="airliner-mark" transform="scale(0.58)">
      <path
        d="M 13 0 C 12.2 -0.5, 9 -1.1, 5 -1.1 L 0 -9.5 C -0.6 -10.2, -1.6 -10, -1.8 -9.2 L -1.4 -3.8 L -0.6 -3.8 C 0.1 -3.8, 0.4 -3.3, 0.3 -2.8 L -0.2 -2.2 L -1.2 -1.1 L -6.5 -1.1 L -8.6 -4.6 C -9.1 -5.1, -9.8 -4.9, -9.6 -4.3 L -9.4 -0.6 L -12 0 L -9.4 0.6 C -9.8 4.9, -9.1 5.1, -8.6 4.6 L -6.5 1.1 L -1.2 1.1 L -0.2 2.2 C 0.4 3.3, 0.1 3.8, -0.6 3.8 L -1.4 3.8 L -1.8 9.2 C -1.6 10, -0.6 10.2, 0 9.5 L 5 1.1 C 9 1.1, 12.2 0.5, 13 0 Z"
        className="fill-slate-400/70 dark:fill-slate-400/60"
      />
      <circle cx="-1.2" cy="-9.4" r="0.7" fill={color} fillOpacity="0.65" />
      <circle cx="-1.2" cy="9.4" r="0.7" fill={color} fillOpacity="0.65" />
    </g>
  );
};

export const HeroWorldMapBackground: React.FC<HeroWorldMapBackgroundProps> = ({
  className = '',
}) => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Pre-generate SVG path for all 1,052 world map dots as a single GPU-accelerated path
  const mapDotsPath = useMemo(() => {
    return (dotsData as [number, number][])
      .map(([x, y]) => `M${x},${y}m-1.2,0a1.2,1.2 0 1,0 2.4,0a1.2,1.2 0 1,0 -2.4,0`)
      .join('');
  }, []);

  return (
    <div
      className={`w-full h-full pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full max-h-full object-contain opacity-40 sm:opacity-45 dark:opacity-35 transition-opacity duration-500"
        viewBox="30 25 930 435"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 1. Dotted World Map Grid (Subtle background texture) */}
        <g className="world-map-dots">
          <path
            d={mapDotsPath}
            className="fill-slate-400/20 dark:fill-slate-500/20 transition-colors duration-500"
          />
        </g>

        {/* 2. Radiating Curved Flight Paths from Bangladesh to all 15 Destinations */}
        <g className="flight-routes">
          {STUDY_COUNTRIES.map((country) => (
            <path
              key={`route-${country.id}`}
              d={country.routePath}
              fill="none"
              stroke={country.color}
              strokeOpacity="0.22"
              strokeWidth="0.95"
              strokeDasharray="2.5 3.5"
              strokeLinecap="round"
            />
          ))}
        </g>

        {/* 3. Subtle Beacons & Labels for Origin (Bangladesh) + All 15 Study Destinations */}
        <g className="map-country-beacons">
          {/* A. ORIGIN: BANGLADESH */}
          <g className="origin-bangladesh">
            {!reducedMotion && (
              <circle
                cx={ORIGIN.x}
                cy={ORIGIN.y}
                r="2.5"
                fill="none"
                className="stroke-[#10b981]/50 dark:stroke-[#34d399]/40"
                strokeWidth="0.9"
              >
                <animate
                  attributeName="r"
                  values="2.5; 8; 13"
                  dur="3.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.55; 0.18; 0"
                  dur="3.5s"
                  repeatCount="indefinite"
                />
              </circle>
            )}

            <circle
              cx={ORIGIN.x}
              cy={ORIGIN.y}
              r="2.4"
              className="fill-[#10b981]/75 dark:fill-[#34d399]/70"
            />

            {/* Subtle Origin Tag */}
            <g className="callout-tag-bd hidden sm:inline">
              <text
                x={ORIGIN.labelPos.lx}
                y={ORIGIN.labelPos.ly}
                textAnchor="middle"
                className="text-[6.5px] font-semibold fill-emerald-700/70 dark:fill-emerald-300/60 tracking-wide select-none"
              >
                Bangladesh
              </text>
            </g>
          </g>

          {/* B. ALL 15 DESTINATION COUNTRIES */}
          {STUDY_COUNTRIES.map((country) => (
            <g key={country.id} className={`destination-${country.id}`}>
              {/* Gentle, slow ripple */}
              {!reducedMotion && (
                <circle
                  cx={country.x}
                  cy={country.y}
                  r="2"
                  fill="none"
                  stroke={country.color}
                  strokeOpacity="0.35"
                  strokeWidth="0.8"
                >
                  <animate
                    attributeName="r"
                    values="2; 6.5; 11"
                    dur="4s"
                    begin={`${country.delay}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.45; 0.15; 0"
                    dur="4s"
                    begin={`${country.delay}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              )}

              {/* Soft pin dot */}
              <circle
                cx={country.x}
                cy={country.y}
                r="2"
                fill={country.color}
                fillOpacity="0.65"
              />

              {/* Delicate connector line & understated label */}
              <g className="callout-indicator">
                <line
                  x1={country.x}
                  y1={country.y}
                  x2={country.labelPos.lx}
                  y2={country.labelPos.ly - 2}
                  stroke={country.color}
                  strokeOpacity="0.25"
                  strokeWidth="0.6"
                  strokeDasharray="1.2 1.5"
                />

                {/* Mobile compact 2-letter code */}
                <text
                  x={country.labelPos.lx}
                  y={country.labelPos.ly}
                  textAnchor={country.labelPos.textAnchor}
                  className="sm:hidden text-[5.5px] font-semibold fill-slate-500/75 dark:fill-slate-400/65 tracking-tight select-none"
                >
                  {country.code}
                </text>

                {/* Tablet & Desktop subtle country name */}
                <text
                  x={country.labelPos.lx}
                  y={country.labelPos.ly}
                  textAnchor={country.labelPos.textAnchor}
                  className="hidden sm:inline text-[6.5px] font-semibold fill-slate-500/80 dark:fill-slate-400/70 tracking-tight select-none"
                >
                  {country.shortName || country.name}
                </text>
              </g>
            </g>
          ))}
        </g>

        {/* 4. Gentle, Low-Focus Airplanes Traveling to All 15 Destinations */}
        {!reducedMotion && (
          <g className="animated-airplanes">
            {STUDY_COUNTRIES.map((country) => (
              <g key={`plane-${country.id}`} className={`plane-bd-${country.id}`}>
                <AirlinerIcon color={country.color} />
                <animateMotion
                  path={country.routePath}
                  dur={`${country.duration}s`}
                  begin={`${country.beginOffset}s`}
                  repeatCount="indefinite"
                  rotate="auto"
                />
                <animate
                  attributeName="opacity"
                  values="0; 0.45; 0.45; 0.45; 0"
                  keyTimes="0; 0.15; 0.5; 0.85; 1"
                  dur={`${country.duration}s`}
                  begin={`${country.beginOffset}s`}
                  repeatCount="indefinite"
                />
              </g>
            ))}
          </g>
        )}
      </svg>
    </div>
  );
};
