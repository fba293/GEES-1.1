"use client";

import React, { useRef, useState } from "react";
import { Slider } from "./slider-06-utils/slider";
import NumberFlow from "@number-flow/react";
import { X } from "lucide-react";
import { Button } from "./slider-06-utils/button";
import { useCurrency } from "../../context/CurrencyContext";

export default function Slider06({ 
  onRangeChange, 
  min = 0, 
  max = 214000, 
  step = 10,
  initialRange = [0, 214000]
}: { 
  onRangeChange?: (range: number[]) => void,
  min?: number,
  max?: number,
  step?: number,
  initialRange?: number[]
}) {
  const { getCurrencySymbol } = useCurrency();
  const [range, setRange] = useState<number[]>(initialRange);
  const [preview, setPreview] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const [low, high] = range;
  const isDefault = low === min && high === max;

  const toPct = (v: number) => ((v - min) / (max - min)) * 100;

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    const raw = ((e.clientX - rect.left) / rect.width) * (max - min) + min;
    setPreview(
      Math.max(min, Math.min(max, Math.round((raw - min) / step) * step + min)),
    );
  };

  const lowPct = toPct(low);
  const highPct = toPct(high);
  const previewPct = preview !== null ? toPct(preview) : null;

  let ghostLeft = 0;
  let ghostWidth = 0;
  if (previewPct !== null) {
    if (previewPct < lowPct) {
      ghostLeft = previewPct;
      ghostWidth = lowPct - previewPct;
    } else if (previewPct > highPct) {
      ghostLeft = highPct;
      ghostWidth = previewPct - highPct;
    }
  }

  const handleRangeChange = (val: number[]) => {
      setRange(val);
      if (onRangeChange) {
          onRangeChange(val);
      }
  }
  
  const currencySymbol = getCurrencySymbol();

  return (
    <div className="w-full space-y-4">
      {/* Header — label + price + clear all in one row */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Price Range
          </p>
          <div className="flex items-baseline gap-1 flex-wrap text-slate-900 dark:text-white font-extrabold">
            <span className="text-base xs:text-lg sm:text-xl font-extrabold tabular-nums tracking-tight">
              {currencySymbol}<NumberFlow value={low} />
            </span>
            <span className="text-slate-400 font-bold px-0.5">–</span>
            <span className="text-base xs:text-lg sm:text-xl font-extrabold tabular-nums tracking-tight">
              {currencySymbol}<NumberFlow value={high} />
            </span>
          </div>
        </div>

        {/* Clear Button */}
        <Button
          variant="outline"
          size="xs"
          onClick={() => handleRangeChange([min, max])}
          disabled={isDefault}
          className="cursor-pointer shrink-0 font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg px-2.5 py-1 text-xs transition-colors flex items-center gap-1 min-h-[32px] disabled:opacity-40"
        >
          <X className="w-3.5 h-3.5" />
          <span>Clear</span>
        </Button>
      </div>

      <div className="space-y-2 pt-1">
        <div
          ref={rootRef}
          className="relative w-full py-1"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setPreview(null)}
        >
          <Slider
            value={range}
            onValueChange={handleRangeChange}
            min={min}
            max={max}
            step={step}
            className="w-full cursor-pointer **:[[role=slider]]:transition-transform **:[[role=slider]]:hover:scale-125 **:data-[slot='slider-track']:h-2.5! **:data-[slot='slider-thumb']:size-5! **:data-[slot='slider-thumb']:border-2! **:data-[slot='slider-thumb']:border-[#fbb034]! **:data-[slot='slider-thumb']:bg-white! dark:**:data-[slot='slider-thumb']:bg-slate-900! **:data-[slot='slider-thumb']:shadow-md **:data-[slot='slider-thumb']:z-10"
          />

          {previewPct !== null && ghostWidth > 0 && (
            <div
              className="pointer-events-none absolute top-1/2 h-2.5 -translate-y-1/2 rounded-full bg-[#fbb034]/30 transition-[left,width] duration-75 z-1"
              style={{ left: `${ghostLeft}%`, width: `${ghostWidth}%` }}
            />
          )}
        </div>

        {/* Labels - 5 ticks cleanly formatted */}
        <div className="flex justify-between items-center text-[10px] xs:text-[11px] font-bold text-slate-700 dark:text-slate-200 select-none pt-1">
          {(() => {
            const labels = [];
            for (let i = 0; i < 5; i++) {
              const val = Math.round((min + (i * (max - min)) / 4) / step) * step;
              labels.push(val);
            }
            return labels.map((val, idx) => (
              <span 
                key={val} 
                className={`tabular-nums ${idx === 0 ? 'text-left' : idx === 4 ? 'text-right' : 'text-center'}`}
              >
                {currencySymbol}{val >= 1000 ? `${Math.round(val / 1000)}k` : val}
              </span>
            ));
          })()}
        </div>
      </div>
    </div>
  );
}
