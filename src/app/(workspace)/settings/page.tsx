import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getScoringSettings } from "@/features/settings/service";
import { ScoringSettingsForm } from "@/features/settings/ui/scoring-settings-form";
import { GlassPanel } from "@/components/glass-panel";
import { SectionHeader } from "@/components/section-header";

export const metadata: Metadata = buildMetadata(
  "Cài đặt | Kính Affiliate Studio",
  "Tùy chỉnh trọng số scoring engine và chuẩn bị kiến trúc cho connector tương lai.",
  "/settings",
);

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getScoringSettings();

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Cài đặt"
        title="Tinh chỉnh scoring engine"
        description="Bản MVP đang chạy single-user mode, nhưng cấu trúc đã tách đủ để thêm connector và auth sau này."
      />
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <GlassPanel className="space-y-4">
          <h2 className="text-lg font-semibold">Nguyên tắc hiện tại</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>- Không tin dữ liệu từ client, mọi form đều parse lại bằng Zod trên server.</li>
            <li>- SQLite cho local nhanh, Prisma schema giữ đường nâng cấp lên Postgres.</li>
            <li>- Connector TikTok chưa bật ở bản đầu nhưng navigation và services đã tách riêng.</li>
          </ul>
        </GlassPanel>
        <GlassPanel className="space-y-5">
          <h2 className="text-lg font-semibold">Trọng số scoring</h2>
          <ScoringSettingsForm
            initialValues={{
              easeWeight: settings.easeWeight,
              competitionWeight: settings.competitionWeight,
              saturationWeight: settings.saturationWeight,
              offerWeight: settings.offerWeight,
              commissionWeight: settings.commissionWeight,
            }}
          />
        </GlassPanel>
      </div>
    </div>
  );
}
