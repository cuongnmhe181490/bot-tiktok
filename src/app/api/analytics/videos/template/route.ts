const template = `title,product_name,product_group,published_at,video_url,hook,angle,format,duration_seconds,caption_type,cta_type,views,avg_watch_time,completion_rate,clicks,ctr,orders,revenue,commission,source,source_type,confidence_level,verification_status,notes
Video test máy xay mini,Máy xay mini cầm tay,Đồ gia dụng,2026-04-01,https://example.com/video-1,Hook mở đầu bằng lỗi phổ biến,review thật,UGC review,28,Tối giản,Mềm,24000,8.2,34.5,510,2.13,38,5380000,645600,CSV Upload,CSV_IMPORT,MEDIUM,CHUA_XAC_MINH,Import từ bảng tracking nội bộ
`;

export async function GET() {
  return new Response(template, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="analytics-template.csv"',
    },
  });
}
