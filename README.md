# Kính Affiliate Studio

Web app tiếng Việt, production-minded, mobile-first cho vận hành content affiliate gồm 4 module trong cùng một hệ thống:

1. Nghiên cứu sản phẩm / trend affiliate
2. Tạo script video hàng loạt
3. Chuẩn bị video nháp / shot list / subtitle package
4. Dashboard theo dõi hiệu suất content affiliate

## Stack

- Next.js 16 App Router
- TypeScript strict mode
- Tailwind CSS v4
- shadcn/ui
- Prisma + SQLite
- React Hook Form + Zod
- Recharts
- Framer Motion
- Metadata API của Next.js
- ESLint + Prettier

## Cấu trúc thư mục

```txt
src/
  app/
  components/
  config/
  features/
  hooks/
  lib/
  server/
  types/
prisma/
docs/
```

## Chạy local

```bash
npm install
npx prisma generate
npm run prisma:seed
npm run dev
```

App mặc định chạy tại `http://localhost:3000`.

## Build production

```bash
npm run build
npm run start
```

## Script quan trọng

- `npm run dev`: chạy local
- `npm run build`: build production
- `npm run start`: chạy bản build
- `npm run lint`: lint code
- `npm run format`: format code
- `npm run prisma:generate`: generate Prisma client
- `npm run prisma:migrate`: tạo migration mới nếu mở rộng schema
- `npm run prisma:seed`: seed dữ liệu mẫu
- `npm run db:seed`: generate client rồi seed

## Dữ liệu mẫu

Seed hiện tại tạo:

- 20 sản phẩm
- 15 trend
- 3 template kịch bản
- 20 bộ script
- 20 project video nháp
- 100 bản ghi hiệu suất video

## URL chính

- `/`
- `/dashboard`
- `/research/products`
- `/research/products/[id]`
- `/research/trends`
- `/scripts`
- `/scripts/[id]`
- `/drafts`
- `/drafts/[id]`
- `/analytics`
- `/analytics/videos`
- `/analytics/videos/[id]`
- `/reports`
- `/settings`

## Ghi chú giao diện

- App shell theo ngữ cảnh từng route, không dùng cùng một hero/header cho mọi màn.
- Mobile ưu tiên sheet cho điều hướng và filter; các bảng quan trọng có chế độ thẻ xếp chồng để quét nhanh trên màn hình nhỏ.
- Các trang chi tiết `/research/products/[id]`, `/scripts/[id]`, `/drafts/[id]`, `/analytics/videos/[id]` được thiết kế như workspace detail page, không còn là bản xem rút gọn.

## Lưu ý triển khai

- SQLite đang dùng cho bản đầu để local nhanh.
- Prisma schema đã tách đủ để nâng cấp lên Postgres khi cần.
- MVP đang ở chế độ single-user, chưa gắn connector TikTok.
- Toàn bộ form đều validate client-side và server-side bằng Zod.

## Tài liệu đi kèm

- [UI system](./docs/UI_SYSTEM.md)
- [Form validation](./docs/FORM_VALIDATION_RULES.md)
- [SEO notes](./docs/SEO_NOTES.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Content guide](./docs/CONTENT_GUIDE_VI.md)
