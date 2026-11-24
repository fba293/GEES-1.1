/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * GEES "Your Journey to Studying Abroad" - Interactive Student Journey Timeline Section
 * Synchronized airplane marker using getTotalLength() and getPointAtLength() for smooth continuous movement along SVG path.
 * Features a clean white plane silhouette matching reference specifications and high-contrast milestone node numbers.
 */

import React, { useState, useRef, useLayoutEffect, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { InteractiveHoverButton } from '../ui/interactive-hover-button.tsx';
import { GEESAircraft } from '../common/GEESAircraft.tsx';

interface StepsRoadmapSectionProps {
  onOpenBooking: () => void;
}

interface CurveConfig {
  viewBox: string;
  aspectClass: string;
  d: string;
  x0: number;
  y0: number;
  cx: number;
  cy: number;
  x2: number;
  y2: number;
  nodeRadius: number;
  hitRadius: number;
  nodeFontSize: number;
  planeWidth: number;
  planeHeight: number;
  planeOffsetY: number;
}

const MOBILE_CURVE: CurveConfig = {
  viewBox: '0 0 420 120',
  aspectClass: 'aspect-[420/120]',
  d: 'M 34 84 Q 210 26 386 84',
  x0: 34,
  y0: 84,
  cx: 210,
  cy: 26,
  x2: 386,
  y2: 84,
  nodeRadius: 14.5,
  hitRadius: 24,
  nodeFontSize: 12.5,
  planeWidth: 56,
  planeHeight: 28,
  planeOffsetY: 26,
};

const DESKTOP_CURVE: CurveConfig = {
  viewBox: '0 0 1000 185',
  aspectClass: 'aspect-[1000/185]',
  d: 'M 65 120 Q 500 38 935 120',
  x0: 65,
  y0: 120,
  cx: 500,
  cy: 38,
  x2: 935,
  y2: 120,
  nodeRadius: 20,
  hitRadius: 32,
  nodeFontSize: 14,
  planeWidth: 84,
  planeHeight: 42,
  planeOffsetY: 37,
};

/**
 * Quadratic Bezier fallback helper for initial render or SSR
 */
function getBezierPointAndAngle(t: number, curve: CurveConfig) {
  const clampedT = Math.max(0, Math.min(1, t));
  const oneMinusT = 1 - clampedT;

  const x =
    oneMinusT * oneMinusT * curve.x0 +
    2 * oneMinusT * clampedT * curve.cx +
    clampedT * clampedT * curve.x2;
  const y =
    oneMinusT * oneMinusT * curve.y0 +
    2 * oneMinusT * clampedT * curve.cy +
    clampedT * clampedT * curve.y2;

  const dx = 2 * oneMinusT * (curve.cx - curve.x0) + 2 * clampedT * (curve.x2 - curve.cx);
  const dy = 2 * oneMinusT * (curve.cy - curve.y0) + 2 * clampedT * (curve.y2 - curve.cy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  return { x, y, angle };
}

function easeInOutCubic(x: number): number {
  const t = Math.max(0, Math.min(1, x));
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

const STAGE_HOLD_MS = 2800;
const LEG_FLIGHT_MS = 900;
const RETURN_FLIGHT_MS = 1600;

interface StepItem {
  stepIndex: number;
  num: string;
  shortLabel: string;
  title: string;
  illustrationSrc: string;
  paragraphs: string[];
  docs: string[];
  advisorDelivers: string[];
}

const STEPS_DATA: StepItem[] = [
  {
    stepIndex: 1,
    num: '01',
    shortLabel: 'Call',
    title: "Not sure where to start? Let's talk!",
    illustrationSrc: '/assets/aistudio/Contact--Streamline-Djakarta_7c07e804.png',
    paragraphs: [
      'Tell us your grades, budget and preferred country.',
      'Our counsellors will help you find the right study options and guide you through the next steps.',
    ],
    docs: [
      'Academic marksheets & transcripts',
      'English proficiency test scores (or test targets)',
      'Budget & preferred intake term',
    ],
    advisorDelivers: [
      'Study options tailored to your grades and budget',
      'Clear country and university recommendations',
      'Step-by-step guidance on what to do next',
    ],
  },
  {
    stepIndex: 2,
    num: '02',
    shortLabel: 'Choose',
    title: 'Pick your country and course!',
    illustrationSrc: '/src/assets/images/step_02_choose_1795037700628.jpg',
    paragraphs: [
      'Tell us where you want to study and what you want to learn.',
      "We'll help you find universities that match your grades, budget and study goals.",
    ],
    docs: [
      'Preferred study destination(s)',
      'Course or subject interests',
      'Tuition budget & academic records',
    ],
    advisorDelivers: [
      'Curated shortlist of matching universities',
      'Course & tuition fee comparison',
      'Entry requirement & intake planning',
    ],
  },
  {
    stepIndex: 3,
    num: '03',
    shortLabel: 'Prepare',
    title: "Let's get your documents ready!",
    illustrationSrc: '/src/assets/images/step_03_prepare_1795037701592.jpg',
    paragraphs: [
      'Bring your academic certificates and required documents to our office. Our team will help you check and prepare everything for your university application.',
    ],
    docs: [
      'Academic certificates & transcripts',
      'Valid passport copy & English test results',
      'CV, Statement of Purpose & reference letters (if required)',
    ],
    advisorDelivers: [
      'Full document verification and checklist review',
      'Application file formatting and preparation',
      'Guidance on missing or additional documents',
    ],
  },
  {
    stepIndex: 4,
    num: '04',
    shortLabel: 'Apply',
    title: "Let's apply to more universities!",
    illustrationSrc: '/src/assets/images/step_04_apply_1795037711744.jpg',
    paragraphs: [
      "Once your documents are ready, we'll submit applications to suitable universities and keep you updated on their progress.",
      'Applying to more than one university gives you more chances to receive offers and more options to choose from.',
    ],
    docs: [
      'Verified application packet',
      'Finalised list of chosen universities',
      'Signed application consent forms',
    ],
    advisorDelivers: [
      'Direct submission to multiple suitable universities',
      'Active application tracking and progress updates',
      'Follow-up with university admissions teams',
    ],
  },
  {
    stepIndex: 5,
    num: '05',
    shortLabel: 'Offer',
    title: 'Your offer letter is here!',
    illustrationSrc: '/src/assets/images/step_05_offer_1795037705103.jpg',
    paragraphs: [
      "Congratulations! You've received an offer from your chosen university.",
      "Compare your offers, and we'll help you find the best scholarships available to make your studies more affordable.",
    ],
    docs: [
      'University offer letter(s)',
      'Scholarship eligibility documents',
      'Any condition-fulfilment records',
    ],
    advisorDelivers: [
      'Side-by-side comparison of your university offers',
      'Scholarship search and fee-reduction guidance',
      'Support accepting your final offer',
    ],
  },
  {
    stepIndex: 6,
    num: '06',
    shortLabel: 'Pay',
    title: "Your payment, your choice. We're here to help!",
    illustrationSrc: '/src/assets/images/step_06_pay_1795037719476.jpg',
    paragraphs: [
      'You can pay your tuition fees directly to the university for peace of mind.',
      'If you need any help, our team is always here to guide you through the payment process and keep you updated on your student file.',
    ],
    docs: [
      'Official university fee invoice / offer letter',
      'University bank wire or payment portal details',
      'Payment confirmation receipt',
    ],
    advisorDelivers: [
      'Step-by-step tuition payment guidance',
      'Verification of official university payment details',
      'Continuous student file updates until COE/CAS issuance',
    ],
  },
  {
    stepIndex: 7,
    num: '07',
    shortLabel: 'Visa',
    title: "Let's get your visa ready!",
    illustrationSrc: '/src/assets/images/step_07_visa_1795037706657.jpg',
    paragraphs: [
      "Once your documents are ready, we'll guide you through your student eVisa application, from bank documents and deadlines to interview preparation.",
      'Our team will help with your paperwork and keep you updated at every step.',
    ],
    docs: [
      'Confirmation of Enrolment / CAS / Offer & payment receipt',
      'Bank statements & financial sponsorship documents',
      'Medical checkup & passport documents',
    ],
    advisorDelivers: [
      'Complete eVisa paperwork check & deadline management',
      'Bank & financial document guidance',
      'Visa interview preparation & status updates',
    ],
  },
  {
    stepIndex: 8,
    num: '08',
    shortLabel: 'Fly',
    title: 'Your new adventure starts here!',
    illustrationSrc: '/src/assets/images/step_08_fly_1795037708743.jpg',
    paragraphs: [
      'Get ready for your new student life abroad!',
      "We'll guide you through flight bookings, accommodation, travel money and everything you need before departure.",
      "We'll also brief you on what to pack, expected costs and who to contact when you need help.",
    ],
    docs: [
      'Approved student visa / eVisa grant',
      'Flight itinerary & travel insurance details',
      'Student accommodation booking confirmation',
    ],
    advisorDelivers: [
      'Flight booking & student accommodation guidance',
      'Travel money & pre-departure packing briefing',
      'Emergency contacts & arrival support checklist',
    ],
  },
];

const TOTAL_STEPS = STEPS_DATA.length;

export const StepsRoadmapSection: React.FC<StepsRoadmapSectionProps> = ({ onOpenBooking }) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [deepDiveStep, setDeepDiveStep] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
  const [descNode, setDescNode] = useState<HTMLParagraphElement | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  const prefersReducedMotion = useReducedMotion();
  const timelineWrapperRef = useRef<HTMLDivElement | null>(null);
  const cardWrapperRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const activePathRef = useRef<SVGPathElement | null>(null);
  const planeGroupRef = useRef<SVGGElement | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  const isMobileRef = useRef<boolean>(isMobile);
  isMobileRef.current = isMobile;
  const isExpandedRef = useRef<boolean>(isExpanded);
  isExpandedRef.current = isExpanded;
  const isModalOpenRef = useRef<boolean>(deepDiveStep !== null);
  isModalOpenRef.current = deepDiveStep !== null;
  const prefersReducedMotionRef = useRef<boolean>(Boolean(prefersReducedMotion));
  prefersReducedMotionRef.current = Boolean(prefersReducedMotion);
  const activeStepRef = useRef<number>(activeStep);
  activeStepRef.current = activeStep;

  const animRef = useRef<{
    mode: 'holding' | 'flying';
    currentT: number;
    facingDir: 1 | -1;
    visualScaleX: number;
    stage: number;
    fromT: number;
    toT: number;
    elapsedMs: number;
    durationMs: number;
    holdElapsedMs: number;
    isReturnLeg: boolean;
  }>({
    mode: 'holding',
    currentT: 0,
    facingDir: 1,
    visualScaleX: 1,
    stage: 1,
    fromT: 0,
    toT: 0,
    elapsedMs: 0,
    durationMs: LEG_FLIGHT_MS,
    holdElapsedMs: 0,
    isReturnLeg: false,
  });

  const currentMode: 'mobile' | 'desktop' = isMobile ? 'mobile' : 'desktop';
  const curve = isMobile ? MOBILE_CURVE : DESKTOP_CURVE;

  const fallbackNodes = useMemo(
    () =>
      STEPS_DATA.map((step) => {
        const t = (step.stepIndex - 1) / (TOTAL_STEPS - 1);
        const { x, y } = getBezierPointAndAngle(t, curve);
        return { stepIndex: step.stepIndex, x, y };
      }),
    [curve]
  );

  const [measuredNodesState, setMeasuredNodesState] = useState<{
    mode: 'mobile' | 'desktop';
    nodes: Array<{ stepIndex: number; x: number; y: number }>;
  }>(() => ({
    mode: currentMode,
    nodes: fallbackNodes,
  }));

  const applyVisualAt = useCallback((t: number, scaleX: number) => {
    const clampedT = Math.max(0, Math.min(1, t));
    const mobile = isMobileRef.current;
    const activeCurve = mobile ? MOBILE_CURVE : DESKTOP_CURVE;

    let pos: { x: number; y: number; angle: number } | null = null;
    let totalLength = 0;

    if (pathRef.current && typeof pathRef.current.getTotalLength === 'function') {
      try {
        totalLength = pathRef.current.getTotalLength();
        if (totalLength > 0) {
          const dist = totalLength * clampedT;
          const pt = pathRef.current.getPointAtLength(dist);
          const delta = 1.5;
          const p1 = pathRef.current.getPointAtLength(Math.max(0, dist - delta));
          const p2 = pathRef.current.getPointAtLength(Math.min(totalLength, dist + delta));
          const angle = (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;
          pos = { x: pt.x, y: pt.y, angle };
        }
      } catch {
        pos = null;
      }
    }

    if (!pos) {
      pos = getBezierPointAndAngle(clampedT, activeCurve);
    }

    if (planeGroupRef.current) {
      const safeScaleX =
        Math.abs(scaleX) < 0.02 ? (scaleX >= 0 ? 0.02 : -0.02) : scaleX;
      const signedAngle = (safeScaleX >= 0 ? 1 : -1) * pos.angle;
      planeGroupRef.current.setAttribute(
        'transform',
        `translate(${pos.x.toFixed(2)}, ${(pos.y - activeCurve.planeOffsetY).toFixed(2)}) scale(${safeScaleX.toFixed(3)}, 1) rotate(${signedAngle.toFixed(2)})`
      );
    }

    if (activePathRef.current) {
      if (totalLength > 0) {
        activePathRef.current.style.strokeDasharray = `${totalLength}`;
        activePathRef.current.style.strokeDashoffset = `${totalLength * (1 - clampedT)}`;
        activePathRef.current.style.opacity = clampedT <= 0.002 ? '0' : '1';
      } else {
        activePathRef.current.style.opacity = clampedT <= 0.002 ? '0' : '1';
      }
    }
  }, []);

  const applyVisualAtRef = useRef(applyVisualAt);
  applyVisualAtRef.current = applyVisualAt;

  const recalculateTimelineGeometry = useCallback(() => {
    const nextIsMobile =
      typeof window !== 'undefined' ? window.innerWidth < 640 : isMobileRef.current;
    const nextMode: 'mobile' | 'desktop' = nextIsMobile ? 'mobile' : 'desktop';
    const activeCurve = nextIsMobile ? MOBILE_CURVE : DESKTOP_CURVE;

    if (pathRef.current && typeof pathRef.current.getTotalLength === 'function') {
      try {
        const totalLength = pathRef.current.getTotalLength();
        if (totalLength > 0) {
          const nodes = STEPS_DATA.map((step) => {
            const t = (step.stepIndex - 1) / (TOTAL_STEPS - 1);
            const pt = pathRef.current!.getPointAtLength(totalLength * t);
            return { stepIndex: step.stepIndex, x: pt.x, y: pt.y };
          });

          setMeasuredNodesState({
            mode: nextMode,
            nodes,
          });
          applyVisualAt(animRef.current.currentT, animRef.current.visualScaleX);
          return;
        }
      } catch {
        // Fallback to mathematical Bezier helper
      }
    }

    setMeasuredNodesState({
      mode: nextMode,
      nodes: STEPS_DATA.map((step) => {
        const t = (step.stepIndex - 1) / (TOTAL_STEPS - 1);
        const { x, y } = getBezierPointAndAngle(t, activeCurve);
        return { stepIndex: step.stepIndex, x, y };
      }),
    });
    applyVisualAt(animRef.current.currentT, animRef.current.visualScaleX);
  }, [applyVisualAt]);

  const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    recalculateTimelineGeometry();
  }, [recalculateTimelineGeometry, isMobile]);

  useEffect(() => {
    const handleViewportUpdate = () => {
      const nextIsMobile = window.innerWidth < 640;
      setIsMobile((prev) => (prev !== nextIsMobile ? nextIsMobile : prev));
      requestAnimationFrame(() => {
        recalculateTimelineGeometry();
      });
    };

    handleViewportUpdate();
    window.addEventListener('resize', handleViewportUpdate, { passive: true });
    window.addEventListener('orientationchange', handleViewportUpdate, { passive: true });

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && timelineWrapperRef.current) {
      observer = new ResizeObserver(() => {
        recalculateTimelineGeometry();
      });
      observer.observe(timelineWrapperRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleViewportUpdate);
      window.removeEventListener('orientationchange', handleViewportUpdate);
      if (observer) observer.disconnect();
    };
  }, [recalculateTimelineGeometry]);

  // Snap safely if user enables reduced motion
  useEffect(() => {
    if (prefersReducedMotion) {
      const targetT = (activeStepRef.current - 1) / (TOTAL_STEPS - 1);
      animRef.current.mode = 'holding';
      animRef.current.currentT = targetT;
      animRef.current.stage = activeStepRef.current;
      animRef.current.facingDir = 1;
      animRef.current.visualScaleX = 1;
      animRef.current.holdElapsedMs = 0;
      animRef.current.isReturnLeg = false;
      applyVisualAt(targetT, 1);
    }
  }, [prefersReducedMotion, applyVisualAt]);

  // Continuous curved-path RAF loop (Stages 01 -> 08 -> smooth curved return to 01 -> repeat)
  useEffect(() => {
    let rafId = 0;
    let lastTime = typeof performance !== 'undefined' ? performance.now() : 0;

    const tick = (now: number) => {
      const dt = Math.min(50, Math.max(0, now - lastTime));
      lastTime = now;

      const state = animRef.current;

      if (prefersReducedMotionRef.current) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      // Smooth horizontal turn easing when reversing flight direction
      if (state.visualScaleX !== state.facingDir) {
        const turnStep = dt / 110;
        if (state.visualScaleX < state.facingDir) {
          state.visualScaleX = Math.min(state.facingDir, state.visualScaleX + turnStep);
        } else {
          state.visualScaleX = Math.max(state.facingDir, state.visualScaleX - turnStep);
        }
      }

      if (state.mode === 'flying') {
        state.elapsedMs += dt;
        const rawProgress = Math.min(1, state.elapsedMs / Math.max(1, state.durationMs));
        const eased = easeInOutCubic(rawProgress);
        state.currentT = state.fromT + (state.toT - state.fromT) * eased;

        applyVisualAtRef.current(state.currentT, state.visualScaleX);

        if (rawProgress >= 1) {
          state.currentT = state.toT;
          state.mode = 'holding';
          state.holdElapsedMs = 0;
          state.facingDir = 1;
          state.isReturnLeg = false;

          setActiveStep((prev) => (prev !== state.stage ? state.stage : prev));
        }
      } else {
        // 'holding' at milestone
        applyVisualAtRef.current(state.currentT, state.visualScaleX);

        if (!isExpandedRef.current && !isModalOpenRef.current) {
          state.holdElapsedMs += dt;
          if (state.holdElapsedMs >= STAGE_HOLD_MS) {
            state.holdElapsedMs = 0;

            if (state.stage < TOTAL_STEPS) {
              const nextStage = state.stage + 1;
              state.mode = 'flying';
              state.stage = nextStage;
              state.fromT = state.currentT;
              state.toT = (nextStage - 1) / (TOTAL_STEPS - 1);
              state.elapsedMs = 0;
              state.durationMs = LEG_FLIGHT_MS;
              state.facingDir = 1;
              state.isReturnLeg = false;
            } else {
              // Reached Stage 08 (FLY) -> smoothly fly back along curve to Stage 01
              state.mode = 'flying';
              state.stage = 1;
              state.fromT = state.currentT;
              state.toT = 0;
              state.elapsedMs = 0;
              state.durationMs = RETURN_FLIGHT_MS;
              state.facingDir = -1;
              state.isReturnLeg = true;
            }
          }
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const timelineNodes =
    measuredNodesState.mode === currentMode && measuredNodesState.nodes.length === TOTAL_STEPS
      ? measuredNodesState.nodes
      : fallbackNodes;
  const activeData = STEPS_DATA.find((s) => s.stepIndex === activeStep) || STEPS_DATA[0];

  const selectStep = useCallback(
    (step: number) => {
      const target = Math.max(1, Math.min(TOTAL_STEPS, step));
      const targetT = (target - 1) / (TOTAL_STEPS - 1);

      setActiveStep((prev) => {
        if (prev !== target) {
          setIsExpanded(false);
        }
        return target;
      });

      const state = animRef.current;
      if (prefersReducedMotionRef.current) {
        state.mode = 'holding';
        state.currentT = targetT;
        state.stage = target;
        state.facingDir = 1;
        state.visualScaleX = 1;
        state.holdElapsedMs = 0;
        state.isReturnLeg = false;
        applyVisualAt(targetT, 1);
        return;
      }

      const deltaT = Math.abs(targetT - state.currentT);
      if (deltaT < 0.002) {
        state.mode = 'holding';
        state.currentT = targetT;
        state.stage = target;
        state.facingDir = 1;
        state.holdElapsedMs = 0;
        state.isReturnLeg = false;
      } else {
        state.mode = 'flying';
        state.stage = target;
        state.fromT = state.currentT;
        state.toT = targetT;
        state.elapsedMs = 0;
        state.durationMs = Math.min(1250, Math.max(460, deltaT * 1400));
        state.facingDir = targetT >= state.currentT ? 1 : -1;
        state.holdElapsedMs = 0;
        state.isReturnLeg = false;
      }
    },
    [applyVisualAt]
  );

  const handlePrevStep = () => {
    const next = Math.max(1, activeStepRef.current - 1);
    selectStep(next);
  };

  const handleNextStep = () => {
    const next = Math.min(TOTAL_STEPS, activeStepRef.current + 1);
    selectStep(next);
  };

  const measureDescriptionOverflow = useCallback(() => {
    if (!descNode || isExpanded) return;
    setIsOverflowing(descNode.scrollHeight > descNode.clientHeight + 1);
  }, [descNode, isExpanded]);

  useIsomorphicLayoutEffect(() => {
    measureDescriptionOverflow();
  }, [measureDescriptionOverflow, activeStep]);

  useEffect(() => {
    if (!descNode || isExpanded) return;
    measureDescriptionOverflow();

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        measureDescriptionOverflow();
      });
      observer.observe(descNode);
    }

    window.addEventListener('resize', measureDescriptionOverflow, { passive: true });
    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('resize', measureDescriptionOverflow);
    };
  }, [descNode, isExpanded, measureDescriptionOverflow]);

  // Collapse "Read more" overlay when clicking outside the card
  useEffect(() => {
    if (!isExpanded) return;
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (cardWrapperRef.current && !cardWrapperRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [isExpanded]);

  const handleCardKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' && isExpanded) {
      e.preventDefault();
      setIsExpanded(false);
      return;
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrevStep();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNextStep();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartXRef.current;
    if (Math.abs(diff) > 45) {
      if (diff > 0) handlePrevStep();
      else handleNextStep();
    }
    touchStartXRef.current = null;
  };

  return (
    <section
      id="steps-roadmap-section"
      className="relative w-full max-w-[1600px] mx-auto py-10 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0B1329] text-slate-900 dark:text-white transition-colors duration-300 border-t border-slate-200/80 dark:border-slate-800/80 overflow-hidden"
    >
      <div className="relative z-10 w-full max-w-[1600px] mx-auto">
        {/* Section Heading */}
        <header className="text-center max-w-5xl mx-auto mb-6 sm:mb-12 px-0 sm:px-2">
          <h2 className="gees-section-title text-[30px] sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white flex flex-col items-center justify-center gap-2 sm:gap-2.5 md:gap-3 leading-[30px] sm:leading-tight text-center">
            <span>Your Journey to</span>
            <span className="gees-section-highlight bg-[#fbb034] text-slate-950 px-3.5 sm:px-5 md:px-6 py-0.5 sm:py-1 md:py-1.5 rounded-xl sm:rounded-2xl font-black tracking-tight leading-none shadow-sm shrink-0 inline-flex items-center">
              Studying Abroad
            </span>
          </h2>
          <p className="mt-2.5 sm:mt-3 text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed max-w-2xl mx-auto text-center px-0 sm:px-2">
            Eight clear steps. Expert guidance from your first call to departure.
          </p>
        </header>

        {/* --- CURVED TIMELINE PATH & REAL AIRCRAFT --- */}
        <div
          ref={timelineWrapperRef}
          className="relative w-full max-w-5xl mx-auto mb-5 sm:mb-7 pt-1 sm:pt-4"
        >
          <div className={`relative w-full ${curve.aspectClass}`}>
            <svg
              key={isMobile ? 'mobile-timeline-svg' : 'desktop-timeline-svg'}
              className="w-full h-full overflow-visible block"
              viewBox={curve.viewBox}
              preserveAspectRatio="xMidYMid meet"
              role="group"
              aria-label="Study abroad process timeline stages"
            >
              <defs>
                {/* Metallic 3D Fuselage Gradient */}
                <linearGradient id="planeBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="50%" stopColor="#f1f5f9" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>

                {/* GEES Gold Wing Shading Gradient */}
                <linearGradient id="planeWingShade" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbb034" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>

                {/* Cockpit Glass Reflection Gradient */}
                <linearGradient id="planeGlass" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
              </defs>

              {/* 1. Inactive Base Dotted Curve */}
              <path
                ref={pathRef}
                d={curve.d}
                fill="none"
                className="stroke-slate-300 dark:stroke-slate-700/80"
                strokeWidth={isMobile ? 2 : 2.5}
                strokeDasharray="5 7"
              />

              {/* 2. Active Golden Highlight Path (synchronized frame-by-frame with aircraft) */}
              <path
                ref={activePathRef}
                d={curve.d}
                fill="none"
                stroke="#fbb034"
                strokeWidth={isMobile ? 3 : 3.5}
                strokeLinecap="round"
                style={{
                  filter: 'drop-shadow(0 0 6px rgba(251, 176, 52, 0.4))',
                }}
              />

              {/* 3. Milestone Nodes Layer */}
              {timelineNodes.map((node) => {
                const step = STEPS_DATA[node.stepIndex - 1];
                const isActive = activeStep === node.stepIndex;
                const isCompleted = node.stepIndex < activeStep;

                return (
                  <g
                    key={node.stepIndex}
                    transform={`translate(${node.x}, ${node.y})`}
                    className="cursor-pointer group focus:outline-none"
                    onClick={() => selectStep(node.stepIndex)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Stage ${step.num}: ${step.shortLabel}`}
                    aria-pressed={isActive}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        selectStep(node.stepIndex);
                      }
                    }}
                  >
                    {/* Invisible expanded touch hit target */}
                    <circle r={curve.hitRadius} fill="transparent" pointerEvents="all" />

                    {/* Outer pulse halo on active stage */}
                    {isActive && (
                      <circle
                        r={curve.nodeRadius + (isMobile ? 4.5 : 6)}
                        fill="none"
                        stroke="#fbb034"
                        strokeOpacity="0.45"
                        strokeWidth={isMobile ? 1.5 : 2}
                      />
                    )}

                    {/* Circle Node Button */}
                    <circle
                      r={curve.nodeRadius}
                      fill={isActive ? '#fbb034' : '#0B1329'}
                      stroke={isActive || isCompleted ? '#fbb034' : '#475569'}
                      strokeWidth={isMobile ? 2 : 2.5}
                      className="transition-transform duration-300 group-hover:scale-110"
                      style={{ filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4))' }}
                    />

                    {/* Number Label inside Node */}
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={isActive ? '#0B1329' : '#fbb034'}
                      fontSize={curve.nodeFontSize}
                      fontWeight="900"
                      fontFamily="sans-serif"
                    >
                      {node.stepIndex}
                    </text>

                    {/* Step Label Underneath on Tablet & Desktop */}
                    {!isMobile && (
                      <text
                        y="40"
                        textAnchor="middle"
                        fill={isActive ? '#fbb034' : '#94a3b8'}
                        fontSize="12.5"
                        fontWeight={isActive ? '800' : '600'}
                        letterSpacing="0.01em"
                        fontFamily="sans-serif"
                        className="transition-colors duration-300 select-none"
                      >
                        {step.shortLabel}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* 4. Top Layer Real Aircraft Marker (follows exact curved SVG path continuously) */}
              <g
                ref={planeGroupRef}
                style={{
                  filter:
                    'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.55)) drop-shadow(0 0 10px rgba(251, 176, 52, 0.35))',
                }}
              >
                <g transform={`translate(${-curve.planeWidth / 2}, ${-curve.planeHeight / 2})`}>
                  <GEESAircraft width={curve.planeWidth} height={curve.planeHeight} />
                </g>
              </g>
            </svg>
          </div>

          {/* Mobile Stage Label Pill Grid (< 640px) - ensures all 8 labels are readable & touch-friendly */}
          <div className="sm:hidden grid grid-cols-4 gap-1.5 mt-3">
            {STEPS_DATA.map((step) => {
              const isActive = activeStep === step.stepIndex;
              return (
                <button
                  key={step.stepIndex}
                  type="button"
                  onClick={() => selectStep(step.stepIndex)}
                  aria-label={`Stage ${step.num}: ${step.shortLabel}`}
                  aria-pressed={isActive}
                  className={`min-h-[44px] px-1.5 py-1.5 rounded-xl border text-center flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95 ${
                    isActive
                      ? 'bg-[#0B1329] dark:bg-[#fbb034] text-[#fbb034] dark:text-[#0B1329] border-[#fbb034] shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-900/70 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:border-[#fbb034]/60'
                  }`}
                >
                  <span
                    style={{ fontVariantNumeric: 'tabular-nums', fontFeatureSettings: '"zero" 0' }}
                    className={`text-[10px] font-bold leading-none ${
                      isActive ? 'opacity-90' : 'text-amber-600 dark:text-[#fbb034]'
                    }`}
                  >
                    {step.num}
                  </span>
                  <span className="text-[10.5px] font-extrabold tracking-wide leading-tight mt-0.5 truncate max-w-full">
                    {step.shortLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* --- INTERACTIVE ACTIVE STEP DETAIL CARD (fixed uniform dimensions across all 8 stages) --- */}
        <div
          ref={cardWrapperRef}
          className="relative w-full max-w-4xl mx-auto focus:outline-none"
          tabIndex={0}
          onKeyDown={handleCardKeyDown}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="group/card relative w-full h-[218px] min-[400px]:h-[212px] sm:h-[224px] md:h-[234px] flex items-center bg-white dark:bg-[#0B1329]/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl px-3.5 py-3.5 sm:px-8 sm:py-6 border border-slate-200/90 dark:border-slate-800/90 shadow-lg dark:shadow-2xl overflow-hidden text-slate-900 dark:text-white">
            {/* Soft warm-cream radial glow on the left side matching reference screenshot */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-64 sm:w-80 bg-gradient-to-r from-[#FEF9E7]/85 via-[#FEF9E7]/35 to-transparent dark:from-[#fbb034]/10 dark:via-[#fbb034]/5 dark:to-transparent"
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.16, ease: 'easeOut' }}
                className="relative z-10 w-full h-full flex items-center justify-between gap-3.5 sm:gap-7 md:gap-9"
              >
                {/* LEFT SIDE: Hand-Drawn Illustration Container + "Step X of 8" Badge */}
                <div className="relative shrink-0 pb-1.5 pr-1">
                  <div className="w-[104px] h-[104px] min-[400px]:w-[116px] min-[400px]:h-[116px] sm:w-[146px] sm:h-[146px] md:w-[158px] md:h-[158px] rounded-2xl sm:rounded-[20px] bg-[#FEF9E7] dark:bg-[#FFFDF5] border border-[#F5E0A3] dark:border-[#F5E0A3]/70 p-2 sm:p-2.5 flex items-center justify-center shadow-2xs overflow-hidden">
                    <img
                      src={activeData.illustrationSrc}
                      alt={`Stage ${activeData.num} ${activeData.shortLabel} illustration`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain select-none pointer-events-none mix-blend-multiply transition-transform duration-300 ease-out group-hover/card:scale-[1.03]"
                    />
                  </div>
                  <span
                    style={{ fontVariantNumeric: 'tabular-nums', fontFeatureSettings: '"zero" 0' }}
                    className="absolute bottom-0 right-0 inline-flex items-center px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg bg-white dark:bg-[#0B1329] border border-[#F3D27A] dark:border-[#fbb034]/50 text-[#9A4D08] dark:text-[#fbb034] text-[10.5px] sm:text-xs font-extrabold tracking-tight shadow-xs whitespace-nowrap select-none"
                  >
                    Step {activeData.stepIndex} of {TOTAL_STEPS}
                  </span>
                </div>

                {/* RIGHT SIDE: Prominent Heading, Readable Description & Bottom-Right Stage Number Watermark */}
                <div className="relative flex-1 min-w-0 h-full flex flex-col justify-center py-0.5 text-justify">
                  <h3 className="relative z-10 text-[16.5px] min-[400px]:text-[18px] sm:text-[23px] md:text-[27px] font-extrabold text-[#0B1329] dark:text-white tracking-tight leading-[1.2] break-words">
                    {activeData.title}
                  </h3>

                  <p
                    ref={setDescNode}
                    className="relative z-10 mt-1.5 sm:mt-2.5 pr-4 sm:pr-14 md:pr-20 text-[13px] min-[400px]:text-[13.5px] sm:text-[15.5px] md:text-[16px] text-slate-600 dark:text-slate-300 leading-[1.45] sm:leading-[1.52] font-normal line-clamp-3 break-words"
                  >
                    {activeData.paragraphs.join(' ')}
                  </p>

                  {isOverflowing && (
                    <button
                      type="button"
                      onClick={() => setIsExpanded(true)}
                      aria-expanded={false}
                      className="no-min-touch relative z-10 mt-1 sm:mt-1.5 self-start inline-flex items-center gap-0.5 text-[12px] sm:text-[13px] font-bold text-amber-600 dark:text-[#fbb034] hover:text-amber-700 dark:hover:text-amber-300 transition-colors cursor-pointer focus:outline-none focus-visible:underline"
                    >
                      <span>Read more</span>
                    </button>
                  )}
                </div>

                {/* Large Subtle Stage Number Watermark Positioned Towards Bottom-Right (standard rounded zero) */}
                <div
                  aria-hidden="true"
                  style={{ fontVariantNumeric: 'tabular-nums', fontFeatureSettings: '"zero" 0' }}
                  className="pointer-events-none select-none absolute -bottom-3 sm:-bottom-5 right-1 sm:right-2 text-[68px] min-[400px]:text-[76px] sm:text-[116px] md:text-[132px] leading-none font-black text-slate-900/[0.06] dark:text-white/[0.06] tracking-tighter z-0"
                >
                  {activeData.num}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Elevated Overlay Presentation for Read More — keeps main timeline height fixed */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                role="region"
                aria-label={`${activeData.num} ${activeData.shortLabel}: full details`}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -4 }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.16, ease: 'easeOut' }}
                className="absolute top-0 inset-x-0 z-30 min-h-full bg-white dark:bg-[#0B1329] rounded-2xl sm:rounded-3xl px-4 py-4 sm:px-8 sm:py-6 border border-[#fbb034]/60 shadow-2xl text-slate-900 dark:text-white overflow-hidden"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-64 sm:w-80 bg-gradient-to-r from-[#FEF9E7]/85 via-[#FEF9E7]/35 to-transparent dark:from-[#fbb034]/10 dark:via-[#fbb034]/5 dark:to-transparent"
                />

                <div className="relative z-10 w-full flex items-start sm:items-center justify-between gap-3.5 sm:gap-7 md:gap-9">
                  {/* LEFT SIDE: Hand-Drawn Illustration Container + "Step X of 8" Badge */}
                  <div className="relative shrink-0 pb-1.5 pr-1">
                    <div className="w-[104px] h-[104px] min-[400px]:w-[116px] min-[400px]:h-[116px] sm:w-[146px] sm:h-[146px] md:w-[158px] md:h-[158px] rounded-2xl sm:rounded-[20px] bg-[#FEF9E7] dark:bg-[#FFFDF5] border border-[#F5E0A3] dark:border-[#F5E0A3]/70 p-2 sm:p-2.5 flex items-center justify-center shadow-2xs overflow-hidden">
                      <img
                        src={activeData.illustrationSrc}
                        alt={`Stage ${activeData.num} ${activeData.shortLabel} illustration`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain select-none pointer-events-none mix-blend-multiply"
                      />
                    </div>
                    <span
                      style={{ fontVariantNumeric: 'tabular-nums', fontFeatureSettings: '"zero" 0' }}
                      className="absolute bottom-0 right-0 inline-flex items-center px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg bg-white dark:bg-[#0B1329] border border-[#F3D27A] dark:border-[#fbb034]/50 text-[#9A4D08] dark:text-[#fbb034] text-[10.5px] sm:text-xs font-extrabold tracking-tight shadow-xs whitespace-nowrap select-none"
                    >
                      Step {activeData.stepIndex} of {TOTAL_STEPS}
                    </span>
                  </div>

                  {/* RIGHT SIDE: Full Description + Read less */}
                  <div className="relative z-10 flex-1 min-w-0 py-0.5">
                    <h3 className="text-[16.5px] min-[400px]:text-[18px] sm:text-[23px] md:text-[27px] font-extrabold text-[#0B1329] dark:text-white tracking-tight leading-[1.2] break-words">
                      {activeData.title}
                    </h3>

                    <div className="mt-1.5 sm:mt-2.5 pr-4 sm:pr-14 md:pr-20 space-y-1.5 text-[13px] min-[400px]:text-[13.5px] sm:text-[15.5px] md:text-[16px] text-slate-600 dark:text-slate-300 leading-[1.45] sm:leading-[1.52] font-normal">
                      {activeData.paragraphs.map((paragraph, pIdx) => (
                        <p
                          key={pIdx}
                          className="text-[13px] min-[400px]:text-[13.5px] sm:text-[15.5px] md:text-[16px] leading-[1.45] sm:leading-[1.52] break-words"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsExpanded(false)}
                      aria-expanded={true}
                      className="no-min-touch mt-2 inline-flex items-center gap-0.5 text-[12px] sm:text-[13px] font-bold text-amber-600 dark:text-[#fbb034] hover:text-amber-700 dark:hover:text-amber-300 transition-colors cursor-pointer focus:outline-none focus-visible:underline"
                    >
                      <span>Read less</span>
                    </button>
                  </div>

                  {/* Bottom-Right Stage Number Watermark */}
                  <div
                    aria-hidden="true"
                    style={{ fontVariantNumeric: 'tabular-nums', fontFeatureSettings: '"zero" 0' }}
                    className="pointer-events-none select-none absolute -bottom-3 sm:-bottom-5 right-1 sm:right-2 text-[68px] min-[400px]:text-[76px] sm:text-[116px] md:text-[132px] leading-none font-black text-slate-900/[0.06] dark:text-white/[0.06] tracking-tighter z-0"
                  >
                    {activeData.num}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Pre-Footer CTA */}
        <div className="flex justify-center pt-7 sm:pt-9">
          <InteractiveHoverButton
            type="button"
            text="Book free counselling"
            onClick={onOpenBooking}
            className="min-h-[44px] w-full sm:w-auto px-8 py-3.5 rounded-full border-slate-300 dark:border-slate-700 text-sm sm:text-base font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 shadow-xs cursor-pointer"
          />
        </div>
      </div>

      {/* --- DEEP DIVE STEP CHECKLIST & ADVISOR DELIVERABLES MODAL --- */}
      {deepDiveStep !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-white dark:bg-[#0B1329] rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-fadeIn text-slate-900 dark:text-white">
            <button
              onClick={() => setDeepDiveStep(null)}
              className="absolute top-4 right-4 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>

            <div className="flex items-center gap-3.5 mb-4">
              <span className="w-10 h-10 rounded-full bg-[#fbb034] text-slate-950 font-black text-sm flex items-center justify-center shadow-md shrink-0">
                {STEPS_DATA[deepDiveStep - 1].num}
              </span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-[#fbb034]">
                  {STEPS_DATA[deepDiveStep - 1].num} — {STEPS_DATA[deepDiveStep - 1].shortLabel}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {STEPS_DATA[deepDiveStep - 1].title}
                </h3>
              </div>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              {STEPS_DATA[deepDiveStep - 1].paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Documents You Need to Prepare:
                </h4>
                <ul className="space-y-1.5 pl-2">
                  {STEPS_DATA[deepDiveStep - 1].docs.map((d, i) => (
                    <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#fbb034]" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  What Your GEES Advisor Delivers:
                </h4>
                <ul className="space-y-1.5 pl-2">
                  {STEPS_DATA[deepDiveStep - 1].advisorDelivers.map((d, i) => (
                    <li key={i} className="text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-emerald-500">
                        check_circle
                      </span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setDeepDiveStep(null);
                  onOpenBooking();
                }}
                className="min-h-[44px] flex-1 py-3 px-4 rounded-full bg-[#fbb034] hover:bg-[#f59e0b] text-slate-950 font-black text-xs uppercase tracking-wider cursor-pointer shadow-md active:scale-98 flex items-center justify-center gap-2"
              >
                <span>Book Step Consultation</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default StepsRoadmapSection;
