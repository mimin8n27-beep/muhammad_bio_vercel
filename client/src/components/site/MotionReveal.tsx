import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from "framer-motion";

interface MotionRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
  intensity?: "soft" | "medium" | "high";
  once?: boolean;
  parallaxRange?: number;
  variant?:
    | "fade-up"
    | "blur-in"
    | "scale-in"
    | "stagger"
    | "stagger-group"
    | "parallax"
    | "glow-pop"
    | "beam-sweep"
    | "dock-slide";
  viewportMargin?: string;
}

const intensityMap = {
  soft: { blur: 8, scale: 0.985, duration: 0.58 },
  medium: { blur: 14, scale: 0.96, duration: 0.82 },
  high: { blur: 18, scale: 0.92, duration: 1.02 },
} as const;

function getRevealVariants(
  variant: NonNullable<MotionRevealProps["variant"]>,
  intensity: NonNullable<MotionRevealProps["intensity"]>,
): Variants {
  const profile = intensityMap[intensity];

  switch (variant) {
    case "blur-in":
      return {
        hidden: (distance: number) => ({
          opacity: 0,
          y: distance,
          filter: `blur(${profile.blur}px)`,
        }),
        visible: { opacity: 1, y: 0, filter: "blur(0px)" },
      };
    case "scale-in":
      return {
        hidden: { opacity: 0, scale: profile.scale, y: 18 },
        visible: { opacity: 1, scale: 1, y: 0 },
      };
    case "stagger":
    case "stagger-group":
      return {
        hidden: { opacity: 0, y: 18 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            staggerChildren: intensity === "high" ? 0.12 : 0.08,
            delayChildren: 0.04,
          },
        },
      };
    case "glow-pop":
      return {
        hidden: {
          opacity: 0,
          scale: profile.scale,
          y: 24,
          filter: `blur(${Math.max(6, profile.blur - 4)}px)`,
          boxShadow: "0 0 0 rgba(0,0,0,0)",
        },
        visible: {
          opacity: 1,
          scale: 1,
          y: 0,
          filter: "blur(0px)",
          boxShadow: "0 0 36px rgba(73,166,255,0.14)",
        },
      };
    case "beam-sweep":
      return {
        hidden: {
          opacity: 0,
          y: 20,
          clipPath: "inset(0 100% 0 0 round 1.5rem)",
        },
        visible: {
          opacity: 1,
          y: 0,
          clipPath: "inset(0 0% 0 0 round 1.5rem)",
        },
      };
    case "dock-slide":
      return {
        hidden: { opacity: 0, y: 32, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1 },
      };
    case "parallax":
      return {
        hidden: { opacity: 0, y: 24, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1 },
      };
    case "fade-up":
    default:
      return {
        hidden: (distance: number) => ({ opacity: 0, y: distance }),
        visible: { opacity: 1, y: 0 },
      };
  }
}

export function MotionReveal({
  children,
  className,
  delay = 0,
  distance = 28,
  intensity = "medium",
  once = true,
  parallaxRange = 22,
  variant = "fade-up",
  viewportMargin = "-10% 0px",
}: MotionRevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  if (variant === "parallax") {
    return (
      <ParallaxReveal
        className={className}
        delay={delay}
        distance={distance}
        intensity={intensity}
        once={once}
        parallaxRange={parallaxRange}
        viewportMargin={viewportMargin}
      >
        {children}
      </ParallaxReveal>
    );
  }

  return (
    <motion.div
      className={className}
      custom={distance}
      variants={getRevealVariants(variant, intensity)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: viewportMargin }}
      transition={{
        duration: intensityMap[intensity].duration,
        ease: [0.16, 1, 0.3, 1],
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

function ParallaxReveal({
  children,
  className,
  delay,
  distance,
  intensity,
  once,
  parallaxRange,
  viewportMargin,
}: {
  children: ReactNode;
  className?: string;
  delay: number;
  distance: number;
  intensity: NonNullable<MotionRevealProps["intensity"]>;
  once: boolean;
  parallaxRange: number;
  viewportMargin: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [parallaxRange, -parallaxRange]);

  return (
    <motion.div
      ref={ref}
      className={className}
      custom={distance}
      variants={getRevealVariants("parallax", intensity)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: viewportMargin }}
      transition={{
        duration: intensityMap[intensity].duration,
        ease: [0.16, 1, 0.3, 1],
        delay,
      }}
      style={{ y: parallaxY }}
    >
      {children}
    </motion.div>
  );
}
