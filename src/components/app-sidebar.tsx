"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getWorkspaceRouteContext, sidebarNavItems } from "@/config/workspace-routes";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();
  const context = getWorkspaceRouteContext(pathname);

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
            <p className="text-sm">
              Một nơi để nghiên cứu, viết, dựng và theo dõi content affiliate.
            </p>
          </div>
        </div>

        <nav className="space-y-1.5">
          {sidebarNavItems.map((item) => {
            const Icon = item.icon;
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
        <p className="text-sm font-medium text-foreground">{context.sidebarTitle}</p>
        <p className="mt-1 text-sm">{context.sidebarDescription}</p>
      </div>
    </aside>
  );
}
