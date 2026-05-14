import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export function calculateRequiredExp(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}

export function getExpProgress(exp: number, level: number): number {
  const required = calculateRequiredExp(level);
  const prevRequired = level > 1 ? calculateRequiredExp(level - 1) : 0;
  const currentExp = exp - prevRequired;
  const neededExp = required - prevRequired;
  return Math.min(Math.max((currentExp / neededExp) * 100, 0), 100);
}

export function getDemotionRiskColor(risk: number): string {
  if (risk < 30) return "green";
  if (risk < 70) return "yellow";
  return "red";
}

export function getTimeRemaining(deadline: string): {
  days: number;
  hours: number;
  minutes: number;
  expired: boolean;
} {
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, expired: true };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    expired: false,
  };
}
