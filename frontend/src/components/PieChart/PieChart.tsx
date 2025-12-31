"use client";

import React from "react";

import clsx from "clsx";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";

import type { ChartConfig } from "@/components/ui/chart";
import { ChartContainer } from "@/components/ui/chart";

import type { CommonPieChartProps, PieSeriesConfig } from "./type";

/**
 * CommonPieChart — reusable Pie/Donut chart with dynamic data and labels.
 * - Accepts arbitrary dataset
 * - Supports optional center label
 * - Plays nice with ChartContainer color vars
 */
export function PieChart<TData extends Record<string, any>>({
  data,
  nameKey,
  dataKey,
  series,
  showLegend = true,
  showTooltip = true,
  centerLabel,
  className,
  valueFormatter,
}: CommonPieChartProps<TData>) {
  // Derive chart config from series if provided
  const chartConfig: ChartConfig = series
    ? (Object.fromEntries(
        Object.entries(series).map(([key, s]) => [key, { label: s.label, color: s.color }])
      ) as ChartConfig)
    : {};

  // Compute total for center label
  const total = data.reduce((sum, d) => sum + Number(d[dataKey] ?? 0), 0);

  const tooltipFormatter = (value: any, _name: string) => {
    const num = typeof value === "number" ? value : Number(value);
    return valueFormatter ? valueFormatter(num) : String(value);
  };

  return (
    <ChartContainer config={chartConfig} className={clsx("min-h-150 w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          {showTooltip && <Tooltip formatter={tooltipFormatter} />}
          {showLegend && <Legend />}

          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            outerRadius="80%"
            innerRadius="60%"
            paddingAngle={4}
            label
          >
            {data.map((entry, index) => {
              const name = String(entry[nameKey]);
              const color = series?.[name]?.color ?? `hsl(${(index * 60) % 360},70%,60%)`;
              return <Cell key={`cell-${index}`} fill={color} />;
            })}

            {centerLabel && (
              <Label
                position="center"
                content={() => {
                  const labelText =
                    typeof centerLabel === "function" ? centerLabel(total) : centerLabel;
                  return (
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-foreground text-sm font-semibold"
                    >
                      {labelText}
                    </text>
                  );
                }}
              />
            )}
          </Pie>
        </RechartsPieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// --- Example usage
export function DemoPie() {
  const data = [
    { category: "Desktop", value: 400 },
    { category: "Mobile", value: 300 },
    { category: "Tablet", value: 200 },
  ];

  const series: PieSeriesConfig = {
    Desktop: { label: "Desktop", color: "#2563eb" },
    Mobile: { label: "Mobile", color: "#60a5fa" },
    Tablet: { label: "Tablet", color: "#93c5fd" },
  };

  return (
    <PieChart
      data={data}
      nameKey="category"
      dataKey="value"
      series={series}
      centerLabel={(total) => `${total} total`}
      valueFormatter={(v) => v.toLocaleString()}
      className="h-80"
    />
  );
}
