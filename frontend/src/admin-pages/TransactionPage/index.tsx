"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus, Download } from "lucide-react";

import SimpleTable from "@/components/Table/Table";
import { transactionColumns } from "./transactions.columns";
import { fetchTransactions } from "@/services/transaction/transaction.service";
import {
  TransactionItem,
  TransactionResponse,
} from "@/types/transaction/transaction.types";
import TransactionViewModal from "./transaction-view.modal";
import PayTransactionModal from "./PayTransactionModal";
import TransactionsFilters from "./TransactionsFilters";
import { ButtonWithProps } from "@/components";

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedTx, setSelectedTx] = useState<TransactionItem | null>(null);
  const [payOpen, setPayOpen] = useState(false);

  const { data, isLoading } = useQuery<TransactionResponse>({
    queryKey: ["transactions", search, dateFrom, dateTo],
    queryFn: () =>
      fetchTransactions({
        s: search,
        df: dateFrom,
        dt: dateTo,
      }),
  });

  return (
    <div className="p-10 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h1 className="text-2xl font-semibold">Transactions Activity</h1>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Filters:</span>

          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border rounded-md px-2 py-1 text-sm"
          />

          <span className="text-sm">To</span>

          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="border rounded-md px-2 py-1 text-sm"
          />

          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search now..."
              className="pl-8 pr-3 py-1.5 border rounded-md text-sm"
            />
          </div>

          <ButtonWithProps variant="default" onClick={() => setPayOpen(true)}>
            <Plus size={14} /> Pay
          </ButtonWithProps>
        </div>
      </div>
      {/* TABLE */}
      <SimpleTable<TransactionItem>
        columns={transactionColumns(setSelectedTx)}
        data={data?.data || []}
        loading={isLoading}
        noDataText="No transactions found"
      />
      {/* VIEW MODAL */}
      <TransactionViewModal
        open={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        transaction={selectedTx}
      />
      <PayTransactionModal open={payOpen} onOpenChange={setPayOpen} />
      
    </div>
  );
}
