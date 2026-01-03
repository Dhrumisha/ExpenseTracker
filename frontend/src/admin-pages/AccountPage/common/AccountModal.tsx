// components/Accounts/AddAccountModal.tsx
"use client";

import { Formik, Form as FormikForm } from "formik";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import CommonModelComponent from "@/components/Modal/CommonModelComponent";
import Input from "@/components/Input/CommonInput";
import ButtonWithProps from "@/components/Button/Button";

import { createAccount } from "@/services/account/account.service";
import { CreateAccountSchema } from "@/utils/validations/account/account.validation";
import { CreateAccountPayload } from "@/types/account/account.types";
import { ComboboxWithProps } from "@/components/Combobox/ComboboxWithProps";
import { ACCOUNT_TYPES } from "./HelperNumberFunction";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddAccountModal({ open, onOpenChange }: Props) {
  const queryClient = useQueryClient();
  
  const { mutate, isPending } = useMutation({
    mutationFn: createAccount,
    onSuccess: (data) => {
      toast.success(data.message || "Account created successfully");
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create account");
    },
  });

  const initialValues: CreateAccountPayload = {
    acc_name: "",
    acc_number: "",
    amount: 0,
  };

  return (
    <CommonModelComponent
      open={open}
      onOpenChange={onOpenChange}
      title="Add Account"
      size="md"
      content={
        <Formik
          initialValues={initialValues}
          validationSchema={CreateAccountSchema}
          onSubmit={(values) => {
            mutate(values);
          }}
        >
          {() => (
            <>
              <FormikForm id="add-account-form" className="space-y-4">
                <ComboboxWithProps
                  formik
                  name="acc_name"
                  label="Select Account"
                  placeholder="Select account type"
                  options={ACCOUNT_TYPES}
                  showSearch={false}
                />
                <Input
                  formik
                  name="acc_number"
                  label="Account Number"
                  placeholder="Enter account number"
                />
                <Input
                  formik
                  name="amount"
                  label="Initial Amount"
                  type="number"
                  placeholder="Enter initial amount"
                />
              </FormikForm>
            </>
          )}
        </Formik>
      }
      footer={
        <>
          <ButtonWithProps
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </ButtonWithProps>
          <ButtonWithProps
            type="submit"
            form="add-account-form"
            disabled={isPending}
          >
            {isPending ? "Creating..." : "Create Account"}
          </ButtonWithProps>
        </>
      }
    />
  );
}
