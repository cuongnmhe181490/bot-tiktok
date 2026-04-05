import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getVideoById, listVideoPerformance } from "@/features/analytics/service";
import { getVideoStatusLabel } from "@/lib/labels";
import { DataTrustBadges } from "@/components/data-trust-badges";
import { GlassPanel } from "@/components/glass-panel";
import { KPIBlock } from "@/components/kpi-block";
import { ProvenancePanel } from "@/components/provenance-panel";
import { SectionHeader } from "@/components/section-header";
import { TagChip } from "@/components/tag-chip";

type VideoDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: VideoDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const video = await getVideoById(id);
  return buildMetadata(
    video ? `${video.title} | Video analytics` : "Chi tiết video",
    video?.hook ?? "Chi tiết video affiliate.",
    `/analytics/videos/${id}`,
  );
}

function getVideoTone(status: string) {
  if (status === "THANG") return "success" as const;
  if (status === "KHONG_HIEU_QUA") return "danger" as const;
  if (status === "TAM_DUNG") return "warning" as const;
  return "info" as const;
}

export const dynamic = "force-dynamic";

export default async function VideoDetailPage({
  params,
}: VideoDetailPageProps) {
  const { id } = await params;
  const [video, videos] = await Promise.all([getVideoById(id), listVideoPerformance()]);
  if (!video) notFound();

  const medianViews = Math.round(videos.reduce((sum, item) => sum + item.views, 0) / videos.length);
  const medianCommission = Math.round(
    videos.reduce((sum, item) => sum + item.commission, 0) / videos.length,
  );
  const winner =
    video.commission >= medianCommission && video.ctr >= 2 ? "Có tín hiệu thắng" : "Chưa đủ mạnh";
  const hypothesis =
    video.completionRate >= 40
      ? "Retention ổn, nhiều khả năng hook và nhịp dựng đang hợp người xem."
      : "Retention chưa đủ tốt, có thể phần mở đầu hoặc chuyển cảnh chưa đủ chặt.";
  const retest =
    video.status === "KHONG_HIEU_QUA"
      ? "Giữ sản phẩm, thay hook mở đầu và rút bớt 1-2 câu trong phần thân video."
      : "Có thể thử thêm một format mới nhưng giữ nguyên product-angle đang hiệu quả.";

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Chi tiết video"
        title={video.title}
        description={`${video.product.name} · ${new Intl.DateTimeFormat("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(video.publishedAt)} · ${video.format}`}
      />

      <div className="flex flex-wrap gap-2">
        <TagChip tone={getVideoTone(video.status)}>{getVideoStatusLabel(video.status)}</TagChip>
        <TagChip>{video.productGroup}</TagChip>
        <TagChip tone="info">{winner}</TagChip>
        <DataTrustBadges
          source={video.source}
          sourceType={video.sourceType}
          confidenceLevel={video.confidenceLevel}
          verificationStatus={video.verificationStatus}
          isDemo={video.isDemo}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KPIBlock label="Views" value={video.views.toLocaleString("vi-VN")} delta={`median ${medianViews.toLocaleString("vi-VN")}`} />
        <KPIBlock label="CTR" value={`${video.ctr}%`} delta={`${video.clicks.toLocaleString("vi-VN")} click`} />
        <KPIBlock label="Orders" value={String(video.orders)} delta={`${Math.round(video.revenue).toLocaleString("vi-VN")}đ doanh thu`} />
        <KPIBlock
          label="Commission"
          value={`${Math.round(video.commission).toLocaleString("vi-VN")}đ`}
          delta={`median ${medianCommission.toLocaleString("vi-VN")}đ`}
          tone="positive"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <GlassPanel className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Tóm tắt video</h2>
            <div className="grid gap-3">
              {[
                ["Sản phẩm", video.product.name],
                ["Hook", video.hook],
                ["Góc nhìn", video.angle],
                ["Format", video.format],
                ["Caption", video.captionType],
                ["CTA", video.ctaType],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
                  <p className="mt-1 text-sm text-foreground">{value}</p>
                </div>
              ))}
            </div>
          </GlassPanel>

          <ProvenancePanel
            source={video.source}
            sourceType={video.sourceType}
            collectedAt={video.collectedAt}
            importedAt={video.importedAt}
            lastVerifiedAt={video.lastVerifiedAt}
            confidenceLevel={video.confidenceLevel}
            verificationStatus={video.verificationStatus}
            isDemo={video.isDemo}
            externalReferenceUrl={video.externalReferenceUrl}
            notes={video.notes}
            title="Nguồn dữ liệu"
          />

          <GlassPanel className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Winner / loser flags</h2>
            <div className="space-y-3">
              <div className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                <p className="text-sm text-foreground">
                  {video.views >= medianViews
                    ? "Lượt xem đang cao hơn mặt bằng dữ liệu."
                    : "Lượt xem đang thấp hơn mặt bằng dữ liệu."}
                </p>
              </div>
              <div className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                <p className="text-sm text-foreground">
                  {video.commission >= medianCommission
                    ? "Commission đủ tốt để giữ lại làm mẫu tham chiếu."
                    : "Commission chưa đủ mạnh để xem là bản thắng."}
                </p>
              </div>
            </div>
          </GlassPanel>
        </div>

        <div className="space-y-4">
          <GlassPanel className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Giả thuyết vì sao thắng hoặc thua</h2>
            <div className="space-y-3">
              <p className="rounded-2xl bg-white/55 p-4 text-sm text-foreground dark:bg-white/6">
                {hypothesis}
              </p>
              <p className="rounded-2xl bg-white/55 p-4 text-sm text-foreground dark:bg-white/6">
                {video.avgWatchTime >= 8
                  ? "Watch time đủ khỏe để thử tăng CTA ở cuối mà không phá retention."
                  : "Watch time còn ngắn, nên ưu tiên cắt phần thân video trước khi đổi CTA."}
              </p>
            </div>
          </GlassPanel>

          <GlassPanel className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Đề xuất re-test</h2>
            <p className="rounded-2xl bg-white/55 p-4 text-sm text-foreground dark:bg-white/6">
              {retest}
            </p>
          </GlassPanel>

          <GlassPanel className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Creator note</h2>
            <p className="rounded-2xl bg-white/55 p-4 text-sm text-foreground dark:bg-white/6">
              {video.note ?? "Chưa có ghi chú riêng. Nên bổ sung note sau mỗi vòng đăng để giữ lịch sử quyết định rõ ràng."}
            </p>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
