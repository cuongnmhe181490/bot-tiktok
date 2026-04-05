"use client";

import { TrendType, SourceType, ConfidenceLevel, VerificationStatus } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { trendTypeOptions } from "@/config/domain";
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

type BulkRow = TrendInput;

const defaultValues: TrendInput = {
  name: "",
  trendType: TrendType.HOOK,
  source: "TikTok Creative Center",
  sourceType: SourceType.TIKTOK_CREATIVE_CENTER,
  description: "Trend nhập nhanh từ TikTok Creative Center để theo dõi tín hiệu sớm.",
  suitableNiche: "",
  externalReferenceUrl: "",
  region: "",
  timeWindow: "",
  trendScore: 0,
  heatLevel: 7,
  applicability: 6,
  saturationLevel: 4,
  discoveredAt: new Date(),
  collectedAt: new Date(),
  importedAt: new Date(),
  lastVerifiedAt: undefined,
  confidenceLevel: ConfidenceLevel.MEDIUM,
  verificationStatus: VerificationStatus.CHUA_XAC_MINH,
  notes: "",
  note: "",
};

function parseBulkPaste(text: string): BulkRow[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, trendType, suitableNiche, heatLevel, applicability, saturationLevel, url, note] =
        line.split("|").map((item) => item.trim());

      return {
        ...defaultValues,
        name: name || "",
        trendType: ((trendType || "HOOK").toUpperCase() as TrendType) ?? TrendType.HOOK,
        suitableNiche: suitableNiche || "Chưa gắn niche",
        heatLevel: Number(heatLevel || 6),
        applicability: Number(applicability || 6),
        saturationLevel: Number(saturationLevel || 4),
        externalReferenceUrl: url || "",
        note: note || "",
      };
    });
}

export function CreativeCenterImport() {
  const form = useForm({
    resolver: zodResolver(trendSchema),
    defaultValues,
  });

  const errors = Object.values(form.formState.errors)
    .map((error) => error?.message)
    .filter(Boolean) as string[];
  const trendType = useWatch({ control: form.control, name: "trendType" }) as TrendType;
  const collectedAt = useWatch({ control: form.control, name: "collectedAt" }) as Date | undefined;

  const onSubmit = form.handleSubmit(async (values) => {
    const result = await postJson("/api/trends", values);
    if (!result.ok) {
      toast.error(result.message ?? "Không thể lưu trend từ Creative Center.");
      return;
    }

    toast.success("Đã thêm trend từ Creative Center.");
    form.reset(defaultValues);
  });

  const bulkImport = async () => {
    const raw = form.getValues("notes") ?? "";
    const rows = parseBulkPaste(raw);

    if (rows.length === 0) {
      toast.error("Chưa có dòng bulk paste hợp lệ.");
      return;
    }

    const result = await postJson("/api/trends/import", { rows });
    if (!result.ok) {
      toast.error(result.message ?? "Không thể import danh sách trend.");
      return;
    }

    toast.success(result.message ?? "Đã import danh sách trend.");
    form.reset(defaultValues);
  };

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <FormErrorSummary messages={errors} />
      <div className="grid gap-4 md:grid-cols-2">
        <FormFieldShell label="Tên trend" required error={form.formState.errors.name?.message}>
          <Input {...form.register("name")} placeholder="Ví dụ: Hook mở đầu bằng lỗi phổ biến" />
        </FormFieldShell>
        <FormFieldShell label="Loại trend" required error={form.formState.errors.trendType?.message}>
          <Select
            value={trendType}
            onValueChange={(value) => form.setValue("trendType", value as TrendType, { shouldValidate: true })}
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
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <FormFieldShell label="Niche" required error={form.formState.errors.suitableNiche?.message}>
          <Input {...form.register("suitableNiche")} placeholder="Ví dụ: Đồ gia dụng" />
        </FormFieldShell>
        <FormFieldShell label="Độ nóng" error={form.formState.errors.heatLevel?.message}>
          <Input type="number" {...form.register("heatLevel", { valueAsNumber: true })} />
        </FormFieldShell>
        <FormFieldShell label="Dễ áp dụng" error={form.formState.errors.applicability?.message}>
          <Input type="number" {...form.register("applicability", { valueAsNumber: true })} />
        </FormFieldShell>
        <FormFieldShell label="Độ bão hòa" error={form.formState.errors.saturationLevel?.message}>
          <Input type="number" {...form.register("saturationLevel", { valueAsNumber: true })} />
        </FormFieldShell>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <FormFieldShell label="Liên kết nguồn" error={form.formState.errors.externalReferenceUrl?.message}>
          <Input {...form.register("externalReferenceUrl")} placeholder="https://creativecenter.tiktok.com/..." />
        </FormFieldShell>
        <FormFieldShell label="Lần thu thập" error={form.formState.errors.collectedAt?.message}>
          <DatePicker
            value={collectedAt}
            onChange={(value) => form.setValue("collectedAt", value ?? undefined, { shouldValidate: true })}
          />
        </FormFieldShell>
      </div>
      <FormFieldShell label="Mô tả" error={form.formState.errors.description?.message}>
        <Textarea rows={3} {...form.register("description")} />
      </FormFieldShell>
      <FormFieldShell
        label="Ghi chú và bulk paste"
        description="Có thể dán nhiều dòng theo mẫu: tên | loại | niche | heat | ease | saturation | url | ghi chú"
        error={form.formState.errors.notes?.message}
      >
        <Textarea rows={5} {...form.register("notes")} placeholder="Mỗi dòng một trend nếu muốn import nhanh." />
      </FormFieldShell>
      <FormFieldShell label="Ghi chú hành động" error={form.formState.errors.note?.message}>
        <Textarea rows={3} {...form.register("note")} placeholder="Ví dụ: nên ghép với video dạng review nhanh." />
      </FormFieldShell>
      <div className="flex flex-wrap justify-end gap-2">
        <Button type="button" variant="outline" onClick={bulkImport} disabled={form.formState.isSubmitting}>
          Import nhiều dòng
        </Button>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Đang lưu..." : "Lưu trend từ Creative Center"}
        </Button>
      </div>
    </form>
  );
}
