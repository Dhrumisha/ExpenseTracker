"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Account } from "@/types/account/account.types";
import { AccountIcon } from "@/components/Accounts/AccountIcon";
import { maskedNumber } from "@/admin-pages/AccountPage/common/HelperNumberFunction";
import Link from "next/link";
import { ROUTES } from "@/admin-pages/routes";

export default function AccountsList({ data }: { data: Account[] }) {
  return (
    <Card>
      <CardHeader className="pb-3 flex items-start justify-between w-full">
        <div>
          <CardTitle className="text-lg">Accounts</CardTitle>
          <p className="text-sm text-muted-foreground">Account Information</p>
        </div>
        <div>
        <Link
          className="text-sm text-purple-500"
          href={ROUTES.admin.accounts}
        >
          View all your accounts
        </Link>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {data?.map((account) => (
          <div
            key={account.id}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition"
          >
            {/* Left */}
            <div className="flex items-center gap-3">
              <AccountIcon type={account.acc_name} />

              <div>
                <p className="font-medium">{account.acc_name}</p>
                <p className="text-sm text-muted-foreground">
                  {maskedNumber(account.acc_number)}
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="text-right">
              <p className="font-semibold">
                ₹ {account.acc_balance.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Account Balance</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
