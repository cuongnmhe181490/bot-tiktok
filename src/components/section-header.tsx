import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="space-y-2">
        {eyebrow ? (
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">{title}</h1>
          {description ? <p className="max-w-2xl">{description}</p> : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
