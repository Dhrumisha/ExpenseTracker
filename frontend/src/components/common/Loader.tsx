import { Loader2 } from "lucide-react";

const Loader = ({
  height = "h-full",
  width = "w-full",
  className = "",
}: {
  height?: string;
  width?: string;
  className?: string;
}) => {
  return (
    <div className={`flex justify-center items-center h-screen ${height} ${width} ${className}`}>
      {/* <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div> */}
      <Loader2 className="animate-spin h-10 w-10" />
    </div>
  );
};

export default Loader;
