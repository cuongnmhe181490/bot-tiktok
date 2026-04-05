"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Clapperboard,
  FileText,
  Home,
  LineChart,
  PackageSearch,
  Settings,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "/dashboard": Home,
  "/research/products": PackageSearch,
  "/research/trends": TrendingUp,
  "/scripts": Sparkles,
  "/drafts": Clapperboard,
  "/analytics": BarChart3,
  "/reports": LineChart,
  "/settings": Settings,
};

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="glass-panel hidden h-[calc(100vh-2rem)] w-[300px] shrink-0 flex-col justify-between rounded-[2rem] p-5 lg:flex">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="glass-soft inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="size-3.5" />
            Liquid Glass workspace
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">{siteConfig.name}</p>
            <p className="text-sm">Một nơi để nghiên cứu, viết, dựng và theo dõi content affiliate.</p>
          </div>
        </div>

        <nav className="space-y-1.5">
          {siteConfig.nav.map((item) => {
            const Icon = iconMap[item.href] ?? FileText;
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between rounded-2xl px-3.5 py-3 text-sm transition-all duration-200",
                  active
                    ? "glass-soft text-foreground"
                    : "text-muted-foreground hover:bg-white/50 hover:text-foreground dark:hover:bg-white/8",
                )}
              >
                <span className="flex items-center gap-3">
                  <Icon className="size-4.5" />
                  {item.label}
                </span>
                <span className="text-[10px] uppercase tracking-[0.18em] opacity-60">
                  {active ? "đang mở" : ""}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="glass-soft rounded-2xl p-4">
        <p className="text-sm font-medium text-foreground">Nhịp làm việc hôm nay</p>
        <p className="mt-1 text-sm">
          Ưu tiên xem top sản phẩm, tinh chỉnh hook đang thắng và chốt shot list ngắn cho
          bản re-test.
        </p>
      </div>
    </aside>
  );
}
