"use client";
import AccountsList from "@/components/Accounts/AccountsList";
import StatisticCard from "@/components/Card/StatisticCard";
import SummaryDonutChart, {
  SummaryItem,
} from "@/components/Charts/SummaryDonutChart";
import { useQuery } from "@tanstack/react-query";
import { StatisticCardItem } from "@/data/cardData";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { ROUTES } from "../routes";
import { fetchDashboardData } from "@/services/dashboard/dashboard.servce";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import TransactionChart from "@/components/Charts/TransactionChart";
import LatestTransactionsTable from "@/components/Table/LatestTransactionsTable";

export default function DashboardPage() {
  const { data: DashboardData, isLoading } = useQuery({
    queryKey: ["Dashboard"],
    queryFn: fetchDashboardData,
  });

  if (isLoading) return <p className="p-10">Loading dashboard...</p>;

  const stats: StatisticCardItem[] = [
    {
      title: "Total Balance",
      amount: DashboardData.availableBalance,
      description: "Available across all accounts",
      icon: Wallet,
      iconBgColor: "bg-blue-100 dark:bg-blue-900/40",
      iconColor: "text-blue-600",
    },
    {
      title: "Income",
      amount: DashboardData.totalIncome,
      description: "This year",
      icon: TrendingUp,
      iconBgColor: "bg-green-100 dark:bg-green-900/40",
      iconColor: "text-green-600",
      trend: "up",
    },
    {
      title: "Expense",
      amount: DashboardData.totalExpense,
      description: "This year",
      icon: TrendingDown,
      iconBgColor: "bg-red-100 dark:bg-red-900/40",
      iconColor: "text-red-600",
      trend: "down",
    },
  ];

  const summaryData: SummaryItem[] = [
    { name: "Income", value: DashboardData.totalIncome, type: "income" },
    { name: "Expense", value: DashboardData.totalExpense, type: "expense" },
  ];

  const transactionData = DashboardData.chartData.map((item: any) => ({
    month: item.label.substring(0, 3),
    income: item.income,
    expense: item.expense,
  }));

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="All the details about your Accounts, Transactions, etc..."
      />

      <div className="p-10">
        <StatisticCard items={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          <div className="lg:col-span-2">
            <TransactionChart data={transactionData} />
          </div>
          <SummaryDonutChart data={summaryData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
          <div className="lg:col-span-2">
            <LatestTransactionsTable
              data={DashboardData.lastTransactions}
              title="Latest Transactions"
              buttonName="View All"
              buttonLink={ROUTES.admin.transactions}
            />
          </div>

          <AccountsList data={DashboardData.lastAccounts} />
        </div>
      </div>
    </>
  );
}

