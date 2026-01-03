"use client";

import { Formik, Form as FormikForm } from "formik";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import CommonModelComponent from "@/components/Modal/CommonModelComponent";
import Input from "@/components/Input/CommonInput";
import ButtonWithProps from "@/components/Button/Button";

import { adddMoneyToAccount } from "@/services/account/account.service";
import { AddMoneySchema } from "@/utils/validations/account/account.validation";
import { AddMoneyAccountPayload } from "@/types/account/account.types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountId: number;
}

export default function AddMoneyModal({
  open,
  onOpenChange,
  accountId,
}: Props) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: AddMoneyAccountPayload) =>
      adddMoneyToAccount(accountId, payload),
    onSuccess: (data) => {
      toast.success(data.message || "Money added successfully");
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to add money");
    },
  });

  const initialValues: AddMoneyAccountPayload = {
    amount: 0,
  };

  return (
    <CommonModelComponent
      open={open}
      onOpenChange={onOpenChange}
      title="Add Money"
      size="sm"
      content={
        <Formik
          initialValues={initialValues}
          validationSchema={AddMoneySchema}
          onSubmit={(values) => mutate(values)}
        >
          {() => (
            <FormikForm id="add-money-form" className="space-y-4">
              {/* Amount */}
              <Input
                formik
                name="amount"
                label="Amount to Add"
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
            form="add-money-form"
            disabled={isPending}
          >
            {isPending ? "Adding..." : "Add Money"}
          </ButtonWithProps>
        </>
      }
    />
  );
}
