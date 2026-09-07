"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Formik } from "formik";
import { UserPlus } from "lucide-react";

import { ROUTES } from "@/admin-pages/routes";

import Input from "@/components/Input/CommonInput";
import { Button } from "@/components/ui/button";
import { SignUpSchema } from "@/utils/validations/auth/authvalidationSchema";
import { SignUpForm } from "@/services/auth/auth.service";
import { SignUpFormType } from "@/types/auth/auth.types";
import { toast } from "react-toastify";
import { AuthShell } from "./AuthShell";

export default function Signup() {
  const router = useRouter();

  const {
    mutate: signUpMutation,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: SignUpForm,
    onSuccess: (data) => {
      toast.success(data.message);
      router.push(ROUTES.auth.signIn);
    },
  });

  const initialValues: SignUpFormType = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  };

  return (
    <AuthShell
      title="Create your account"
      description="Takes less than a minute. No card required."
      footer={
        <>
          Already have an account?{" "}
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
        validationSchema={SignUpSchema}
        onSubmit={(values) => signUpMutation(values)}
      >
        {({ values, handleSubmit }) => (
          <form onSubmit={handleSubmit} className="space-y-4">
            {isError && (
              <p className="rounded-md bg-expense-100 px-3 py-2 text-sm text-expense">
                {(error as Error)?.message || "Signup failed"}
              </p>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Input
                formik
                label="First Name"
                name="firstname"
                placeholder="Jane"
                defaultValue={values.firstname}
              />
              <Input
                formik
                label="Last Name"
                name="lastname"
                placeholder="Doe"
                defaultValue={values.lastname}
              />
            </div>

            <Input
              formik
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              defaultValue={values.email}
            />

            <Input
              formik
              label="Password"
              name="password"
              type="password"
              placeholder="At least 8 characters"
              defaultValue={values.password}
            />

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? (
                "Creating account..."
              ) : (
                <>
                  Create Account <UserPlus />
                </>
              )}
            </Button>
          </form>
        )}
      </Formik>
    </AuthShell>
  );
}
