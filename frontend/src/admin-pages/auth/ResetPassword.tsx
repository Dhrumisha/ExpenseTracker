"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Formik } from "formik";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import Input from "@/components/Input/CommonInput";
import { resetPassword } from "@/services/auth/auth.service";
import { ResetPasswordSchema } from "@/utils/validations/auth/authvalidationSchema";
import { ROUTES } from "@/admin-pages/routes";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const { mutate: resetPasswordMutate, isPending } = useMutation({
    mutationFn: ({
      token,
      password,
      passwordConfirm,
    }: {
      token: string;
      password: string;
      passwordConfirm: string;
    }) => resetPassword(token, { password, passwordConfirm }),

    onSuccess: () => {
      toast.success("Password reset successfully");
      router.push(ROUTES.auth.signIn);
    },

    onError: (error: any) => {
      toast.error(error?.message || "Invalid or expired reset link");
    },
  });

  // 🚨 Invalid link (no token)
  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-600 text-lg">Invalid reset password link</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Formik
        initialValues={{
          password: "",
          passwordConfirm: "",
        }}
        validationSchema={ResetPasswordSchema}
        onSubmit={(values) =>
            resetPasswordMutate({
            token,
            password: values.password,
            passwordConfirm: values.passwordConfirm,
          })
        }
      >
        {({ values, handleSubmit }) => (
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-lg bg-white p-6 shadow"
          >
            <h1 className="mb-4 text-2xl font-semibold text-center">
              Reset Password
            </h1>

            <Input
              formik
              label="New Password"
              name="password"
              type="password"
              defaultValue={values.password}
            />

            <Input
              formik
              label="Confirm Password"
              name="passwordConfirm"
              type="password"
              defaultValue={values.passwordConfirm}
            />

            <button
              type="submit"
              disabled={isPending}
              className="mt-4 w-full rounded bg-black py-2 text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {isPending ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </Formik>
    </div>
  );
}
