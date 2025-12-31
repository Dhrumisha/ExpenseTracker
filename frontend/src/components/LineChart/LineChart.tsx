"use client";

import clsx from "clsx";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  ResponsiveContainer,
} from "recharts";

import type { ChartConfig } from "@/components/ui/chart";
import { ChartContainer } from "@/components/ui/chart";

export type SeriesConfig = Record<
  string,
  {
    /** Display name in legend/tooltip */
    label: string;
    /** Any valid CSS color (hex/rgb/hsl/var(...)) */
    color: string;
  }
>;

export type CommonBarChartProps<TData extends Record<string, any>> = {
  /** Array of data objects */
  data: TData[];
  /** Key in each data object to use for the X axis (e.g., "month") */
  xKey: keyof TData & string;
  /** Series definition. Keys must match properties on the data objects */
  series: SeriesConfig;
  /** Show background grid */
  showGrid?: boolean;
  /** Show default recharts legend */
  showLegend?: boolean;
  /** Show tooltip */
  showTooltip?: boolean;
  /** Tailwind / className passthrough */
  className?: string;
  /** Corner radius for bars. Defaults to 4 */
  barRadius?: number | [number, number, number, number];
  /** Format values for labels/tooltip */
  valueFormatter?: (value: number, seriesKey: string) => string;
};

/**
 * CommonBarChart — drop-in, reusable bar chart with labels.
 * - Accepts arbitrary data + series config
 * - Renders value labels above each bar
 * - Plays nice with shadcn's ChartContainer to get CSS color vars
 */
export function LineChart<TData extends Record<string, any>>({
  data,
  // xKey,
  series,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  barRadius = 4,
  className,
  valueFormatter,
}: CommonBarChartProps<TData>) {
  // Build ChartContainer config from provided series colors/labels
  const chartConfig: ChartConfig = Object.fromEntries(
    Object.entries(series).map(([key, s]) => [key, { label: s.label, color: s.color }])
  ) as ChartConfig;

  // Recharts Tooltip formatter
  const tooltipFormatter = (value: any, name: string) => {
    const num = typeof value === "number" ? value : Number(value);
    const formatted = valueFormatter ? valueFormatter(num, name) : String(value);
    const displayName = series[name]?.label ?? name;
    return [formatted, displayName];
  };

  return (
    <ChartContainer config={chartConfig} className={clsx("min-h-100 w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart accessibilityLayer data={data}>
          {showGrid && <CartesianGrid vertical={false} />}
          {showTooltip && <Tooltip formatter={tooltipFormatter} />}
          {showLegend && <Legend />}

          {Object.keys(series).map((key) => (
            <Bar
              key={key}
              dataKey={key}
              fill={`var(--color-${key})`}
              radius={barRadius as any}
              isAnimationActive
            >
              <LabelList
                dataKey={key}
                position="top"
                formatter={(v: any) =>
                  valueFormatter ? valueFormatter(Number(v), key) : String(v)
                }
              />
            </Bar>
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// --- Example usage
// Remove this from production and use where needed.
export function Demo() {
  const data = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ];

  const series: SeriesConfig = {
    desktop: { label: "Desktop", color: "#2563eb" },
    mobile: { label: "Mobile", color: "#60a5fa" },
  };

  return (
    <LineChart
      data={data}
      xKey="month"
      series={series}
      showGrid
      showLegend
      showTooltip
      valueFormatter={(v) => v.toLocaleString()}
      className="h-72"
    />
  );
}
