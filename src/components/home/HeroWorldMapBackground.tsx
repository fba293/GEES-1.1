/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Hero Section Dotted World Map & Continuous Animated Flight Paths
 * 
 * Features:
 * - Compact world-map silhouette fitting cleanly between the hero header and search bar
 * - Prominent blinking callout beacons pointing out Bangladesh (Origin) and all 6 destination countries:
 *   1. Malaysia 2. United Kingdom 3. Australia 4. New Zealand 5. Cyprus 6. Finland
 * - Radiating flight paths with continuous commercial airliners flying along trajectories
 * - Smooth tangent orientation (<animateMotion rotate="auto">) and non-synchronized looping
 * - Full dark mode & light mode theme harmony without artificial neon glow
 * - Accessibility: full prefers-reduced-motion support
 */

import React, { useEffect, useState, useMemo } from 'react';
import dotsData from './mapDotsData.json';

interface HeroWorldMapBackgroundProps {
  className?: string;
}

// Bangladesh Origin Point
const ORIGIN = {
  name: 'Bangladesh',
  code: 'BD',
  x: 708,
  y: 236,
  labelPos: { lx: 708, ly: 254, textAnchor: 'middle' as const },
};

// The 6 Primary Foreign Study Destinations sent from Bangladesh
const STUDY_COUNTRIES = [
  {
    id: 'malaysia',
    name: 'Malaysia',
    code: 'MY',
    x: 756,
    y: 276,
    color: '#fbb034', // GEES Gold
    labelPos: { lx: 786, ly: 294, textAnchor: 'start' as const },
    delay: 0.2,
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    shortName: 'UK',
    code: 'UK',
    x: 456,
    y: 120,
    color: '#3b82f6', // British Blue
    labelPos: { lx: 418, ly: 98, textAnchor: 'end' as const },
    delay: 0.5,
  },
  {
    id: 'australia',
    name: 'Australia',
    code: 'AU',
    x: 864,
    y: 384,
    color: '#10b981', // Aussie Green
    labelPos: { lx: 890, ly: 406, textAnchor: 'start' as const },
    delay: 0.8,
  },
  {
    id: 'nz',
    name: 'New Zealand',
    code: 'NZ',
    x: 925,
    y: 405,
    color: '#06b6d4', // Kiwi Cyan
    labelPos: { lx: 940, ly: 382, textAnchor: 'start' as const },
    delay: 1.1,
  },
  {
    id: 'cyprus',
    name: 'Cyprus',
    code: 'CY',
    x: 564,
    y: 188,
    color: '#a855f7', // Mediterranean Purple
    labelPos: { lx: 536, ly: 210, textAnchor: 'end' as const },
    delay: 1.4,
  },
  {
    id: 'finland',
    name: 'Finland',
    code: 'FI',
    x: 540,
    y: 82,
    color: '#6366f1', // Nordic Indigo
    labelPos: { lx: 562, ly: 64, textAnchor: 'start' as const },
    delay: 1.7,
  },
];

/**
 * Realistic Commercial Passenger Airliner SVG Icon
 * Scaled along positive X-axis (nose at +13, tail at -12, wingspan from -9.5 to +9.5)
 */
const AirlinerIcon: React.FC<{ theme?: 'gold' | 'blue' | 'emerald' | 'indigo' }> = ({
  theme = 'gold',
}) => {
  const accent =
    theme === 'blue'
      ? '#3b82f6'
      : theme === 'emerald'
        ? '#10b981'
        : theme === 'indigo'
          ? '#6366f1'
          : '#fbb034';

  return (
    <g className="airliner-mark" transform="scale(0.95)">
      {/* 1. Slender Passenger Jet Fuselage & Swept Wings */}
      <path
        d="M 13 0 C 12.2 -0.5, 9 -1.1, 5 -1.1 L 0 -9.5 C -0.6 -10.2, -1.6 -10, -1.8 -9.2 L -1.4 -3.8 L -0.6 -3.8 C 0.1 -3.8, 0.4 -3.3, 0.3 -2.8 L -0.2 -2.2 L -1.2 -1.1 L -6.5 -1.1 L -8.6 -4.6 C -9.1 -5.1, -9.8 -4.9, -9.6 -4.3 L -9.4 -0.6 L -12 0 L -9.4 0.6 C -9.8 4.9, -9.1 5.1, -8.6 4.6 L -6.5 1.1 L -1.2 1.1 L -0.2 2.2 C 0.4 3.3, 0.1 3.8, -0.6 3.8 L -1.4 3.8 L -1.8 9.2 C -1.6 10, -0.6 10.2, 0 9.5 L 5 1.1 C 9 1.1, 12.2 0.5, 13 0 Z"
        className="fill-slate-800 dark:fill-white stroke-slate-900/40 dark:stroke-slate-200/40"
        strokeWidth="0.3"
      />

      {/* 2. Cockpit Window Visor */}
      <path
        d="M 11.2 -0.35 C 11.6 0, 11.6 0, 11.2 0.35 L 9.8 0.45 L 9.8 -0.45 Z"
        className="fill-slate-400 dark:fill-slate-900"
      />

      {/* 3. Wingtip Brand Accents */}
      <circle cx="-1.2" cy="-9.4" r="0.75" fill={accent} />
      <circle cx="-1.2" cy="9.4" r="0.75" fill={accent} />

      {/* 4. Realistic Wing Navigation Lights (Port Red / Starboard Green) */}
      <circle cx="-1.4" cy="-9.6" r="0.4" fill="#ef4444" />
      <circle cx="-1.4" cy="9.6" r="0.4" fill="#22c55e" />

      {/* 5. Passenger Cabin Window Line */}
      <line
        x1="8"
        y1="0"
        x2="-5"
        y2="0"
        className="stroke-slate-500/30 dark:stroke-[#fbbf24]/90"
        strokeWidth="0.5"
        strokeDasharray="0.8 1.1"
      />
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
      .map(([x, y]) => `M${x},${y}m-1.3,0a1.3,1.3 0 1,0 2.6,0a1.3,1.3 0 1,0 -2.6,0`)
      .join('');
  }, []);

  // Curved Flight Paths Radiating Directly from Bangladesh (708, 236)
  const routeMalaysia = 'M 708 236 Q 736 252 756 276';
  const routeUK = 'M 708 236 C 625 155, 535 115, 456 120';
  const routeAustralia = 'M 708 236 C 760 300, 820 345, 864 384';
  const routeNZ = 'M 708 236 C 785 305, 870 365, 925 405';
  const routeCyprus = 'M 708 236 Q 630 195 564 188';
  const routeFinland = 'M 708 236 C 655 145, 605 95, 540 82';

  return (
    <div
      className={`w-full h-full pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full max-h-full object-contain opacity-85 dark:opacity-90 transition-opacity duration-500"
        viewBox="30 25 930 435"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle gradients for flight trails radiating from Bangladesh */}
          <linearGradient id="route-grad-malaysia" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#fbb034" stopOpacity="0.45" />
          </linearGradient>

          <linearGradient id="route-grad-uk" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#fbb034" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
          </linearGradient>

          <linearGradient id="route-grad-australia" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.45" />
          </linearGradient>

          <linearGradient id="route-grad-finland" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.4" />
          </linearGradient>

          <linearGradient id="route-grad-cyprus" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.4" />
          </linearGradient>

          <linearGradient id="route-grad-nz" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.45" />
          </linearGradient>
        </defs>

        {/* 1. Dotted World Map Grid (Single GPU-accelerated path) */}
        <g className="world-map-dots">
          <path
            d={mapDotsPath}
            className="fill-slate-600/18 dark:fill-slate-400/16 transition-colors duration-500"
          />
        </g>

        {/* 2. Radiating Curved Flight Paths from Bangladesh */}
        <g className="flight-routes">
          {/* Bangladesh -> Malaysia */}
          <path
            d={routeMalaysia}
            fill="none"
            stroke="url(#route-grad-malaysia)"
            strokeWidth="1.5"
            strokeDasharray="3 4"
            strokeLinecap="round"
            className="opacity-75 dark:opacity-85"
          />

          {/* Bangladesh -> United Kingdom */}
          <path
            d={routeUK}
            fill="none"
            stroke="url(#route-grad-uk)"
            strokeWidth="1.6"
            strokeDasharray="3 4"
            strokeLinecap="round"
            className="opacity-75 dark:opacity-85"
          />

          {/* Bangladesh -> Australia */}
          <path
            d={routeAustralia}
            fill="none"
            stroke="url(#route-grad-australia)"
            strokeWidth="1.5"
            strokeDasharray="3 4"
            strokeLinecap="round"
            className="opacity-70 dark:opacity-85"
          />

          {/* Bangladesh -> New Zealand */}
          <path
            d={routeNZ}
            fill="none"
            stroke="url(#route-grad-nz)"
            strokeWidth="1.4"
            strokeDasharray="3 4"
            strokeLinecap="round"
            className="opacity-65 dark:opacity-80 hidden sm:inline"
          />

          {/* Bangladesh -> Cyprus */}
          <path
            d={routeCyprus}
            fill="none"
            stroke="url(#route-grad-cyprus)"
            strokeWidth="1.4"
            strokeDasharray="3 4"
            strokeLinecap="round"
            className="opacity-65 dark:opacity-80 hidden md:inline"
          />

          {/* Bangladesh -> Finland */}
          <path
            d={routeFinland}
            fill="none"
            stroke="url(#route-grad-finland)"
            strokeWidth="1.5"
            strokeDasharray="3 4"
            strokeLinecap="round"
            className="opacity-70 dark:opacity-85 hidden sm:inline"
          />
        </g>

        {/* 3. Point-Out Blinking Beacons & Callouts to the 6 Countries + Bangladesh */}
        <g className="map-country-beacons">
          {/* A. ORIGIN: BANGLADESH */}
          <g className="origin-bangladesh">
            {/* Blinking radar pulse */}
            {!reducedMotion && (
              <circle
                cx={ORIGIN.x}
                cy={ORIGIN.y}
                r="3"
                fill="none"
                className="stroke-[#10b981] dark:stroke-[#34d399]"
                strokeWidth="1.4"
              >
                <animate
                  attributeName="r"
                  values="3; 10; 18"
                  dur="1.8s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="1; 0.3; 0"
                  dur="1.8s"
                  repeatCount="indefinite"
                />
              </circle>
            )}

            {/* Glowing core dot */}
            <circle
              cx={ORIGIN.x}
              cy={ORIGIN.y}
              r="3.5"
              className="fill-[#10b981] dark:fill-[#34d399]"
            >
              {!reducedMotion && (
                <animate
                  attributeName="opacity"
                  values="1; 0.4; 1"
                  dur="1.2s"
                  repeatCount="indefinite"
                />
              )}
            </circle>
            <circle cx={ORIGIN.x} cy={ORIGIN.y} r="1.4" fill="#ffffff" />

            {/* Point-Out Callout Pin: Bangladesh */}
            <g className="callout-tag-bd">
              <line
                x1={ORIGIN.x}
                y1={ORIGIN.y}
                x2={ORIGIN.x}
                y2={ORIGIN.y + 11}
                className="stroke-[#10b981] dark:stroke-[#34d399]"
                strokeWidth="0.9"
                strokeDasharray="1.5 1.5"
              />
              {/* Mobile compact badge (sm:hidden) */}
              <g className="sm:hidden">
                <rect
                  x={ORIGIN.x - 12}
                  y={ORIGIN.y + 11}
                  width="24"
                  height="12"
                  rx="3"
                  className="fill-[#064e3b]/90 dark:fill-[#022c22]/95 stroke-[#10b981]"
                  strokeWidth="0.8"
                />
                <text
                  x={ORIGIN.x}
                  y={ORIGIN.y + 19.5}
                  textAnchor="middle"
                  className="text-[6.5px] font-black fill-[#a7f3d0] tracking-wide select-none"
                >
                  BD
                </text>
              </g>
              {/* Tablet & Desktop full pill (hidden sm:inline) */}
              <g className="hidden sm:inline">
                <rect
                  x={ORIGIN.x - 36}
                  y={ORIGIN.y + 11}
                  width="72"
                  height="15"
                  rx="4"
                  className="fill-[#064e3b]/90 dark:fill-[#022c22]/95 stroke-[#10b981]"
                  strokeWidth="0.8"
                />
                <text
                  x={ORIGIN.x}
                  y={ORIGIN.y + 22}
                  textAnchor="middle"
                  className="text-[8px] font-black fill-[#a7f3d0] tracking-wide uppercase select-none"
                >
                  🇧🇩 Bangladesh
                </text>
              </g>
            </g>
          </g>

          {/* B. THE 6 DESTINATION COUNTRIES WE SEND STUDENTS TO */}
          {STUDY_COUNTRIES.map((country) => (
            <g key={country.id} className={`destination-${country.id}`}>
              {/* Radar expanding blink wave */}
              {!reducedMotion && (
                <circle
                  cx={country.x}
                  cy={country.y}
                  r="2.5"
                  fill="none"
                  stroke={country.color}
                  strokeWidth="1.2"
                >
                  <animate
                    attributeName="r"
                    values="2.5; 9; 16"
                    dur="2.2s"
                    begin={`${country.delay}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.95; 0.25; 0"
                    dur="2.2s"
                    begin={`${country.delay}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              )}

              {/* Blinking center LED core */}
              <circle
                cx={country.x}
                cy={country.y}
                r="3"
                fill={country.color}
              >
                {!reducedMotion && (
                  <animate
                    attributeName="opacity"
                    values="1; 0.3; 1"
                    dur="1.4s"
                    begin={`${country.delay}s`}
                    repeatCount="indefinite"
                  />
                )}
              </circle>
              <circle cx={country.x} cy={country.y} r="1.1" fill="#ffffff" />

              {/* Point-Out Callout Indicator to destination */}
              <g className="callout-indicator">
                {/* Pointer Line */}
                <line
                  x1={country.x}
                  y1={country.y}
                  x2={country.labelPos.lx}
                  y2={country.labelPos.ly - 6}
                  stroke={country.color}
                  strokeWidth="0.8"
                  strokeDasharray="1.5 1.5"
                  className="opacity-75"
                />

                {/* Mobile Compact Code Badge (sm:hidden) */}
                <g
                  transform={`translate(${country.labelPos.lx}, ${country.labelPos.ly - 12})`}
                  className="sm:hidden"
                >
                  {(() => {
                    const badgeWidth = 20;
                    const xOffset = country.labelPos.textAnchor === 'end' ? -badgeWidth : 0;
                    return (
                      <>
                        <rect
                          x={xOffset}
                          y={0}
                          width={badgeWidth}
                          height="12"
                          rx="3"
                          className="fill-slate-900/90 dark:fill-slate-950/95 shadow-xs"
                          stroke={country.color}
                          strokeWidth="0.8"
                        />
                        <text
                          x={xOffset + badgeWidth / 2}
                          y={8.5}
                          textAnchor="middle"
                          className="text-[6.5px] font-extrabold fill-white dark:fill-slate-100 tracking-tight select-none"
                        >
                          {country.code}
                        </text>
                      </>
                    );
                  })()}
                </g>

                {/* Tablet & Desktop Full Name Badge (hidden sm:inline) */}
                <g
                  transform={`translate(${country.labelPos.lx}, ${country.labelPos.ly - 13})`}
                  className="hidden sm:inline"
                >
                  {(() => {
                    const badgeWidth = country.id === 'uk' ? 32 : country.id === 'nz' ? 64 : 58;
                    const xOffset = country.labelPos.textAnchor === 'end' ? -badgeWidth : 0;
                    return (
                      <>
                        <rect
                          x={xOffset}
                          y={0}
                          width={badgeWidth}
                          height="14"
                          rx="3.5"
                          className="fill-slate-900/90 dark:fill-slate-950/95 shadow-xs"
                          stroke={country.color}
                          strokeWidth="0.8"
                        />
                        <circle
                          cx={xOffset + 6}
                          cy={7}
                          r="2"
                          fill={country.color}
                        />
                        <text
                          x={xOffset + (badgeWidth + 6) / 2}
                          y={10}
                          textAnchor="middle"
                          className="text-[7.5px] font-bold fill-white dark:fill-slate-100 tracking-tight select-none"
                        >
                          {country.shortName || country.name}
                        </text>
                      </>
                    );
                  })()}
                </g>
              </g>
            </g>
          ))}
        </g>

        {/* 4. Continuously Moving Airplanes along Flight Paths from Bangladesh */}
        {!reducedMotion ? (
          <g className="animated-airplanes">
            {/* Plane 1: Bangladesh -> Malaysia */}
            <g className="plane-bd-malaysia">
              <AirlinerIcon theme="gold" />
              <animateMotion
                path={routeMalaysia}
                dur="14s"
                repeatCount="indefinite"
                rotate="auto"
              />
              <animate
                attributeName="opacity"
                values="0; 1; 1; 1; 0"
                keyTimes="0; 0.1; 0.5; 0.9; 1"
                dur="14s"
                repeatCount="indefinite"
              />
            </g>

            {/* Plane 2: Bangladesh -> United Kingdom */}
            <g className="plane-bd-uk">
              <AirlinerIcon theme="blue" />
              <animateMotion
                path={routeUK}
                dur="20s"
                begin="-7s"
                repeatCount="indefinite"
                rotate="auto"
              />
              <animate
                attributeName="opacity"
                values="0; 1; 1; 1; 0"
                keyTimes="0; 0.1; 0.5; 0.9; 1"
                dur="20s"
                begin="-7s"
                repeatCount="indefinite"
              />
            </g>

            {/* Plane 3: Bangladesh -> Australia */}
            <g className="plane-bd-australia">
              <AirlinerIcon theme="emerald" />
              <animateMotion
                path={routeAustralia}
                dur="18s"
                begin="-12s"
                repeatCount="indefinite"
                rotate="auto"
              />
              <animate
                attributeName="opacity"
                values="0; 1; 1; 1; 0"
                keyTimes="0; 0.1; 0.5; 0.9; 1"
                dur="18s"
                begin="-12s"
                repeatCount="indefinite"
              />
            </g>

            {/* Plane 4: Bangladesh -> Finland (Desktop / Tablet) */}
            <g className="plane-bd-finland hidden sm:inline">
              <AirlinerIcon theme="indigo" />
              <animateMotion
                path={routeFinland}
                dur="19s"
                begin="-4s"
                repeatCount="indefinite"
                rotate="auto"
              />
              <animate
                attributeName="opacity"
                values="0; 1; 1; 1; 0"
                keyTimes="0; 0.1; 0.5; 0.9; 1"
                dur="19s"
                begin="-4s"
                repeatCount="indefinite"
              />
            </g>
          </g>
        ) : (
          /* Static Placement for Accessibility */
          <g className="static-airplanes opacity-85">
            <g transform="translate(732, 254) rotate(42)">
              <AirlinerIcon theme="gold" />
            </g>
            <g transform="translate(580, 140) rotate(-145)">
              <AirlinerIcon theme="blue" />
            </g>
            <g transform="translate(800, 330) rotate(50)">
              <AirlinerIcon theme="emerald" />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
