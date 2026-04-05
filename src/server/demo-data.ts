import {
  GoalType,
  ProductStatus,
  ToneType,
  TrendType,
  VideoStatus,
  type DraftProject,
  type Product,
  type ScoringSettings,
  type ScriptDraft,
  type ScriptTemplate,
  type Trend,
  type VideoPerformance,
} from "@prisma/client";
import { buildDraftPackage } from "@/features/drafts/helpers";
import { computeProductScore } from "@/features/research/products/helpers";
import { generateScriptPackage } from "@/features/scripts/helpers";
import { slugify } from "@/lib/sanitize";

const categories = [
  "Đồ gia dụng",
  "Chăm sóc cá nhân",
  "Đồ bếp",
  "Mẹ và bé",
  "Thiết bị nhỏ",
  "Phụ kiện điện thoại",
];

const productNames = [
  "Máy xay mini cầm tay",
  "Kệ thoát nước gấp gọn",
  "Máy massage cổ vai",
  "Đèn ngủ cảm biến dịu mắt",
  "Giá đỡ điện thoại xoay 360",
  "Máy hút bụi bàn làm việc",
  "Hộp cơm điện mini",
  "Bộ dao bếp phủ chống dính",
  "Bình xịt dầu ăn đều tia",
  "Túi đựng mỹ phẩm chống nước",
  "Máy ép tỏi inox gọn nhẹ",
  "Kẹp tóc tạo phồng nhanh",
  "Gối tựa lưng memory foam",
  "Tấm lót bàn chống trượt",
  "Bộ cọ vệ sinh đa năng",
  "Máy tạo bọt sữa cầm tay",
  "Cân nhà bếp điện tử",
  "Giá treo nhà tắm không khoan",
  "Quạt bàn mini sạc USB",
  "Máy hâm cốc giữ nhiệt",
];

const trendNames = [
  "Mở đầu bằng cảnh dùng sai cách",
  "Cut nhanh trước - sau trong 2 giây",
  "Dùng âm thanh đời thường thay nhạc nền",
  "Góc quay trên mặt bàn sáng",
  "So sánh 3 lựa chọn trong cùng tầm giá",
  "Hook bằng câu hỏi trực diện",
  "Cảnh thật từ tay người dùng",
  "Format checklist siêu ngắn",
  "Nêu pain point trong 1 dòng subtitle",
  "Một câu chốt đáng mua ở đâu",
  "POV người mua lần đầu",
  "Mở clip bằng lỗi phổ biến",
  "Review kiểu đối chiếu ngân sách",
  "Góc quay close-up texture",
  "Caption tối giản một câu chính",
];

export const demoScoringSettings: ScoringSettings = {
  id: "demo-scoring",
  easeWeight: 20,
  competitionWeight: 20,
  saturationWeight: 15,
  offerWeight: 25,
  commissionWeight: 20,
  updatedAt: new Date("2026-04-01T09:00:00.000Z"),
};

export const demoProducts: Product[] = productNames.map((name, index) => {
  const originalPrice = 199_000 + index * 35_000;
  const salePrice = Math.round(originalPrice * (0.68 + (index % 4) * 0.04));
  const commissionPercent = 8 + (index % 6) * 2;
  const score = computeProductScore(
    {
      easeOfFilming: 6 + (index % 5),
      competitionLevel: 3 + (index % 6),
      saturationLevel: 2 + (index % 6),
      offerAttractiveness: 5 + (index % 5),
      commissionPercent,
    },
    demoScoringSettings,
  );

  return {
    id: `demo-product-${index + 1}`,
    name,
    slug: slugify(name),
    productUrl: `https://example.com/products/${index + 1}`,
    source: ["TikTok Shop", "Shopee Affiliate", "Lazada", "Nguồn nội bộ"][index % 4]!,
    category: categories[index % categories.length]!,
    originalPrice,
    salePrice,
    discountPercent: Math.round(((originalPrice - salePrice) / originalPrice) * 100),
    commissionPercent,
    estimatedCommission: Math.round((salePrice * commissionPercent) / 100),
    rating: Number((4.2 + (index % 5) * 0.15).toFixed(1)),
    reviewCount: 120 + index * 37,
    shopName: ["Mộc Home", "Everyday Lab", "Studio Gia Dụng", "Chọn Món Hay"][index % 4]!,
    voucher: index % 2 === 0 ? "Giảm thêm 15K" : "Voucher 8%",
    freeship: index % 3 !== 0,
    importedAt: new Date(2026, 2, (index % 27) + 1),
    shortDescription: `${name} dễ demo, lợi ích rõ và có mức sale đủ gọn để thử nhiều angle affiliate.`,
    internalNote:
      index % 4 === 0
        ? "Ưu tiên test format review nhanh 25-35 giây."
        : "Cần so thêm với đối thủ giá rẻ trước khi scale.",
    status: [
      ProductStatus.MOI,
      ProductStatus.DANG_TEST,
      ProductStatus.DANG_CHAY,
      ProductStatus.THANG,
      ProductStatus.LOAI_BO,
    ][index % 5]!,
    totalScore: score.totalScore,
    easeOfFilming: 6 + (index % 5),
    competitionLevel: 3 + (index % 6),
    saturationLevel: 2 + (index % 6),
    offerAttractiveness: 5 + (index % 5),
    scoreBreakdown: score.scoreBreakdown,
    createdAt: new Date(2026, 1, (index % 25) + 1),
    updatedAt: new Date(2026, 2, (index % 25) + 2),
  };
});

export const demoTrends: Trend[] = trendNames.map((name, index) => ({
  id: `demo-trend-${index + 1}`,
  name,
  trendType: Object.values(TrendType)[index % Object.values(TrendType).length]!,
  description:
    "Trend phù hợp cho video affiliate ngắn, giữ nhịp xem tốt và dễ biến tấu theo từng ngành hàng.",
  suitableNiche: categories[index % categories.length]!,
  referenceUrl: `https://example.com/trends/${index + 1}`,
  heatLevel: 6 + (index % 5),
  applicability: 5 + (index % 4),
  saturationLevel: 3 + (index % 5),
  discoveredAt: new Date(2026, 2, 15 + (index % 10)),
  note:
    index % 2 === 0
      ? "Nên dùng ngay cho video cần retention 3 giây đầu."
      : "Đã có dấu hiệu bão hòa nhẹ, nên ghép với angle mới.",
  createdAt: new Date(2026, 2, 1 + index),
  updatedAt: new Date(2026, 2, 2 + index),
}));

export const demoScriptTemplates: ScriptTemplate[] = [
  {
    id: "demo-template-1",
    name: "Review nhanh 30 giây",
    description: "Mở pain point, demo nhanh, chốt nhẹ.",
    structure: "- Hook\n- Demo\n- Lợi ích\n- CTA mềm",
    tone: ToneType.THUC_TE,
    createdAt: new Date("2026-03-01T09:00:00.000Z"),
  },
  {
    id: "demo-template-2",
    name: "So sánh cùng tầm giá",
    description: "Phù hợp với sản phẩm cạnh tranh cao.",
    structure: "- Vấn đề\n- So sánh 2 lựa chọn\n- Kết luận",
    tone: ToneType.SO_SANH,
    createdAt: new Date("2026-03-02T09:00:00.000Z"),
  },
  {
    id: "demo-template-3",
    name: "Kể nhanh trải nghiệm thật",
    description: "Tăng độ tin cậy cho video review.",
    structure: "- Trải nghiệm cũ\n- Lý do thử\n- Điều bất ngờ",
    tone: ToneType.CHIA_SE,
    createdAt: new Date("2026-03-03T09:00:00.000Z"),
  },
];

export const demoScriptDrafts: ScriptDraft[] = Array.from({ length: 20 }, (_, index) => {
  const product = demoProducts[index % demoProducts.length]!;
  const tone = Object.values(ToneType)[index % Object.values(ToneType).length]!;
  const goal = Object.values(GoalType)[index % Object.values(GoalType).length]!;
  const generated = generateScriptPackage({
    productName: product.name,
    customerPersona: "người muốn hiểu nhanh món này có đáng mua hay không",
    painPoints: "quá nhiều lựa chọn na ná nhau, khó chốt nhanh",
    strengths: "demo trực diện, giá sale rõ, lợi ích nhìn thấy ngay",
    notes: "Nhấn vào trải nghiệm thật thay vì nói quá công dụng.",
    tone,
    goal,
    durationSeconds: 25 + (index % 4) * 10,
  });

  return {
    id: `demo-script-${index + 1}`,
    title: `Kịch bản test ${product.name}`,
    audience: "người xem muốn quyết nhanh nhưng vẫn cần lý do rõ ràng",
    painPoints: "khó quyết giữa nhiều món có chức năng gần giống nhau",
    strengths: "video gọn, offer rõ, dễ lên cảnh thật",
    notes: "Ưu tiên caption ngắn, tránh hứa hẹn quá mức.",
    tone,
    goal,
    durationSeconds: 25 + (index % 4) * 10,
    hooks: generated.hooks,
    angles: generated.angles,
    voiceOvers: generated.voiceOvers,
    shotLists: generated.shotLists,
    captions: generated.captions,
    ctas: generated.ctas,
    teleprompter: generated.teleprompter,
    subtitleReady: generated.subtitleReady,
    safetyCheck: generated.safetyCheck,
    bestVersion: index % 5 === 0,
    createdAt: new Date(2026, 2, 1 + index),
    updatedAt: new Date(2026, 2, 5 + (index % 10)),
    productId: product.id,
    templateId: demoScriptTemplates[index % demoScriptTemplates.length]!.id,
  };
});

export const demoDraftProjects: DraftProject[] = Array.from({ length: 20 }, (_, index) => {
  const product = demoProducts[index % demoProducts.length]!;
  const rawScript = `Nếu bạn đang cần ${product.name.toLowerCase()} mà vẫn muốn video lên gọn và dễ hiểu, đây là cách mình thường quay. Mở đầu bằng pain point thật. Sau đó đưa ngay cảnh dùng thực tế. Cuối video chỉ giữ lại một câu chốt nhẹ và một CTA đủ mềm.`;
  const generated = buildDraftPackage({
    title: `Project nháp ${product.name}`,
    productName: product.name,
    rawScript,
  });

  return {
    id: `demo-draft-${index + 1}`,
    title: `Project nháp ${product.name}`,
    productName: product.name,
    rawScript,
    splitScript: generated.splitScript,
    suggestedTiming: generated.suggestedTiming,
    sceneSuggestions: generated.sceneSuggestions,
    overlayTexts: generated.overlayTexts,
    shootingChecklist: generated.shootingChecklist,
    editingChecklist: generated.editingChecklist,
    scriptTxt: generated.scriptTxt,
    subtitleSrt: generated.subtitleSrt,
    shotlistMd: generated.shotlistMd,
    checklistMd: generated.checklistMd,
    metadataJson: generated.metadataJson,
    createdAt: new Date(2026, 2, 2 + index),
    updatedAt: new Date(2026, 2, 4 + (index % 12)),
  };
});

export const demoVideoPerformance: VideoPerformance[] = Array.from({ length: 100 }, (_, index) => {
  const product = demoProducts[index % demoProducts.length]!;
  const views = 12_000 + index * 650;
  const clicks = Math.round(views * (0.015 + (index % 6) * 0.003));
  const orders = Math.round(clicks * (0.08 + (index % 4) * 0.03));
  const revenue = orders * product.salePrice;
  const commission = Number(((revenue * product.commissionPercent) / 100).toFixed(2));

  return {
    id: `demo-video-${index + 1}`,
    title: `Video affiliate ${index + 1} - ${product.name}`,
    productId: product.id,
    productGroup: product.category,
    publishedAt: new Date(2026, 0, (index % 28) + 1),
    videoUrl: `https://example.com/videos/${index + 1}`,
    hook: [
      "Nếu bạn đang phân vân, xem hết 20 giây này.",
      "Điểm đáng thử nhất của món này nằm ở trải nghiệm thật.",
      "Một món sale nhưng không phải kiểu mua cho vui.",
      "Mình test nhanh vì quá nhiều người hỏi món này có đáng không.",
    ][index % 4]!,
    angle: ["review thật", "so sánh cùng tầm giá", "pain point trực diện", "re-test hook mới"][index % 4]!,
    format: ["UGC review", "Top list", "POV", "Demo nhanh"][index % 4]!,
    durationSeconds: 18 + (index % 6) * 6,
    captionType: ["Tối giản", "Checklist", "Kể nhanh", "So sánh"][index % 4]!,
    ctaType: ["Mềm", "Gợi lưu", "Xem mô tả", "Thử bản sale"][index % 4]!,
    note: index % 7 === 0 ? "Retest angle cùng một hook." : "Giữ caption một câu chính.",
    views,
    avgWatchTime: Number((5.8 + (index % 7) * 1.15).toFixed(1)),
    completionRate: Number((18 + (index % 8) * 4.5).toFixed(1)),
    clicks,
    ctr: Number(((clicks / views) * 100).toFixed(2)),
    orders,
    revenue,
    commission,
    status: [VideoStatus.DA_DANG, VideoStatus.THANG, VideoStatus.KHONG_HIEU_QUA, VideoStatus.TAM_DUNG][index % 4]!,
    createdAt: new Date(2026, 0, (index % 28) + 1),
    updatedAt: new Date(2026, 0, (index % 28) + 2),
  };
});
