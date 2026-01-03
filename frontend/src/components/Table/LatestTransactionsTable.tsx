"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./DataTable";
import { Transaction } from "@/types/transaction/transaction.types";
import { cn } from "@/lib/utils";
import StatusBadge from "../Badge/StatusBadge";

const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "account",
    header: "Account",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const { amount, type } = row.original;
      return (
        <span
          className={cn(
            "font-medium",
            type === "Income" ? "text-income" : "text-expense"
          )}
        >
          ₹{amount.toLocaleString()}
        </span>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <StatusBadge status={row.original.type} />,
  },
];

export default function LatestTransactionsTable({
  data,
  title,
  buttonName,
  buttonLink,
}: {
  data: Transaction[];
  title: string;
  buttonName:string;
  buttonLink: string;
}) {
  return (
    <DataTable
      columns={columns}
      data={data}
      className="h-full"
      title={title}
      buttonLink={buttonLink}
      buttonName={buttonName}
    />
  );
}
