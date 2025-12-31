import { formatDateTime } from "@/utils/date";

interface FormattedDateWithUserProps {
  date?: string | Date | null;
  by_name?: string | null;
  dateFormat?: string;
  fallback?: string;
}

export const FormattedDateWithUser = ({
  date,
  by_name,
  dateFormat = "MMM d, yyyy h:mm a",
  fallback = "-",
}: FormattedDateWithUserProps) => {
  return (
    <span className="flex flex-col gap-1 font-medium text-gray-500">
      {date && by_name ? (
        <>
          <span>{date ? formatDateTime(new Date(date), dateFormat, fallback) : ""}</span>
          {by_name && <span className="text-xs text-gray-400">by {by_name}</span>}
        </>
      ) : (
        fallback
      )}
    </span>
  );
};
