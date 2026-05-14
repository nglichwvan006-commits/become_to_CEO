"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface CountUpProps {
  target: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export function CountUp({
  target,
  duration = 1.5,
  className,
  prefix = "",
  suffix = "",
  decimals = 0,
}: CountUpProps) {
  const [isInView, setIsInView] = useState(false);
  const spring = useSpring(0, { duration: duration * 1000 });
  const display = useTransform(spring, (v) => `${prefix}${v.toFixed(decimals)}${suffix}`);

  useEffect(() => {
    if (isInView) {
      spring.set(target);
    }
  }, [isInView, target, spring]);

  return (
    <motion.span
      className={cn(className)}
      onViewportEnter={() => setIsInView(true)}
      viewport={{ once: true }}
    >
      {display}
    </motion.span>
  );
}
