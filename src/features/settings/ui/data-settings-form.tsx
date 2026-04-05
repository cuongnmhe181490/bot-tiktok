"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { postJson } from "@/lib/http";
import { dataSettingsSchema, type DataSettingsInput } from "@/features/settings/schema";
import { FormErrorSummary } from "@/components/form-error-summary";
import { FormFieldShell } from "@/components/form-field-shell";
import { Button } from "@/components/ui/button";

type DataSettingsFormProps = {
  initialValues: DataSettingsInput;
};

export function DataSettingsForm({ initialValues }: DataSettingsFormProps) {
  const form = useForm({
    resolver: zodResolver(dataSettingsSchema),
    defaultValues: initialValues,
  });

  const errors = Object.values(form.formState.errors)
    .map((error) => error?.message)
    .filter(Boolean) as string[];

  const onSubmit = form.handleSubmit(async (values) => {
    const result = await postJson("/api/settings/data", {
      ...values,
      freeOnlyMode: true,
    });
    if (!result.ok) {
      toast.error(result.message ?? "Không thể lưu cấu hình dữ liệu.");
      return;
    }
    toast.success("Đã cập nhật chế độ dữ liệu.");
  });

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <FormErrorSummary messages={errors} />

      <FormFieldShell
        label="Chế độ dữ liệu"
        description="Bản hiện tại chỉ hỗ trợ nguồn miễn phí, dữ liệu nhập tay, CSV nội bộ và dữ liệu demo."
      >
        <div className="rounded-2xl border border-white/40 bg-white/60 px-4 py-3 text-sm font-medium text-foreground dark:border-white/10 dark:bg-white/6">
          Free-only
        </div>
      </FormFieldShell>

      <FormFieldShell
        label="Hiển thị dữ liệu demo"
        description="Tắt mục này nếu bạn muốn giao diện ưu tiên bản ghi thật hoặc bản ghi do chính bạn import."
      >
        <label className="flex items-center gap-3 rounded-2xl border border-white/40 bg-white/60 px-4 py-3 text-sm text-foreground dark:border-white/10 dark:bg-white/6">
          <input
            type="checkbox"
            className="size-4 rounded border-slate-300 text-slate-900"
            {...form.register("showDemoData")}
          />
          <span>Cho phép hiển thị bản ghi demo trong các module nghiên cứu và analytics</span>
        </label>
      </FormFieldShell>
      <div className="flex justify-end">
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Đang lưu..." : "Lưu cấu hình dữ liệu"}
        </Button>
      </div>
    </form>
  );
}
