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
  render: (item: T) => React.ReactNode;
};

type DataTableProps<T> = {
  data: T[];
  columns: DataTableColumn<T>[];
  getKey: (item: T) => string;
  rowHref?: (item: T) => string;
};

export function DataTable<T>({
  data,
  columns,
  getKey,
  rowHref,
}: DataTableProps<T>) {
  return (
    <GlassPanel className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <Table>
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
            {data.map((item) => (
              <TableRow key={getKey(item)} className="border-white/35">
                {columns.map((column) => (
                  <TableCell key={column.key} className={column.className}>
                    {column.render(item)}
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
