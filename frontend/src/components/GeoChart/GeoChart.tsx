  "use client";

  import { Chart } from "react-google-charts";

  import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
  import { cn } from "@/lib/utils"; // Optional: for className utility

  import type { GeoChartProps } from "./type";

  export const GeoChart = ({
    title = "Geo Chart",
    className,
    height = 400,
    data,
    region = "world", // Default to "world"
  }: GeoChartProps) => {
    // Prepare data for the chart (Google GeoChart expects a specific format)
    const chartData = [
      ["Country", "Value"], // Header row
      ...data.map((item) => [item.country, item.value]),
    ];

    const options = {
      region: region, // Region for the map: "world", "US", etc.
      displayMode: "regions", // Display regions (countries/states)
      colorAxis: { colors: ["#e0f7fa", "#00796b"] }, // Color scale (light to dark)
      resolution: "countries", // You can also use "provinces" or "countries"
      backgroundColor: "#f5f5f5", // Background color
      datalessRegionColor: "#f0f0f0", // Color for regions without data
      tooltip: { isHtml: true }, // Allow HTML tooltips
    };

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
              <Chart
                chartType="GeoChart"
                data={chartData}
                options={options}
                width="100%"
                height="100%"
              />
            )}
          </div>
        </CardContent>
      </Card>
    );
  };
