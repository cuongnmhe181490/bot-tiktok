# Free Data Stack

## Nguyên tắc

Kính Affiliate Studio hiện chạy theo mô hình `free-only data stack`.

Hệ thống chỉ dùng 4 nhóm nguồn:

1. TikTok Creative Center theo hướng nhập tay hoặc quick import
2. Google Trends theo hướng CSV công khai
3. Dữ liệu nội bộ do người dùng nhập hoặc CSV nội bộ
4. Dữ liệu demo của hệ thống

## Không dùng

- API trả phí
- trend API trả tiền
- scraper trả phí
- connector enterprise
- browser automation như một điều kiện bắt buộc để app hoạt động

## Mục tiêu sản phẩm

- Người dùng luôn biết dữ liệu đến từ đâu
- Không nhầm `fact data` với `gợi ý nội bộ`
- Bản đầu có thể chạy ổn chỉ với manual entry, CSV và seed data

## Fact data và internal suggestion

### Fact data

- product research record do người dùng nhập
- trend record từ Creative Center, Google Trends hoặc CSV nội bộ
- analytics record nhập tay hoặc import

### Internal suggestion

- product score
- score breakdown
- suggested hooks
- suggested angles
- safety check
- recommendation summary
- retest recommendation

Các khối internal suggestion đều phải được đánh dấu `Gợi ý nội bộ`.
