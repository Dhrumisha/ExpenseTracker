import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
export const Loader: React.FC<{
  height?: string;
  width?: string;
  className?: string;
}> = ({ height = "h-full", width = "w-full", className = "" }) => {
  return (
    <div className={cn("flex items-center justify-center h-screen", height, width, className)}>
      <Loader2 className="animate-spin h-10 w-10" />
    </div>
  );
};
