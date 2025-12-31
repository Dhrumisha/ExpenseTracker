import {
  ResponsiveContainer,
  AreaChart as RAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

import { numberFmt } from "./type";

import type { AreaChartCardProps } from "./type";

// ---------- AreaChartCard ----------

export function AreaChartCard({
  title = "Revenue Growth",
  className,
  height = 320,
  data,
  valueFormatter = numberFmt,
}: AreaChartCardProps) {
  return (
    <Card className={cn("w-full overflow-hidden", className)}>
      <CardHeader className="pb-2">
        {title ? <CardTitle className="text-base sm:text-lg">{title}</CardTitle> : null}
      </CardHeader>
      <CardContent className="pt-0">
        <div style={{ height }} className="w-full">
          {!data || data.length === 0 ? (
            <div>No data</div>
          ) : (
            <ChartContainer config={{}} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RAreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeOpacity={0.2} />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={valueFormatter} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend verticalAlign="top" height={36} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--chart-revenue)"
                    fill="var(--chart-revenue-light)"
                  />
                </RAreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
