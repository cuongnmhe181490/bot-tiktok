"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type BarRankingChartProps = {
  data: Array<{ label: string; value: number }>;
};

export function BarRankingChart({ data }: BarRankingChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ left: 12 }}>
        <CartesianGrid stroke="rgba(148, 163, 184, 0.14)" horizontal={false} />
        <XAxis type="number" tickLine={false} axisLine={false} />
        <YAxis
          type="category"
          dataKey="label"
          tickLine={false}
          axisLine={false}
          width={110}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(255,255,255,0.82)",
            backdropFilter: "blur(12px)",
          }}
        />
        <Bar dataKey="value" radius={[0, 12, 12, 0]} fill="oklch(var(--chart-2))" />
      </BarChart>
    </ResponsiveContainer>
  );
}
