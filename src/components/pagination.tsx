import Link from "next/link";
import { Button } from "@/components/ui/button";

type PaginationProps = {
  prevHref?: string;
  nextHref?: string;
};

export function Pagination({ prevHref, nextHref }: PaginationProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Button asChild variant="outline" disabled={!prevHref}>
        <Link href={prevHref ?? "#"} aria-disabled={!prevHref}>
          Trang trước
        </Link>
      </Button>
      <Button asChild variant="outline" disabled={!nextHref}>
        <Link href={nextHref ?? "#"} aria-disabled={!nextHref}>
          Trang sau
        </Link>
      </Button>
    </div>
  );
}
