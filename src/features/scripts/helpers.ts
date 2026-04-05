import { goalOptions, toneOptions } from "@/config/domain";

type ScriptGeneratorInput = {
  productName: string;
  customerPersona: string;
  painPoints: string;
  strengths: string;
  notes?: string | undefined;
  tone: string;
  goal: string;
  durationSeconds: number;
};

const softCtas = [
  "Nếu đang cân nhắc, bạn có thể xem thử mẫu này trước.",
  "Phần mình thấy đáng thử nhất là trải nghiệm dùng thực tế.",
  "Bạn muốn mình bóc tách thêm phiên bản nào thì để lại từ khóa.",
  "Nếu hợp nhu cầu của bạn, link mình để ngay phần mô tả.",
  "Nên lưu lại để lúc cần còn so nhanh với lựa chọn khác.",
];

export function generateScriptPackage(input: ScriptGeneratorInput) {
  const toneLabel =
    toneOptions.find((item) => item.value === input.tone)?.label ?? input.tone;
  const goalLabel =
    goalOptions.find((item) => item.value === input.goal)?.label ?? input.goal;

  const hooks = Array.from({ length: 10 }, (_, index) => {
    const variations = [
      `Nếu bạn là ${input.customerPersona.toLowerCase()}, đây là lý do nên xem hết video này.`,
      `Mình thử ${input.productName} vì ${input.painPoints.toLowerCase()} quá lâu rồi.`,
      `Một món mình thấy đủ hợp lý để test ngay trong tuần này.`,
      `Điểm ăn tiền của ${input.productName} không nằm ở giá, mà ở cảm giác dùng thật.`,
      `Có một chi tiết nhỏ của ${input.productName} làm mình đổi góc nhìn.`,
    ];

    return `${index + 1}. ${variations[index % variations.length]}`;
  }).join("\n");

  const angles = [
    `So sánh trước - sau khi dùng ${input.productName}`,
    `Nhấn vào pain point: ${input.painPoints}`,
    `Tập trung vào lợi ích rõ nhất: ${input.strengths.split("\n")[0] ?? input.strengths}`,
    `Review kiểu “đáng tiền ở đâu” với tone ${toneLabel.toLowerCase()}`,
    `Góc nhìn mua thử để tối ưu mục tiêu ${goalLabel.toLowerCase()}`,
  ].join("\n");

  const voiceOvers = [
    `Bản 1:\nMình chọn ${input.productName} vì ${input.painPoints.toLowerCase()}. Sau khi dùng thực tế, điểm mình thấy rõ nhất là ${input.strengths.toLowerCase()}. Video này dài khoảng ${input.durationSeconds} giây nên mình chỉ giữ đúng phần đáng xem.`,
    `Bản 2:\nNếu bạn đang tìm một lựa chọn gọn, dễ lên video và dễ kéo click, ${input.productName} là ứng viên khá ổn. Mình sẽ đi nhanh qua điều đáng tiền, điều cần lưu ý và khi nào nên mua.`,
    `Bản 3:\nKhông phải món nào sale cũng nên làm affiliate. Với ${input.productName}, thứ đáng giữ lại là offer khá rõ, dễ diễn giải và phù hợp với người xem cần quyết định nhanh.`,
  ].join("\n\n");

  const shotLists = [
    `Shot list 1:\n- Cảnh mở hộp cận tay\n- Cảnh pain point đang diễn ra\n- Cảnh chuyển sang dùng sản phẩm\n- Cảnh highlight chi tiết chính\n- Cảnh CTA mềm cuối video`,
    `Shot list 2:\n- Cảnh tiêu đề hook\n- Cảnh quay ngang môi trường sử dụng\n- Cảnh zoom tính năng mạnh nhất\n- Cảnh note lưu ý ngắn\n- Cảnh chèn link mô tả`,
    `Shot list 3:\n- Cảnh before/after\n- Cảnh phản ứng thật\n- Cảnh đặt sản phẩm lên nền sáng\n- Cảnh giá sale + voucher\n- Cảnh chốt nhẹ`,
  ].join("\n\n");

  const captions = [
    `Giữ mọi thứ gọn hơn với ${input.productName}.`,
    `Món này hợp ai cần giải quyết nhanh: ${input.painPoints.toLowerCase()}.`,
    `Một lựa chọn dễ quay, dễ nói, dễ kéo click khi làm affiliate.`,
    `Mình giữ lại bản tóm tắt ngắn nhất để bạn xem trong 30 giây.`,
    `Điểm đáng thử nằm ở trải nghiệm thật, không phải câu chữ.`,
  ].join("\n");

  const ctas = softCtas.join("\n");

  const teleprompter = `Hook: Nếu bạn đang gặp ${input.painPoints.toLowerCase()}, xem nhanh món này.\n\nBody: ${input.productName} nổi bật ở ${input.strengths}. Cách mình lên video là nói ngắn, quay thật, giữ đúng nhịp ${input.durationSeconds} giây.\n\nNote: ${input.notes || "Nhấn thêm lưu ý về voucher, freeship và cảm nhận dùng thực tế."}\n\nCTA: ${softCtas[0]}`;

  const subtitleReady = `Nếu bạn đang gặp ${input.painPoints.toLowerCase()},\nđây là món mình thấy đáng thử.\n${input.productName} nổi bật ở ${input.strengths}.\nMình ưu tiên cách nói ngắn,\nquay thật,\nđể người xem hiểu nhanh trong ${input.durationSeconds} giây.\n${softCtas[1]}`;

  const safetyCheck = [
    "- Không hứa hẹn quá mức so với công dụng thực tế.",
    "- Không dùng từ ngữ tuyệt đối như “chắc chắn”, “100% hiệu quả”.",
    "- Luôn giữ phần lưu ý rõ nếu sản phẩm cần điều kiện sử dụng riêng.",
    "- CTA mềm, không ép mua, không gây hiểu sai về giá hoặc voucher.",
  ].join("\n");

  return {
    hooks,
    angles,
    voiceOvers,
    shotLists,
    captions,
    ctas,
    teleprompter,
    subtitleReady,
    safetyCheck,
  };
}
