"use client";

import CommonModelComponent from "@/components/Modal/CommonModelComponent";
import { TransactionItem } from "@/types/transaction/transaction.types";
import { CheckCircle } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  transaction: TransactionItem | null;
}

export default function TransactionViewModal({
  open,
  onClose,
  transaction,
}: Props) {
  if (!transaction) return null;

  return (
    <CommonModelComponent
      open={open}
      onOpenChange={onClose}
      title="Transaction Detail"
      size="sm"
      content={
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">{transaction.source}</span>
            <CheckCircle className="text-income" size={16} />
          </div>

          <div>
            <p className="font-medium">{transaction.description}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(transaction.createdat).toLocaleString()}
            </p>
          </div>

          <p
            className={`text-xl font-bold ${
              transaction.type === "income"
                ? "text-income"
                : "text-expense"
            }`}
          >
            {transaction.type === "income" ? "+" : "-"}₹{transaction.amount}
          </p>
        </div>
      }
      footer={
        <button
          onClick={onClose}
          className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm"
        >
          Got it, thanks!
        </button>
      }
    />
  );
}
