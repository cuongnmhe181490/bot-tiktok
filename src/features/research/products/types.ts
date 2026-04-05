import type { Prisma, ProductStatus } from "@prisma/client";

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    scripts: true;
    videos: true;
  };
}>;

export type ProductStatusValue = ProductStatus;
