import { GlassPanel } from "@/components/glass-panel";

type ChartCardProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
};

export function ChartCard({
  title,
  description,
  action,
  children,
}: ChartCardProps) {
  return (
    <GlassPanel className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {description ? <p className="text-sm">{description}</p> : null}
        </div>
        {action}
      </div>
      <div className="h-[280px] w-full">{children}</div>
    </GlassPanel>
  );
}
