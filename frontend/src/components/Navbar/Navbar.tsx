"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { ProfileMenu } from "./ProfileMenu";
import ThemeToggle from "./ThemeToggle";
import { ROUTES } from "@/admin-pages/routes";

const navLinks = [
  { label: "Dashboard", href: ROUTES.admin.overview },
  { label: "Transactions", href: ROUTES.admin.transactions },
  { label: "Accounts", href: ROUTES.admin.accounts },
  { label: "Settings", href: ROUTES.admin.settings },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur">
      <nav className="mx-auto flex h-16 items-center justify-between px-6">
        {/* LEFT – LOGO */}
        <Link href={ROUTES.admin.overview} className="text-xl font-semibold">
          <span className="text-primary">Fin</span>Board
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-sm font-medium transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                {link.label}

                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-2 left-0 h-0.5 w-full rounded bg-primary"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* RIGHT – DESKTOP */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <ProfileMenu />
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="md:hidden p-2 rounded-md border"
          onClick={() => setOpen((p) => !p)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-t bg-card"
          >
            <div className="flex flex-col gap-4 px-6 py-4">
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "text-sm font-medium",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div className="flex items-center justify-between pt-4 border-t">
                <ThemeToggle />
                <ProfileMenu />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
