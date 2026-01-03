// utils/validations/transaction/payTransaction.schema.ts
import * as Yup from "yup";

export const PayTransactionSchema = Yup.object({
  account_id: Yup.number()
    .required("Account is required")
    .typeError("Account is required"),
  description: Yup.string().required("Description is required"),
  amount: Yup.number()
    .positive("Amount must be greater than 0")
    .required("Amount is required"),
});
