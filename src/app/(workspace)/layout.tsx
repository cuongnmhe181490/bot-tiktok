import { AppSidebar } from "@/components/app-sidebar";
import { Topbar } from "@/components/topbar";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-screen max-w-[1600px] gap-4 px-3 py-4 sm:px-4 lg:px-6">
      <AppSidebar />
      <div className="min-w-0 flex-1 space-y-4">
        <Topbar />
        <main className="space-y-6 pb-8">{children}</main>
      </div>
    </div>
  );
}
