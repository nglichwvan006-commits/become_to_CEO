import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow-sm",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow-sm",
        outline: "text-foreground",
        career: "border-transparent bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md",
        gold: "border-transparent bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 shadow-md",
        exp: "border-transparent bg-gradient-to-r from-emerald-500 to-green-400 text-white shadow-md",
        easy: "border-transparent bg-difficulty-easy/20 text-difficulty-easy",
        medium: "border-transparent bg-difficulty-medium/20 text-difficulty-medium",
        hard: "border-transparent bg-difficulty-hard/20 text-difficulty-hard",
        bronze: "border-transparent bg-rank-bronze/20 text-rank-bronze",
        silver: "border-transparent bg-rank-silver/20 text-rank-silver",
        goldRank: "border-transparent bg-rank-gold/20 text-rank-gold",
        platinum: "border-transparent bg-rank-platinum/20 text-rank-platinum",
        diamond: "border-transparent bg-rank-diamond/20 text-rank-diamond",
        master: "border-transparent bg-rank-master/20 text-rank-master",
        legend: "border-transparent bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-amber-950 shadow-lg animate-gradient",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
