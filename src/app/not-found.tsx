import Link from "next/link";
import { GlassPanel } from "@/components/glass-panel";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4">
      <GlassPanel className="space-y-5 text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
          404
        </p>
        <h1 className="text-3xl font-semibold">Trang này không còn ở đây.</h1>
        <p>
          Có thể đường dẫn đã thay đổi hoặc nội dung chưa được tạo. Bạn có thể quay lại
          dashboard để tiếp tục công việc.
        </p>
        <Button asChild>
          <Link href="/dashboard">Quay lại dashboard</Link>
        </Button>
      </GlassPanel>
    </div>
  );
}
