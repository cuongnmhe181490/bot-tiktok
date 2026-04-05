import {
  GoalType,
  PrismaClient,
  ProductStatus,
  ToneType,
  TrendType,
  VideoStatus,
} from "@prisma/client";
import { buildDraftPackage } from "../src/features/drafts/helpers";
import { computeProductScore } from "../src/features/research/products/helpers";
import { generateScriptPackage } from "../src/features/scripts/helpers";
import { slugify } from "../src/lib/sanitize";

const prisma = new PrismaClient();

const categories = [
  "Đồ gia dụng",
  "Chăm sóc cá nhân",
  "Đồ bếp",
  "Mẹ và bé",
  "Thiết bị nhỏ",
  "Phụ kiện điện thoại",
];

const sources = ["TikTok Shop", "Shopee Affiliate", "Lazada", "Nguồn nội bộ"];
const shops = [
  "Nhà Sạch Studio",
  "Everyday Lab",
  "Mộc Home",
  "Chọn Món Hay",
  "Studio Gia Dụng",
  "Hộp Tiện Nghi",
];

async function main() {
  await prisma.videoPerformance.deleteMany();
  await prisma.scriptDraft.deleteMany();
  await prisma.scriptTemplate.deleteMany();
  await prisma.draftProject.deleteMany();
  await prisma.trend.deleteMany();
  await prisma.product.deleteMany();
  await prisma.scoringSettings.deleteMany();

  const scoringSettings = await prisma.scoringSettings.create({
    data: {
      easeWeight: 20,
      competitionWeight: 20,
      saturationWeight: 15,
      offerWeight: 25,
      commissionWeight: 20,
    },
  });

  const products = await Promise.all(
    Array.from({ length: 20 }, async (_, index) => {
      const category = categories[index % categories.length]!;
      const originalPrice = 199_000 + index * 35_000;
      const salePrice = Math.round(originalPrice * (0.68 + (index % 4) * 0.04));
      const commissionPercent = 8 + (index % 6) * 2;
      const input = {
        easeOfFilming: 6 + (index % 5),
        competitionLevel: 3 + (index % 6),
        saturationLevel: 2 + (index % 6),
        offerAttractiveness: 5 + (index % 5),
        commissionPercent,
      };
      const score = computeProductScore(input, scoringSettings);
      const name = [
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
      ][index]!;

      return prisma.product.create({
        data: {
          name,
          slug: slugify(name),
          productUrl: `https://example.com/products/${index + 1}`,
          source: sources[index % sources.length]!,
          category,
          originalPrice,
          salePrice,
          discountPercent: Math.round(((originalPrice - salePrice) / originalPrice) * 100),
          commissionPercent,
          estimatedCommission: Math.round((salePrice * commissionPercent) / 100),
          rating: Number((4.2 + (index % 5) * 0.15).toFixed(1)),
          reviewCount: 120 + index * 37,
          shopName: shops[index % shops.length]!,
          voucher: index % 2 === 0 ? "Giảm thêm 15K" : "Voucher 8%",
          freeship: index % 3 !== 0,
          importedAt: new Date(2026, 2, (index % 27) + 1),
          shortDescription: `${name} phù hợp để làm affiliate vì dễ demo nhanh, lợi ích rõ và có offer đủ hấp dẫn để kéo click.`,
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
          easeOfFilming: input.easeOfFilming,
          competitionLevel: input.competitionLevel,
          saturationLevel: input.saturationLevel,
          offerAttractiveness: input.offerAttractiveness,
          scoreBreakdown: score.scoreBreakdown,
        },
      });
    }),
  );

  await Promise.all(
    Array.from({ length: 15 }, (_, index) => {
      const names = [
        "Mở đầu bằng cảnh dùng sai cách",
        "Cut nhanh trước - sau trong 2 giây",
        "Dùng âm thanh đời thường thay nhạc nền",
        "Góc quay trên mặt bàn sáng",
        "So sánh 3 lựa chọn trong cùng tầm giá",
        "Hook bằng câu hỏi trực diện",
        "Cảnh thật từ tay người dùng",
        "Format checklist siêu ngắn",
        "Nêu pain point trong 1 dòng subtitle",
        "Một câu chốt “đáng mua ở đâu”",
        "POV người mua lần đầu",
        "Mở clip bằng lỗi phổ biến",
        "Review kiểu đối chiếu ngân sách",
        "Góc quay close-up texture / chất liệu",
        "Caption tối giản 1 câu chính",
      ];

      return prisma.trend.create({
        data: {
          name: names[index]!,
          trendType: Object.values(TrendType)[index % Object.values(TrendType).length]!,
          description:
            "Trend phù hợp cho nội dung chuyển đổi nhanh, ít setup, giữ được nhịp xem ngắn và dễ biến tấu theo từng ngành hàng.",
          suitableNiche: categories[index % categories.length]!,
          referenceUrl: `https://example.com/trends/${index + 1}`,
          heatLevel: 6 + (index % 5),
          applicability: 5 + (index % 4),
          saturationLevel: 3 + (index % 5),
          discoveredAt: new Date(2026, 2, 15 + (index % 10)),
          note:
            index % 2 === 0
              ? "Nên test cùng hook câu hỏi để tăng retention 3 giây đầu."
              : "Giữ subtitle ngắn, tránh nhét thông tin vào một cảnh.",
        },
      });
    }),
  );

  const templates = await Promise.all(
    [
      {
        name: "Review nhanh 30 giây",
        description: "Mở pain point, demo nhanh, chốt nhẹ.",
        structure: "- Hook\n- Demo\n- Lợi ích\n- CTA mềm",
        tone: ToneType.THUC_TE,
      },
      {
        name: "So sánh cùng tầm giá",
        description: "Phù hợp sản phẩm cạnh tranh cao.",
        structure: "- Vấn đề\n- So sánh 2 lựa chọn\n- Kết luận",
        tone: ToneType.SO_SANH,
      },
      {
        name: "Kể nhanh trải nghiệm thật",
        description: "Tăng độ tin cậy cho video review.",
        structure: "- Trải nghiệm cũ\n- Lý do thử\n- Điều bất ngờ",
        tone: ToneType.CHIA_SE,
      },
    ].map((item) => prisma.scriptTemplate.create({ data: item })),
  );

  await Promise.all(
    Array.from({ length: 20 }, async (_, index) => {
      const product = products[index % products.length]!;
      const generated = generateScriptPackage({
        productName: product.name,
        customerPersona: "người muốn mua nhanh nhưng vẫn cần lý do rõ ràng",
        painPoints: "mất thời gian tìm món hợp lý và khó nhìn ra lợi ích thật",
        strengths: "demo trực diện, giá sale rõ, dễ lên cảnh thật và dễ chốt CTA mềm",
        notes: "Nhấn mạnh góc dùng thật, không nói quá công dụng.",
        tone: Object.values(ToneType)[index % Object.values(ToneType).length]!,
        goal: Object.values(GoalType)[index % Object.values(GoalType).length]!,
        durationSeconds: 25 + (index % 4) * 10,
      });

      return prisma.scriptDraft.create({
        data: {
          title: `Kịch bản test ${product.name}`,
          productId: product.id,
          audience: "người xem muốn hiểu nhanh sản phẩm có đáng thử hay không",
          painPoints: "khó quyết nhanh giữa nhiều lựa chọn na ná nhau",
          strengths: "video gọn, offer rõ, lợi ích nhìn thấy ngay trên khung hình",
          notes: "Ưu tiên caption ngắn, tránh hứa hẹn quá mức.",
          tone: Object.values(ToneType)[index % Object.values(ToneType).length]!,
          goal: Object.values(GoalType)[index % Object.values(GoalType).length]!,
          durationSeconds: 25 + (index % 4) * 10,
          templateId: templates[index % templates.length]!.id,
          ...generated,
          bestVersion: index % 5 === 0,
        },
      });
    }),
  );

  await Promise.all(
    Array.from({ length: 20 }, (_, index) => {
      const product = products[index % products.length]!;
      const rawScript = `Nếu bạn đang cần ${product.name.toLowerCase()} mà vẫn muốn video lên gọn và dễ hiểu, đây là cách mình thường quay. Mở đầu bằng pain point thật. Sau đó đưa ngay cảnh dùng thực tế. Cuối video chỉ giữ lại một câu chốt nhẹ và một CTA đủ mềm.`;
      const generated = buildDraftPackage({
        title: `Project nháp ${product.name}`,
        productName: product.name,
        rawScript,
      });

      return prisma.draftProject.create({
        data: {
          title: `Project nháp ${product.name}`,
          productName: product.name,
          rawScript,
          ...generated,
        },
      });
    }),
  );

  await Promise.all(
    Array.from({ length: 100 }, (_, index) => {
      const product = products[index % products.length]!;
      const views = 12_000 + index * 650;
      const clicks = Math.round(views * (0.015 + (index % 6) * 0.003));
      const orders = Math.round(clicks * (0.08 + (index % 4) * 0.03));
      const revenue = orders * product.salePrice;
      const commission = Number(((revenue * product.commissionPercent) / 100).toFixed(2));

      return prisma.videoPerformance.create({
        data: {
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
          angle: [
            "review thật",
            "so sánh cùng tầm giá",
            "pain point trực diện",
            "re-test hook mới",
          ][index % 4]!,
          format: ["UGC review", "Top list", "POV", "Demo nhanh"][index % 4]!,
          durationSeconds: 18 + (index % 6) * 6,
          captionType: ["Tối giản", "Checklist", "Kể nhanh", "So sánh"][index % 4]!,
          ctaType: ["Mềm", "Gợi lưu", "Xem mô tả", "Thử bản sale"][index % 4]!,
          note: index % 7 === 0 ? "Retest angle cùng một hook." : "Giữ caption 1 câu chính.",
          views,
          avgWatchTime: Number((5.8 + (index % 7) * 1.15).toFixed(1)),
          completionRate: Number((18 + (index % 8) * 4.5).toFixed(1)),
          clicks,
          ctr: Number(((clicks / views) * 100).toFixed(2)),
          orders,
          revenue,
          commission,
          status: [VideoStatus.DA_DANG, VideoStatus.THANG, VideoStatus.KHONG_HIEU_QUA, VideoStatus.TAM_DUNG][
            index % 4
          ]!,
        },
      });
    }),
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
