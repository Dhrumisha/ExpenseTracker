"use client";

import { Formik } from "formik";
import { useMutation } from "@tanstack/react-query";

import Input from "@/components/Input/CommonInput";
import { Button } from "@/components/ui/button";
import { ChangePasswordSchema } from "@/utils/validations/auth/authvalidationSchema";
import { ChangePasswordValues } from "@/types/user/user.types";
import { ChangePassword } from "@/services/auth/auth.service";
import { toast } from "react-toastify";

export default function ChangePasswordForm() {

  const initialValues: ChangePasswordValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: ChangePasswordValues) =>
      ChangePassword(payload),

    onSuccess: (data) => {
      toast.success(data.message || "Password changed successfully");
    },

    onError: (error: any) => {
      toast.error(error.message || "Failed to change password");
    },
  });

  return (
    <div className="mt-12">
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-xl font-bold pb-2">Change Password</h2>
        <p className="text-sm text-muted-foreground">
          This will be used to log into your account and complete high severity
          actions.
        </p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={ChangePasswordSchema}
        onSubmit={(values, { resetForm }) => {
          mutate({
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
            confirmPassword:values.confirmPassword
          });
          // resetForm();
        }}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            <Input
              formik
              asterisk
              label="Current Password"
              name="currentPassword"
              type="password"
            />

            <Input
              formik
              asterisk
              label="New Password"
              name="newPassword"
              type="password"
            />

            <Input
              formik
              asterisk
              label="Confirm Password"
              name="confirmPassword"
              type="password"
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="reset" variant="outline">
                Reset
              </Button>
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700"
              >
                Change Password
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}
