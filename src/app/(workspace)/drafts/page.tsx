import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { listDraftProjects } from "@/features/drafts/service";
import { DraftProjectForm } from "@/features/drafts/ui/draft-project-form";
import { DataTable } from "@/components/data-table";
import { GlassPanel } from "@/components/glass-panel";
import { SectionHeader } from "@/components/section-header";

export const metadata: Metadata = buildMetadata(
  "Video nháp | Kính Affiliate Studio",
  "Chuẩn bị shot list, subtitle package, checklist quay và metadata bundle cho video affiliate.",
  "/drafts",
);

export const dynamic = "force-dynamic";

export default async function DraftsPage() {
  const projects = await listDraftProjects();

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Module 3"
        title="Dự án video nháp"
        description="Biến raw script thành gói dựng có cấu trúc, đủ sạch để handed-off cho editor hoặc dùng ngay trong batch quay."
      />
      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <GlassPanel className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold">Tạo bundle mới</h2>
            <p>Nhập raw script, hệ thống sẽ chia câu, gợi ý cảnh và xuất ra bộ file phục vụ dựng.</p>
          </div>
          <DraftProjectForm />
        </GlassPanel>
        <DataTable
          data={projects}
          getKey={(item) => item.id}
          rowHref={(item) => `/drafts/${item.id}`}
          columns={[
            {
              key: "title",
              header: "Dự án",
              render: (item) => (
                <div>
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-xs">{item.productName}</p>
                </div>
              ),
            },
            {
              key: "updatedAt",
              header: "Cập nhật",
              render: (item) => (
                <span className="text-sm">
                  {new Intl.DateTimeFormat("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }).format(item.updatedAt)}
                </span>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
