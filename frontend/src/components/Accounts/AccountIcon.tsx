import { Wallet, CreditCard, DollarSign } from "lucide-react";

export function AccountIcon({ type }: { type: string }) {
  const base =
    "w-10 h-10 flex items-center justify-center rounded-full text-white";

  switch (type) {
    case "paypal":
      return (
        <div className={`${base} bg-blue-600`}>
          <Wallet size={18} />
        </div>
      );
    case "visa":
      return (
        <div className={`${base} bg-indigo-600`}>
          <CreditCard size={18} />
        </div>
      );
    case "cash":
      return (
        <div className={`${base} bg-red-500`}>
          <DollarSign size={18} />
        </div>
      );
    default:
      return null;
  }
}
