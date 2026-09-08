"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Formik } from "formik";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { KeyRound, ShieldAlert } from "lucide-react";

import Input from "@/components/Input/CommonInput";
import { Button } from "@/components/ui/button";
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

  if (!token) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-6 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-expense-100">
          <ShieldAlert className="size-6 text-expense" />
        </span>
        <p className="text-lg font-medium text-foreground">
          Invalid reset password link
        </p>
        <p className="text-sm text-muted-foreground">
          This link is missing its token, or has already been used.
        </p>
        <a
          href={ROUTES.auth.forgotPassword}
          className="mt-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Request a new link
        </a>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
            <KeyRound className="size-6 text-primary" />
          </span>
          <h1 className="text-2xl font-semibold text-foreground">
            Set a new password
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Make it something you haven&apos;t used before.
          </p>
        </div>

        <Formik
          initialValues={{ password: "", passwordConfirm: "" }}
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                formik
                label="New Password"
                name="password"
                type="password"
                placeholder="At least 8 characters"
                defaultValue={values.password}
              />

              <Input
                formik
                label="Confirm Password"
                name="passwordConfirm"
                type="password"
                placeholder="Re-enter your new password"
                defaultValue={values.passwordConfirm}
              />

              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}
