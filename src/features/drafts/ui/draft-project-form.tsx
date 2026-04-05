"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { useLocalDraft } from "@/hooks/use-local-draft";
import { postJson } from "@/lib/http";
import { draftProjectSchema, type DraftProjectInput } from "@/features/drafts/schema";
import { FormErrorSummary } from "@/components/form-error-summary";
import { FormFieldShell } from "@/components/form-field-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const initialValues: DraftProjectInput = {
  title: "",
  productName: "",
  rawScript: "",
};

export function DraftProjectForm() {
  const draft = useLocalDraft("draft-project-form", initialValues);
  const form = useForm({
    resolver: zodResolver(draftProjectSchema),
    values: draft.value,
  });

  const watchedValues = useWatch({ control: form.control });

  React.useEffect(() => {
    draft.setValue({
      ...initialValues,
      ...(watchedValues as Partial<DraftProjectInput>),
    });
  }, [draft, watchedValues]);

  const errorMessages = Object.values(form.formState.errors)
    .map((error) => error?.message)
    .filter(Boolean) as string[];

  const onSubmit = form.handleSubmit(async (values) => {
    const result = await postJson("/api/drafts", values);
    if (!result.ok) {
      toast.error(result.message ?? "Không thể tạo project nháp.");
      return;
    }

    toast.success("Đã tạo bundle video nháp.");
    draft.reset();
    form.reset(initialValues);
  });

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <FormErrorSummary messages={errorMessages} />
      <div className="grid gap-4 md:grid-cols-2">
        <FormFieldShell label="Tên dự án" required error={form.formState.errors.title?.message}>
          <Input {...form.register("title")} />
        </FormFieldShell>
        <FormFieldShell label="Tên sản phẩm" required error={form.formState.errors.productName?.message}>
          <Input {...form.register("productName")} />
        </FormFieldShell>
      </div>
      <FormFieldShell
        label="Raw script"
        description="Nhập script gốc đủ rõ để hệ thống chia câu, gợi ý timestamp và xuất subtitle."
        required
        error={form.formState.errors.rawScript?.message}
      >
        <Textarea rows={8} {...form.register("rawScript")} />
      </FormFieldShell>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">Autosave cục bộ được bật cho form này.</p>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Đang tạo..." : "Tạo video nháp"}
        </Button>
      </div>
    </form>
  );
}
