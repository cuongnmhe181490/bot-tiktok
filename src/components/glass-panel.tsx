import * as React from "react";
import { cn } from "@/lib/utils";

export function GlassPanel({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "glass-panel specular-line rounded-3xl p-5 sm:p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
