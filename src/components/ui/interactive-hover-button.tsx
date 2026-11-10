import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils.ts";
import { triggerHaptic } from "../../lib/haptics.ts";

export interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  mobileText?: string;
  icon?: React.ReactNode;
}

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ 
  text, 
  mobileText, 
  children, 
  icon = <ArrowRight className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" />,
  className, 
  onClick,
  ...props 
}, ref) => {
  const label = children ?? text ?? "Button";

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    triggerHaptic(12);
    if (onClick) onClick(e);
  };

  const hasBg = className?.includes("bg-");
  const hasText = className?.includes("text-");
  const hasBorder = className?.includes("border-");

  return (
    <button
      ref={ref}
      onClick={handleClick}
      className={cn(
        "group relative w-auto min-w-fit cursor-pointer overflow-hidden rounded-full border px-6 py-2.5 text-center font-bold shadow-xs transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none active:scale-[0.97] inline-flex items-center justify-center whitespace-nowrap",
        !hasBorder && "border-slate-300 dark:border-slate-700",
        !hasBg && "bg-white dark:bg-slate-900",
        !hasText && "text-slate-900 dark:text-white",
        className,
      )}
      {...props}
    >
      {/* 1. Base Layer (Resting state: 100% visible, centered, above background) */}
      <span className={cn(
        "relative z-10 inline-flex items-center justify-center gap-2 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-12 group-hover:opacity-0 font-bold whitespace-nowrap",
        !hasText && "text-slate-900 dark:text-white",
        className?.includes("text-") && "text-current"
      )}>
        <span className="h-2 w-2 rounded-full bg-[#fbb034] shrink-0 transition-transform duration-300 group-hover:scale-0" />
        <span className="whitespace-nowrap">
          {mobileText ? (
            <>
              <span className="sm:hidden">{mobileText}</span>
              <span className="hidden sm:inline">{label}</span>
            </>
          ) : (
            label
          )}
        </span>
      </span>

      {/* 2. Hover Content Layer (Slides in smoothly with text + arrow icon) */}
      <div 
        className="absolute inset-0 z-20 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-slate-950 font-black opacity-0 pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 group-hover:opacity-100 whitespace-nowrap px-4"
      >
        <span className="whitespace-nowrap">
          {mobileText ? (
            <>
              <span className="sm:hidden">{mobileText}</span>
              <span className="hidden sm:inline">{label}</span>
            </>
          ) : (
            label
          )}
        </span>
        {icon}
      </div>

      {/* 3. Smooth Expanding Amber Background Fill on Hover */}
      <div 
        className="absolute inset-0 z-0 bg-[#fbb034] pointer-events-none transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] -translate-x-full group-hover:translate-x-0"
      />
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };
