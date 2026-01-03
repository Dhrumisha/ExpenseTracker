export interface TransactionItem {
    id: number;
    description: string;
    status: string;
    source: string;
    amount: string;
    type: "income" | "expense";
    createdat: string;
  }
  
  export interface TransactionResponse {
    status: string;
    message: string;
    data: TransactionItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
    };
  }
      
export type TransactionType = "Income" | "Expense";
export type StatusType = "Success" | "Failed";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  account: string;
  status:StatusType;
  amount: number;
  type: TransactionType;
}

// types/transaction/add-transaction.types.ts
export interface AddTransactionPayload {
  amount: number;
  description: string;
  source: string;
}

export interface CommonTransactionResponse {
  status: string;
  message: string;
}