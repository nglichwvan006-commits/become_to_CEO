"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SlideUpProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  distance?: number;
}

export function SlideUp({
  children,
  className,
  delay = 0,
  duration = 0.6,
  distance = 30,
}: SlideUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration,
        delay,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
