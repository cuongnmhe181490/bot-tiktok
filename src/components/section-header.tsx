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
        "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="space-y-1.5">
        {eyebrow ? (
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground sm:text-xs">
            {eyebrow}
          </p>
        ) : null}
        <div className="space-y-1">
          <h1 className="text-[1.65rem] font-semibold leading-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          {description ? <p className="max-w-2xl">{description}</p> : null}
        </div>
      </div>
      {action ? <div className="shrink-0 self-start sm:self-auto">{action}</div> : null}
    </div>
  );
}
