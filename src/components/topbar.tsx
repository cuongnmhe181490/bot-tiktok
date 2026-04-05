"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MoonStar, Search, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AppSidebar } from "@/components/app-sidebar";

export function Topbar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();

  const activeLabel =
    siteConfig.nav.find((item) => pathname === item.href || pathname.startsWith(item.href))
      ?.label ?? "Tổng quan";

  return (
    <div className="glass-panel sticky top-3 z-40 rounded-[1.75rem] px-4 py-3">
      <div className="flex items-center gap-3">
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
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Workspace
          </p>
          <p className="truncate text-base font-semibold text-foreground">{activeLabel}</p>
        </div>

        <div className="hidden max-w-xs flex-1 md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-10 rounded-full border-white/40 bg-white/55 pl-9 backdrop-blur-md dark:bg-white/8"
              placeholder="Tìm sản phẩm, trend, script..."
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
          <Link href="/scripts">Tạo kịch bản mới</Link>
        </Button>
      </div>
    </div>
  );
}
