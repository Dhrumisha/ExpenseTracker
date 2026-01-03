"use client";

import { useMutation } from "@tanstack/react-query";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import Input from "@/components/Input/CommonInput";
import { ROUTES } from "@/admin-pages/routes";
import { ForgotPasswordSchema } from "@/utils/validations/auth/authvalidationSchema";
import { forgotPassword } from "@/services/auth/auth.service";

interface ForgotPasswordFormType {
  email: string;
}

export default function ForgotPasswordPage() {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      toast.success(data.message || "Reset link sent to your email");
      router.push(ROUTES.auth.signIn);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  const initialValues: ForgotPasswordFormType = {
    email: "",
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Formik
        initialValues={initialValues}
        validationSchema={ForgotPasswordSchema}
        onSubmit={(values) => mutate(values)}
      >
        {({ values, handleSubmit }) => (
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-lg bg-surface p-6 shadow"
          >
            <h1 className="mb-2 text-2xl font-semibold text-center">
              Forgot Password
            </h1>

            <p className="mb-4 text-center text-sm text-gray-600">
              Enter your email and we’ll send you a password reset link.
            </p>

            <Input
              formik
              label="Email"
              name="email"
              type="email"
              defaultValue={values.email}
            />

            <button
              type="submit"
              disabled={isPending}
              className="mt-4 w-full rounded bg-black py-2 text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {isPending ? "Sending..." : "Send Reset Link"}
            </button>

            <p className="mt-4 text-center text-sm">
              Remember your password?{" "}
              <a
                href={ROUTES.auth.signIn}
                className="text-blue-600 underline"
              >
                Sign in
              </a>
            </p>
          </form>
        )}
      </Formik>
    </div>
  );
}
