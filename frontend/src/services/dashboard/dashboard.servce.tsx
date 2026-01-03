import axiosInstance from "@/utils/axios";
import { DashboardResponse } from "@/types/dashboard/dashboard.types";

export const fetchDashboardData = async (): Promise<DashboardResponse> => {
  try {
    const res = await axiosInstance.get<DashboardResponse>("/transaction/dashboard");
    return res.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Unauthorized");
  }
};
