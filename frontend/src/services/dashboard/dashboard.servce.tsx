import axiosInstance from "@/utils/axios";

export const fetchDashboardData = async () => {
    try {
        const { data } = await axiosInstance.get("/transaction/dashboard");
        return data;
      } catch (error: any) {
        throw new Error(
          error?.response?.data?.message || "Unauthorized"
        );
      }
};
