"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type SummaryType = "income" | "expense" | "balance";

export type SummaryItem = {
  name: string;
  value: number;
  type: SummaryType;
};

const COLORS = {
  income: "hsl(var(--income))",
  expense: "hsl(var(--expense))",
  balance: "hsl(var(--balance))",
};

export default function SummaryDonutChart({
  title = "Summary",
  data,
  className,
}: {
  title?: string;
  data: SummaryItem[];
  className?: string;
}) {
  const total = data.reduce((s, i) => s + i.value, 0);

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[260px] relative">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                innerRadius={72}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {data.map((item, i) => (
                  <Cell key={i} fill={COLORS[item.type]} />
                ))}
              </Pie>

              <Tooltip
                formatter={(v: number) => `₹${v}`}
                contentStyle={{
                  background: "hsl(var(--background))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: 8,
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-xl font-semibold">₹{total}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 space-y-3">
          {data.map((item) => (
            <div key={item.name} className="flex justify-between text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[item.type] }}
                />
                <span className="text-muted-foreground">{item.name}</span>
              </div>
              <span className="font-medium">₹{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
