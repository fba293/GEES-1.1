import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils.ts";

export interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  mobileText?: string;
}

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = "Button", mobileText, children, className, ...props }, ref) => {
  const label = text || (typeof children === "string" ? children : "Button");

  return (
    <button
      ref={ref}
      className={cn(
        "group relative w-32 cursor-pointer overflow-hidden rounded-full border border-[#e5e5ea] dark:border-slate-800 bg-white dark:bg-slate-800 p-2 text-center font-semibold text-[#1d1d1f] dark:text-white transition-all select-none active:scale-[0.97]",
        className,
      )}
      {...props}
    >
      <span className="inline-block translate-x-1 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0 whitespace-nowrap">
        {mobileText ? (
          <>
            <span className="sm:hidden">{mobileText}</span>
            <span className="hidden sm:inline">{label}</span>
          </>
        ) : (
          label
        )}
      </span>
      <div className="absolute top-0 inset-x-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-1.5 text-slate-950 dark:text-slate-950 font-bold opacity-0 transition-all duration-300 group-hover:-translate-x-0.5 group-hover:opacity-100 whitespace-nowrap pointer-events-none">
        <span>
          {mobileText ? (
            <>
              <span className="sm:hidden">{mobileText}</span>
              <span className="hidden sm:inline">{label}</span>
            </>
          ) : (
            label
          )}
        </span>
        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
      </div>
      <div className="absolute left-[20%] top-[40%] h-2 w-2 scale-[1] rounded-lg bg-[#fbb034] transition-all duration-300 ease-out group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8] group-hover:rounded-none group-hover:bg-[#fbb034] pointer-events-none" />
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };
