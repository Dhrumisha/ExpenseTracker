export interface AccountResponse {
    status: string;
    message:string;
    data: Account[];
  }
  
export interface Account {
    id: number;
    acc_name: "Cash";
    acc_number: string;
    acc_balance: string; // backend returns string
    createdat: string;
    updatedat: string;
  }
  
  export interface CreateAccountPayload {
    acc_name: string;
    acc_number: string;
    amount: number;
  }
  
  export interface AddMoneyAccountPayload {
    amount: number;
  }
  
  export interface TransferMoneyPayload {
    from_acc: number;
    to_acc: number;
    amount: number;
  }
  
  export interface commonResponseAccount{
    status:string;
    message:string;
    data:Account;
  }
  