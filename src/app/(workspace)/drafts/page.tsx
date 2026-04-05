import Link from "next/link";
import type { Metadata } from "next";
import { Download, FolderKanban } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { listDraftProjects } from "@/features/drafts/service";
import { DraftProjectForm } from "@/features/drafts/ui/draft-project-form";
import { DataTable } from "@/components/data-table";
import { GlassPanel } from "@/components/glass-panel";
import { SectionHeader } from "@/components/section-header";
import { TagChip } from "@/components/tag-chip";

export const metadata: Metadata = buildMetadata(
  "Video nháp | Kính Affiliate Studio",
  "Project manager cho khâu quay dựng affiliate: raw script, subtitle-ready text, shot list, checklist và export bundle.",
  "/drafts",
);

export const dynamic = "force-dynamic";

function draftStatus(index: number) {
  const variants = [
    { label: "Mới", tone: "info" as const },
    { label: "Đang quay", tone: "warning" as const },
    { label: "Đang dựng", tone: "default" as const },
    { label: "Đã đăng", tone: "success" as const },
    { label: "Cần tối ưu", tone: "danger" as const },
  ];
  return variants[index % variants.length]!;
}

export default async function DraftsPage() {
  const projects = await listDraftProjects();
  const featuredProject = projects[0];

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Module 3"
        title="Dự án video nháp"
        description="Màn này đóng vai trò project manager cho khâu quay dựng. Mỗi draft cần đủ raw script, subtitle-ready text, timestamp suggestion, shot list, overlay text và checklist trước khi handed-off."
      />

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <GlassPanel id="new-bundle" className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Tạo bundle mới</h2>
            <p className="text-sm text-muted-foreground">
              Nhập raw script, hệ thống sẽ chia câu, gợi ý timestamp, gợi ý cảnh quay và sinh bundle export.
            </p>
          </div>
          <DraftProjectForm />
        </GlassPanel>

        {featuredProject ? (
          <GlassPanel className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="glass-soft rounded-2xl p-2.5 text-muted-foreground">
                <FolderKanban className="size-4" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Preview panel</h2>
                <p className="text-sm text-muted-foreground">
                  Xem nhanh cấu trúc bundle trước khi mở chi tiết project.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-foreground">{featuredProject.title}</p>
                  <p className="text-sm text-muted-foreground">{featuredProject.productName}</p>
                </div>
                <TagChip tone="warning">đang quay</TagChip>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {[
                ["Raw script", featuredProject.rawScript],
                ["Subtitle-ready text", featuredProject.splitScript],
                ["Timestamp suggestion", featuredProject.suggestedTiming],
                ["Shot list", featuredProject.sceneSuggestions],
                ["Overlay text", featuredProject.overlayTexts],
                ["Checklist quay", featuredProject.shootingChecklist],
                ["Checklist dựng", featuredProject.editingChecklist],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  <p className="mt-3 line-clamp-5 whitespace-pre-line text-sm text-muted-foreground">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
              <p className="text-sm font-medium text-foreground">Export bundle</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["script.txt", "subtitle.srt", "shotlist.md", "checklist.md", "metadata.json"].map(
                  (item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-xs text-foreground dark:bg-white/10"
                    >
                      <Download className="size-3.5" />
                      {item}
                    </span>
                  ),
                )}
              </div>
            </div>
          </GlassPanel>
        ) : null}
      </div>

      <GlassPanel className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Danh sách draft projects</h2>
          <p className="text-sm text-muted-foreground">
            Mỗi project có route detail riêng để mở bundle đầy đủ và xuất file theo nhu cầu.
          </p>
        </div>

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
                  <Link href={`/drafts/${item.id}`} className="font-medium text-foreground">
                    {item.title}
                  </Link>
                  <p className="text-xs">{item.productName}</p>
                </div>
              ),
            },
            {
              key: "status",
              header: "Trạng thái",
              render: (_, index) => {
                const meta = draftStatus(index);
                return <TagChip tone={meta.tone}>{meta.label}</TagChip>;
              },
            },
            {
              key: "script",
              header: "Raw script",
              render: (item) => (
                <span className="line-clamp-2 text-sm text-muted-foreground">{item.rawScript}</span>
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
      </GlassPanel>
    </div>
  );
}
