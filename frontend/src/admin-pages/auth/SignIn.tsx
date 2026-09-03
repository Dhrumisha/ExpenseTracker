"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Formik } from "formik";

import Input from "@/components/Input/CommonInput";
import { ROUTES } from "@/admin-pages/routes";
import { SignInForm } from "@/services/auth/auth.service";
import { SignInSchema } from "@/utils/validations/auth/authvalidationSchema";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/redux";
import { login } from "@/redux/slices/userSlice";

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
          firstname: data.data.firstname,
          lastname: data.data.lastname,
          email: data.data.email,
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
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Formik
        initialValues={initialValues}
        validationSchema={SignInSchema}
        onSubmit={(values) => signInMutation(values)}
      >
        {({ values, handleSubmit }) => (
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-lg bg-surface p-6 shadow"
          >
            <h1 className="mb-4 text-2xl font-semibold text-center">Sign In</h1>

            <Input
              formik
              label="Email"
              name="email"
              type="email"
              defaultValue={values.email}
            />
            <Input
              formik
              label="Password"
              name="password"
              type="password"
              defaultValue={values.password}
            />
            <div className="mt-2 text-right">
              <a
                href={ROUTES.auth.forgotPassword}
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="mt-4 w-full rounded bg-black py-2 text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {isPending ? "Signing in..." : "Sign In"}
            </button>

            <p className="mt-4 text-center text-sm">
              Don’t have an account?{" "}
              <a href={ROUTES.auth.signUp} className="text-blue-600 underline">
                Sign up
              </a>
            </p>
          </form>
        )}
      </Formik>
    </div>
  );
}
