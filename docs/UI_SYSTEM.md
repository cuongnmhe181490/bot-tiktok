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
- bảng luôn có horizontal scroll an toàn
- form chia cột khi đủ rộng, còn lại xếp một cột
