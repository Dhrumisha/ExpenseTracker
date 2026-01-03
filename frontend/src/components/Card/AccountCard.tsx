// admin-pages/AccountPage/components/AccountCard.tsx
"use client";

import {
  MoreVertical,
  Wallet,
  Calendar,
  PiggyBank,
  CreditCard,
  HandCoins,
  Banknote,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { JSX, useState } from "react";

import { maskedNumber } from "@/admin-pages/AccountPage/common/HelperNumberFunction";
import { Account } from "@/types/account/account.types";
import Link from "next/link";
import AddMoneyModal from "@/admin-pages/AccountPage/common/AddMoneyTOAccountModal";
import TransferMoneyModal from "@/admin-pages/AccountPage/common/TransferMoneyModal";

interface Props {
  account: Account;
  accounts: Account[];
}

const ACCOUNT_TYPE_ICONS: Record<string, JSX.Element> = {
  Cash: <HandCoins className="h-5 w-5 text-purple-600" />,
  Bank: <PiggyBank className="h-5 w-5 text-blue-600" />,
  Card: <CreditCard className="h-5 w-5 text-income" />,
  Wallet: <Wallet className="h-5 w-5 text-orange-600" />,
};

export default function AccountCard({ account, accounts }: Props) {
  const [openAddMoney, setOpenAddMoney] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  return (
    <>
      <Card className="rounded-xl border shadow-sm hover:shadow-md transition-all">
        <CardContent className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-1">
            {/* Icon */}
            <div className="flex items-start gap-5">
              <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                {ACCOUNT_TYPE_ICONS[account.acc_name] ?? (
                  <Wallet className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              {/* Title */}
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="flex items-center justify-statrt gap-2 text-xl font-semibold leading-none">
                    {account.acc_name}
                    <Banknote className="h-5 w-5 text-orange-600" />
                  </h3>
                </div>

                <div className="flex flex-col gap-2">
                  {/* Account Number */}
                  <div className="text-sm text-muted-foreground">
                    {maskedNumber(account.acc_number)}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar size={12} />
                    Created on {new Date(account.createdat).toDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* 3-dot menu */}
            <div className="flex flex-col justify-between items-end">
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <MoreVertical className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setTransferOpen(true)}
                    className="cursor-pointer"
                  >
                    Transfer Funds
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setOpenAddMoney(true)}
                    className="cursor-pointer"
                  >
                    Add Money
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem className="text-expense cursor-pointer">
                    Delete
                  </DropdownMenuItem> */}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Balance */}
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold pl-15">₹ {account.acc_balance}</div>
            <div>
              <Link
                href=""
                className="text-purple-500"
                onClick={() => setOpenAddMoney(true)}
              >
                Add Money
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <AddMoneyModal
        open={openAddMoney}
        onOpenChange={setOpenAddMoney}
        accountId={account.id}
      />

      <TransferMoneyModal
        open={transferOpen}
        onOpenChange={setTransferOpen}
        accounts={accounts || []}
      />
    </>
  );
}
