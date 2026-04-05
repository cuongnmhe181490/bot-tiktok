export type Option<T extends string> = {
  label: string;
  value: T;
  helper?: string;
};

export type KPIItem = {
  label: string;
  value: string;
  delta?: string;
  tone?: "neutral" | "positive" | "warning" | "danger";
};

export type ChartPoint = {
  label: string;
  value: number;
};
