import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { listProducts } from "@/features/research/products/service";
import { listScriptDrafts, listScriptTemplates } from "@/features/scripts/service";
import { ScriptGeneratorForm } from "@/features/scripts/ui/script-generator-form";
import { DataTable } from "@/components/data-table";
import { GlassPanel } from "@/components/glass-panel";
import { SectionHeader } from "@/components/section-header";
import { TagChip } from "@/components/tag-chip";

export const metadata: Metadata = buildMetadata(
  "Tạo kịch bản | Kính Affiliate Studio",
  "Sinh hook, angle, voice-over, shot list và phiên bản teleprompter từ dữ liệu sản phẩm.",
  "/scripts",
);

export const dynamic = "force-dynamic";

export default async function ScriptsPage() {
  const [products, templates, drafts] = await Promise.all([
    listProducts(),
    listScriptTemplates(),
    listScriptDrafts(),
  ]);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Module 2"
        title="Tạo script video hàng loạt"
        description="Đi từ dữ liệu sản phẩm đến bộ kịch bản có thể dùng ngay cho quay, teleprompter hoặc subtitle."
      />
      <div className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <GlassPanel className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold">Generator</h2>
            <p>Tạo gói nội dung hoàn chỉnh gồm hook, angle, voice-over, shot list, caption và safety check.</p>
          </div>
          <ScriptGeneratorForm products={products} templates={templates} />
        </GlassPanel>
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
              render: (item) => <TagChip>{item.tone.replaceAll("_", " ")}</TagChip>,
            },
            {
              key: "goal",
              header: "Mục tiêu",
              render: (item) => <span className="text-sm">{item.goal.replaceAll("_", " ")}</span>,
            },
          ]}
        />
      </div>
    </div>
  );
}
