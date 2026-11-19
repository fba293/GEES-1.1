import React from 'react';

interface MorphingHamburgerIconProps {
  isOpen: boolean;
  className?: string;
}

/**
 * Centralized Motion Configuration
 * Snappy, fluid responsive transition coordinated between Hamburger and Drawer
 */
export const HAMBURGER_ANIMATION_CONFIG = {
  durationOpenMs: 280,
  durationCloseMs: 240,
  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
};

export const MorphingHamburgerIcon: React.FC<MorphingHamburgerIconProps> = ({
  isOpen,
  className = 'w-5.5 h-5.5 text-current',
}) => {
  const duration = isOpen
    ? HAMBURGER_ANIMATION_CONFIG.durationOpenMs
    : HAMBURGER_ANIMATION_CONFIG.durationCloseMs;
  const easing = HAMBURGER_ANIMATION_CONFIG.easing;

  return (
    <svg
      className={`overflow-visible pointer-events-none select-none ${className}`}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.6"
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{ overflow: 'visible' }}
    >
      {/* Top Stroke: CSB-style staggered offset when closed, centered 45deg arm when open */}
      <g
        style={{
          transformOrigin: '12px 12px',
          transformBox: 'view-box',
          WebkitTransformOrigin: '12px 12px',
          transform: isOpen
            ? 'rotate(45deg) translateY(5px)'
            : 'rotate(0deg) translateY(0px)',
          transition: `transform ${duration}ms ${easing}`,
          willChange: 'transform',
        }}
      >
        <line
          x1={isOpen ? '4.5' : '8'}
          y1="7"
          x2="19.5"
          y2="7"
          style={{ transition: `x1 ${duration}ms ${easing}` }}
        />
      </g>

      {/* Middle Stroke: Contracts horizontally to center (12, 12) and fades out smoothly */}
      <g
        style={{
          transformOrigin: '12px 12px',
          transformBox: 'view-box',
          WebkitTransformOrigin: '12px 12px',
          opacity: isOpen ? 0 : 1,
          transform: isOpen ? 'scaleX(0)' : 'scaleX(1)',
          transition: `opacity ${isOpen ? Math.round(duration * 0.55) : duration}ms ${easing}, transform ${duration}ms ${easing}`,
          willChange: 'opacity, transform',
        }}
      >
        <line x1="4.5" y1="12" x2="19.5" y2="12" />
      </g>

      {/* Bottom Stroke: CSB-style compact offset when closed, centered -45deg arm when open */}
      <g
        style={{
          transformOrigin: '12px 12px',
          transformBox: 'view-box',
          WebkitTransformOrigin: '12px 12px',
          transform: isOpen
            ? 'rotate(-45deg) translateY(-5px)'
            : 'rotate(0deg) translateY(0px)',
          transition: `transform ${duration}ms ${easing}`,
          willChange: 'transform',
        }}
      >
        <line
          x1={isOpen ? '4.5' : '12.5'}
          y1="17"
          x2="19.5"
          y2="17"
          style={{ transition: `x1 ${duration}ms ${easing}` }}
        />
      </g>
    </svg>
  );
};

export default MorphingHamburgerIcon;

