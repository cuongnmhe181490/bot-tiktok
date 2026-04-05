import { Sparkles } from "lucide-react";
import { GlassPanel } from "@/components/glass-panel";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <GlassPanel className="flex flex-col items-start gap-4 rounded-[2rem] p-6 sm:p-8">
      <span className="glass-soft inline-flex size-12 items-center justify-center rounded-2xl">
        <Sparkles className="size-5 text-primary" />
      </span>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p>{description}</p>
      </div>
      {actionLabel && onAction ? <Button onClick={onAction}>{actionLabel}</Button> : null}
    </GlassPanel>
  );
}
