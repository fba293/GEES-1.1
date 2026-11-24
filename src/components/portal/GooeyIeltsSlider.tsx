import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Liquid } from 'liquid-gooey';

interface GooeyIeltsSliderProps {
  min: number;
  max: number;
  step?: number;
  valueMin: number;
  valueMax: number;
  onChange: (nextMin: number, nextMax: number) => void;
  trackId?: string;
  minInputId?: string;
  maxInputId?: string;
  minAriaLabel?: string;
  maxAriaLabel?: string;
  formatBadge?: (val: number) => string;
  badgeWidth?: number;
}

const THUMB_SIZE = 20;

export const GooeyIeltsSlider: React.FC<GooeyIeltsSliderProps> = ({
  min,
  max,
  step = 0.5,
  valueMin,
  valueMax,
  onChange,
  trackId = 'ielts-slider-track-highlight',
  minInputId = 'ielts-min-range-slider',
  maxInputId = 'ielts-max-range-slider',
  minAriaLabel = 'Minimum IELTS score',
  maxAriaLabel = 'Maximum IELTS score',
  formatBadge = (val) => val.toFixed(1),
  badgeWidth = 34,
}) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeThumb, setActiveThumb] = useState<'min' | 'max' | null>(null);

  useEffect(() => {
    if (!activeThumb) return;
    const handleRelease = () => setActiveThumb(null);
    window.addEventListener('pointerup', handleRelease);
    window.addEventListener('pointercancel', handleRelease);
    return () => {
      window.removeEventListener('pointerup', handleRelease);
      window.removeEventListener('pointercancel', handleRelease);
    };
  }, [activeThumb]);

  const span = Math.max(0.0001, max - min);
  const minPct = Math.min(100, Math.max(0, ((valueMin - min) / span) * 100));
  const maxPct = Math.min(100, Math.max(0, ((valueMax - min) / span) * 100));

  const snapValue = useCallback(
    (raw: number) => {
      const clamped = Math.min(max, Math.max(min, raw));
      const snapped = Math.round((clamped - min) / step) * step + min;
      return Math.min(max, Math.max(min, Number(snapped.toFixed(2))));
    },
    [min, max, step]
  );

  // Clicking directly on the track jumps the nearest thumb so the liquid-rubber
  // trail glides smoothly across the rail.
  const handleTrackPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0) return;

      const usableWidth = Math.max(1, rect.width - THUMB_SIZE);
      const ratio = Math.min(
        1,
        Math.max(0, (e.clientX - rect.left - THUMB_SIZE / 2) / usableWidth)
      );
      const targetVal = snapValue(min + ratio * span);

      const distMin = Math.abs(targetVal - valueMin);
      const distMax = Math.abs(targetVal - valueMax);

      if (distMin < distMax || (distMin === distMax && targetVal < valueMin)) {
        const nextMin = Math.min(targetVal, valueMax);
        setActiveThumb('min');
        onChange(nextMin, valueMax);
      } else {
        const nextMax = Math.max(targetVal, valueMin);
        setActiveThumb('max');
        onChange(valueMin, nextMax);
      }
    },
    [min, span, snapValue, valueMin, valueMax, onChange]
  );

  // Align visual thumb center exactly with the native range input thumb travel
  // (native thumbs move from 0 to containerWidth - THUMB_SIZE).
  const minLeftStyle = `calc(${minPct}% - ${(minPct / 100) * THUMB_SIZE}px)`;
  const maxLeftStyle = `calc(${maxPct}% - ${(maxPct / 100) * THUMB_SIZE}px)`;
  const badgeOffset = (badgeWidth - THUMB_SIZE) / 2;

  // Active liquid rail stretches between the centers of the two thumbs.
  const railLeftStyle = `calc(${minPct}% + ${THUMB_SIZE / 2 - (minPct / 100) * THUMB_SIZE}px)`;
  const railRightStyle = `calc(${100 - maxPct}% + ${THUMB_SIZE / 2 - ((100 - maxPct) / 100) * THUMB_SIZE}px)`;

  const minOnTop = activeThumb === 'min' || valueMin >= max - step;

  return (
    <div
      ref={trackRef}
      onPointerDown={handleTrackPointerDown}
      onPointerUp={() => setActiveThumb(null)}
      onPointerCancel={() => setActiveThumb(null)}
      className="relative w-full h-8 flex items-center select-none cursor-pointer my-1"
    >
      {/* Inactive base rail matching GEES slate theme */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[2px] top-1/2 -translate-y-1/2 h-[6px] rounded-full bg-slate-200"
      />

      {/* Gooey liquid layer: active amber rail + both moving thumbs + popping score droplets */}
      <Liquid
        blur={4}
        contrast={20}
        fill="#f59e0b"
        filterPadding={36}
        shadow="0 2px 7px rgba(245, 158, 11, 0.34), inset 0 1px 0 rgba(255, 255, 255, 0.35)"
        className="pointer-events-none relative w-full h-8"
      >
        {/* Active range liquid bar that seamlessly merges into both thumbs */}
        <Liquid.Item observe radius={999}>
          <div
            id={trackId}
            className="absolute top-1/2 -translate-y-1/2 h-[8px] rounded-full transition-[left,right] duration-150 ease-out"
            style={{
              left: railLeftStyle,
              right: railRightStyle,
              minWidth: '8px',
            }}
          />
        </Liquid.Item>

        {/* Popping gooey value droplet for Min thumb */}
        <Liquid.Item observe radius={999}>
          <div
            aria-hidden="true"
            className="absolute top-1/2 flex items-center justify-center h-[22px] rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            style={{
              width: `${badgeWidth}px`,
              left: `calc(${minPct}% - ${(minPct / 100) * THUMB_SIZE}px - ${badgeOffset}px)`,
              transform:
                activeThumb === 'min'
                  ? 'translateY(calc(-50% - 25px)) scale(1)'
                  : 'translateY(-50%) scale(0.38)',
            }}
          >
            <span
              className={`text-[10px] font-extrabold text-white tracking-tight leading-none whitespace-nowrap transition-opacity duration-150 ${
                activeThumb === 'min' ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {formatBadge(valueMin)}
            </span>
          </div>
        </Liquid.Item>

        {/* Popping gooey value droplet for Max thumb */}
        <Liquid.Item observe radius={999}>
          <div
            aria-hidden="true"
            className="absolute top-1/2 flex items-center justify-center h-[22px] rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            style={{
              width: `${badgeWidth}px`,
              left: `calc(${maxPct}% - ${(maxPct / 100) * THUMB_SIZE}px - ${badgeOffset}px)`,
              transform:
                activeThumb === 'max'
                  ? 'translateY(calc(-50% - 25px)) scale(1)'
                  : 'translateY(-50%) scale(0.38)',
            }}
          >
            <span
              className={`text-[10px] font-extrabold text-white tracking-tight leading-none whitespace-nowrap transition-opacity duration-150 ${
                activeThumb === 'max' ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {formatBadge(valueMax)}
            </span>
          </div>
        </Liquid.Item>

        {/* Min Thumb with liquid-rubber trailing droplet */}
        <Liquid.Item
          effect="move"
          radius={999}
          move={{
            springiness: 0.62,
            wobble: 0.6,
            stretch: 0.48,
            trail: 0.65,
          }}
        >
          <div
            aria-hidden="true"
            className="absolute top-1/2 flex items-center justify-center rounded-full transition-[left,transform] duration-100 ease-out"
            style={{
              left: minLeftStyle,
              width: `${THUMB_SIZE}px`,
              height: `${THUMB_SIZE}px`,
              transform: `translateY(-50%) scale(${activeThumb === 'min' ? 1.14 : 1})`,
            }}
          >
            <span
              className={`block rounded-full bg-white shadow-2xs transition-transform duration-150 ${
                activeThumb === 'min' ? 'w-[10px] h-[10px] scale-95' : 'w-[10px] h-[10px]'
              }`}
            />
          </div>
        </Liquid.Item>

        {/* Max Thumb with liquid-rubber trailing droplet */}
        <Liquid.Item
          effect="move"
          radius={999}
          move={{
            springiness: 0.62,
            wobble: 0.6,
            stretch: 0.48,
            trail: 0.65,
          }}
        >
          <div
            aria-hidden="true"
            className="absolute top-1/2 flex items-center justify-center rounded-full transition-[left,transform] duration-100 ease-out"
            style={{
              left: maxLeftStyle,
              width: `${THUMB_SIZE}px`,
              height: `${THUMB_SIZE}px`,
              transform: `translateY(-50%) scale(${activeThumb === 'max' ? 1.14 : 1})`,
            }}
          >
            <span
              className={`block rounded-full bg-white shadow-2xs transition-transform duration-150 ${
                activeThumb === 'max' ? 'w-[10px] h-[10px] scale-95' : 'w-[10px] h-[10px]'
              }`}
            />
          </div>
        </Liquid.Item>
      </Liquid>

      {/* Native accessible range inputs riding transparently above the liquid visual */}
      <input
        aria-label={minAriaLabel}
        className="range-input-gooey"
        id={minInputId}
        max={max}
        min={min}
        step={step}
        type="range"
        value={valueMin}
        style={{ zIndex: minOnTop ? 30 : 20 }}
        onPointerDown={() => setActiveThumb('min')}
        onPointerUp={() => setActiveThumb(null)}
        onFocus={() => setActiveThumb('min')}
        onBlur={() => setActiveThumb((curr) => (curr === 'min' ? null : curr))}
        onChange={(e) => {
          const nextMin = parseFloat(e.target.value);
          onChange(nextMin, Math.max(nextMin, valueMax));
        }}
      />
      <input
        aria-label={maxAriaLabel}
        className="range-input-gooey"
        id={maxInputId}
        max={max}
        min={min}
        step={step}
        type="range"
        value={valueMax}
        style={{ zIndex: minOnTop ? 20 : 30 }}
        onPointerDown={() => setActiveThumb('max')}
        onPointerUp={() => setActiveThumb(null)}
        onFocus={() => setActiveThumb('max')}
        onBlur={() => setActiveThumb((curr) => (curr === 'max' ? null : curr))}
        onChange={(e) => {
          const nextMax = parseFloat(e.target.value);
          onChange(Math.min(valueMin, nextMax), nextMax);
        }}
      />
    </div>
  );
};
