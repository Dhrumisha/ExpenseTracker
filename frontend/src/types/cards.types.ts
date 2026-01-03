import { LucideIcon } from "lucide-react";

export interface StatisticCardItem {
  title: string;
  amount: number | string;
  description?: string;
  label?: string;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  trend?: "up" | "down";
}

export interface StatisticCardProps {
  items: StatisticCardItem[];
  iconSize?: string;
  iconPosition?: "left" | "right";
  iconBgSize?: string;
  iconCenter?: boolean;
  cardSize?: string;
  currency?: string;
}
