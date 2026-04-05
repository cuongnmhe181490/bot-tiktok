import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getDraftProjectById } from "@/features/drafts/service";
import { CopyTextButton } from "@/components/copy-text-button";
import { GlassPanel } from "@/components/glass-panel";
import { SectionHeader } from "@/components/section-header";
import { TagChip } from "@/components/tag-chip";

type DraftDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: DraftDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getDraftProjectById(id);
  return buildMetadata(
    project ? `${project.title} | Video nháp` : "Chi tiết video nháp",
    project?.rawScript ?? "Chi tiết project video nháp.",
    `/drafts/${id}`,
  );
}

export const dynamic = "force-dynamic";

export default async function DraftDetailPage({
  params,
}: DraftDetailPageProps) {
  const { id } = await params;
  const project = await getDraftProjectById(id);
  if (!project) notFound();

  const blocks = [
    { title: "Raw script", content: project.rawScript },
    { title: "Subtitle package", content: project.subtitleSrt },
    { title: "Timestamp gợi ý", content: project.suggestedTiming },
    { title: "Shot plan", content: project.sceneSuggestions },
    { title: "Overlay text", content: project.overlayTexts },
    { title: "Checklist quay", content: project.shootingChecklist },
    { title: "Checklist dựng", content: project.editingChecklist },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Chi tiết project nháp"
        title={project.title}
        description={`${project.productName} · bundle dựng đã được chuẩn hóa để giao tiếp mượt hơn với editor.`}
      />

      <div className="flex flex-wrap gap-2">
        <TagChip tone="warning">Đang quay</TagChip>
        <TagChip tone="info">Có subtitle package</TagChip>
        <TagChip>Xuất được 5 file</TagChip>
        <TagChip tone="warning">Gợi ý nội bộ</TagChip>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <GlassPanel className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Production note</h2>
            <div className="space-y-3">
              <p className="rounded-2xl bg-white/55 p-4 text-sm text-foreground dark:bg-white/6">
                Project này đã đủ cấu trúc để giao sang khâu quay và dựng, nhưng nên giữ một người chịu trách nhiệm khóa câu mở đầu cuối cùng trước khi bấm máy.
              </p>
              <p className="rounded-2xl bg-white/55 p-4 text-sm text-foreground dark:bg-white/6">
                Nếu cần rút ngắn thời lượng, hãy cắt ở shot phụ trước, không cắt phần thiết lập pain point hoặc CTA mềm.
              </p>
            </div>
          </GlassPanel>

          <GlassPanel className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Next step recommendation</h2>
            <TagChip tone="warning">Gợi ý nội bộ</TagChip>
            <div className="space-y-3">
              {[
                "Khóa shot mở đầu và góc quay chính trước khi chuyển script cho người quay.",
                "Đọc lại subtitle package trên điện thoại để kiểm tra nhịp và độ dễ đọc.",
                "Giữ checklist dựng đi cùng bundle để tránh thiếu overlay và CTA ở cuối video.",
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                  <p className="text-sm text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Export bundle</h2>
            <div className="space-y-3">
              {[
                ["script.txt", project.scriptTxt],
                ["subtitle.srt", project.subtitleSrt],
                ["shotlist.md", project.shotlistMd],
                ["checklist.md", project.checklistMd],
                ["metadata.json", project.metadataJson],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-foreground">{label}</p>
                    <CopyTextButton value={String(value)} />
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {blocks.map((item) => (
            <GlassPanel key={item.title} className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-foreground">{item.title}</h2>
                <CopyTextButton value={item.content} />
              </div>
              <pre className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                {item.content}
              </pre>
            </GlassPanel>
          ))}
        </div>
      </div>
    </div>
  );
}
