"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowPulseProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  intensity?: "low" | "medium" | "high";
}

const intensityMap = {
  low: { blur: "8px", spread: "20px" },
  medium: { blur: "12px", spread: "30px" },
  high: { blur: "16px", spread: "40px" },
};

export function GlowPulse({
  children,
  className,
  color = "#a78bfa",
  intensity = "medium",
}: GlowPulseProps) {
  const { blur, spread } = intensityMap[intensity];

  return (
    <motion.div
      animate={{
        boxShadow: [
          `0 0 ${blur} ${color}30`,
          `0 0 ${spread} ${color}50, 0 0 ${parseInt(spread) * 1.5}px ${color}20`,
          `0 0 ${blur} ${color}30`,
        ],
      }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
