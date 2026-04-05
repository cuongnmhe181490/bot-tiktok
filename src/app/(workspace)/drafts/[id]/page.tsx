import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getDraftProjectById } from "@/features/drafts/service";
import { GlassPanel } from "@/components/glass-panel";
import { SectionHeader } from "@/components/section-header";

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

  return (
    <div className="space-y-6">
      <SectionHeader title={project.title} description={project.productName} eyebrow="Bundle xuất dựng" />
      <div className="grid gap-4 xl:grid-cols-2">
        {[
          ["Split script", project.splitScript],
          ["Timestamp gợi ý", project.suggestedTiming],
          ["Cảnh quay", project.sceneSuggestions],
          ["Overlay text", project.overlayTexts],
          ["Checklist quay", project.shootingChecklist],
          ["Checklist dựng", project.editingChecklist],
          ["script.txt", project.scriptTxt],
          ["subtitle.srt", project.subtitleSrt],
          ["shotlist.md", project.shotlistMd],
          ["metadata.json", project.metadataJson],
        ].map(([title, content]) => (
          <GlassPanel key={title} className="space-y-3">
            <h2 className="text-lg font-semibold">{title}</h2>
            <pre className="whitespace-pre-wrap text-sm text-muted-foreground">{content}</pre>
          </GlassPanel>
        ))}
      </div>
    </div>
  );
}
