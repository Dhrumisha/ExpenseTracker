"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Account } from "@/types/Dashboard/account.types";
import { AccountIcon } from "@/components/Accounts/AccountIcon";

export default function AccountsList({ data }: { data: Account[] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Accounts</CardTitle>
        <p className="text-sm text-muted-foreground">
          View all your accounts
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {data?.map((account) => (
          <div
            key={account.id}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition"
          >
            {/* Left */}
            <div className="flex items-center gap-3">
              <AccountIcon type={account.type} />

              <div>
                <p className="font-medium">{account.name}</p>
                <p className="text-sm text-muted-foreground">
                  {account.number}
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="text-right">
              <p className="font-semibold">
                GHS {account.balance.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                Account Balance
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
