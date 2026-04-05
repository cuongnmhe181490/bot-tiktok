"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { postJson } from "@/lib/http";
import {
  scoringSettingsSchema,
  type ScoringSettingsInput,
} from "@/features/settings/schema";
import { FormErrorSummary } from "@/components/form-error-summary";
import { FormFieldShell } from "@/components/form-field-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ScoringSettingsFormProps = {
  initialValues: ScoringSettingsInput;
};

export function ScoringSettingsForm({
  initialValues,
}: ScoringSettingsFormProps) {
  const form = useForm({
    resolver: zodResolver(scoringSettingsSchema),
    defaultValues: initialValues,
  });

  const errorMessages = Object.values(form.formState.errors)
    .map((error) => error?.message)
    .filter(Boolean) as string[];

  const onSubmit = form.handleSubmit(async (values) => {
    const result = await postJson("/api/settings/scoring", values);
    if (!result.ok) {
      toast.error(result.message ?? "Không thể cập nhật trọng số.");
      return;
    }
    toast.success("Đã cập nhật trọng số scoring.");
  });

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <FormErrorSummary messages={errorMessages} />
      <div className="grid gap-4 md:grid-cols-2">
        {[
          ["easeWeight", "Trọng số độ dễ quay"],
          ["competitionWeight", "Trọng số cạnh tranh"],
          ["saturationWeight", "Trọng số bão hòa"],
          ["offerWeight", "Trọng số offer"],
          ["commissionWeight", "Trọng số hoa hồng"],
        ].map(([field, label]) => (
          <FormFieldShell
            key={field}
            label={label ?? ""}
            error={form.formState.errors[field as keyof ScoringSettingsInput]?.message as string | undefined}
          >
            <Input type="number" {...form.register(field as keyof ScoringSettingsInput, { valueAsNumber: true })} />
          </FormFieldShell>
        ))}
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Đang cập nhật..." : "Lưu trọng số"}
        </Button>
      </div>
    </form>
  );
}
