"use client";

import * as React from "react";
import { GoalType, Product, ScriptTemplate, ToneType } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { goalOptions, toneOptions } from "@/config/domain";
import { useLocalDraft } from "@/hooks/use-local-draft";
import { postJson } from "@/lib/http";
import { scriptDraftSchema, type ScriptDraftInput } from "@/features/scripts/schema";
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

type ScriptGeneratorFormProps = {
  products: Product[];
  templates: ScriptTemplate[];
};

const initialValues: ScriptDraftInput = {
  title: "",
  productId: "",
  audience: "",
  painPoints: "",
  strengths: "",
  notes: "",
  tone: ToneType.THUC_TE,
  goal: GoalType.TANG_CLICK,
  durationSeconds: 35,
  templateId: "",
};

export function ScriptGeneratorForm({
  products,
  templates,
}: ScriptGeneratorFormProps) {
  const draft = useLocalDraft("script-generator-form", initialValues);
  const form = useForm({
    resolver: zodResolver(scriptDraftSchema),
    values: draft.value,
  });

  const watchedValues = useWatch({ control: form.control });
  const productId = useWatch({ control: form.control, name: "productId" }) as string;
  const tone = useWatch({ control: form.control, name: "tone" }) as ToneType;
  const goal = useWatch({ control: form.control, name: "goal" }) as GoalType;
  const templateId = useWatch({ control: form.control, name: "templateId" }) as string;

  React.useEffect(() => {
    draft.setValue({
      ...initialValues,
      ...(watchedValues as Partial<ScriptDraftInput>),
    });
  }, [draft, watchedValues]);

  const errorMessages = Object.values(form.formState.errors)
    .map((error) => error?.message)
    .filter(Boolean) as string[];

  const onSubmit = form.handleSubmit(async (values) => {
    const result = await postJson("/api/scripts", values);
    if (!result.ok) {
      toast.error(result.message ?? "Không thể tạo kịch bản.");
      return;
    }

    toast.success("Đã tạo kịch bản mới.");
    draft.reset();
    form.reset(initialValues);
  });

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <FormErrorSummary messages={errorMessages} />
      <div className="grid gap-4 md:grid-cols-2">
        <FormFieldShell label="Tên bộ kịch bản" required error={form.formState.errors.title?.message}>
          <Input {...form.register("title")} />
        </FormFieldShell>
        <FormFieldShell label="Sản phẩm" required error={form.formState.errors.productId?.message}>
          <Select
            value={productId}
            onValueChange={(value) => form.setValue("productId", value, { shouldValidate: true })}
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
      <div className="grid gap-4 md:grid-cols-2">
        <FormFieldShell label="Đối tượng khách hàng" required error={form.formState.errors.audience?.message}>
          <Input {...form.register("audience")} />
        </FormFieldShell>
        <FormFieldShell label="Template" error={form.formState.errors.templateId?.message}>
          <Select
            value={templateId || "none"}
            onValueChange={(value) =>
              form.setValue("templateId", value === "none" ? "" : value, { shouldValidate: true })
            }
          >
            <SelectTrigger className="h-11 rounded-2xl border-white/45 bg-white/55 dark:bg-white/8">
              <SelectValue placeholder="Chọn template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Không dùng template</SelectItem>
              {templates.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormFieldShell>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <FormFieldShell label="Pain points" required error={form.formState.errors.painPoints?.message}>
          <Textarea rows={4} {...form.register("painPoints")} />
        </FormFieldShell>
        <FormFieldShell label="Điểm mạnh" required error={form.formState.errors.strengths?.message}>
          <Textarea rows={4} {...form.register("strengths")} />
        </FormFieldShell>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <FormFieldShell label="Tone" error={form.formState.errors.tone?.message}>
          <Select
            value={tone}
            onValueChange={(value) => form.setValue("tone", value as ToneType, { shouldValidate: true })}
          >
            <SelectTrigger className="h-11 rounded-2xl border-white/45 bg-white/55 dark:bg-white/8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {toneOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormFieldShell>
        <FormFieldShell label="Mục tiêu video" error={form.formState.errors.goal?.message}>
          <Select
            value={goal}
            onValueChange={(value) => form.setValue("goal", value as GoalType, { shouldValidate: true })}
          >
            <SelectTrigger className="h-11 rounded-2xl border-white/45 bg-white/55 dark:bg-white/8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {goalOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormFieldShell>
        <FormFieldShell label="Độ dài video" error={form.formState.errors.durationSeconds?.message}>
          <Input type="number" {...form.register("durationSeconds", { valueAsNumber: true })} />
        </FormFieldShell>
      </div>
      <FormFieldShell label="Lưu ý" error={form.formState.errors.notes?.message}>
        <Textarea rows={4} {...form.register("notes")} />
      </FormFieldShell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Biểu mẫu dài sẽ tự lưu cục bộ để bạn không mất dữ liệu nháp.
        </p>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Đang tạo..." : "Tạo bộ kịch bản"}
        </Button>
      </div>
    </form>
  );
}
