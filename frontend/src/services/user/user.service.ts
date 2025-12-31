import { UpdateUserPayload, UpdateUserResponse } from "@/types/user/user.types";
import axiosInstance from "@/utils/axios";

export const UpdateUser = async (payload: UpdateUserPayload): Promise<UpdateUserResponse> => {
    try {
        const res = await axiosInstance.put("/user", payload);
        return res.data;
    } catch (error: any) {
        throw new Error(
            error?.response?.data?.message || "Failed to Update User"
        );
    }
};

export const GetUser = async (): Promise<UpdateUserResponse> => {
    try {
        const res = await axiosInstance.get("/user");
        return res.data;
    } catch (error: any) {
        throw new Error(
            error?.response?.data?.message || "Failed to Update User"
        );
    }
};