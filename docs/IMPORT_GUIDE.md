# Import Guide

## 1. Trend từ TikTok Creative Center

### Cách làm

1. Mở `Research > Trends`
2. Vào khu `Creative Center quick import`
3. Dán nhanh các trường:
   - tên trend
   - loại trend
   - niche
   - độ nóng
   - độ dễ áp dụng
   - độ bão hòa
   - link nguồn
   - ghi chú

### Bulk paste

Có thể dán nhiều dòng theo mẫu:

```txt
Tên trend | HOOK | Đồ gia dụng | 8 | 7 | 4 | https://creativecenter.tiktok.com/... | Ghi chú ngắn
```

## 2. Import Google Trends CSV

### Lấy CSV ở đâu

1. Mở Google Trends
2. Chọn từ khóa hoặc topic muốn theo dõi
3. Export CSV từ giao diện Google Trends
4. Vào `Research > Trends`
5. Dùng khu `Google Trends import`

### Cột được map

- `keyword` hoặc `topic` -> tên trend
- `region` -> khu vực
- `time_window` -> khung thời gian
- `trend_score` hoặc `value` -> trend score
- `notes` -> ghi chú

### Giới hạn

- Google Trends không phải dữ liệu TikTok
- score từ Google Trends chỉ là tín hiệu quan tâm tìm kiếm, không phải chỉ số chuyển đổi
- nếu file thiếu cột keyword/topic, hệ thống sẽ báo lỗi dòng

## 3. Import analytics CSV

Khu `Analytics > Bản ghi video` hỗ trợ import CSV nội bộ.

### Mẫu cột chính

- `title`
- `product_name`
- `product_group`
- `published_at`
- `video_url`
- `hook`
- `angle`
- `format`
- `duration_seconds`
- `views`
- `clicks`
- `orders`
- `revenue`
- `commission`

## 4. Preview và xác nhận

Các flow import mới đều ưu tiên:

- xem trước số dòng hợp lệ
- xem số dòng lỗi
- báo lỗi theo dòng
- chỉ import sau khi người dùng xác nhận
