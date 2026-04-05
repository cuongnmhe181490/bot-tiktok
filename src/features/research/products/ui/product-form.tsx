"use client";

import { ProductStatus } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { productStatusOptions } from "@/config/domain";
import { postJson } from "@/lib/http";
import { productSchema, type ProductInput } from "@/features/research/products/schema";
import { DatePicker } from "@/components/date-picker";
import { FormErrorSummary } from "@/components/form-error-summary";
import { FormFieldShell } from "@/components/form-field-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const defaultValues: ProductInput = {
  name: "",
  slug: "",
  productUrl: "",
  source: "TikTok Shop",
  category: "",
  originalPrice: 0,
  salePrice: 0,
  discountPercent: 0,
  commissionPercent: 0,
  estimatedCommission: 0,
  rating: 4.5,
  reviewCount: 0,
  shopName: "",
  voucher: "",
  freeship: true,
  importedAt: new Date(),
  shortDescription: "",
  internalNote: "",
  status: ProductStatus.MOI,
  easeOfFilming: 7,
  competitionLevel: 5,
  saturationLevel: 4,
  offerAttractiveness: 7,
};

export function ProductForm() {
  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  const importedAt = useWatch({ control: form.control, name: "importedAt" }) as Date;
  const status = useWatch({ control: form.control, name: "status" }) as ProductStatus;

  const errorMessages = Object.values(form.formState.errors)
    .map((error) => error?.message)
    .filter(Boolean) as string[];

  const onSubmit = form.handleSubmit(async (values) => {
    const result = await postJson("/api/products", values);

    if (!result.ok) {
      toast.error(result.message ?? "Không thể lưu sản phẩm.");
      return;
    }

    toast.success("Đã thêm sản phẩm.");
    form.reset(defaultValues);
  });

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <FormErrorSummary messages={errorMessages} />

      <div className="grid gap-4 md:grid-cols-2">
        <FormFieldShell label="Tên sản phẩm" required error={form.formState.errors.name?.message}>
          <Input placeholder="Ví dụ: Máy xay mini cầm tay" {...form.register("name")} />
        </FormFieldShell>
        <FormFieldShell label="Slug" error={form.formState.errors.slug?.message}>
          <Input placeholder="tu-dong-neu-bo-trong" {...form.register("slug")} />
        </FormFieldShell>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormFieldShell label="Link sản phẩm" required error={form.formState.errors.productUrl?.message}>
          <Input placeholder="https://..." {...form.register("productUrl")} />
        </FormFieldShell>
        <FormFieldShell label="Tên shop" required error={form.formState.errors.shopName?.message}>
          <Input placeholder="Tên shop / nhà bán" {...form.register("shopName")} />
        </FormFieldShell>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <FormFieldShell label="Nguồn" required error={form.formState.errors.source?.message}>
          <Input {...form.register("source")} />
        </FormFieldShell>
        <FormFieldShell label="Ngành hàng" required error={form.formState.errors.category?.message}>
          <Input {...form.register("category")} />
        </FormFieldShell>
        <FormFieldShell label="Ngày nhập" required error={form.formState.errors.importedAt?.message}>
          <DatePicker
            value={importedAt}
            onChange={(value) =>
              form.setValue("importedAt", value ?? new Date(), { shouldValidate: true })
            }
          />
        </FormFieldShell>
        <FormFieldShell label="Trạng thái" required error={form.formState.errors.status?.message}>
          <Select
            value={status}
            onValueChange={(value) =>
              form.setValue("status", value as ProductStatus, { shouldValidate: true })
            }
          >
            <SelectTrigger className="h-11 rounded-2xl border-white/45 bg-white/55 dark:bg-white/8">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              {productStatusOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormFieldShell>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["originalPrice", "Giá gốc"],
          ["salePrice", "Giá sale"],
          ["discountPercent", "% giảm"],
          ["commissionPercent", "Hoa hồng %"],
          ["estimatedCommission", "Hoa hồng ước tính"],
          ["rating", "Rating"],
          ["reviewCount", "Số review"],
          ["offerAttractiveness", "Độ hấp dẫn offer"],
          ["easeOfFilming", "Độ dễ quay"],
          ["competitionLevel", "Độ cạnh tranh"],
          ["saturationLevel", "Độ bão hòa"],
        ].map(([field, label]) => (
          <FormFieldShell
            key={field}
            label={label ?? ""}
            error={form.formState.errors[field as keyof ProductInput]?.message as string | undefined}
          >
            <Input
              type="number"
              step="0.1"
              {...form.register(field as keyof ProductInput, { valueAsNumber: true })}
            />
          </FormFieldShell>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormFieldShell
          label="Mô tả ngắn"
          description="10 đến 300 ký tự, nên mô tả lợi ích dễ hiểu bằng tiếng Việt tự nhiên."
          required
          error={form.formState.errors.shortDescription?.message}
        >
          <Textarea
            rows={4}
            placeholder="Tóm tắt vì sao sản phẩm đáng test."
            {...form.register("shortDescription")}
          />
        </FormFieldShell>
        <FormFieldShell
          label="Note nội bộ"
          description="Tối đa 1000 ký tự, chỉ nhập nội dung có nghĩa."
          error={form.formState.errors.internalNote?.message}
        >
          <Textarea
            rows={4}
            placeholder="Ghi chú phục vụ nghiên cứu nội bộ."
            {...form.register("internalNote")}
          />
        </FormFieldShell>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Đang lưu..." : "Lưu sản phẩm"}
        </Button>
      </div>
    </form>
  );
}
