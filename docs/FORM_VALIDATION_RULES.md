# Form Validation Rules

## Nguyên tắc chung

- validate ở cả client và server
- không tin dữ liệu từ client
- trim khoảng trắng đầu/cuối
- chặn input chỉ toàn khoảng trắng
- chặn chuỗi rác lặp vô nghĩa
- sanitize plain text để tránh XSS cơ bản

## Helper chính

- `sanitizePlainText`
- `sanitizeMultilineText`
- `slugify`
- `isMeaningfulText`
- `trimmedText`
- `optionalText`
- `boundedNumber`
- `strictUrl`
- `safeDate`

## Rule đang áp dụng

- tên sản phẩm: 3-120 ký tự
- mô tả ngắn: 10-300 ký tự
- note nội bộ: tối đa 1000 ký tự
- tên trend: 3-120 ký tự
- raw script: 20-3000 ký tự
- hook/angle/caption/script: phải có nội dung có nghĩa
- rating: 0-5
- giảm giá: 0-100
- score input: 0-10 hoặc 0-100 tùy field
- views/clicks/orders/revenue/commission: không âm

## UX lỗi

- lỗi ngay cạnh field
- có `FormErrorSummary` khi submit fail
- nút submit disabled khi đang gửi
- toast báo thành công / thất bại

## Autosave

- form script generator
- form draft project

Autosave lưu cục bộ bằng `localStorage`, không thay thế validation server.
