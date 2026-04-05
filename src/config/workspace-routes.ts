import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Clapperboard,
  FileText,
  Home,
  PackageSearch,
  Settings,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export type WorkspaceRouteContext = {
  href: string;
  label: string;
  shortLabel: string;
  description: string;
  searchPlaceholder: string;
  ctaLabel: string;
  ctaHref: string;
  sidebarTitle: string;
  sidebarDescription: string;
  breadcrumbs: string[];
  icon: LucideIcon;
};

export const workspaceRouteContexts: WorkspaceRouteContext[] = [
  {
    href: "/dashboard",
    label: "Tổng quan vận hành",
    shortLabel: "Tổng quan",
    description: "Nhìn nhanh KPI, việc đang chờ và nội dung cần xử lý trong một nhịp làm việc.",
    searchPlaceholder: "Tìm sản phẩm, hook, video cần xử lý...",
    ctaLabel: "Xem việc ưu tiên",
    ctaHref: "/dashboard",
    sidebarTitle: "Nhịp hôm nay",
    sidebarDescription:
      "Ưu tiên xem KPI lệch nhịp, chốt sản phẩm cần test và đẩy tiếp các video đang có dấu hiệu thắng.",
    breadcrumbs: ["Workspace", "Tổng quan"],
    icon: Home,
  },
  {
    href: "/research/products",
    label: "Trung tâm nghiên cứu sản phẩm",
    shortLabel: "Sản phẩm",
    description: "Lọc cơ hội affiliate theo score, offer, hoa hồng và độ dễ quay để ra quyết định test.",
    searchPlaceholder: "Tìm tên sản phẩm, shop, ngành hàng...",
    ctaLabel: "Thêm sản phẩm",
    ctaHref: "/research/products#quick-add",
    sidebarTitle: "Cách dùng khu này",
    sidebarDescription:
      "Đọc score trước, nhìn breakdown sau, rồi mới quyết định sản phẩm nào nên vào batch test tiếp theo.",
    breadcrumbs: ["Workspace", "Nghiên cứu", "Sản phẩm"],
    icon: PackageSearch,
  },
  {
    href: "/research/trends",
    label: "Radar xu hướng",
    shortLabel: "Xu hướng",
    description: "Theo dõi format, hook và góc quay đang lên để ghép đúng sản phẩm vào đúng thời điểm.",
    searchPlaceholder: "Tìm trend, niche, dạng hook...",
    ctaLabel: "Thêm trend",
    ctaHref: "/research/trends#quick-add",
    sidebarTitle: "Nhìn trend đúng cách",
    sidebarDescription:
      "Độ nóng cao chưa đủ. Luôn nhìn thêm độ dễ áp dụng và độ bão hòa trước khi ghép vào kế hoạch quay.",
    breadcrumbs: ["Workspace", "Nghiên cứu", "Xu hướng"],
    icon: TrendingUp,
  },
  {
    href: "/scripts",
    label: "Workspace tạo kịch bản",
    shortLabel: "Kịch bản",
    description: "Đi từ insight sản phẩm sang hook, angle, VO, caption và bản teleprompter có thể dùng ngay.",
    searchPlaceholder: "Tìm script, template, hook thắng...",
    ctaLabel: "Tạo script mới",
    ctaHref: "/scripts#generator",
    sidebarTitle: "Gợi ý nhịp làm việc",
    sidebarDescription:
      "Bắt đầu từ pain point thật, giữ angle rõ và chỉ chốt một CTA mềm cho mỗi video.",
    breadcrumbs: ["Workspace", "Tạo kịch bản"],
    icon: Sparkles,
  },
  {
    href: "/drafts",
    label: "Dự án video nháp",
    shortLabel: "Video nháp",
    description: "Chuẩn hóa gói quay dựng gồm shot list, subtitle-ready text, checklist và bundle export.",
    searchPlaceholder: "Tìm project nháp, tên sản phẩm, trạng thái...",
    ctaLabel: "Tạo bundle mới",
    ctaHref: "/drafts#new-bundle",
    sidebarTitle: "Đích của màn này",
    sidebarDescription:
      "Mỗi project nên đủ sạch để editor nhận là dựng được ngay, không phải hỏi lại bối cảnh.",
    breadcrumbs: ["Workspace", "Video nháp"],
    icon: Clapperboard,
  },
  {
    href: "/analytics",
    label: "Analytics nội dung",
    shortLabel: "Analytics",
    description: "Đọc hiệu suất theo thời gian, sản phẩm, hook, angle và format để biết nên scale hay re-test.",
    searchPlaceholder: "Tìm video, hook, angle, format...",
    ctaLabel: "Xem video records",
    ctaHref: "/analytics/videos",
    sidebarTitle: "Đọc số cho đúng",
    sidebarDescription:
      "Đừng nhìn views đơn lẻ. CTR, completion và commission mới cho biết video có thật sự đáng giữ.",
    breadcrumbs: ["Workspace", "Hiệu suất nội dung"],
    icon: BarChart3,
  },
  {
    href: "/reports",
    label: "Báo cáo quyết định",
    shortLabel: "Báo cáo",
    description: "Tóm tắt ngày, tuần, tháng và gom khuyến nghị để ra quyết định nhanh hơn.",
    searchPlaceholder: "Tìm top video, nhóm báo cáo, ghi chú...",
    ctaLabel: "Xem báo cáo tuần",
    ctaHref: "/reports#weekly-report",
    sidebarTitle: "Mục đích chính",
    sidebarDescription:
      "Báo cáo tốt phải dẫn đến hành động rõ: giữ, scale, dừng hoặc re-test bằng giả thuyết mới.",
    breadcrumbs: ["Workspace", "Báo cáo"],
    icon: FileText,
  },
  {
    href: "/settings",
    label: "Thiết lập hệ thống",
    shortLabel: "Cài đặt",
    description: "Quản lý scoring engine, trạng thái, import/export và chế độ demo để app vận hành ổn định.",
    searchPlaceholder: "Tìm cài đặt, trọng số, import/export...",
    ctaLabel: "Tinh chỉnh trọng số",
    ctaHref: "/settings#scoring",
    sidebarTitle: "Giữ app gọn và chắc",
    sidebarDescription:
      "Chỉ chỉnh những thiết lập ảnh hưởng trực tiếp đến workflow. Tránh biến cài đặt thành nơi chất đống tùy chọn.",
    breadcrumbs: ["Workspace", "Cài đặt"],
    icon: Settings,
  },
];

export function getWorkspaceRouteContext(pathname: string) {
  const matched =
    workspaceRouteContexts.find((item) =>
      item.href === "/dashboard"
        ? pathname === item.href
        : pathname === item.href || pathname.startsWith(`${item.href}/`),
    ) ?? workspaceRouteContexts[0]!;

  return matched!;
}

export const sidebarNavItems = [
  { href: "/dashboard", label: "Tổng quan", icon: Home },
  { href: "/research/products", label: "Nghiên cứu sản phẩm", icon: PackageSearch },
  { href: "/research/trends", label: "Xu hướng", icon: TrendingUp },
  { href: "/scripts", label: "Tạo kịch bản", icon: Sparkles },
  { href: "/drafts", label: "Dự án video nháp", icon: Clapperboard },
  { href: "/analytics", label: "Hiệu suất nội dung", icon: BarChart3 },
  { href: "/reports", label: "Báo cáo", icon: FileText },
  { href: "/settings", label: "Cài đặt", icon: Settings },
] as const;
