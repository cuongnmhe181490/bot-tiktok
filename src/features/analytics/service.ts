import { VideoStatus } from "@prisma/client";
import { getDb } from "@/server/db";
import type { VideoPerformanceInput } from "@/features/analytics/schema";

export async function listVideoPerformance() {
  return getDb().videoPerformance.findMany({
    include: {
      product: true,
    },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getVideoById(id: string) {
  return getDb().videoPerformance.findUnique({
    where: { id },
    include: {
      product: true,
    },
  });
}

export async function createVideoPerformance(input: VideoPerformanceInput) {
  return getDb().videoPerformance.create({
    data: {
      title: input.title,
      productId: input.productId,
      productGroup: input.productGroup,
      publishedAt: input.publishedAt,
      videoUrl: input.videoUrl,
      hook: input.hook,
      angle: input.angle,
      format: input.format,
      durationSeconds: input.durationSeconds,
      captionType: input.captionType,
      ctaType: input.ctaType,
      note: input.note ?? null,
      views: input.views,
      avgWatchTime: input.avgWatchTime,
      completionRate: input.completionRate,
      clicks: input.clicks,
      ctr: input.ctr,
      orders: input.orders,
      revenue: input.revenue,
      commission: input.commission,
      status: input.status,
    },
  });
}

export async function getAnalyticsOverview() {
  const videos = await listVideoPerformance();
  const totalViews = videos.reduce((sum, item) => sum + item.views, 0);
  const totalCommission = videos.reduce((sum, item) => sum + item.commission, 0);
  const winners = videos.filter((item) => item.status === VideoStatus.THANG);
  const losers = videos.filter((item) => item.status === VideoStatus.KHONG_HIEU_QUA);

  const topHooks = Object.entries(
    videos.reduce<Record<string, number>>((acc, item) => {
      acc[item.hook] = (acc[item.hook] ?? 0) + item.views;
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([label, value]) => ({ label, value }));

  return {
    videos,
    totalViews,
    totalCommission,
    winners,
    losers,
    topHooks,
  };
}
