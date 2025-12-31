import axios from "axios";
import { MeResponse, SignUpFormType } from "@/types/auth/auth.types";
import axiosInstance from "@/utils/axios";
import { ChangePasswordValues } from "@/types/user/user.types";

export interface SignUpResponse {
  message: string;
  success: boolean;
  data: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
  };
}

export interface SignInResponse {
  message: string;
  success: boolean;
  token: string;
  data?: {
    email: string;
    password: string;
  };
}

export async function SignUpForm(
  payload: SignUpFormType
): Promise<SignUpResponse> {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/sign-up`,
      payload
    );
    return res.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Error during sign up");
  }
}

export interface SignInFormType {
  email: string;
  password: string;
}

export async function SignInForm(
  payload: SignInFormType
): Promise<SignUpResponse> {
  try {
    const res = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/sign-in`,
      payload
    );
    console.log("response", res);
    return res.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Error during sign up");
  }
}

export const forgotPassword = async (payload: {
  email: string;
}): Promise<{ status: string; message: string }> => {
  try {
    const { data } = await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_URL}/user/forget-password`,
      payload
    );
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Error during sign up");
  }
};

export const resetPassword = async (
  token: string,
  payload: {
    password: string;
    passwordConfirm: string;
  }
) => {
  const { data } = await axios.put(
    `${process.env.NEXT_PUBLIC_BASE_URL}/user/reset-password/${token}`,
    payload
  );
  return data;
};

export const getMe = async (): Promise<MeResponse> => {
  try {
    const { data } = await axiosInstance.get<MeResponse>("/user/me");
    return data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Unauthorized");
  }
};

export const logoutUser = async () => {
  try {
    await axiosInstance.post("/auth/logout");
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Logout failed");
  }
};

export const ChangePassword = async (
  payload: ChangePasswordValues
) => {
  const { data } = await axiosInstance.put(
    `${process.env.NEXT_PUBLIC_BASE_URL}/user/change-password`,
    payload
  );
  return data;
};

export default { SignUpForm, SignInForm };
