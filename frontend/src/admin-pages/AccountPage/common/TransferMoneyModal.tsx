// components/Accounts/TransferMoneyModal.tsx
"use client";

import { Formik, Form as FormikForm } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import CommonModelComponent from "@/components/Modal/CommonModelComponent";
import Input from "@/components/Input/CommonInput";
import ButtonWithProps from "@/components/Button/Button";
import { ComboboxWithProps } from "@/components/Combobox/ComboboxWithProps";

import { TransferMoneySchema } from "@/utils/validations/account/account.validation";
import { transferMoney } from "@/services/account/account.service";
import { Account } from "@/types/account/account.types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accounts: Account[];
}

interface TransferFormValues {
  from_acc: number | "";
  to_acc: number | "";
  amount: number;
}

export default function TransferMoneyModal({
  open,
  onOpenChange,
  accounts,
}: Props) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: transferMoney,
    onSuccess: () => {
      toast.success("Money transferred successfully");
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Transfer failed");
    },
  });

  const initialValues: TransferFormValues = {
    from_acc: "",
    to_acc: "",
    amount: 0,  
  };

  /* 🔹 ACCOUNT OPTIONS */
  const accountOptions = accounts.map((acc) => ({
    label: `${acc.acc_name} • ₹${acc.acc_balance}`,
    value: acc.id,
  }));

  return (
    <>
    <CommonModelComponent
      open={open}
      onOpenChange={onOpenChange}
      title="Transfer Money"
      description="Move funds securely between your accounts"
      size="md"
      content={
        <Formik
          initialValues={initialValues}
          validationSchema={TransferMoneySchema}
          onSubmit={(values) => {
            mutate({
              from_acc: Number(values.from_acc),
              to_acc: Number(values.to_acc),
              amount: values.amount
            });
          }}
        >
          {({ values }) => (
            <FormikForm id="transfer-form" className="space-y-4">
              {/* FROM ACCOUNT */}
              <ComboboxWithProps
                formik
                name="from_acc"
                label="From Account"
                placeholder="Select source account"
                options={accountOptions}
              />

              {/* TO ACCOUNT */}
              <ComboboxWithProps
                formik
                name="to_acc"
                label="To Account"
                placeholder="Select destination account"
                options={accountOptions.filter(
                  (a) => a.value !== values.from_acc
                )}
              />

              {/* AMOUNT */}
              <Input
                formik
                name="amount"
                label="Amount"
                type="number"
                placeholder="Enter amount"
              />

            </FormikForm>
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
            form="transfer-form"
            disabled={isPending}
          >
            {isPending ? "Transferring..." : "Transfer"}
          </ButtonWithProps>
        </>
      }
    />
    </>
  );
}
