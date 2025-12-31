"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Formik } from "formik";

import { ROUTES } from "@/admin-pages/routes";
import { login } from "@/redux/slices/userSlice";
import { useAppDispatch } from "@/redux";

import Input from "@/components/Input/CommonInput";
import { SignUpSchema } from "@/utils/validations/auth/authvalidationSchema";
import { SignUpForm, SignUpResponse } from "@/services/auth/auth.service";
import { SignUpFormType } from "@/types/auth/auth.types";
import { toast } from "react-toastify";

export default function Signup() {
  const router = useRouter();
  const dispatch = useAppDispatch();

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
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Formik
        initialValues={initialValues}
        validationSchema={SignUpSchema}
        onSubmit={(values) => signUpMutation(values)}
      >
        {({ values, handleSubmit }) => (
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-lg bg-white p-6 shadow"
          >
            <h1 className="mb-4 text-center text-2xl font-semibold">
              Create Account
            </h1>

            {isError && (
              <p className="mb-3 rounded bg-red-100 p-2 text-sm text-red-600">
                {(error as Error)?.message || "Signup failed"}
              </p>
            )}

            <Input
              formik
              label="First Name"
              name="firstname"
              defaultValue={values.firstname}
            />

            <Input
              formik
              label="Last Name"
              name="lastname"
              defaultValue={values.lastname}
            />

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

            <button
              type="submit"
              disabled={isPending}
              className="mt-4 w-full rounded bg-black py-2 text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {isPending ? "Creating..." : "Sign Up"}
            </button>

            <p className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a href={ROUTES.auth.signIn} className="text-blue-600 underline">
                Sign in
              </a>
            </p>
          </form>
        )}
      </Formik>
    </div>
  );
}
