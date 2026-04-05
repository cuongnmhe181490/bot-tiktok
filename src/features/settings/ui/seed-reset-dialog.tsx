"use client";

import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function SeedResetDialog() {
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText("npm run prisma:seed");
      toast.success("Đã copy lệnh reset dữ liệu mẫu.");
    } catch {
      toast.error("Không thể copy lệnh reset.");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Mở hướng dẫn reset</Button>
      </DialogTrigger>
      <DialogContent className="rounded-[1.5rem] border-white/50 bg-white/92 p-5 shadow-2xl backdrop-blur-xl dark:bg-slate-950/88">
        <DialogHeader className="space-y-2">
          <DialogTitle>Reset dữ liệu mẫu</DialogTitle>
          <DialogDescription>
            Với bản local, cách an toàn nhất là chạy lại seed script. Production hiện dùng chế độ fallback đọc dữ liệu để tránh crash trên serverless.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-2xl bg-slate-100/80 p-4 font-mono text-sm text-foreground dark:bg-white/8">
          npm run prisma:seed
        </div>
        <DialogFooter className="gap-2 border-t-white/40 bg-transparent p-0 pt-4">
          <Button variant="outline" onClick={handleCopy}>
            Copy lệnh
          </Button>
          <Button asChild>
            <a href="/settings#scoring">Quay lại cài đặt</a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
