import Link from "next/link";
import type { Metadata } from "next";
import { Copy, History, Library, WandSparkles } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { listProducts } from "@/features/research/products/service";
import { listScriptDrafts, listScriptTemplates } from "@/features/scripts/service";
import { ScriptGeneratorForm } from "@/features/scripts/ui/script-generator-form";
import { GlassPanel } from "@/components/glass-panel";
import { SectionHeader } from "@/components/section-header";
import { TagChip } from "@/components/tag-chip";
import { DataTable } from "@/components/data-table";

export const metadata: Metadata = buildMetadata(
  "Tạo kịch bản | Kính Affiliate Studio",
  "Workspace tạo kịch bản thật cho studio affiliate: form generate, thư viện template, lịch sử script và các block output có thể dùng ngay.",
  "/scripts",
);

export const dynamic = "force-dynamic";

function splitLines(value: string, limit = 4) {
  return value
    .split("\n")
    .map((line) => line.replace(/^\d+\.\s*/, "").trim())
    .filter(Boolean)
    .slice(0, limit);
}

function statusMeta(index: number) {
  const variants = [
    { label: "Mới", tone: "info" as const },
    { label: "Giữ lại", tone: "default" as const },
    { label: "Đã quay", tone: "warning" as const },
    { label: "Thắng", tone: "success" as const },
    { label: "Bỏ", tone: "danger" as const },
  ];
  return variants[index % variants.length]!;
}

export default async function ScriptsPage() {
  const [products, templates, drafts] = await Promise.all([
    listProducts(),
    listScriptTemplates(),
    listScriptDrafts(),
  ]);

  const featuredDraft = drafts[0];

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Module 2"
        title="Workspace tạo kịch bản"
        description="Từ dữ liệu sản phẩm đến hook, angle, voice-over, shot list, caption và bản teleprompter. Bố cục này ưu tiên làm việc thật, không còn là form đơn lẻ cạnh một table trống nghĩa."
      />

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <GlassPanel id="generator" className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Generator</h2>
            <p className="text-sm text-muted-foreground">
              Nhập đúng bối cảnh khách hàng, pain point, điểm mạnh và mục tiêu video. Kết quả tạo ra sẽ đủ hook, angle, caption, CTA, teleprompter và bản subtitle-ready.
            </p>
          </div>
          <ScriptGeneratorForm products={products} templates={templates} />
        </GlassPanel>

        <div className="space-y-4">
          <GlassPanel className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="glass-soft rounded-2xl p-2.5 text-muted-foreground">
                <Library className="size-4" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Thư viện template</h2>
                <p className="text-sm text-muted-foreground">
                  Template giúp giữ nhịp cấu trúc ổn định khi chạy theo batch.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {templates.map((item) => (
                <div key={item.id} className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-foreground">{item.name}</p>
                    <TagChip>{item.tone.replaceAll("_", " ").toLowerCase()}</TagChip>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                  <p className="mt-3 whitespace-pre-line text-xs text-muted-foreground">
                    {item.structure}
                  </p>
                </div>
              ))}
            </div>
          </GlassPanel>

          {featuredDraft ? (
            <GlassPanel className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="glass-soft rounded-2xl p-2.5 text-muted-foreground">
                  <WandSparkles className="size-4" />
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Bản generate gần nhất</h2>
                  <p className="text-sm text-muted-foreground">
                    Preview nhanh để kiểm tra chất lượng output trước khi mở chi tiết.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground">{featuredDraft.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {featuredDraft.product.name} · {featuredDraft.durationSeconds} giây
                    </p>
                  </div>
                  <TagChip tone="success">best version</TagChip>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {[
                  { title: "10 hook", value: featuredDraft.hooks },
                  { title: "5 angle", value: featuredDraft.angles },
                  { title: "3 script voice-over", value: featuredDraft.voiceOvers },
                  { title: "3 shot list", value: featuredDraft.shotLists },
                  { title: "5 caption", value: featuredDraft.captions },
                  { title: "5 CTA mềm", value: featuredDraft.ctas },
                  { title: "Teleprompter", value: featuredDraft.teleprompter },
                  { title: "Subtitle-ready", value: featuredDraft.subtitleReady },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Copy className="size-3.5" />
                        copy
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {splitLines(item.value, item.title === "Teleprompter" ? 3 : 4).map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                <p className="text-sm font-medium text-foreground">Safety check</p>
                <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {splitLines(featuredDraft.safetyCheck, 4).map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            </GlassPanel>
          ) : null}
        </div>
      </div>

      <GlassPanel className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="glass-soft rounded-2xl p-2.5 text-muted-foreground">
            <History className="size-4" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Lịch sử script đã tạo</h2>
            <p className="text-sm text-muted-foreground">
              Dùng để xem lại bản nào giữ lại, bản nào đã quay, bản nào nên bỏ.
            </p>
          </div>
        </div>

        <DataTable
          data={drafts}
          getKey={(item) => item.id}
          rowHref={(item) => `/scripts/${item.id}`}
          columns={[
            {
              key: "title",
              header: "Bộ kịch bản",
              render: (item) => (
                <div>
                  <Link href={`/scripts/${item.id}`} className="font-medium text-foreground">
                    {item.title}
                  </Link>
                  <p className="text-xs">{item.product.name}</p>
                </div>
              ),
            },
            {
              key: "tone",
              header: "Tone",
              render: (item) => <TagChip>{item.tone.replaceAll("_", " ").toLowerCase()}</TagChip>,
            },
            {
              key: "goal",
              header: "Mục tiêu",
              render: (item) => (
                <span className="text-sm">{item.goal.replaceAll("_", " ").toLowerCase()}</span>
              ),
            },
            {
              key: "status",
              header: "Trạng thái",
              render: (_, index) => {
                const meta = statusMeta(index);
                return <TagChip tone={meta.tone}>{meta.label}</TagChip>;
              },
            },
          ]}
        />
      </GlassPanel>
    </div>
  );
}
