import { GlassPanel } from "@/components/glass-panel";
import { Skeleton } from "@/components/ui/skeleton";

export default function WorkspaceLoading() {
  return (
    <div className="space-y-6">
      <GlassPanel className="space-y-4">
        <Skeleton className="h-4 w-28 rounded-full" />
        <Skeleton className="h-10 w-2/3 rounded-2xl" />
        <Skeleton className="h-5 w-1/2 rounded-full" />
      </GlassPanel>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <GlassPanel key={index}>
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="mt-3 h-10 w-28 rounded-2xl" />
          </GlassPanel>
        ))}
      </div>
    </div>
  );
}
