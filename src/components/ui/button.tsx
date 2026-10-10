/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES Standardized Reusable Button Component
 * Features:
 * - Brand Amber (#fbb034), Brand Blue, Secondary Pill, Outline, and Dark variants
 * - Tactile Apple/GEES active click animation (active:scale-95)
 * - Minimum touch target compliant (44px on standard sizes)
 * - Icon and loading state support
 */

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils.ts";
import { triggerHaptic } from "../../lib/haptics.ts";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer active:scale-95 touch-manipulation",
  {
    variants: {
      variant: {
        // GEES Signature Primary (Amber / Gold)
        primary:
          "bg-[#fbb034] hover:bg-[#f59e0b] active:bg-[#d97706] text-slate-950 font-black shadow-xs ring-1 ring-amber-400/40 hover:brightness-105",
        default:
          "bg-[#fbb034] hover:bg-[#f59e0b] active:bg-[#d97706] text-slate-950 font-black shadow-xs ring-1 ring-amber-400/40 hover:brightness-105",

        // GEES Brand Blue
        blue:
          "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold shadow-md shadow-blue-600/25",

        // Emerald / Success
        emerald:
          "bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/25",

        // Secondary Soft Neutral Pill
        secondary:
          "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold border border-slate-200/80 dark:border-slate-700/80",

        // Outline Ghost Pill
        outline:
          "border border-slate-300 dark:border-slate-700 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-900 dark:text-white font-bold",

        // Ghost Hover
        ghost:
          "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white font-semibold",

        // Ink Dark
        dark:
          "bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 font-bold shadow-xs",

        // Destructive / Danger
        destructive:
          "bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold shadow-xs",

        link:
          "text-blue-600 dark:text-blue-400 underline-offset-4 hover:underline p-0 h-auto font-semibold active:scale-100",
      },
      size: {
        default: "min-h-[44px] h-10 px-5 py-2 text-xs sm:text-sm",
        md: "min-h-[44px] h-10 px-5 py-2 text-xs sm:text-sm",
        sm: "min-h-[36px] h-8 px-3.5 py-1 text-xs",
        lg: "min-h-[48px] h-12 px-7 py-3 text-sm sm:text-base",
        icon: "min-h-[44px] min-w-[44px] h-10 w-10 sm:h-11 sm:w-11 p-0 rounded-full",
        "icon-sm": "min-h-[36px] min-w-[36px] h-8.5 w-8.5 sm:h-9 sm:w-9 p-0 rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
  haptic?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      icon,
      iconPosition = "right",
      loading = false,
      haptic = true,
      onClick,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (haptic) triggerHaptic(10);
      if (onClick) onClick(e);
    };

    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          onClick={handleClick}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        onClick={handleClick}
        {...props}
      >
        {loading && (
          <span className="w-3.5 h-3.5 mr-2 rounded-full border-2 border-current border-t-transparent animate-spin shrink-0" />
        )}
        {!loading && icon && iconPosition === "left" && (
          <span className="mr-1.5 shrink-0 inline-flex items-center">{icon}</span>
        )}
        <span>{children}</span>
        {!loading && icon && iconPosition === "right" && (
          <span className="ml-1.5 shrink-0 inline-flex items-center transition-transform group-hover:translate-x-0.5">
            {icon}
          </span>
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;
