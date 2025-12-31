// ---------- StackedBarChartCard ----------

export type StackedBarDatum = {
  name: string;
  category1: number;
  category2: number;
  category3: number;
};

export type StackedBarChartCardProps = {
  title?: React.ReactNode;
  className?: string;
  height?: number;
  data: StackedBarDatum[];
};
