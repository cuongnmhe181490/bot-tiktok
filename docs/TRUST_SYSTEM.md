# Trust System

## Badge dùng trong toàn app

- `Demo`
- `Nhập tay`
- `CSV import`
- `TikTok Creative Center`
- `Google Trends`
- `Gợi ý nội bộ`
- `Chưa xác minh`
- `Đã đối chiếu`
- `Dữ liệu demo`
- `Tin cậy thấp`
- `Tin cậy vừa`
- `Tin cậy cao`

## Ý nghĩa

### Demo

Bản ghi dùng để mô phỏng hệ thống khi chưa có dữ liệu thật.

### Nhập tay / CSV import / Creative Center / Google Trends

Cho biết record fact data đang đến từ đâu.

### Chưa xác minh

Đã nhập vào hệ thống nhưng chưa được đối chiếu lại.

### Đã đối chiếu

Người dùng đã rà lại record ở một thời điểm xác định.

### Tin cậy thấp / vừa / cao

Không phải đánh giá tuyệt đối. Đây là tín hiệu để ưu tiên record nào nên được đọc trước.

- `thấp`: thường là ghi chú tay, thiếu link tham chiếu hoặc chưa có ngày thu thập rõ
- `vừa`: có nguồn tương đối rõ nhưng chưa đối chiếu đầy đủ
- `cao`: có nguồn rõ, thời điểm thu thập rõ và đã rà lại

## Gợi ý nội bộ

Các khối như:

- product score
- score breakdown
- script suggestions
- retest recommendation
- recommendation summary

đều phải được hiểu là lớp suy luận nội bộ, không phải dữ liệu từ nền tảng.
