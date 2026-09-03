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

export interface SignInFormType {
  email: string;
  password: string;
}

// All requests go through axiosInstance so baseURL/withCredentials stay
// consistent, and every failure throws a real Error — callers decide how
// (or whether) to surface it, instead of the service layer toasting for them.
const asError = (error: any, fallback: string): Error =>
  new Error(error?.response?.data?.message || fallback);

export async function SignUpForm(
  payload: SignUpFormType
): Promise<SignUpResponse> {
  try {
    const res = await axiosInstance.post("/auth/sign-up", payload);
    return res.data;
  } catch (error: any) {
    throw asError(error, "Error during sign up");
  }
}

export async function SignInForm(
  payload: SignInFormType
): Promise<SignUpResponse> {
  try {
    const res = await axiosInstance.post("/auth/sign-in", payload);
    return res.data;
  } catch (error: any) {
    throw asError(error, "Error during sign in");
  }
}

export const forgotPassword = async (payload: {
  email: string;
}): Promise<{ status: string; message: string }> => {
  try {
    const { data } = await axiosInstance.put("/user/forget-password", payload);
    return data;
  } catch (error: any) {
    throw asError(error, "Error during password reset request");
  }
};

export const resetPassword = async (
  token: string,
  payload: {
    password: string;
    passwordConfirm: string;
  }
) => {
  try {
    const { data } = await axiosInstance.put(
      `/user/reset-password/${token}`,
      payload
    );
    return data;
  } catch (error: any) {
    throw asError(error, "Error during password reset");
  }
};

export const getMe = async (): Promise<MeResponse> => {
  const { data } = await axiosInstance.get<MeResponse>("/user/me");
  return data;
};

export const logoutUser = async () => {
  try {
    await axiosInstance.post("/auth/logout");
  } catch (error: any) {
    throw asError(error, "Logout failed");
  }
};

export const ChangePassword = async (payload: ChangePasswordValues) => {
  try {
    const { data } = await axiosInstance.put("/user/change-password", payload);
    return data;
  } catch (error: any) {
    throw asError(error, "Error during password change");
  }
};
