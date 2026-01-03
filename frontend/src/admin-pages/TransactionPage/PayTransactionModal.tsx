// components/Transactions/PayTransactionModal.tsx
"use client";

import { Formik, Form as FormikForm } from "formik";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import CommonModelComponent from "@/components/Modal/CommonModelComponent";
import Input from "@/components/Input/CommonInput";
import ButtonWithProps from "@/components/Button/Button";
import { ComboboxWithProps } from "@/components/Combobox/ComboboxWithProps";

import { GetAllAccount } from "@/services/account/account.service";
import { addTransaction } from "@/services/transaction/transaction.service";
import { PayTransactionSchema } from "@/utils/validations/transaction/transaction.validation";

interface FormValues {
  account_id: number;
  description: string;
  amount: number;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PayTransactionModal({
  open,
  onOpenChange,
}: Props) {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["accounts"],
    queryFn: GetAllAccount,
  });

  const accounts = data?.data || [];

  const accountOptions = accounts.map((acc) => ({
    label: `${acc.acc_name} • ₹${acc.acc_balance}`,
    value: String(acc.id), // combobox expects string
  }));

  const mutation = useMutation({
    mutationFn: ({
      account_id,
      description,
      amount,
    }: FormValues) =>
      addTransaction(account_id, {
        amount,
        description,
        source: "Manual",
      }),
    onSuccess: () => {
      toast.success("Transaction successful");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["Dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Transaction failed");
    },
  });

  const initialValues: FormValues = {
    account_id: 0,
    description: "",
    amount: 0,
  };

  return (
    <CommonModelComponent
      open={open}
      onOpenChange={onOpenChange}
      title="Pay Transaction"
      size="md"
      isLoading={mutation.isPending}
      content={
        <Formik
          initialValues={initialValues}
          validationSchema={PayTransactionSchema}
          onSubmit={(values) => mutation.mutate(values)}
        >
          {() => (
            <FormikForm id="pay-transaction-form" className="space-y-4">
              <ComboboxWithProps
                formik
                name="account_id"
                label="Select Account"
                placeholder="Select account..."
                options={accountOptions}
                showSearch={false}
              />

              <Input
                formik
                name="description"
                label="Description"
                placeholder="Enter description"
              />

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
            form="pay-transaction-form"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Processing..." : "Pay"}
          </ButtonWithProps>
        </>
      }
    />
  );
}
