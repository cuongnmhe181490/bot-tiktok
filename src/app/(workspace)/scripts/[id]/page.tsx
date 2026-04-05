import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getGoalLabel, getToneLabel } from "@/lib/labels";
import { getScriptDraftById } from "@/features/scripts/service";
import { CopyTextButton } from "@/components/copy-text-button";
import { GlassPanel } from "@/components/glass-panel";
import { SectionHeader } from "@/components/section-header";
import { TagChip } from "@/components/tag-chip";

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

  const blocks = [
    { title: "10 hook", content: draft.hooks },
    { title: "5 angle", content: draft.angles },
    { title: "3 script voice-over", content: draft.voiceOvers },
    { title: "3 shot list", content: draft.shotLists },
    { title: "5 caption", content: draft.captions },
    { title: "5 CTA mềm", content: draft.ctas },
    { title: "Bản teleprompter", content: draft.teleprompter },
    { title: "Bản subtitle-ready", content: draft.subtitleReady },
    { title: "Safety check", content: draft.safetyCheck },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Chi tiết kịch bản"
        title={draft.title}
        description={`${draft.product.name} · ${draft.durationSeconds} giây · ${getGoalLabel(draft.goal)}`}
      />

      <div className="flex flex-wrap gap-2">
        <TagChip tone={draft.bestVersion ? "success" : "info"}>
          {draft.bestVersion ? "Bản giữ lại" : "Bản đang theo dõi"}
        </TagChip>
        <TagChip>{getToneLabel(draft.tone)}</TagChip>
        <TagChip tone="info">{getGoalLabel(draft.goal)}</TagChip>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <GlassPanel className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Tóm tắt ngữ cảnh</h2>
            <div className="grid gap-3">
              {[
                ["Sản phẩm", draft.product.name],
                ["Đối tượng", draft.audience],
                ["Tone", getToneLabel(draft.tone)],
                ["Mục tiêu", getGoalLabel(draft.goal)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
                  <p className="mt-1 text-sm text-foreground">{value}</p>
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Pain points và điểm mạnh</h2>
            <div className="space-y-3">
              <div className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                <p className="text-sm font-medium text-foreground">Pain points</p>
                <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{draft.painPoints}</p>
              </div>
              <div className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                <p className="text-sm font-medium text-foreground">Điểm mạnh</p>
                <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{draft.strengths}</p>
              </div>
              {draft.notes ? (
                <div className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                  <p className="text-sm font-medium text-foreground">Ghi chú thêm</p>
                  <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{draft.notes}</p>
                </div>
              ) : null}
            </div>
          </GlassPanel>

          <GlassPanel className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Version notes</h2>
            <div className="space-y-3">
              <div className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                <p className="text-sm text-foreground">
                  Bản này phù hợp khi bạn cần thử nhanh nhiều hook nhưng vẫn giữ một trục nội dung rõ.
                </p>
              </div>
              <div className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                <p className="text-sm text-foreground">
                  Nếu video đi vào batch quay, hãy ưu tiên khóa một hook, một angle và một CTA mềm thay vì bê nguyên toàn bộ output.
                </p>
              </div>
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
