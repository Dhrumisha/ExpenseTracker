// utils/maskedNumber.ts
export const maskedNumber = (value: string) => {
    if (!value || value.length < 8) return value;
    return `${value.slice(0, 4)}******${value.slice(-4)}`;
  };
  
 export const ACCOUNT_TYPES = [
    { label: "Cash", value: "Cash" },
    { label: "Bank", value: "Bank" },
    { label: "Crypto", value: "Crypto" },
    { label: "Credit Card", value: "Credit Card" },
  ];
  