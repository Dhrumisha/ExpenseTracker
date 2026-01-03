import { TransactionItem } from "@/components/Charts/TransactionChart";
import { Account } from "../account/account.types";
import { Transaction } from "../transaction/transaction.types";

export interface DashboardResponse {
    message: string;
    availableBalance: number;
    totalIncome: number;
    totalExpense: number;
    chartData: TransactionItem[];
    lastTransactions: Transaction[];
    lastAccounts: Account[];
}
