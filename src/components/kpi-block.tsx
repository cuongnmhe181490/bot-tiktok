import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { GlassPanel } from "@/components/glass-panel";
import { cn } from "@/lib/utils";

type KPIBlockProps = {
  label: string;
  value: string;
  delta?: string;
  tone?: "neutral" | "positive" | "warning" | "danger";
};

const toneClassMap = {
  neutral: "text-muted-foreground",
  positive: "text-emerald-700 dark:text-emerald-300",
  warning: "text-amber-700 dark:text-amber-300",
  danger: "text-rose-700 dark:text-rose-300",
};

export function KPIBlock({
  label,
  value,
  delta,
  tone = "neutral",
}: KPIBlockProps) {
  const Icon =
    tone === "positive" ? ArrowUpRight : tone === "danger" ? ArrowDownRight : Minus;

  return (
    <GlassPanel className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="font-mono text-2xl font-semibold text-foreground sm:text-3xl">
            {value}
          </p>
        </div>
        {delta ? (
          <span
            className={cn(
              "glass-soft inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
              toneClassMap[tone],
            )}
          >
            <Icon className="size-3.5" />
            {delta}
          </span>
        ) : null}
      </div>
    </GlassPanel>
  );
}
