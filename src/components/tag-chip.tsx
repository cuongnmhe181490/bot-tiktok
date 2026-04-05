import { cn } from "@/lib/utils";

export function TagChip({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "success" | "warning" | "danger" | "info";
}) {
  const toneClass =
    tone === "success"
      ? "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-500/12 dark:text-emerald-200"
      : tone === "warning"
        ? "bg-amber-100/80 text-amber-700 dark:bg-amber-500/12 dark:text-amber-200"
        : tone === "danger"
          ? "bg-rose-100/80 text-rose-700 dark:bg-rose-500/12 dark:text-rose-200"
          : tone === "info"
            ? "bg-sky-100/80 text-sky-700 dark:bg-sky-500/12 dark:text-sky-200"
            : "bg-slate-100/80 text-slate-700 dark:bg-white/10 dark:text-slate-200";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        toneClass,
      )}
    >
      {children}
    </span>
  );
}
