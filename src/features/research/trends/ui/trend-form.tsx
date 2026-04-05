"use client";

import { TrendType } from "@prisma/client";
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

const defaultValues: TrendInput = {
  name: "",
  trendType: TrendType.HOOK,
  description: "",
  suitableNiche: "",
  referenceUrl: "",
  heatLevel: 6,
  applicability: 6,
  saturationLevel: 4,
  discoveredAt: new Date(),
  note: "",
};

export function TrendForm() {
  const form = useForm({
    resolver: zodResolver(trendSchema),
    defaultValues,
  });

  const trendType = useWatch({ control: form.control, name: "trendType" }) as TrendType;
  const discoveredAt = useWatch({ control: form.control, name: "discoveredAt" }) as Date;

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
        <FormFieldShell label="Niche phù hợp" required error={form.formState.errors.suitableNiche?.message}>
          <Input {...form.register("suitableNiche")} />
        </FormFieldShell>
        <FormFieldShell label="Link tham khảo" error={form.formState.errors.referenceUrl?.message}>
          <Input {...form.register("referenceUrl")} placeholder="https://..." />
        </FormFieldShell>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
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
      <FormFieldShell label="Mô tả" required error={form.formState.errors.description?.message}>
        <Textarea rows={4} {...form.register("description")} />
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
