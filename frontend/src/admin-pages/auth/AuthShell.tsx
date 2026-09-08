"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LucideIcon, PieChart, ShieldCheck, Wallet2 } from "lucide-react";

import { ROUTES } from "@/admin-pages/routes";

const FEATURES: { icon: LucideIcon; label: string }[] = [
  { icon: Wallet2, label: "All your accounts, one dashboard" },
  { icon: PieChart, label: "Visual, real-time spending insights" },
  { icon: ShieldCheck, label: "Bank-grade, encrypted by default" },
];

/**
 * Shared two-column shell for every auth screen: a branded panel on the
 * left (hidden on small screens) and the actual form on the right. Keeps
 * sign-in/sign-up/forgot/reset visually consistent without duplicating
 * the layout in each page.
 */
export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-background">
      {/* BRAND PANEL */}
      <div className="relative hidden overflow-hidden bg-primary lg:flex lg:flex-col lg:justify-between lg:p-12">
        <BrandGlow />

        <Link
          href={ROUTES.root}
          className="relative z-10 text-2xl font-semibold text-primary-foreground"
        >
          Fin<span className="opacity-70">Board</span>
        </Link>

        <div className="relative z-10 max-w-md">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-semibold leading-tight text-primary-foreground"
          >
            Track every rupee. Master your money.
          </motion.h1>
          <p className="mt-3 text-primary-foreground/70">
            A single, calm place to see where your money comes from and where
            it goes.
          </p>

          <ul className="mt-8 space-y-4">
            {FEATURES.map(({ icon: Icon, label }, i) => (
              <motion.li
                key={label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
                className="flex items-center gap-3 text-sm text-primary-foreground/90"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-foreground/10">
                  <Icon className="size-4" />
                </span>
                {label}
              </motion.li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} FinBoard. Built for people who like
          knowing where their money went.
        </p>
      </div>

      {/* FORM PANEL */}
      <div className="flex flex-col items-center justify-center px-6 py-12 sm:px-10">
        <Link
          href={ROUTES.root}
          className="mb-8 text-xl font-semibold lg:hidden"
        >
          <span className="text-primary">Fin</span>Board
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {description}
            </p>
          </div>

          {children}

          {footer && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {footer}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

/** Soft animated glow blobs that give the brand panel some depth. */
function BrandGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.5, 0.35] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-24 -top-24 size-96 rounded-full bg-income blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-0 right-0 size-96 translate-x-1/3 translate-y-1/3 rounded-full bg-[rgb(var(--balance))] blur-3xl"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] [background-size:24px_24px]" />
    </div>
  );
}
