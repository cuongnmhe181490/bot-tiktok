import { SlidersHorizontal } from "lucide-react";
import { GlassPanel } from "@/components/glass-panel";
import { Button } from "@/components/ui/button";

type FilterBarProps = {
  children: React.ReactNode;
  mobileAction?: React.ReactNode;
};

export function FilterBar({ children, mobileAction }: FilterBarProps) {
  return (
    <GlassPanel className="space-y-3 p-4">
      <div className="flex items-center justify-between gap-3 sm:hidden">
        <div>
          <p className="text-sm font-medium text-foreground">Bộ lọc nhanh</p>
          <p className="text-xs text-muted-foreground">Rút gọn để thao tác nhanh trên mobile</p>
        </div>
        {mobileAction ?? (
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="size-4" />
            Bộ lọc
          </Button>
        )}
      </div>
      <div className="grid gap-3 md:grid-cols-4">{children}</div>
    </GlassPanel>
  );
}
