"use client";

import { ConfidenceLevel, ProductStatus, SourceType, VerificationStatus } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import {
  confidenceLevelOptions,
  productStatusOptions,
  sourceTypeOptions,
  verificationStatusOptions,
} from "@/config/domain";
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
  source: "Manual Entry",
  sourceType: SourceType.MANUAL,
  collectedAt: new Date(),
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
  lastVerifiedAt: undefined,
  confidenceLevel: ConfidenceLevel.LOW,
  verificationStatus: VerificationStatus.CHUA_XAC_MINH,
  externalReferenceUrl: "",
  notes: "",
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
  const collectedAt = useWatch({ control: form.control, name: "collectedAt" }) as Date | undefined;
  const lastVerifiedAt = useWatch({ control: form.control, name: "lastVerifiedAt" }) as Date | undefined;
  const status = useWatch({ control: form.control, name: "status" }) as ProductStatus;
  const sourceType = useWatch({ control: form.control, name: "sourceType" }) as SourceType;
  const confidenceLevel = useWatch({
    control: form.control,
    name: "confidenceLevel",
  }) as ConfidenceLevel;
  const verificationStatus = useWatch({
    control: form.control,
    name: "verificationStatus",
  }) as VerificationStatus;

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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <FormFieldShell
          label="Nguồn dữ liệu"
          required
          description="Ví dụ: TikTok Creative Center, CSV Upload hoặc Manual Entry."
          error={form.formState.errors.source?.message}
        >
          <Input {...form.register("source")} />
        </FormFieldShell>
        <FormFieldShell label="Loại nguồn" required error={form.formState.errors.sourceType?.message}>
          <Select
            value={sourceType}
            onValueChange={(value) =>
              form.setValue("sourceType", value as SourceType, { shouldValidate: true })
            }
          >
            <SelectTrigger className="h-11 rounded-2xl border-white/45 bg-white/55 dark:bg-white/8">
              <SelectValue placeholder="Chọn loại nguồn" />
            </SelectTrigger>
            <SelectContent>
              {sourceTypeOptions
                .filter((item) => item.value !== "INTERNAL_GENERATED")
                .map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </FormFieldShell>
        <FormFieldShell label="Ngành hàng" required error={form.formState.errors.category?.message}>
          <Input {...form.register("category")} />
        </FormFieldShell>
        <FormFieldShell label="Lần nhập hệ thống" required error={form.formState.errors.importedAt?.message}>
          <DatePicker
            value={importedAt}
            onChange={(value) =>
              form.setValue("importedAt", value ?? new Date(), { shouldValidate: true })
            }
          />
        </FormFieldShell>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <FormFieldShell label="Lần thu thập" error={form.formState.errors.collectedAt?.message}>
          <DatePicker
            value={collectedAt}
            onChange={(value) => form.setValue("collectedAt", value ?? undefined, { shouldValidate: true })}
          />
        </FormFieldShell>
        <FormFieldShell label="Lần xác minh gần nhất" error={form.formState.errors.lastVerifiedAt?.message}>
          <DatePicker
            value={lastVerifiedAt}
            onChange={(value) =>
              form.setValue("lastVerifiedAt", value ?? undefined, { shouldValidate: true })
            }
          />
        </FormFieldShell>
        <FormFieldShell label="Mức độ tin cậy" required error={form.formState.errors.confidenceLevel?.message}>
          <Select
            value={confidenceLevel}
            onValueChange={(value) =>
              form.setValue("confidenceLevel", value as ConfidenceLevel, { shouldValidate: true })
            }
          >
            <SelectTrigger className="h-11 rounded-2xl border-white/45 bg-white/55 dark:bg-white/8">
              <SelectValue placeholder="Chọn mức tin cậy" />
            </SelectTrigger>
            <SelectContent>
              {confidenceLevelOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormFieldShell>
        <FormFieldShell label="Trạng thái xác minh" required error={form.formState.errors.verificationStatus?.message}>
          <Select
            value={verificationStatus}
            onValueChange={(value) =>
              form.setValue("verificationStatus", value as VerificationStatus, { shouldValidate: true })
            }
          >
            <SelectTrigger className="h-11 rounded-2xl border-white/45 bg-white/55 dark:bg-white/8">
              <SelectValue placeholder="Chọn trạng thái xác minh" />
            </SelectTrigger>
            <SelectContent>
              {verificationStatusOptions
                .filter((item) => item.value !== "DU_LIEU_DEMO")
                .map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </FormFieldShell>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormFieldShell label="Liên kết tham chiếu" error={form.formState.errors.externalReferenceUrl?.message}>
          <Input placeholder="https://creativecenter.tiktok.com/..." {...form.register("externalReferenceUrl")} />
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
          label="Ghi chú dữ liệu"
          description="Dùng cho provenance: ví dụ nguồn nào, đã đối chiếu tới đâu, còn điểm nào cần rà lại."
          error={form.formState.errors.notes?.message}
        >
          <Textarea rows={4} placeholder="Ví dụ: đối chiếu bằng ảnh chụp Creative Center ngày 05/04." {...form.register("notes")} />
        </FormFieldShell>
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
      </div>

      <FormFieldShell
        label="Ghi chú nội bộ"
        description="Tối đa 1000 ký tự, tách biệt với phần dữ liệu tham chiếu ở trên."
        error={form.formState.errors.internalNote?.message}
      >
        <Textarea
          rows={4}
          placeholder="Ghi chú phục vụ scoring, angle test hoặc lưu ý khi quay."
          {...form.register("internalNote")}
        />
      </FormFieldShell>

      <div className="flex justify-end">
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Đang lưu..." : "Lưu sản phẩm"}
        </Button>
      </div>
    </form>
  );
}
