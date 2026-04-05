# Data Provenance

## Metadata chuẩn

Các record chính trong hệ thống hiện dùng bộ metadata provenance sau:

- `source`: tên nguồn cụ thể
- `sourceType`: loại nguồn theo enum
- `collectedAt`: thời điểm thu thập từ nguồn
- `importedAt`: thời điểm nhập vào hệ thống
- `lastVerifiedAt`: lần cuối người dùng đối chiếu lại
- `confidenceLevel`: low / medium / high
- `verificationStatus`: chưa xác minh / đã đối chiếu / dữ liệu demo
- `isDemo`: có phải bản ghi demo hay không
- `externalReferenceUrl`: liên kết tham chiếu nếu có
- `notes`: ghi chú dữ liệu

## Source type

- `TIKTOK_CREATIVE_CENTER`
- `GOOGLE_TRENDS`
- `MANUAL`
- `CSV_IMPORT`
- `SYSTEM_DEMO`
- `INTERNAL_GENERATED`

## Cách đọc provenance trong UI

- `Nguồn dữ liệu`: nơi record đến từ
- `Lần thu thập`: lúc lấy từ nguồn gốc
- `Lần nhập hệ thống`: lúc đưa vào app
- `Lần xác minh gần nhất`: lúc người dùng rà lại
- `Mức độ tin cậy`: giúp ưu tiên bản ghi đáng tin hơn

## Ghi chú

- `Product`, `Trend` và `VideoPerformance` là các record fact data chính
- `ScriptDraft` và các recommendation trong draft/report hiện được đánh dấu bằng UI là `Gợi ý nội bộ`
- Dữ liệu demo luôn có badge riêng và có thể ẩn qua phần cài đặt dữ liệu
