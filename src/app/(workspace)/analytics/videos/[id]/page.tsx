import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getVideoById } from "@/features/analytics/service";
import { GlassPanel } from "@/components/glass-panel";
import { KPIBlock } from "@/components/kpi-block";
import { SectionHeader } from "@/components/section-header";

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

export const dynamic = "force-dynamic";

export default async function VideoDetailPage({
  params,
}: VideoDetailPageProps) {
  const { id } = await params;
  const video = await getVideoById(id);
  if (!video) notFound();

  return (
    <div className="space-y-6">
      <SectionHeader title={video.title} description={video.product.name} eyebrow="Chi tiết video" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KPIBlock label="Views" value={video.views.toLocaleString("vi-VN")} />
        <KPIBlock label="CTR" value={`${video.ctr}%`} />
        <KPIBlock label="Orders" value={String(video.orders)} />
        <KPIBlock label="Commission" value={`${Math.round(video.commission).toLocaleString("vi-VN")}đ`} tone="positive" />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <GlassPanel className="space-y-3">
          <h2 className="text-lg font-semibold">Khung nội dung</h2>
          <p><span className="font-medium text-foreground">Hook:</span> {video.hook}</p>
          <p><span className="font-medium text-foreground">Angle:</span> {video.angle}</p>
          <p><span className="font-medium text-foreground">Format:</span> {video.format}</p>
          <p><span className="font-medium text-foreground">Caption type:</span> {video.captionType}</p>
          <p><span className="font-medium text-foreground">CTA type:</span> {video.ctaType}</p>
        </GlassPanel>
        <GlassPanel className="space-y-3">
          <h2 className="text-lg font-semibold">Ghi chú vận hành</h2>
          <p>{video.note ?? "Chưa có ghi chú."}</p>
          <p><span className="font-medium text-foreground">Doanh thu:</span> {Math.round(video.revenue).toLocaleString("vi-VN")}đ</p>
          <p><span className="font-medium text-foreground">Avg watch time:</span> {video.avgWatchTime}s</p>
          <p><span className="font-medium text-foreground">Completion rate:</span> {video.completionRate}%</p>
        </GlassPanel>
      </div>
    </div>
  );
}
