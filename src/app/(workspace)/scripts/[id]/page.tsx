import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getScriptDraftById } from "@/features/scripts/service";
import { GlassPanel } from "@/components/glass-panel";
import { SectionHeader } from "@/components/section-header";

type ScriptDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: ScriptDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const draft = await getScriptDraftById(id);
  return buildMetadata(
    draft ? `${draft.title} | Kịch bản` : "Chi tiết kịch bản",
    draft?.subtitleReady ?? "Chi tiết bộ kịch bản.",
    `/scripts/${id}`,
  );
}

export const dynamic = "force-dynamic";

export default async function ScriptDetailPage({
  params,
}: ScriptDetailPageProps) {
  const { id } = await params;
  const draft = await getScriptDraftById(id);
  if (!draft) notFound();

  return (
    <div className="space-y-6">
      <SectionHeader title={draft.title} description={draft.product.name} eyebrow="Chi tiết kịch bản" />
      <div className="grid gap-4 xl:grid-cols-2">
        {[
          ["10 hook", draft.hooks],
          ["5 angle", draft.angles],
          ["Voice-over", draft.voiceOvers],
          ["Shot list", draft.shotLists],
          ["Caption", draft.captions],
          ["CTA mềm", draft.ctas],
          ["Teleprompter", draft.teleprompter],
          ["Subtitle-ready", draft.subtitleReady],
          ["Safety check", draft.safetyCheck],
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
