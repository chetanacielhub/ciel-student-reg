"use client";

import { motion, HTMLMotionProps, useInView, animate } from "framer-motion";
import { ReactNode, useEffect, useRef, useState, useCallback } from "react";

interface MotionProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function FadeIn({ children, delay = 0, duration = 0.5, className = "", style, ...props }: MotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, delay = 0, duration = 0.5, className = "", style, ...props }: MotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, className = "", style, ...props }: MotionProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.12,
          },
        },
      }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "", style, ...props }: MotionProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { ease: [0.16, 1, 0.3, 1], duration: 0.5 } },
      }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface CounterAnimationProps {
  value: string | number;
  duration?: number;
  className?: string;
}

/** Animated Counter component that counts up numbers when scrolled into view */
export function CounterAnimation({
  value,
  duration = 2,
  className = "",
}: CounterAnimationProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });
  const strVal = String(value);
  const isInfinity = strVal.includes("∞");

  // Determine initial display value
  const match = strVal.match(/^([^0-9.]*)([0-9.,]+)(.*)$/);
  const prefix = match ? match[1] || "" : "";
  const numStr = match ? match[2].replace(/,/g, "") : "";
  const suffix = match ? match[3] || "" : "";
  const targetNum = match ? parseFloat(numStr) : NaN;

  const [displayValue, setDisplayValue] = useState(() => {
    if (isInfinity) return "∞";
    if (!isNaN(targetNum)) {
      return `${prefix}0${suffix}`;
    }
    return strVal;
  });

  const runAnimation = useCallback(() => {
    if (isInfinity || isNaN(targetNum)) return;

    const hasDecimal = numStr.includes(".");
    const decimalPlaces = hasDecimal ? numStr.split(".")[1].length : 0;

    const controls = animate(0, targetNum, {
      duration,
      ease: [0.16, 1, 0.3, 1], // Smooth cubic-bezier ease out
      onUpdate: (latest) => {
        const formattedNum = hasDecimal
          ? latest.toFixed(decimalPlaces)
          : Math.floor(latest).toLocaleString();
        setDisplayValue(`${prefix}${formattedNum}${suffix}`);
      },
    });

    return () => controls.stop();
  }, [isInfinity, targetNum, numStr, prefix, suffix, duration]);

  useEffect(() => {
    if (isInView && !isInfinity && !isNaN(targetNum)) {
      const cleanup = runAnimation();
      return () => cleanup?.();
    }
  }, [isInView, isInfinity, targetNum, runAnimation]);

  if (isInfinity) {
    return (
      <motion.span
        ref={ref}
        className={className}
        initial={{ opacity: 0, scale: 0.3, rotate: -90 }}
        animate={
          isInView
            ? { opacity: 1, scale: 1, rotate: 0 }
            : { opacity: 0, scale: 0.3, rotate: -90 }
        }
        whileHover={{ scale: 1.3, rotate: 180, color: "#d4af37" }}
        transition={{ type: "spring", stiffness: 240, damping: 12 }}
        style={{ display: "inline-block", cursor: "default" }}
      >
        ∞
      </motion.span>
    );
  }

  return (
    <motion.span
      ref={ref}
      className={className}
      onMouseEnter={runAnimation}
      whileHover={{ scale: 1.08 }}
      transition={{ type: "spring", stiffness: 350, damping: 15 }}
      style={{ display: "inline-block", cursor: "pointer" }}
    >
      {displayValue}
    </motion.span>
  );
}

/** Animated Ambient Gold Particle Canvas - Subtle Obsidian Glow */
export function GoldenParticleBackground() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.03, 0.06, 0.03],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          top: "-15%",
          left: "10%",
          width: "550px",
          height: "550px",
          background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, rgba(9,10,14,0) 70%)",
          filter: "blur(60px)",
        }}
      />
    </div>
  );
}
