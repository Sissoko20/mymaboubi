"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  variant?: "default" | "primary" | "accent" | "warning";
  delay?: number;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  variant = "default",
  delay = 0,
}: StatCardProps) {
  const variantStyles = {
    default: "bg-card border border-border",
    primary: "gradient-primary text-primary-foreground border-0",
    accent: "gradient-accent text-accent-foreground border-0",
    warning: "gradient-warm text-foreground border-0",
  };

  const iconBgStyles = {
    default: "bg-secondary text-primary",
    primary: "bg-primary-foreground/20 text-primary-foreground",
    accent: "bg-accent-foreground/20 text-accent-foreground",
    warning: "bg-foreground/10 text-foreground",
  };

  return (
    <div
      className={cn(
        "rounded-xl p-5 shadow-card transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 animate-fade-in",
        variantStyles[variant]
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className={cn(
            "text-sm font-medium",
            variant === "default" ? "text-muted-foreground" : "opacity-80"
          )}>
            {title}
          </p>
          <p className="text-2xl font-bold font-display tracking-tight">
            {typeof value === "number" ? value.toLocaleString("fr-FR") : value}
          </p>
          {subtitle && (
            <p className={cn(
              "text-xs",
              variant === "default" ? "text-muted-foreground" : "opacity-70"
            )}>
              {subtitle}
            </p>
          )}
        </div>
        <div className={cn("p-2.5 rounded-lg", iconBgStyles[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {trend && trendValue && (
        <div className="mt-3 flex items-center gap-1.5">
          <span className={cn(
            "text-xs font-medium px-1.5 py-0.5 rounded",
            trend === "up" && "bg-chart-strong/20 text-chart-strong",
            trend === "down" && "bg-destructive/20 text-destructive",
            trend === "neutral" && "bg-secondary text-muted-foreground"
          )}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
          </span>
        </div>
      )}
    </div>
  );
}
