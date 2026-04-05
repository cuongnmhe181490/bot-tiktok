const templates = {
  google: `keyword,topic,region,time_window,trend_score,notes
máy xay mini,,VN,7 ngày gần nhất,82,Từ Google Trends
giá treo nhà tắm,,VN,30 ngày gần nhất,67,Từ Google Trends
`,
  creative: `name,trend_type,suitable_niche,heat_level,applicability,saturation_level,external_reference_url,note
Hook mở đầu bằng lỗi phổ biến,HOOK,Đồ gia dụng,8,7,4,https://creativecenter.tiktok.com/example,Mẫu nhập từ Creative Center
`,
} as const;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kind = searchParams.get("kind") === "creative" ? "creative" : "google";

  return new Response(templates[kind], {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="trend-template-${kind}.csv"`,
    },
  });
}
