"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Formik } from "formik";
import { LogIn } from "lucide-react";

import Input from "@/components/Input/CommonInput";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/admin-pages/routes";
import { SignInForm } from "@/services/auth/auth.service";
import { SignInSchema } from "@/utils/validations/auth/authvalidationSchema";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/redux";
import { login } from "@/redux/slices/userSlice";
import { AuthShell } from "./AuthShell";

interface SignInFormType {
  email: string;
  password: string;
}

export default function SignIn() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { mutate: signInMutation, isPending } = useMutation({
    mutationFn: SignInForm,
    onSuccess: (data) => {
      toast.success(data.message);
      router.push(ROUTES.admin.overview);

      dispatch(
        login({
          firstname: data.user.firstname,
          lastname: data.user.lastname,
          email: data.user.email,
        })
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || "Unable to sign in");
    },
  });

  const initialValues: SignInFormType = {
    email: "",
    password: "",
  };

  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to see where your money's been."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <a
            href={ROUTES.auth.signUp}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign up
          </a>
        </>
      }
    >
      <Formik
        initialValues={initialValues}
        validationSchema={SignInSchema}
        onSubmit={(values) => signInMutation(values)}
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
            <div>
              <Input
                formik
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                defaultValue={values.password}
              />
              <div className="mt-2 text-right">
                <a
                  href={ROUTES.auth.forgotPassword}
                  className="text-sm text-muted-foreground hover:text-primary hover:underline"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? (
                "Signing in..."
              ) : (
                <>
                  Sign In <LogIn />
                </>
              )}
            </Button>
          </form>
        )}
      </Formik>
    </AuthShell>
  );
}
