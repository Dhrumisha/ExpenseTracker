// --- Types
export type PieSegmentConfig = {
  /** Display label for legend and tooltip */
  label: string;
  /** CSS color value */
  color: string;
};

export type PieSeriesConfig = Record<string, PieSegmentConfig>;

export interface CommonPieChartProps<TData extends Record<string, any>> {
  /** Data array with each object representing a slice */
  data: TData[];
  /** Key in data object for slice label (x-axis equivalent) */
  nameKey: keyof TData & string;
  /** Key for slice value */
  dataKey: keyof TData & string;
  /** Series color configuration (optional if colors are embedded in data) */
  series?: PieSeriesConfig;
  /** Show legend */
  showLegend?: boolean;
  /** Show tooltip */
  showTooltip?: boolean;
  /** Show total or custom label in center */
  centerLabel?: string | ((total: number) => string);
  /** Tailwind / className passthrough */
  className?: string;
  /** Value formatter for tooltip/labels */
  valueFormatter?: (value: number) => string;
}
