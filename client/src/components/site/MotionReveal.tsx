import type { ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

interface MotionRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
  once?: boolean;
  variant?: "fade-up" | "blur-in" | "scale-in" | "stagger";
}

const revealVariants: Record<NonNullable<MotionRevealProps["variant"]>, Variants> = {
  "fade-up": {
    hidden: (distance: number) => ({ opacity: 0, y: distance }),
    visible: { opacity: 1, y: 0 },
  },
  "blur-in": {
    hidden: (distance: number) => ({
      opacity: 0,
      y: distance,
      filter: "blur(14px)",
    }),
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
  "scale-in": {
    hidden: { opacity: 0, scale: 0.94, y: 18 },
    visible: { opacity: 1, scale: 1, y: 0 },
  },
  stagger: {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.04,
      },
    },
  },
};

export function MotionReveal({
  children,
  className,
  delay = 0,
  distance = 28,
  once = true,
  variant = "fade-up",
}: MotionRevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      custom={distance}
      variants={revealVariants[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-10% 0px" }}
      transition={{ duration: 0.82, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
