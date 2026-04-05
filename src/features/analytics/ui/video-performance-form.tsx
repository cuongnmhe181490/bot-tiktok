"use client";

import { ConfidenceLevel, Product, SourceType, VerificationStatus, VideoStatus } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import {
  confidenceLevelOptions,
  sourceTypeOptions,
  verificationStatusOptions,
  videoStatusOptions,
} from "@/config/domain";
import { postJson } from "@/lib/http";
import { videoPerformanceSchema, type VideoPerformanceInput } from "@/features/analytics/schema";
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

type VideoPerformanceFormProps = {
  products: Product[];
};

const defaultValues: VideoPerformanceInput = {
  title: "",
  productId: "",
  productGroup: "",
  source: "Manual Entry",
  sourceType: SourceType.MANUAL,
  publishedAt: new Date(),
  videoUrl: "",
  collectedAt: new Date(),
  importedAt: new Date(),
  lastVerifiedAt: undefined,
  confidenceLevel: ConfidenceLevel.LOW,
  verificationStatus: VerificationStatus.CHUA_XAC_MINH,
  externalReferenceUrl: "",
  notes: "",
  hook: "",
  angle: "",
  format: "",
  durationSeconds: 30,
  captionType: "",
  ctaType: "",
  note: "",
  views: 0,
  avgWatchTime: 0,
  completionRate: 0,
  clicks: 0,
  ctr: 0,
  orders: 0,
  revenue: 0,
  commission: 0,
  status: VideoStatus.NHAP,
};

export function VideoPerformanceForm({ products }: VideoPerformanceFormProps) {
  const form = useForm({
    resolver: zodResolver(videoPerformanceSchema),
    defaultValues,
  });

  const productId = useWatch({ control: form.control, name: "productId" }) as string;
  const publishedAt = useWatch({ control: form.control, name: "publishedAt" }) as Date;
  const importedAt = useWatch({ control: form.control, name: "importedAt" }) as Date;
  const collectedAt = useWatch({ control: form.control, name: "collectedAt" }) as Date | undefined;
  const lastVerifiedAt = useWatch({ control: form.control, name: "lastVerifiedAt" }) as Date | undefined;
  const status = useWatch({ control: form.control, name: "status" }) as VideoStatus;
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
    const result = await postJson("/api/analytics/videos", values);
    if (!result.ok) {
      toast.error(result.message ?? "Không thể lưu bản ghi.");
      return;
    }
    toast.success("Đã lưu bản ghi hiệu suất.");
    form.reset(defaultValues);
  });

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <FormErrorSummary messages={errorMessages} />
      <div className="grid gap-4 md:grid-cols-2">
        <FormFieldShell label="Tiêu đề" required error={form.formState.errors.title?.message}>
          <Input {...form.register("title")} />
        </FormFieldShell>
        <FormFieldShell label="Sản phẩm" required error={form.formState.errors.productId?.message}>
          <Select
            value={productId}
            onValueChange={(value) => {
              const product = products.find((item) => item.id === value);
              form.setValue("productId", value, { shouldValidate: true });
              if (product) {
                form.setValue("productGroup", product.category, { shouldValidate: true });
              }
            }}
          >
            <SelectTrigger className="h-11 rounded-2xl border-white/45 bg-white/55 dark:bg-white/8">
              <SelectValue placeholder="Chọn sản phẩm" />
            </SelectTrigger>
            <SelectContent>
              {products.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormFieldShell>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <FormFieldShell label="Nguồn dữ liệu" required error={form.formState.errors.source?.message}>
          <Input {...form.register("source")} placeholder="Ví dụ: CSV Upload hoặc Manual Entry" />
        </FormFieldShell>
        <FormFieldShell label="Loại nguồn" required error={form.formState.errors.sourceType?.message}>
          <Select
            value={sourceType}
            onValueChange={(value) =>
              form.setValue("sourceType", value as SourceType, { shouldValidate: true })
            }
          >
            <SelectTrigger className="h-11 rounded-2xl border-white/45 bg-white/55 dark:bg-white/8">
              <SelectValue />
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
        <FormFieldShell label="Mức độ tin cậy" error={form.formState.errors.confidenceLevel?.message}>
          <Select
            value={confidenceLevel}
            onValueChange={(value) =>
              form.setValue("confidenceLevel", value as ConfidenceLevel, { shouldValidate: true })
            }
          >
            <SelectTrigger className="h-11 rounded-2xl border-white/45 bg-white/55 dark:bg-white/8">
              <SelectValue />
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
        <FormFieldShell label="Trạng thái xác minh" error={form.formState.errors.verificationStatus?.message}>
          <Select
            value={verificationStatus}
            onValueChange={(value) =>
              form.setValue("verificationStatus", value as VerificationStatus, { shouldValidate: true })
            }
          >
            <SelectTrigger className="h-11 rounded-2xl border-white/45 bg-white/55 dark:bg-white/8">
              <SelectValue />
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
      <div className="grid gap-4 md:grid-cols-3">
        <FormFieldShell label="Nhóm sản phẩm" error={form.formState.errors.productGroup?.message}>
          <Input {...form.register("productGroup")} />
        </FormFieldShell>
        <FormFieldShell label="Ngày đăng" error={form.formState.errors.publishedAt?.message}>
          <DatePicker
            value={publishedAt}
            onChange={(value) =>
              form.setValue("publishedAt", value ?? new Date(), { shouldValidate: true })
            }
          />
        </FormFieldShell>
        <FormFieldShell label="URL video" error={form.formState.errors.videoUrl?.message}>
          <Input {...form.register("videoUrl")} />
        </FormFieldShell>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <FormFieldShell label="Lần thu thập" error={form.formState.errors.collectedAt?.message}>
          <DatePicker
            value={collectedAt}
            onChange={(value) => form.setValue("collectedAt", value ?? undefined, { shouldValidate: true })}
          />
        </FormFieldShell>
        <FormFieldShell label="Lần nhập hệ thống" error={form.formState.errors.importedAt?.message}>
          <DatePicker
            value={importedAt}
            onChange={(value) => form.setValue("importedAt", value ?? new Date(), { shouldValidate: true })}
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
        <FormFieldShell label="Liên kết tham chiếu" error={form.formState.errors.externalReferenceUrl?.message}>
          <Input {...form.register("externalReferenceUrl")} placeholder="https://..." />
        </FormFieldShell>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <FormFieldShell label="Hook" error={form.formState.errors.hook?.message}>
          <Textarea rows={3} {...form.register("hook")} />
        </FormFieldShell>
        <FormFieldShell label="Angle" error={form.formState.errors.angle?.message}>
          <Textarea rows={3} {...form.register("angle")} />
        </FormFieldShell>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["format", "Format"],
          ["captionType", "Caption type"],
          ["ctaType", "CTA type"],
        ].map(([field, label]) => (
          <FormFieldShell
            key={field}
            label={label ?? ""}
            error={form.formState.errors[field as keyof VideoPerformanceInput]?.message as string | undefined}
          >
            <Input {...form.register(field as keyof VideoPerformanceInput)} />
          </FormFieldShell>
        ))}
        <FormFieldShell label="Trạng thái" error={form.formState.errors.status?.message}>
          <Select
            value={status}
            onValueChange={(value) =>
              form.setValue("status", value as VideoStatus, { shouldValidate: true })
            }
          >
            <SelectTrigger className="h-11 rounded-2xl border-white/45 bg-white/55 dark:bg-white/8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {videoStatusOptions.map((item) => (
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
          ["durationSeconds", "Thời lượng"],
          ["views", "Views"],
          ["avgWatchTime", "Avg watch time"],
          ["completionRate", "Completion rate"],
          ["clicks", "Clicks"],
          ["ctr", "CTR"],
          ["orders", "Orders"],
          ["revenue", "Doanh thu"],
          ["commission", "Commission"],
        ].map(([field, label]) => (
          <FormFieldShell
            key={field}
            label={label ?? ""}
            error={form.formState.errors[field as keyof VideoPerformanceInput]?.message as string | undefined}
          >
            <Input
              type="number"
              step="0.1"
              {...form.register(field as keyof VideoPerformanceInput, { valueAsNumber: true })}
            />
          </FormFieldShell>
        ))}
      </div>
      <FormFieldShell label="Ghi chú" error={form.formState.errors.note?.message}>
        <Textarea rows={3} {...form.register("note")} />
      </FormFieldShell>
      <FormFieldShell label="Ghi chú dữ liệu" error={form.formState.errors.notes?.message}>
        <Textarea rows={3} {...form.register("notes")} placeholder="Ví dụ: import từ CSV nội bộ ngày 04/04, chưa đối chiếu lại CTR." />
      </FormFieldShell>
      <div className="flex justify-end">
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Đang lưu..." : "Lưu bản ghi"}
        </Button>
      </div>
    </form>
  );
}
