"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { GetAllAccount } from "@/services/account/account.service";
import AddAccountModal from "@/admin-pages/AccountPage/common/AccountModal";
import AccountCard from "@/components/Card/AccountCard";
import { PageHeader } from "@/components/PageHeader/ListPageHeader";
import { Account } from "@/types/account/account.types";

export default function AccountsPage() {
  const [open, setOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["accounts"],
    queryFn: GetAllAccount,
  });

  const accounts = data?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
        <PageHeader
          customModuleName="Accounts"
          customDescription="Manage your accounts here."
          buttonName="Add Account"
          onClick={() => setOpen(true)}
          isModel={true}
        />

      {/* Accounts Grid */}
      {accounts.length === 0 ? (
        <div className="flex flex-col items-center justify-center border rounded-lg p-10 text-center text-muted-foreground">
          <p>No accounts added yet</p>
          <Button className="mt-4" onClick={() => setOpen(true)}>
            + Create your first account
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 xl:px-8">
          {accounts.map((account: Account) => (
            <AccountCard key={account.id} account={account} accounts={accounts} />
          ))}
        </div>
      )}

      {/* Modal */}
      <AddAccountModal
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  );
}
