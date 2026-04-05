type FormErrorSummaryProps = {
  messages: string[];
};

export function FormErrorSummary({ messages }: FormErrorSummaryProps) {
  if (messages.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="rounded-2xl border border-rose-200/80 bg-rose-50/75 px-4 py-3.5 text-sm text-rose-700 dark:border-rose-400/20 dark:bg-rose-950/20 dark:text-rose-200"
    >
      <p className="font-medium">Biểu mẫu chưa thể gửi.</p>
      <ul className="mt-2 space-y-1">
        {messages.slice(0, 4).map((message) => (
          <li key={message}>- {message}</li>
        ))}
      </ul>
    </div>
  );
}
