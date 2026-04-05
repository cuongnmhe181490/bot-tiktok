export const siteConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME ?? "Kinh Affiliate Studio",
  description:
    "Nền tảng tiếng Việt để nghiên cứu sản phẩm affiliate, tạo kịch bản hàng loạt, chuẩn bị gói dựng video và theo dõi hiệu suất nội dung.",
  shortDescription:
    "Nghiên cứu, viết kịch bản, chuẩn bị dựng và theo dõi hiệu suất content affiliate trong một hệ thống gọn, sáng và dễ mở rộng.",
  keywords: [
    "affiliate TikTok",
    "nghiên cứu sản phẩm affiliate",
    "tạo kịch bản video",
    "dashboard content affiliate",
    "shot list video",
    "subtitle package",
  ],
  nav: [
    { href: "/dashboard", label: "Tổng quan" },
    { href: "/research/products", label: "Nghiên cứu sản phẩm" },
    { href: "/research/trends", label: "Xu hướng" },
    { href: "/scripts", label: "Tạo kịch bản" },
    { href: "/drafts", label: "Dự án video nháp" },
    { href: "/analytics", label: "Hiệu suất nội dung" },
    { href: "/reports", label: "Báo cáo" },
    { href: "/settings", label: "Cài đặt" },
  ],
} as const;

export const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
