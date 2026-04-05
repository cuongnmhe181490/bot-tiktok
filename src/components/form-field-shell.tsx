type FormFieldShellProps = {
  label: string;
  description?: string | undefined;
  error?: string | undefined;
  required?: boolean | undefined;
  children: React.ReactNode;
};

export function FormFieldShell({
  label,
  description,
  error,
  required,
  children,
}: FormFieldShellProps) {
  return (
    <label className="space-y-2.5">
      <div className="space-y-1.5">
        <span className="text-sm font-medium text-foreground">
          {label} {required ? <span className="text-rose-500">*</span> : null}
        </span>
        {description ? <p className="text-xs leading-5">{description}</p> : null}
      </div>
      {children}
      {error ? <p className="text-sm leading-6 text-rose-600 dark:text-rose-300">{error}</p> : null}
    </label>
  );
}
