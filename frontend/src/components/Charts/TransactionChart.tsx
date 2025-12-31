"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useState } from "react";

export interface TransactionItem  {
  month: string;
  income: number;
  expense: number;
}

export default function TransactionChart({ data }: { data: TransactionItem[]  }) {
  const [type, setType] = useState<"line" | "bar">("line");

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Transaction Activity</CardTitle>

        <div className="flex gap-2">
          {["line", "bar"].map((t) => (
            <button
              key={t}
              onClick={() => setType(t as any)}
              className={`px-3 py-1 text-xs rounded-md transition ${
                type === t ? "bg-primary text-primary-foreground" : "border"
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="h-[320px]">
        <ResponsiveContainer>
          {type === "line" ? (
            <LineChart data={data}>
              <CartesianGrid
                stroke="hsl(var(--border))"
                strokeDasharray="3 3"
              />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="income"
                stroke="hsl(var(--income))"
                strokeWidth={2.5}
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="hsl(var(--expense))"
                strokeWidth={2.5}
              />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid
                stroke="hsl(var(--border))"
                strokeDasharray="3 3"
              />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="income"
                fill="hsl(var(--income))"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="expense"
                fill="hsl(var(--expense))"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
