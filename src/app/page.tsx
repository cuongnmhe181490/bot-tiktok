import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BarChart3, Clapperboard, PackageSearch, Sparkles } from "lucide-react";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { GlassPanel } from "@/components/glass-panel";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = buildMetadata(
  `${siteConfig.name} | Nghiên cứu và vận hành content affiliate`,
  siteConfig.shortDescription,
  "/",
);

const modules = [
  {
    title: "Nghiên cứu sản phẩm và trend",
    description:
      "Theo dõi sản phẩm đáng test, trend mới và chấm điểm nhanh theo trọng số của riêng bạn.",
    icon: PackageSearch,
  },
  {
    title: "Tạo script video hàng loạt",
    description:
      "Từ dữ liệu sản phẩm đến hook, angle, voice-over, teleprompter và bản subtitle-ready.",
    icon: Sparkles,
  },
  {
    title: "Chuẩn bị video nháp",
    description:
      "Tách câu, gợi ý timestamp, shot list, checklist và export bundle phục vụ dựng nhanh.",
    icon: Clapperboard,
  },
  {
    title: "Dashboard hiệu suất",
    description:
      "Nhìn ra hook thắng, angle thua, sản phẩm cần re-test và xu hướng doanh thu ngay trong một nhịp xem.",
    icon: BarChart3,
  },
];

export default function LandingPage() {
  return (
    <div className="mx-auto max-w-[1300px] px-4 py-4 sm:px-6 lg:px-8">
      <header className="glass-panel sticky top-4 z-40 rounded-[1.8rem] px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-foreground">{siteConfig.name}</p>
            <p className="text-xs">Studio điều phối content affiliate bằng tiếng Việt.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href="/dashboard">Xem workspace</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="grid min-h-[calc(100svh-7rem)] items-center gap-8 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:py-14">
        <div className="space-y-6">
          <div className="glass-soft inline-flex rounded-full px-3 py-1 text-xs tracking-[0.22em] text-muted-foreground uppercase">
            Quiet Liquid Glass for affiliate ops
          </div>
          <div className="space-y-4">
            <h1 className="max-w-4xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Một hệ thống gọn, sáng và đủ sâu để vận hành content affiliate hàng ngày.
            </h1>
            <p className="max-w-2xl text-base sm:text-lg">
              Nghiên cứu sản phẩm, chốt trend, viết kịch bản, chuẩn bị dựng và theo dõi
              hiệu suất trong một luồng làm việc liền mạch, dễ đọc và dễ mở rộng.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/dashboard">
                Mở dashboard
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/research/products">Xem module nghiên cứu</Link>
            </Button>
          </div>
        </div>

        <GlassPanel className="grid gap-4 rounded-[2rem] p-4 sm:p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {modules.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="glass-soft rounded-[1.4rem] p-4">
                  <span className="mb-4 inline-flex size-11 items-center justify-center rounded-2xl bg-white/70 dark:bg-white/8">
                    <Icon className="size-5 text-primary" />
                  </span>
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                  <p className="mt-2 text-sm">{item.description}</p>
                </div>
              );
            })}
          </div>
          <div className="glass-soft rounded-[1.4rem] p-5">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Quy trình làm việc
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              {["Chọn sản phẩm", "Chốt hook", "Xuất bundle dựng", "Theo dõi hiệu suất"].map(
                (step, index) => (
                  <div key={step} className="rounded-2xl bg-white/65 p-3 dark:bg-white/6">
                    <p className="text-xs text-muted-foreground">Bước {index + 1}</p>
                    <p className="mt-1 text-sm font-medium text-foreground">{step}</p>
                  </div>
                ),
              )}
            </div>
          </div>
        </GlassPanel>
      </section>

      <section className="grid gap-4 py-6 md:grid-cols-3">
        {[
          "Nội dung tiếng Việt tự nhiên, không rối, không kiểu admin template cũ.",
          "Form validation chặt cả client và server, ưu tiên an toàn dữ liệu ngay từ đầu.",
          "SQLite cho bản đầu nhưng cấu trúc đã tách theo feature, dễ nâng lên Postgres.",
        ].map((item) => (
          <GlassPanel key={item} className="p-5">
            <p className="text-sm text-foreground">{item}</p>
          </GlassPanel>
        ))}
      </section>

      <footer className="py-10 text-sm text-muted-foreground">
        <div className="flex flex-col gap-3 border-t border-white/45 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p>{siteConfig.name}. Bộ khung vận hành content affiliate bằng tiếng Việt.</p>
          <div className="flex gap-4">
            <Link href="/reports">Báo cáo</Link>
            <Link href="/settings">Cài đặt</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
