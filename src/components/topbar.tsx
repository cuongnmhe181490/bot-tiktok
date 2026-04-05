"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Menu, MoonStar, Search, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { getWorkspaceRouteContext } from "@/config/workspace-routes";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Topbar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const context = getWorkspaceRouteContext(pathname);
  const Icon = context.icon;

  return (
    <div className="glass-panel sticky top-3 z-40 rounded-[1.75rem] px-4 py-3">
      <div className="flex flex-wrap items-start gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon-sm" variant="outline" className="lg:hidden">
              <Menu className="size-4" />
              <span className="sr-only">Mở điều hướng</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="border-none bg-transparent p-3 shadow-none">
            <SheetHeader className="sr-only">
              <SheetTitle>Điều hướng chính</SheetTitle>
            </SheetHeader>
            <AppSidebar />
          </SheetContent>
        </Sheet>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            {context.breadcrumbs.map((item, index) => (
              <span key={`${item}-${index}`} className="inline-flex items-center gap-1">
                {index > 0 ? <ChevronRight className="size-3" /> : null}
                {item}
              </span>
            ))}
          </div>
          <div className="flex items-start gap-3">
            <span className="glass-soft hidden rounded-2xl p-2.5 text-muted-foreground sm:inline-flex">
              <Icon className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-foreground sm:text-lg">
                {context.label}
              </p>
              <p className="hidden max-w-2xl text-sm text-muted-foreground md:block">
                {context.description}
              </p>
            </div>
          </div>
        </div>

        <div className="hidden max-w-sm flex-1 md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-10 rounded-full border-white/40 bg-white/55 pl-9 backdrop-blur-md dark:bg-white/8"
              placeholder={context.searchPlaceholder}
              aria-label="Tìm kiếm nội dung"
            />
          </div>
        </div>

        <Button
          size="icon-sm"
          variant="outline"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          aria-label="Đổi chế độ sáng tối"
        >
          {resolvedTheme === "dark" ? (
            <SunMedium className="size-4" />
          ) : (
            <MoonStar className="size-4" />
          )}
        </Button>

        <Button asChild className="hidden sm:inline-flex">
          <Link href={context.ctaHref}>{context.ctaLabel}</Link>
        </Button>
      </div>
    </div>
  );
}
