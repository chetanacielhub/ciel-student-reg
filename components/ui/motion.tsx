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

/** Floating ambient gold orbs — absolute positioned, zero layout impact */
export function FloatingOrbs() {
  const orbs = [
    { w: 560, h: 560, top: "-8%",  left: "-4%",  color: "rgba(212,175,55,0.07)", dur: 22, delay: 0 },
    { w: 380, h: 380, top: "38%",  right: "-6%", color: "rgba(212,175,55,0.05)", dur: 18, delay: 3 },
    { w: 280, h: 280, bottom: "6%",left: "28%",  color: "rgba(212,175,55,0.04)", dur: 26, delay: 6 },
    { w: 180, h: 180, top: "18%",  left: "52%",  color: "rgba(255,215,100,0.05)", dur: 14, delay: 1.5 },
  ] as const;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 1.15, 0.95, 1], x: [0, 18, -12, 0], y: [0, -16, 10, 0], opacity: [0.7, 1, 0.8, 0.7] }}
          transition={{ duration: orb.dur, delay: orb.delay, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            width: orb.w,
            height: orb.h,
            top: (orb as { top?: string }).top,
            left: (orb as { left?: string }).left,
            right: (orb as { right?: string }).right,
            bottom: (orb as { bottom?: string }).bottom,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: "blur(48px)",
            borderRadius: "50%",
          }}
        />
      ))}
    </div>
  );
}

/** Gold scroll progress bar — fixed at top, zero layout impact */
export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: 3,
        width: `${progress}%`,
        background: "linear-gradient(90deg, #d4af37, #ffe97a, #d4af37)",
        zIndex: 99999,
        boxShadow: "0 0 10px rgba(212,175,55,0.6)",
        transition: "width 0.05s linear",
      }}
      />
  );
}

/**
 * TypewriterTitle — types the three hero lines character by character.
 * Drop-in replacement for the h1 inner content; keeps the same markup shape.
 */
export function TypewriterTitle() {
  const LINES = [
    { text: "Ideate.",        gold: false },
    { text: "Innovate.",      gold: false },
    { text: "Create Impact.", gold: true  },
  ] as const;

  const [chars, setChars] = useState<[string, string, string]>(["", "", ""]);
  const [lineIdx, setLineIdx] = useState(-1); // -1 = waiting for initial delay
  const [colIdx, setColIdx]   = useState(0);

  // Initial delay before typing starts
  useEffect(() => {
    const t = setTimeout(() => setLineIdx(0), 350);
    return () => clearTimeout(t);
  }, []);

  // Typing engine
  useEffect(() => {
    if (lineIdx < 0 || lineIdx >= LINES.length) return;
    const target = LINES[lineIdx].text;

    if (colIdx < target.length) {
      // Type next character
      const t = setTimeout(() => {
        setChars(prev => {
          const next = [...prev] as [string, string, string];
          next[lineIdx] = target.slice(0, colIdx + 1);
          return next;
        });
        setColIdx(c => c + 1);
      }, 72);
      return () => clearTimeout(t);
    } else {
      // Line complete — pause then start next line
      const t = setTimeout(() => {
        setLineIdx(l => l + 1);
        setColIdx(0);
      }, lineIdx === 2 ? 0 : 320);
      return () => clearTimeout(t);
    }
  }, [lineIdx, colIdx]);

  const isDone = lineIdx >= LINES.length;

  // Cursor: a thin blinking block that renders at the active typing position
  const cursor = (
    <span
      aria-hidden="true"
      style={{
        display:        "inline-block",
        width:          "3px",
        height:         "0.82em",
        background:     "var(--ciel-gold, #d4af37)",
        marginLeft:     "3px",
        verticalAlign:  "middle",
        borderRadius:   "1px",
        animation:      "caretBlink 0.85s step-end infinite",
      }}
    />
  );

  return (
    <>
      {LINES.map((ln, i) => (
        <span key={i} style={{ display: "block" }}>
          <span
            className={ln.gold ? "text-gold" : ""}
            style={{ whiteSpace: "nowrap" }}
          >
            {chars[i]}
            {!isDone && lineIdx === i && cursor}
          </span>
        </span>
      ))}
    </>
  );
}
/**
 * MorphingBlob — an organic shape that continuously morphs its border-radius.
 * Absolutely positioned; zero layout impact.
 */
export function MorphingBlob({
  color = "rgba(212,175,55,0.055)",
  size = 420,
  style,
  duration = 11,
}: {
  color?: string;
  size?: number;
  style?: React.CSSProperties;
  duration?: number;
}) {
  return (
    <motion.div
      animate={{
        borderRadius: [
          "62% 38% 46% 54% / 60% 44% 56% 40%",
          "39% 61% 58% 42% / 40% 68% 32% 60%",
          "57% 43% 36% 64% / 52% 33% 67% 48%",
          "46% 54% 66% 34% / 61% 47% 53% 39%",
          "62% 38% 46% 54% / 60% 44% 56% 40%",
        ],
        rotate: [0, 18, -12, 24, 0],
        scale: [1, 1.07, 0.96, 1.04, 1],
      }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
      style={{
        position: "absolute",
        width: size,
        height: size,
        background: color,
        filter: "blur(55px)",
        pointerEvents: "none",
        zIndex: 0,
        ...style,
      }}
    />
  );
}
