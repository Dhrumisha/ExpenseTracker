import { ButtonWithProps } from "@/components";
import Input from "@/components/Input/CommonInput";

interface Props {
  search: string;
  from: string;
  to: string;
  onSearchChange: (v: string) => void;
  onDateChange: (key: "from" | "to", value: string) => void;
  onApply: () => void;
}

export default function TransactionsFilters({
  search,
  from,
  to,
  onSearchChange,
  onDateChange,
  onApply,
}: Props) {
  return (
    <div className="flex gap-3 items-center">
      <Input
        formik={false}
        type="date"
        value={from}
        onChange={(e) => onDateChange("from", e.target.value)}
      />
      <Input
        formik={false}
        type="date"
        value={to}
        onChange={(e) => onDateChange("to", e.target.value)}
      />

      <Input
        placeholder="Search..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <ButtonWithProps variant="default" onClick={onApply}>Apply</ButtonWithProps>
    </div>
  );
}
