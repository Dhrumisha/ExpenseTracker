export interface UpdateUserPayload {
    firstname: string;
    lastname: string;
    email:string;
    contact: string;
    country: string;
    currency: string;
    theme: "light" | "dark";
    language?: string;
}

export interface UpdateUserResponse {
    success: string;
    message: string;
    user: UpdateUserPayload;
} 

export interface ChangePasswordValues {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }
  