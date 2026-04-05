import { VideoStatus } from "@prisma/client";
import { z } from "zod";
import {
  boundedNumber,
  optionalText,
  safeDate,
  strictUrl,
  trimmedText,
} from "@/lib/validation";

export const videoPerformanceSchema = z.object({
  title: trimmedText("Tiêu đề", 3, 160),
  productId: trimmedText("Sản phẩm", 3, 80),
  productGroup: trimmedText("Nhóm sản phẩm", 2, 120),
  publishedAt: safeDate("Ngày đăng"),
  videoUrl: strictUrl("URL video"),
  hook: trimmedText("Hook", 3, 220, true),
  angle: trimmedText("Angle", 3, 220, true),
  format: trimmedText("Format", 2, 80),
  durationSeconds: boundedNumber("Thời lượng", 5, 300, false),
  captionType: trimmedText("Caption type", 2, 80),
  ctaType: trimmedText("CTA type", 2, 80),
  note: optionalText("Ghi chú", 600, true),
  views: boundedNumber("Views", 0, 999_999_999, false),
  avgWatchTime: boundedNumber("Avg watch time", 0, 600),
  completionRate: boundedNumber("Completion rate", 0, 100),
  clicks: boundedNumber("Clicks", 0, 999_999_999, false),
  ctr: boundedNumber("CTR", 0, 100),
  orders: boundedNumber("Orders", 0, 999_999, false),
  revenue: boundedNumber("Doanh thu", 0, 999_999_999),
  commission: boundedNumber("Commission", 0, 999_999_999),
  status: z.nativeEnum(VideoStatus, {
    message: "Trạng thái video không hợp lệ.",
  }),
});

export type VideoPerformanceInput = z.infer<typeof videoPerformanceSchema>;
