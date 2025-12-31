// Type for the GeoChart data
export type GeoDatum = {
  country: string;
  value: number;
};

export type GeoChartProps = {
  title?: React.ReactNode;
  className?: string;
  height?: number;
  data: GeoDatum[];
  region?: string; // Option to specify the region (world, US, etc.)
};
