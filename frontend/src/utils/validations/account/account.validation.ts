// utils/validations/account/account.schema.ts
import * as Yup from "yup";

export const CreateAccountSchema = Yup.object({
  acc_name: Yup.string().required("Account type is required"),
  acc_number: Yup.string()
    .min(8, "Account number too short")
    .required("Account number is required"),
  amount: Yup.number()
    .typeError("Amount must be a number")
    .positive("Amount must be greater than 0")
    .required("Initial amount is required"),
});

export const AddMoneySchema = Yup.object({
  amount: Yup.number()
    .positive("Amount must be greater than 0")
    .required("Amount is required"),
});

export const TransferMoneySchema = Yup.object({
  from_acc: Yup.number().required("From account is required"),
  to_acc: Yup.number()
    .required("To account is required")
    .notOneOf(
      [Yup.ref("from_acc")],
      "Accounts must be different"
    ),
  amount: Yup.number()
    .positive("Amount must be greater than 0")
    .required("Amount is required"),
});
