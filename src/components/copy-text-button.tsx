"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type CopyTextButtonProps = {
  value: string;
  label?: string;
};

export function CopyTextButton({
  value,
  label = "Copy",
}: CopyTextButtonProps) {
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Đã copy nội dung.");
    } catch {
      toast.error("Không thể copy nội dung.");
    }
  }

  return (
    <Button type="button" variant="ghost" size="sm" onClick={handleCopy}>
      <Copy className="size-3.5" />
      {label}
    </Button>
  );
}
