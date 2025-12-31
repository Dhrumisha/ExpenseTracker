export type AreaDatum = { date: string; revenue: number; users: number };

export const numberFmt = (v: unknown) =>
  typeof v === "number" ? new Intl.NumberFormat().format(v) : String(v ?? "");

export type AreaChartCardProps = {
  title?: React.ReactNode;
  className?: string;
  height?: number;
  data: AreaDatum[];
  valueFormatter?: (v: number) => string;
};
