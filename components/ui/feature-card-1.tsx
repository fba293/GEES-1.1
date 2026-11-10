// components/ui/feature-card-1.tsx

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

// Define the props for the component
export interface AnimatedFeatureCardProps extends Omit<HTMLMotionProps<"div">, 'title'> {
  /** The numerical index to display, e.g., "001" */
  index: string;
  /** The tag or category label */
  tag: string;
  /** The main title or description */
  title: React.ReactNode;
  /** The URL for the central image */
  imageSrc: string;
  /** The color variant which determines the gradient and tag color */
  color: "orange" | "purple" | "blue";
  /** Optional active/selected state */
  isActive?: boolean;
}

// Define HSL color values for each variant to work with shadcn's theming
const colorVariants = {
  orange: {
    '--feature-color': 'hsl(35, 91%, 55%)',
    '--feature-color-light': 'hsl(41, 100%, 85%)',
    '--feature-color-dark': 'hsl(35, 95%, 96%)',
    '--feature-color-badge-dark': 'hsl(35, 90%, 15%)',
  },
  purple: {
    '--feature-color': 'hsl(262, 85%, 60%)',
    '--feature-color-light': 'hsl(261, 100%, 87%)',
    '--feature-color-dark': 'hsl(264, 100%, 97%)',
    '--feature-color-badge-dark': 'hsl(262, 80%, 16%)',
  },
  blue: {
    '--feature-color': 'hsl(211, 100%, 60%)',
    '--feature-color-light': 'hsl(210, 100%, 83%)',
    '--feature-color-dark': 'hsl(216, 100%, 97%)',
    '--feature-color-badge-dark': 'hsl(211, 80%, 16%)',
  },
};

const AnimatedFeatureCard = React.forwardRef<
  HTMLDivElement,
  AnimatedFeatureCardProps
>(({ className, index, tag, title, imageSrc, color, isActive, ...props }, ref) => {
  const cardStyle = colorVariants[color] as React.CSSProperties;

  return (
    <motion.div
      ref={ref}
      style={cardStyle}
      className={cn(
        "relative flex h-[360px] sm:h-[380px] w-full flex-col justify-end overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c1322] p-5 sm:p-6 shadow-sm transition-shadow",
        isActive && "ring-2 ring-[#fbb034] shadow-lg",
        className
      )}
      whileHover="hover"
      initial="initial"
      variants={{
        initial: { y: 0 },
        hover: { y: -8, transition: { type: "spring", stiffness: 220, damping: 16 } },
      }}
      {...props}
    >
      {/* Background Radial Gradient */}
      <div
        className="absolute inset-0 z-0 opacity-50 dark:opacity-25 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 30%, var(--feature-color-light) 0%, transparent 70%)`
        }}
      />
      
      {/* Index Number */}
      <div className="absolute top-5 left-5 font-mono text-base sm:text-lg font-bold text-slate-400 dark:text-slate-500 z-10 select-none">
        {index}
      </div>

      {/* Main Central Floating Image */}
      <motion.div 
        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none pb-16"
        variants={{
          initial: { scale: 1, y: 0 },
          hover: { scale: 1.22, y: -16 },
        }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <img
          src={imageSrc}
          alt={tag}
          className="w-32 h-32 sm:w-40 sm:h-40 object-contain drop-shadow-xl"
          loading="lazy"
        />
      </motion.div>
      
      {/* Content Box */}
      <div className="relative z-20 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/85 p-3.5 sm:p-4 backdrop-blur-md shadow-xs">
        <span
          className="mb-1.5 sm:mb-2 inline-block rounded-full px-2.5 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-bold tracking-wide uppercase"
          style={{ 
            backgroundColor: 'var(--feature-color-dark)', 
            color: 'var(--feature-color)' 
          }}
        >
          {tag}
        </span>
        <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
          {title}
        </div>
      </div>
    </motion.div>
  );
});

AnimatedFeatureCard.displayName = "AnimatedFeatureCard";

export { AnimatedFeatureCard };
export default AnimatedFeatureCard;
