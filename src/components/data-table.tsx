import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GlassPanel } from "@/components/glass-panel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type DataTableColumn<T> = {
  key: string;
  header: string;
  className?: string;
  render: (item: T, index: number) => React.ReactNode;
};

type DataTableProps<T> = {
  data: T[];
  columns: DataTableColumn<T>[];
  getKey: (item: T) => string;
  rowHref?: (item: T) => string;
  mobileTitle?: (item: T) => React.ReactNode;
};

export function DataTable<T>({
  data,
  columns,
  getKey,
  rowHref,
  mobileTitle,
}: DataTableProps<T>) {
  return (
    <GlassPanel className="overflow-hidden p-0">
      <div className="space-y-3 p-3 md:hidden">
        {data.map((item, index) => (
          <div key={getKey(item)} className="rounded-2xl bg-white/60 p-4 dark:bg-white/6">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                {mobileTitle ? (
                  mobileTitle(item)
                ) : (
                  <p className="font-medium text-foreground">{columns[0]?.render(item, index)}</p>
                )}
              </div>
              {rowHref ? (
                <Link
                  className="inline-flex items-center justify-end text-sm text-primary"
                  href={rowHref(item)}
                >
                  <ArrowRight className="size-4" />
                </Link>
              ) : null}
            </div>
            <div className="space-y-2">
              {columns.slice(1).map((column) => (
                <div key={column.key} className="flex items-start justify-between gap-3 text-sm">
                  <span className="shrink-0 text-muted-foreground">{column.header}</span>
                  <div className="min-w-0 text-right text-foreground">{column.render(item, index)}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto">
        <Table className="hidden md:table">
          <TableHeader>
            <TableRow className="border-white/40">
              {columns.map((column) => (
                <TableHead key={column.key} className={cn("h-12", column.className)}>
                  {column.header}
                </TableHead>
              ))}
              {rowHref ? <TableHead className="w-14 text-right">Chi tiết</TableHead> : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={getKey(item)} className="border-white/35">
                {columns.map((column) => (
                  <TableCell key={column.key} className={column.className}>
                    {column.render(item, index)}
                  </TableCell>
                ))}
                {rowHref ? (
                  <TableCell className="text-right">
                    <Link
                      className="inline-flex items-center justify-end text-sm text-primary"
                      href={rowHref(item)}
                    >
                      <ArrowRight className="size-4" />
                    </Link>
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </GlassPanel>
  );
}
