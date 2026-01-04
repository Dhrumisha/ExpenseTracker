"use client";
import AccountsList from "@/components/Accounts/AccountsList";
import StatisticCard from "@/components/Card/StatisticCard";
import SummaryDonutChart, {
  SummaryItem,
} from "@/components/Charts/SummaryDonutChart";
import { useQuery } from "@tanstack/react-query";
import { StatisticCardItem } from "@/types/cards.types";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { ROUTES } from "../routes";
import { fetchDashboardData } from "@/services/dashboard/dashboard.servce";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import TransactionChart from "@/components/Charts/TransactionChart";
import LatestTransactionsTable from "@/components/Table/LatestTransactionsTable";
import { TransactionItem } from "@/components/Charts/TransactionChart";
import { GetAllAccount } from "@/services/account/account.service";

export default function DashboardPage() {
  const { data: DashboardData, isLoading } = useQuery({
    queryKey: ["Dashboard"],
    queryFn: fetchDashboardData,
  });

  const { data: accountsData } = useQuery({
    queryKey: ["accounts"],
    queryFn: GetAllAccount,
  });

  const accounts = accountsData?.data || [];

  if (isLoading) return <p className="p-10">Loading dashboard...</p>;

  const stats: StatisticCardItem[] = [
    {
      title: "Total Balance",
      amount: DashboardData?.availableBalance || 0,
      description: "Available across all accounts",
      icon: Wallet,
      iconBgColor: "bg-blue-100 dark:bg-blue-900/40",
      iconColor: "text-blue-600",
    },
    {
      title: "Income",
      amount: DashboardData?.totalIncome || 0,
      description: "This year",
      icon: TrendingUp,
      iconBgColor: "bg-income-100 dark:bg-income-weak",
      iconColor: "text-income",
      trend: "up",
    },
    {
      title: "Expense",
      amount: DashboardData?.totalExpense || 0,
      description: "This year",
      icon: TrendingDown,
      iconBgColor: "bg-expense-100 dark:bg-expense-weak",
      iconColor: "text-expense",
      trend: "down",
    },
  ];

  const summaryData: SummaryItem[] = [
    { name: "Income", value: DashboardData?.totalIncome || 0, type: "income" },
    { name: "Expense", value: DashboardData?.totalExpense || 0, type: "expense" },
  ];

  const transactionData = DashboardData?.chartData?.map(
    (item: TransactionItem) => ({
      label: item.label.substring(0, 3),
      income: item.income,
      expense: item.expense,
    })
  ) || [];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="All the details about your Accounts, Transactions, etc..."
      />

      <div className="p-4 xl:p-10">
        <StatisticCard items={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          <div className="lg:col-span-2 h-[350px]">
            <TransactionChart data={transactionData} />
          </div>
          <SummaryDonutChart data={summaryData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
          <div className="lg:col-span-2">
            <LatestTransactionsTable
              data={DashboardData?.lastTransactions || []}
              title="Latest Transactions"
              buttonName="View All"
              buttonLink={ROUTES.admin.transactions}
            />
          </div>

          <AccountsList data={accounts} />
        </div>
      </div>
    </>
  );
}
