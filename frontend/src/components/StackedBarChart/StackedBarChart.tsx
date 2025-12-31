import {
  ResponsiveContainer,
  BarChart as RStackedBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

import type { StackedBarChartCardProps } from "./type";

export function StackedBarChartCard({
  title = "Sales by Category",
  className,
  height = 320,
  data,
}: StackedBarChartCardProps) {
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
                <RStackedBarChart data={data}>
                  <CartesianGrid strokeOpacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend verticalAlign="top" height={36} />
                  <Bar dataKey="category1" stackId="a" fill="var(--chart-category1)" />
                  <Bar dataKey="category2" stackId="a" fill="var(--chart-category2)" />
                  <Bar dataKey="category3" stackId="a" fill="var(--chart-category3)" />
                </RStackedBarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
