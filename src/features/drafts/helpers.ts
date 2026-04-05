type DraftPackageInput = {
  title: string;
  productName: string;
  rawScript: string;
};

function toSrtText(lines: string[]) {
  return lines
    .map((line, index) => {
      const start = index * 3;
      const end = start + 2;
      return `${index + 1}\n00:00:${String(start).padStart(2, "0")},000 --> 00:00:${String(end).padStart(2, "0")},500\n${line}`;
    })
    .join("\n\n");
}

export function buildDraftPackage(input: DraftPackageInput) {
  const lines = input.rawScript
    .split(/[.!?]\s+/)
    .map((line) => line.trim())
    .filter(Boolean);

  const splitScript = lines.map((line, index) => `${index + 1}. ${line}`).join("\n");
  const suggestedTiming = lines
    .map((line, index) => `${index + 1}. ${index * 3}s - ${index * 3 + 3}s | ${line}`)
    .join("\n");
  const sceneSuggestions = lines
    .map(
      (line, index) =>
        `${index + 1}. Cảnh ${index + 1}: minh họa trực diện cho câu "${line}" bằng góc quay cận tay hoặc before/after.`,
    )
    .join("\n");
  const overlayTexts = lines
    .map((line, index) => `${index + 1}. Overlay ngắn: ${line.slice(0, 48)}`)
    .join("\n");
  const shootingChecklist = [
    "- Chuẩn bị ánh sáng nền sáng, sạch, không lẫn chi tiết gây nhiễu.",
    "- Quay ít nhất 3 góc cho cảnh mở đầu.",
    "- Có một cảnh cận tính năng chính và một cảnh toàn môi trường dùng.",
    "- Giữ 5 giây cuối đủ sạch để chèn CTA mềm.",
  ].join("\n");
  const editingChecklist = [
    "- Cắt câu thừa và giữ nhịp dưới 3 giây mỗi ý.",
    "- Ưu tiên subtitle 2 dòng, dễ đọc trên mobile.",
    "- Overlay text không che khu vực sản phẩm chính.",
    "- Kiểm tra lại CTA, link mô tả và lỗi chính tả trước khi xuất.",
  ].join("\n");

  const metadata = {
    title: input.title,
    productName: input.productName,
    sceneCount: lines.length,
    generatedAt: new Date().toISOString(),
  };

  return {
    splitScript,
    suggestedTiming,
    sceneSuggestions,
    overlayTexts,
    shootingChecklist,
    editingChecklist,
    scriptTxt: lines.join("\n"),
    subtitleSrt: toSrtText(lines),
    shotlistMd: lines.map((line) => `- ${line}`).join("\n"),
    checklistMd: `${shootingChecklist}\n\n${editingChecklist}`,
    metadataJson: JSON.stringify(metadata, null, 2),
  };
}
