import { SlidersHorizontal } from "lucide-react";
import { GlassPanel } from "@/components/glass-panel";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

type FilterBarProps = {
  children: React.ReactNode;
  mobileAction?: React.ReactNode;
  summary?: string;
  activeCount?: number;
};

export function FilterBar({
  children,
  mobileAction,
  summary = "Lọc nhanh để giữ màn hình gọn và dễ đọc.",
  activeCount = 0,
}: FilterBarProps) {
  return (
    <GlassPanel className="space-y-3 p-4">
      <div className="flex items-center justify-between gap-3 md:hidden">
        <div>
          <p className="text-sm font-medium text-foreground">Bộ lọc</p>
          <p className="text-xs leading-5 text-muted-foreground">{summary}</p>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            {mobileAction ?? (
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="size-4" />
                Lọc{activeCount > 0 ? ` (${activeCount})` : ""}
              </Button>
            )}
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-[1.75rem] border-none px-0 pb-0">
            <SheetHeader className="px-4 pt-4">
              <SheetTitle>Bộ lọc</SheetTitle>
              <SheetDescription>{summary}</SheetDescription>
            </SheetHeader>
            <div className="grid gap-3 px-4 pb-5 pt-2">{children}</div>
          </SheetContent>
        </Sheet>
      </div>
      <div className="hidden gap-3 md:grid md:grid-cols-4">{children}</div>
    </GlassPanel>
  );
}
