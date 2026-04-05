# SEO Notes

## Đã triển khai

- Metadata API cho toàn site
- title / description / keywords tiếng Việt
- Open Graph
- Twitter card
- `robots.ts`
- `sitemap.ts`
- canonical qua `buildMetadata`
- landing page với heading hierarchy sạch

## Trang quan trọng

- `/`: landing tĩnh, copy tự nhiên, không nhồi chữ
- các page workspace để dynamic, không cố tối ưu SEO rác cho dashboard nội bộ

## Khuyến nghị khi deploy

- set `NEXT_PUBLIC_SITE_URL` đúng domain production
- thêm OG image route riêng nếu cần social preview mạnh hơn
- nếu public hóa report pages, bổ sung structured data theo page type
