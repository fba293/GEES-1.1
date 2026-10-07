import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export interface AnimatedTextCycleProps {
  words?: string[];
  texts?: string[];
  interval?: number;
  className?: string;
  textClassName?: string;
  prefix?: string;
  suffix?: string;
}

export const AnimatedTextCycle: React.FC<AnimatedTextCycleProps> = ({
  words = [
    "Health Insurance",
    "Student Accommodation",
    "Visa Consultation",
    "University Admission",
    "Scholarship Guidance",
    "IELTS Preparation",
  ],
  texts,
  interval = 2200,
  className = "",
  textClassName = "",
  prefix = "",
  suffix = "",
}) => {
  const items = texts || words;
  const [titleNumber, setTitleNumber] = useState(0);

  useEffect(() => {
    if (!items || items.length <= 1) return;
    const timeoutId = setTimeout(() => {
      if (titleNumber === items.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, interval);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, items, interval]);

  return (
    <span
      className={`relative inline-flex items-center align-middle select-none ${className}`}
      data-purpose="animated-text-cycle"
    >
      {prefix && <span className="mr-1 shrink-0">{prefix}</span>}
      <span className="relative inline-flex items-center h-[1.35em] overflow-hidden pr-1.5">
        {/* Invisible spacer so the container has exact matching width & height */}
        <span className={`invisible opacity-0 select-none pointer-events-none whitespace-nowrap ${textClassName}`}>
          {items[titleNumber] || "\u00A0"}
        </span>
        {items.map((title, index) => (
          <motion.span
            key={index}
            className={`absolute left-0 whitespace-nowrap ${textClassName}`}
            initial={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 50, damping: 15 }}
            animate={
              titleNumber === index
                ? {
                    y: 0,
                    opacity: 1,
                  }
                : {
                    y: titleNumber > index ? -25 : 25,
                    opacity: 0,
                  }
            }
          >
            {title}
          </motion.span>
        ))}
      </span>
      {suffix && <span className="ml-1 shrink-0">{suffix}</span>}
    </span>
  );
};

export default AnimatedTextCycle;
