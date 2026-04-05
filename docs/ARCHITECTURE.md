# Architecture

## Mục tiêu

Một app duy nhất, tách theo feature, đủ sạch để:

- mở rộng connector TikTok sau này
- nâng SQLite lên Postgres
- thêm auth nội bộ khi cần
- giữ UI và logic tách lớp rõ ràng

## Sơ đồ lớp

- `src/app`: route, layout, metadata, route handlers
- `src/components`: design system nội bộ và shared UI
- `src/features`: schema, service, helper, UI theo từng module
- `src/lib`: helper dùng chung như sanitize, seo, validation, http
- `src/server`: truy cập Prisma
- `src/config`: site config, domain enums/options
- `src/hooks`: autosave local draft
- `src/types`: type dùng chung
- `prisma`: schema, seed
- `docs`: tài liệu vận hành

## Tổ chức feature

Mỗi feature chính có:

- `schema.ts`: Zod schema
- `service.ts`: truy cập dữ liệu Prisma
- `helpers.ts`: logic tính điểm hoặc generator
- `ui/*`: form và component riêng

## Data flow

1. User nhập liệu ở form RHF
2. Client validate bằng `zodResolver`
3. Submit tới route handler trong `app/api/*`
4. Server parse lại cùng schema Zod
5. Service ghi Prisma
6. Route revalidate page liên quan

## Route strategy

- `/` là landing SEO tĩnh
- các page workspace nằm trong route group `(workspace)`
- workspace dùng sidebar + topbar chung
- page dữ liệu đặt `dynamic = "force-dynamic"` để đọc DB theo request

## Database strategy

- SQLite cho local nhanh
- Prisma schema dùng model rõ, không nhét JSON lung tung vào core flow
- trường nullable được chuẩn hóa về `null` trong service

## Nâng cấp sau này

- thêm auth: tạo `User`, `Workspace`, `Membership`
- thêm connector: tạo `Connector`, `SyncJob`, `ExternalVideo`
- thêm queue: tách generator/script pipeline sang background job
- nâng DB: đổi datasource sang Postgres, giữ nguyên service layer
