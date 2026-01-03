import axiosInstance from "@/utils/axios";
import { AddTransactionPayload, CommonTransactionResponse, TransactionResponse } from "@/types/transaction/transaction.types";

export const fetchTransactions = async (params?: {
  page?: number;
  limit?: number;
  s?: string;
  df?: string;
  dt: string;
  status?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}): Promise<TransactionResponse> => {
  const res = await axiosInstance.get("/transaction", { params });
  return res.data;
};

export const addTransaction = async (
  accountId: number,
  payload: AddTransactionPayload
): Promise<CommonTransactionResponse> => {
  try {
    const res = await axiosInstance.post(
      `/transaction/add-transaction/${accountId}`,
      payload
    );
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Transaction failed"
    );
  }
};  