import axiosInstance from "@/utils/axios";
import {
  AccountResponse,
  AddMoneyAccountPayload,
  commonResponseAccount,
  CreateAccountPayload,
  TransferMoneyPayload,
} from "@/types/account/account.types";

export async function GetAllAccount(): Promise<AccountResponse> {
  try {
    const res = await axiosInstance.get("/account");
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch accounts"
    );
  }
}

export const createAccount = async (
  payload: CreateAccountPayload
): Promise<commonResponseAccount> => {
  try {
    const res = await axiosInstance.post("/account/create", payload);
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch accounts"
    );
  }
};

export const adddMoneyToAccount = async (
  id:number,
  payload: AddMoneyAccountPayload
): Promise<commonResponseAccount> => {
  try {
    const res = await axiosInstance.put(`/account/add-money/${id}`, payload);
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch accounts"
    );
  }
};

export const transferMoney = async (
  payload: TransferMoneyPayload
): Promise<commonResponseAccount> => {
  try {
    const res = await axiosInstance.put("/transaction/transfer-money", payload);
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Transfer failed"
    );
  }
};
