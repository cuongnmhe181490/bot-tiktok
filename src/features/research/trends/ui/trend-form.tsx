"use client";

import { ConfidenceLevel, SourceType, TrendType, VerificationStatus } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import {
  confidenceLevelOptions,
  sourceTypeOptions,
  trendTypeOptions,
  verificationStatusOptions,
} from "@/config/domain";
import { postJson } from "@/lib/http";
import { trendSchema, type TrendInput } from "@/features/research/trends/schema";
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

const defaultValues: TrendInput = {
  name: "",
  trendType: TrendType.HOOK,
  source: "Manual Entry",
  sourceType: SourceType.MANUAL,
  description: "",
  suitableNiche: "",
  externalReferenceUrl: "",
  region: "",
  timeWindow: "",
  trendScore: 0,
  heatLevel: 6,
  applicability: 6,
  saturationLevel: 4,
  discoveredAt: new Date(),
  collectedAt: new Date(),
  importedAt: new Date(),
  lastVerifiedAt: undefined,
  confidenceLevel: ConfidenceLevel.LOW,
  verificationStatus: VerificationStatus.CHUA_XAC_MINH,
  notes: "",
  note: "",
};

export function TrendForm() {
  const form = useForm({
    resolver: zodResolver(trendSchema),
    defaultValues,
  });

  const trendType = useWatch({ control: form.control, name: "trendType" }) as TrendType;
  const discoveredAt = useWatch({ control: form.control, name: "discoveredAt" }) as Date;
  const importedAt = useWatch({ control: form.control, name: "importedAt" }) as Date;
  const collectedAt = useWatch({ control: form.control, name: "collectedAt" }) as Date | undefined;
  const lastVerifiedAt = useWatch({ control: form.control, name: "lastVerifiedAt" }) as Date | undefined;
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
    const result = await postJson("/api/trends", values);
    if (!result.ok) {
      toast.error(result.message ?? "Không thể lưu trend.");
      return;
    }

    toast.success("Đã thêm trend.");
    form.reset(defaultValues);
  });

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <FormErrorSummary messages={errorMessages} />
      <div className="grid gap-4 md:grid-cols-2">
        <FormFieldShell label="Tên trend" required error={form.formState.errors.name?.message}>
          <Input {...form.register("name")} placeholder="Ví dụ: Hook mở đầu bằng lỗi phổ biến" />
        </FormFieldShell>
        <FormFieldShell label="Loại trend" required error={form.formState.errors.trendType?.message}>
          <Select
            value={trendType}
            onValueChange={(value) =>
              form.setValue("trendType", value as TrendType, { shouldValidate: true })
            }
          >
            <SelectTrigger className="h-11 rounded-2xl border-white/45 bg-white/55 dark:bg-white/8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {trendTypeOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormFieldShell>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <FormFieldShell label="Nguồn dữ liệu" required error={form.formState.errors.source?.message}>
          <Input {...form.register("source")} placeholder="Ví dụ: TikTok Creative Center" />
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
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <FormFieldShell label="Niche phù hợp" required error={form.formState.errors.suitableNiche?.message}>
          <Input {...form.register("suitableNiche")} />
        </FormFieldShell>
        <FormFieldShell label="Liên kết tham chiếu" error={form.formState.errors.externalReferenceUrl?.message}>
          <Input {...form.register("externalReferenceUrl")} placeholder="https://..." />
        </FormFieldShell>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <FormFieldShell label="Độ nóng" error={form.formState.errors.heatLevel?.message}>
          <Input type="number" {...form.register("heatLevel", { valueAsNumber: true })} />
        </FormFieldShell>
        <FormFieldShell label="Dễ áp dụng" error={form.formState.errors.applicability?.message}>
          <Input type="number" {...form.register("applicability", { valueAsNumber: true })} />
        </FormFieldShell>
        <FormFieldShell label="Độ bão hòa" error={form.formState.errors.saturationLevel?.message}>
          <Input type="number" {...form.register("saturationLevel", { valueAsNumber: true })} />
        </FormFieldShell>
        <FormFieldShell label="Ngày phát hiện" error={form.formState.errors.discoveredAt?.message}>
          <DatePicker
            value={discoveredAt}
            onChange={(value) =>
              form.setValue("discoveredAt", value ?? new Date(), { shouldValidate: true })
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
        <FormFieldShell label="Trend score" error={form.formState.errors.trendScore?.message}>
          <Input type="number" {...form.register("trendScore", { valueAsNumber: true })} />
        </FormFieldShell>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <FormFieldShell label="Khu vực" error={form.formState.errors.region?.message}>
          <Input {...form.register("region")} placeholder="Ví dụ: VN" />
        </FormFieldShell>
        <FormFieldShell label="Khung thời gian" error={form.formState.errors.timeWindow?.message}>
          <Input {...form.register("timeWindow")} placeholder="Ví dụ: 7 ngày gần nhất" />
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
      <FormFieldShell label="Mô tả" required error={form.formState.errors.description?.message}>
        <Textarea rows={4} {...form.register("description")} />
      </FormFieldShell>
      <FormFieldShell label="Ghi chú dữ liệu" error={form.formState.errors.notes?.message}>
        <Textarea rows={3} {...form.register("notes")} placeholder="Nguồn nhập, mức độ chắc chắn hoặc điểm cần đối chiếu thêm." />
      </FormFieldShell>
      <FormFieldShell label="Ghi chú" error={form.formState.errors.note?.message}>
        <Textarea rows={3} {...form.register("note")} />
      </FormFieldShell>
      <div className="flex justify-end">
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Đang lưu..." : "Lưu trend"}
        </Button>
      </div>
    </form>
  );
}
