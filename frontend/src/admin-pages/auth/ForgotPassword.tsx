"use client";

import { useMutation } from "@tanstack/react-query";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Mail } from "lucide-react";

import Input from "@/components/Input/CommonInput";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/admin-pages/routes";
import { ForgotPasswordSchema } from "@/utils/validations/auth/authvalidationSchema";
import { forgotPassword } from "@/services/auth/auth.service";
import { AuthShell } from "./AuthShell";

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
    <AuthShell
      title="Forgot your password?"
      description="Enter your email and we'll send you a reset link."
      footer={
        <>
          Remember your password?{" "}
          <a
            href={ROUTES.auth.signIn}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </a>
        </>
      }
    >
      <Formik
        initialValues={initialValues}
        validationSchema={ForgotPasswordSchema}
        onSubmit={(values) => mutate(values)}
      >
        {({ values, handleSubmit }) => (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              formik
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              defaultValue={values.email}
            />

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? (
                "Sending..."
              ) : (
                <>
                  Send Reset Link <Mail />
                </>
              )}
            </Button>
          </form>
        )}
      </Formik>
    </AuthShell>
  );
}
