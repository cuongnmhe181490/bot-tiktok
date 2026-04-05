import { DataTrustBadges } from "@/components/data-trust-badges";

type ProvenancePanelProps = {
  source: string;
  sourceType: string;
  collectedAt?: Date | null;
  importedAt?: Date | null;
  lastVerifiedAt?: Date | null;
  confidenceLevel: string;
  verificationStatus: string;
  isDemo?: boolean;
  externalReferenceUrl?: string | null;
  notes?: string | null;
  title?: string;
};

function formatDate(value?: Date | null) {
  if (!value) return "Chưa có";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(value);
}

export function ProvenancePanel({
  source,
  sourceType,
  collectedAt,
  importedAt,
  lastVerifiedAt,
  confidenceLevel,
  verificationStatus,
  isDemo,
  externalReferenceUrl,
  notes,
  title = "Dữ liệu tham chiếu",
}: ProvenancePanelProps) {
  return (
    <div className="space-y-4 rounded-[1.6rem] border border-white/45 bg-white/72 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-white/6">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <DataTrustBadges
          source={source}
          sourceType={sourceType}
          confidenceLevel={confidenceLevel}
          verificationStatus={verificationStatus}
          isDemo={isDemo}
        />
      </div>

      <dl className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
        <div>
          <dt className="text-[11px] uppercase tracking-[0.16em]">Nguồn dữ liệu</dt>
          <dd className="mt-1 text-foreground">{source}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-[0.16em]">Lần thu thập</dt>
          <dd className="mt-1 text-foreground">{formatDate(collectedAt)}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-[0.16em]">Lần nhập hệ thống</dt>
          <dd className="mt-1 text-foreground">{formatDate(importedAt)}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-[0.16em]">Lần xác minh gần nhất</dt>
          <dd className="mt-1 text-foreground">{formatDate(lastVerifiedAt)}</dd>
        </div>
      </dl>

      {externalReferenceUrl ? (
        <a
          href={externalReferenceUrl}
          target="_blank"
          rel="noreferrer"
          className="block text-sm text-sky-700 transition hover:text-sky-800 dark:text-sky-300 dark:hover:text-sky-200"
        >
          Mở liên kết tham chiếu
        </a>
      ) : null}

      {notes ? (
        <p className="rounded-2xl bg-white/56 px-4 py-3 text-sm leading-6 text-muted-foreground dark:bg-white/7">
          {notes}
        </p>
      ) : null}
    </div>
  );
}
