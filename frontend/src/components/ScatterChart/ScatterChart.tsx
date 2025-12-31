// src/components/common/CommonScatterChart/index.tsx

"use client";

import React from "react";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ZAxis,
} from "recharts";

import { cn } from "@/lib/utils";

/**
 * Scatter Chart Data Point Interface
 */
export interface ScatterDataPoint {
  x: number;
  y: number;
  z?: number; // For bubble size
  name?: string;
  color?: string;
  [key: string]: any; // Allow additional properties
}

/**
 * Scatter Chart Series Interface
 */
export interface ScatterSeries {
  name: string;
  data: ScatterDataPoint[];
  color?: string;
  shape?: "circle" | "cross" | "diamond" | "square" | "star" | "triangle" | "wye";
}

/**
 * CommonScatterChart Props
 */
export interface ScatterChartWithProps {
  series: ScatterSeries[];
  width?: number | `${number}%`;
  height?: number | `${number}%`;
  xAxisLabel?: string;
  yAxisLabel?: string;
  title?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  xAxisDomain?: [number | "auto", number | "auto"];
  yAxisDomain?: [number | "auto", number | "auto"];
  className?: string;
  colors?: string[];
  enableZoom?: boolean;
  customTooltip?: React.ComponentType<any>;
}

/**
 * Default Tooltip Component
 */
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium mb-1">{data.name || "Point"}</p>
        <p className="text-xs text-muted-foreground">
          X: <span className="font-medium">{data.x}</span>
        </p>
        <p className="text-xs text-muted-foreground">
          Y: <span className="font-medium">{data.y}</span>
        </p>
        {data.z !== undefined && (
          <p className="text-xs text-muted-foreground">
            Size: <span className="font-medium">{data.z}</span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

/**
 * CommonScatterChart Component
 *
 * A reusable scatter chart component using Recharts
 * Supports multiple series, custom colors, and tooltips
 *
 * @example
 * <CommonScatterChart
 *   title="Sales vs Revenue"
 *   series={[
 *     {
 *       name: "Product A",
 *       data: [
 *         { x: 100, y: 200, name: "Point 1" },
 *         { x: 120, y: 300, name: "Point 2" }
 *       ],
 *       color: "#8884d8"
 *     }
 *   ]}
 *   xAxisLabel="Sales"
 *   yAxisLabel="Revenue"
 *   showGrid
 *   showLegend
 * />
 */
export const CommonScatterChart: React.FC<ScatterChartWithProps> = ({
  series,
  width = "100%",
  height = 400,
  xAxisLabel,
  yAxisLabel,
  title,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  xAxisDomain,
  yAxisDomain,
  className,
  colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7c7c", "#8dd1e1"],
  customTooltip,
}) => {
  return (
    <div className={cn("w-full", className)}>
      {title && <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>}

      <ResponsiveContainer width={width} height={height}>
        <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 40 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />}

          <XAxis
            type="number"
            dataKey="x"
            name={xAxisLabel || "X"}
            label={{
              value: xAxisLabel,
              position: "bottom",
              offset: 0,
              className: "fill-muted-foreground text-xs",
            }}
            domain={xAxisDomain}
            className="text-xs"
          />

          <YAxis
            type="number"
            dataKey="y"
            name={yAxisLabel || "Y"}
            label={{
              value: yAxisLabel,
              angle: -90,
              position: "insideLeft",
              className: "fill-muted-foreground text-xs",
            }}
            domain={yAxisDomain}
            className="text-xs"
          />

          {/* Optional Z-Axis for bubble size */}
          <ZAxis type="number" dataKey="z" range={[50, 400]} />

          {showTooltip && (
            <Tooltip
              content={(props) => {
                const Cmp = (customTooltip ?? CustomTooltip) as React.ComponentType<any>;
                return <Cmp {...props} />;
              }}
              cursor={{ strokeDasharray: "3 3" }}
            />
          )}

          {showLegend && (
            <Legend
              wrapperStyle={{
                paddingTop: "20px",
              }}
            />
          )}

          {series.map((serie, index) => (
            <Scatter
              key={serie.name}
              name={serie.name}
              data={serie.data}
              fill={serie.color || colors[index % colors.length]}
              shape={serie.shape || "circle"}
            >
              {serie.data.map((entry, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={entry.color || serie.color || colors[index % colors.length]}
                />
              ))}
            </Scatter>
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CommonScatterChart;
