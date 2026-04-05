import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, CircleAlert, NotebookText, Sparkles } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { getProductById } from "@/features/research/products/service";
import { getProductStatusLabel } from "@/lib/labels";
import { DataTrustBadges } from "@/components/data-trust-badges";
import { GlassPanel } from "@/components/glass-panel";
import { KPIBlock } from "@/components/kpi-block";
import { ProvenancePanel } from "@/components/provenance-panel";
import { SectionHeader } from "@/components/section-header";
import { TagChip } from "@/components/tag-chip";
import { Button } from "@/components/ui/button";

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  return buildMetadata(
    product ? `${product.name} | Nghiên cứu sản phẩm` : "Chi tiết sản phẩm",
    product?.shortDescription ?? "Chi tiết sản phẩm trong module nghiên cứu.",
    `/research/products/${id}`,
  );
}

function getStatusTone(status: string) {
  if (status === "THANG") return "success" as const;
  if (status === "DANG_TEST") return "warning" as const;
  if (status === "LOAI_BO") return "danger" as const;
  if (status === "MOI") return "info" as const;
  return "default" as const;
}

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  const scoreReasons = product.scoreBreakdown.split("\n");
  const painPoints = [
    "Người xem đang thấy nhiều lựa chọn giống nhau và khó chốt nhanh.",
    "Cần một video gọn, nhìn là hiểu công dụng chính.",
    "Muốn thấy lý do mua thật thay vì lời hứa quá tay.",
  ];
  const audiences = [
    "Người mua lần đầu, ưu tiên quyết định nhanh.",
    "Nhóm thích đồ gọn, dễ dùng, ít phải học cách dùng.",
    "Người xem có xu hướng phản hồi tốt với demo thực tế.",
  ];
  const angles = [
    `So sánh nhanh ${product.name.toLowerCase()} với lựa chọn cùng tầm giá.`,
    "Mở bằng lỗi dùng sai hoặc nỗi khó chịu quen thuộc.",
    "Tập trung vào một lợi ích rõ nhất và một CTA mềm.",
  ];
  const riskNotes = [
    product.competitionLevel >= 7 ? "Cạnh tranh khá cao, không nên dùng hook quá chung." : "Cạnh tranh ở mức chấp nhận được, còn cửa để thử nhiều góc mở đầu.",
    product.saturationLevel >= 7 ? "Dễ bị bão hòa nếu dựng giống mặt bằng thị trường." : "Độ bão hòa chưa quá nặng, vẫn còn chỗ cho POV và demo thật.",
    product.rating < 4.5 ? "Cần xử lý kỹ phần note rủi ro trong caption hoặc lời nói." : "Rating ổn, phù hợp với video review ngắn thiên về trải nghiệm.",
  ];

  const history = [
    {
      title: "Nhập sản phẩm vào radar nghiên cứu",
      note: `${new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(product.importedAt)} · ${product.source}`,
    },
    {
      title: "Điểm tổng đã được tính lại",
      note: `Score hiện tại ${product.totalScore}/100 dựa trên offer, độ dễ quay, cạnh tranh và bão hòa.`,
    },
    {
      title: "Đề xuất hành động",
      note:
        product.status === "DANG_TEST"
          ? "Giữ trong batch test hiện tại và đưa sang màn script."
          : product.status === "THANG"
            ? "Có thể scale thêm angle hoặc format."
            : "Nên xem lại cách mở đầu hoặc trạng thái của sản phẩm.",
    },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Phân tích sản phẩm"
        title={product.name}
        description={product.shortDescription}
        action={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href={`/scripts?productId=${product.id}`}>Tạo script từ sản phẩm này</Link>
            </Button>
            <Button asChild>
              <Link href="/research/products">Quay lại danh sách</Link>
            </Button>
          </div>
        }
      />

      <div className="flex flex-wrap gap-2">
        <TagChip tone={getStatusTone(product.status)}>{getProductStatusLabel(product.status)}</TagChip>
        <TagChip tone="info">{product.category}</TagChip>
        <TagChip tone="success">Score {product.totalScore}/100</TagChip>
        <TagChip>{product.shopName}</TagChip>
        <DataTrustBadges
          source={product.source}
          sourceType={product.sourceType}
          confidenceLevel={product.confidenceLevel}
          verificationStatus={product.verificationStatus}
          isDemo={product.isDemo}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KPIBlock
          label="Giá sale"
          value={`${Math.round(product.salePrice).toLocaleString("vi-VN")}đ`}
          delta={`-${product.discountPercent}%`}
          tone="warning"
        />
        <KPIBlock
          label="Hoa hồng ước tính"
          value={`${Math.round(product.estimatedCommission).toLocaleString("vi-VN")}đ`}
          delta={`${product.commissionPercent}%`}
          tone="positive"
        />
        <KPIBlock
          label="Rating"
          value={product.rating.toFixed(1)}
          delta={`${product.reviewCount.toLocaleString("vi-VN")} đánh giá`}
        />
        <KPIBlock
          label="Ngày nhập"
          value={new Intl.DateTimeFormat("vi-VN", {
            day: "2-digit",
            month: "2-digit",
          }).format(product.importedAt)}
          delta={product.source}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <GlassPanel className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Vì sao điểm đang ở mức này</h2>
            <div className="flex flex-wrap gap-2">
              <TagChip tone="warning">Gợi ý nội bộ</TagChip>
              <TagChip>Không phải dữ liệu từ nền tảng</TagChip>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {scoreReasons.map((item) => (
                <div key={item} className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                  <p className="text-sm text-foreground">{item}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Điểm này đủ để bạn đọc rất nhanh xem nên giữ sản phẩm cho batch test, chỉ quan sát thêm hay loại sớm.
            </p>
          </GlassPanel>

          <GlassPanel className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Pain points phù hợp</h2>
            <div className="space-y-3">
              {painPoints.map((item) => (
                <div key={item} className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                  <p className="text-sm text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Góc nội dung nên thử</h2>
            <div className="flex flex-wrap gap-2">
              <TagChip tone="warning">Gợi ý nội bộ</TagChip>
            </div>
            <div className="space-y-3">
              {angles.map((item) => (
                <div key={item} className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                  <p className="text-sm text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Timeline ghi chú</h2>
            <div className="space-y-3">
              {history.map((item) => (
                <div key={item.title} className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.note}</p>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>

        <div className="space-y-4">
          <GlassPanel className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="glass-soft rounded-2xl p-2.5 text-muted-foreground">
                <Sparkles className="size-4" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Insight ngắn gọn</h2>
                <p className="text-sm text-muted-foreground">
                  Nếu chỉ có 15 giây để quyết, đây là cách nên đọc sản phẩm này.
                </p>
              </div>
            </div>
            <p className="rounded-2xl bg-white/55 p-4 text-sm leading-6 text-foreground dark:bg-white/6">
              {product.totalScore >= 75
                ? "Đây là ứng viên đủ đẹp để đẩy thẳng sang khâu viết script. Offer rõ, score đủ tốt và dễ tìm góc quay ngắn."
                : "Sản phẩm này chưa hẳn yếu, nhưng cần chọn đúng pain point và hook mở đầu. Không nên bước vào batch quay nếu chưa chốt được góc nhìn rõ."}
            </p>
          </GlassPanel>

          <ProvenancePanel
            source={product.source}
            sourceType={product.sourceType}
            collectedAt={product.collectedAt}
            importedAt={product.importedAt}
            lastVerifiedAt={product.lastVerifiedAt}
            confidenceLevel={product.confidenceLevel}
            verificationStatus={product.verificationStatus}
            isDemo={product.isDemo}
            externalReferenceUrl={product.externalReferenceUrl}
            notes={product.notes}
            title="Dữ liệu tham chiếu"
          />

          <GlassPanel className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Đối tượng phù hợp</h2>
            <div className="space-y-3">
              {audiences.map((item) => (
                <div key={item} className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                  <p className="text-sm text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="glass-soft rounded-2xl p-2.5 text-muted-foreground">
                <CircleAlert className="size-4" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Risk notes</h2>
                <p className="text-sm text-muted-foreground">
                  Những điểm cần giữ tỉnh táo trước khi đẩy sang batch lớn.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {riskNotes.map((item) => (
                <div key={item} className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                  <p className="text-sm text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="glass-soft rounded-2xl p-2.5 text-muted-foreground">
                <NotebookText className="size-4" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Quick actions</h2>
                <p className="text-sm text-muted-foreground">
                  Chuyển tiếp sang hành động phù hợp mà không phải quay lại menu.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <Link
                href={`/scripts?productId=${product.id}`}
                className="flex items-center justify-between rounded-2xl bg-white/55 p-4 transition hover:bg-white/70 dark:bg-white/6 dark:hover:bg-white/10"
              >
                <div>
                  <p className="font-medium text-foreground">Tạo script từ sản phẩm này</p>
                  <p className="text-sm text-muted-foreground">Giữ nguyên bối cảnh sản phẩm để sang khu nội dung.</p>
                </div>
                <ArrowRight className="size-4 text-muted-foreground" />
              </Link>
              <div className="rounded-2xl bg-white/55 p-4 dark:bg-white/6">
                <p className="font-medium text-foreground">Trạng thái hiện tại</p>
                <p className="text-sm text-muted-foreground">
                  {getProductStatusLabel(product.status)} · Có thể đổi ở màn danh sách hoặc API chỉnh sửa sau.
                </p>
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
