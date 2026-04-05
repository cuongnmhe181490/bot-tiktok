import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getScoringSettings } from "@/features/settings/service";
import { ScoringSettingsForm } from "@/features/settings/ui/scoring-settings-form";
import { GlassPanel } from "@/components/glass-panel";
import { SectionHeader } from "@/components/section-header";
import { TagChip } from "@/components/tag-chip";

export const metadata: Metadata = buildMetadata(
  "Cài đặt | Kính Affiliate Studio",
  "Thiết lập scoring engine, giao diện, dữ liệu mẫu, import/export và ghi chú validation cho Kính Affiliate Studio.",
  "/settings",
);

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getScoringSettings();

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Cài đặt"
        title="Thiết lập hệ thống"
        description="Chia theo nhóm rõ ràng để khu này thực sự dùng được: scoring engine, giao diện, dữ liệu mẫu, import/export và ghi chú validation."
      />

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <GlassPanel id="scoring" className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Trọng số scoring engine</h2>
              <p className="text-sm text-muted-foreground">
                Thay đổi trực tiếp các trọng số đang dùng để tính điểm sản phẩm. Form này đã có parse lại bằng Zod ở server.
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
              <TagChip tone="warning">Dark mode tùy chọn</TagChip>
            </div>
            <p className="text-sm text-muted-foreground">
              Chủ đích giao diện là cao cấp nhưng yên tĩnh. Không thêm quá nhiều accent, không biến dashboard thành admin template dày đặc.
            </p>
          </GlassPanel>
        </div>

        <div className="space-y-4">
          <GlassPanel className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Dữ liệu mẫu</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>- 20 sản phẩm seed</li>
              <li>- 15 trend seed</li>
              <li>- 20 script history</li>
              <li>- 20 draft projects</li>
              <li>- 100 analytics records</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Dùng cho local và cũng làm fallback an toàn cho production khi SQLite trên serverless không duy trì bền vững.
            </p>
          </GlassPanel>

          <GlassPanel className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Import / export</h2>
            <p className="text-sm text-muted-foreground">
              CSV export đã có ở khu sản phẩm. Kiến trúc route handlers giữ sẵn chỗ để mở rộng import/export cho analytics và reports.
            </p>
          </GlassPanel>

          <GlassPanel className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Cấu hình nhãn trạng thái</h2>
            <p className="text-sm text-muted-foreground">
              Trạng thái hiện được chuẩn hóa theo enum ở schema để giữ toàn hệ thống nhất quán: sản phẩm, script, draft và video.
            </p>
          </GlassPanel>

          <GlassPanel className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Giới hạn mặc định và validation notes</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>- Tên sản phẩm: 3-120 ký tự</li>
              <li>- Mô tả ngắn: 10-300 ký tự</li>
              <li>- Note nội bộ: tối đa 1000 ký tự</li>
              <li>- Chặn text vô nghĩa, ký tự lặp rác, URL sai format và số âm không hợp lệ</li>
            </ul>
          </GlassPanel>

          <GlassPanel className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Reset demo data</h2>
            <p className="text-sm text-muted-foreground">
              Với bản SQLite local, hãy dùng lại script seed khi cần reset dữ liệu. Trên Vercel production hiện dùng chế độ fallback đọc dữ liệu để tránh crash.
            </p>
            <TagChip tone="warning">Cần confirm dialog ở bước tiếp theo nếu bật reset trực tiếp</TagChip>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
