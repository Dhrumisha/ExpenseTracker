export type AccountType = "paypal" | "visa" | "cash";

export interface Account {
  id: string;
  name: string;
  number: string;
  balance: number;
  type: AccountType;
}
