import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getDataSettings, getScoringSettings } from "@/features/settings/service";
import { DataSettingsForm } from "@/features/settings/ui/data-settings-form";
import { SeedResetDialog } from "@/features/settings/ui/seed-reset-dialog";
import { ScoringSettingsForm } from "@/features/settings/ui/scoring-settings-form";
import { GlassPanel } from "@/components/glass-panel";
import { SectionHeader } from "@/components/section-header";
import { TagChip } from "@/components/tag-chip";

export const metadata: Metadata = buildMetadata(
  "Cài đặt | Kính Affiliate Studio",
  "Thiết lập scoring engine, giao diện, dữ liệu mẫu, import/export và quy tắc nội dung cho Kính Affiliate Studio.",
  "/settings",
);

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [settings, dataSettings] = await Promise.all([getScoringSettings(), getDataSettings()]);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Cài đặt"
        title="Control center của hệ thống"
        description="Khu này tập trung các thiết lập có tác động trực tiếp đến workflow: cách chấm điểm, cách vận hành dữ liệu mẫu và các nguyên tắc giữ chất lượng nội dung."
      />

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <GlassPanel className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Chế độ dữ liệu</h2>
              <p className="text-sm text-muted-foreground">
                Hệ thống này chỉ dùng nguồn miễn phí và dữ liệu nội bộ: TikTok Creative Center nhập tay, Google Trends, CSV nội bộ, manual entry và dữ liệu demo.
              </p>
            </div>
            <DataSettingsForm
              initialValues={{
                freeOnlyMode: dataSettings.freeOnlyMode,
                showDemoData: dataSettings.showDemoData,
              }}
            />
          </GlassPanel>

          <GlassPanel id="scoring" className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Trọng số chấm điểm</h2>
              <p className="text-sm text-muted-foreground">
                Điều chỉnh cách hệ thống ưu tiên độ dễ quay, mức cạnh tranh, độ bão hòa, sức hấp dẫn của offer và phần trăm hoa hồng.
              </p>
            </div>
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

          <GlassPanel className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Giao diện</h2>
            <div className="flex flex-wrap gap-2">
              <TagChip>Liquid Glass tiết chế</TagChip>
              <TagChip tone="info">Nền sáng trung tính</TagChip>
              <TagChip tone="warning">Dark mode tuỳ chọn</TagChip>
            </div>
            <p className="text-sm text-muted-foreground">
              Mục tiêu thị giác là yên tĩnh, rõ và có chiều sâu nhẹ. Chất lượng cảm nhận đến từ hierarchy và spacing nhiều hơn là hiệu ứng.
            </p>
          </GlassPanel>

          <GlassPanel className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Quy tắc nội dung</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                Giữ hook ngắn, đủ rõ nghĩa và không hứa hẹn quá mức.
              </p>
              <p className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                Mỗi video chỉ nên có một CTA mềm để tránh loãng nhịp chốt.
              </p>
              <p className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                Với nội dung dễ bão hòa, ưu tiên đổi góc nhìn thay vì chỉ đổi câu chữ.
              </p>
            </div>
          </GlassPanel>
        </div>

        <div className="space-y-4">
          <GlassPanel className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Dữ liệu mẫu</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>- 20 sản phẩm</li>
              <li>- 15 trend</li>
              <li>- 20 lịch sử kịch bản</li>
              <li>- 20 draft project</li>
              <li>- 100 bản ghi analytics</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Bộ seed này đủ dày để toàn app nhìn giống một studio đang vận hành, không phải một dashboard placeholder.
            </p>
          </GlassPanel>

          <GlassPanel className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Import / Export</h2>
            <p className="text-sm text-muted-foreground">
              Dùng các mẫu CSV để nhập trend từ Google Trends hoặc chuẩn hóa import nội bộ. Bản đầu không phụ thuộc API trả phí hay connector bên ngoài.
            </p>
            <div className="flex flex-wrap gap-2">
              <TagChip tone="info">Google Trends CSV</TagChip>
              <TagChip>Manual Entry</TagChip>
              <TagChip tone="warning">Creative Center quick import</TagChip>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href="/api/trends/template?kind=google"
                className="inline-flex rounded-full bg-white/60 px-4 py-2 text-sm text-foreground transition hover:bg-white/80 dark:bg-white/8 dark:hover:bg-white/12"
              >
                Tải mẫu CSV Google Trends
              </a>
              <a
                href="/api/trends/template?kind=creative"
                className="inline-flex rounded-full bg-white/60 px-4 py-2 text-sm text-foreground transition hover:bg-white/80 dark:bg-white/8 dark:hover:bg-white/12"
              >
                Tải mẫu CSV Creative Center
              </a>
            </div>
          </GlassPanel>

          <GlassPanel className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Quy tắc validation</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>- Tên sản phẩm: 3-120 ký tự</li>
              <li>- Mô tả ngắn: 10-300 ký tự</li>
              <li>- Note nội bộ: tối đa 1000 ký tự</li>
              <li>- Chặn text rỗng nghĩa, ký tự lặp rác, URL sai, enum nguồn sai và file CSV lỗi cơ bản</li>
            </ul>
          </GlassPanel>

          <GlassPanel className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Reset dữ liệu mẫu</h2>
            <p className="text-sm text-muted-foreground">
              Nếu cần đưa local về trạng thái sạch, hãy chạy lại seed script. Đây là cách an toàn nhất để giữ schema và dữ liệu mẫu đồng bộ.
            </p>
            <SeedResetDialog />
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
