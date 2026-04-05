"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type LinePerformanceChartProps = {
  data: Array<{ label: string; value: number }>;
};

export function LinePerformanceChart({
  data,
}: LinePerformanceChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid stroke="rgba(148, 163, 184, 0.16)" vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={40} />
        <Tooltip
          contentStyle={{
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(255,255,255,0.82)",
            backdropFilter: "blur(12px)",
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="oklch(var(--chart-1))"
          strokeWidth={2.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
