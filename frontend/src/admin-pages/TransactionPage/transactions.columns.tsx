import { Column } from "@/components/Table/Table";
import { TransactionItem } from "@/types/transaction/transaction.types";
import { CheckCircle } from "lucide-react";

export const transactionColumns = (
  onView: (row: TransactionItem) => void
): Column<TransactionItem>[] => [
  {
    header: "Date",
    cell: (row) => new Date(row.createdat).toDateString(),
  },
  {
    header: "Description",
    accessor: "description",
  },
  {
    header: "Status",
    cell: () => (
      <div className="flex items-center gap-1 text-income">
        <CheckCircle size={14} />
        Completed
      </div>
    ),
  },
  {
    header: "Source",
    accessor: "source",
  },
  {
    header: "Amount",
    cell: (row) => (
      <span
        className={
          row.type === "income"
            ? "text-income font-medium"
            : "text-expense font-medium"
        }
      >
        {row.type === "income" ? "+" : "-"}₹{row.amount}
      </span>
    ),
  },
  {
    header: "",
    cell: (row) => (
      <button
        onClick={() => onView(row)}
        className="text-purple-600 hover:underline text-sm"
      >
        View
      </button>
    ),
  },
];
