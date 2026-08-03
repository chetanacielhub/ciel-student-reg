"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

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
