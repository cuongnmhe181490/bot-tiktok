# UI System

## Tinh thần

- Liquid Glass tiết chế
- tối giản kiểu Nhật
- sáng, sạch, yên tĩnh
- ưu tiên độ đọc hơn hiệu ứng

## Surface layers

- `background`: nền sáng trung tính, có radial glow rất nhẹ
- `glass-panel`: card chính, blur vừa phải, specular highlight mỏng
- `glass-soft`: chip, button, filter, secondary surface
- `interactive`: hover/focus dùng shift nhẹ, không bật shadow nặng

## Typography

- font chính: `Be Vietnam Pro`
- font số liệu/mono: `Geist Mono`
- heading đậm vừa phải, tracking khít nhẹ
- body text thoáng, không dày chữ

## Palette

- nền: lạnh nhẹ, thiên xám xanh dịu
- accent: xanh slate tinh tế
- success/warning/error/info đều giảm saturation
- không dùng neon, không dùng tím rẻ tiền

## Core components

- `GlassPanel`
- `SectionHeader`
- `KPIBlock`
- `DataTable`
- `FilterBar`
- `TagChip`
- `DataTrustBadges`
- `ProvenancePanel`
- `DatePicker`
- `Topbar`
- `AppSidebar`
- `ChartCard`
- `EmptyState`

## State rules

- hover: đổi nền nhẹ và tăng contrast rất ít
- focus-visible: ring rõ nhưng dịu
- active: translate rất nhỏ nếu phù hợp
- disabled: giảm opacity, khóa pointer events
- loading: dùng skeleton hoặc label trạng thái ngắn

## Responsive rules

- mobile-first
- sidebar desktop, sheet trên mobile
- sheet điều hướng trên mobile chỉ chiếm chiều ngang vừa đủ, overlay mờ nhẹ để không tạo cảm giác nặng
- `FilterBar` trên mobile chuyển sang sheet riêng, luôn hiển thị tóm tắt filter đang bật
- `DataTable` có chế độ thẻ xếp chồng trên mobile cho các bảng quét nhanh, chỉ giữ table đầy đủ từ `md` trở lên
- form chia cột khi đủ rộng, còn lại xếp một cột

## Trust badges

- badge nguồn dữ liệu dùng màu dịu, không neon
- badge `Gợi ý nội bộ` luôn tách khỏi badge fact data
- `ProvenancePanel` gom nguồn, ngày thu thập, ngày nhập, ngày xác minh và link tham chiếu vào một khối đọc nhanh
