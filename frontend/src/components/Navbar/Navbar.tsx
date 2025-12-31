"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // optional helper
import { ProfileMenu } from "./ProfileMenu";
import { ROUTES } from "@/admin-pages/routes";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { label: "Dashboard", href: ROUTES.admin.overview },
  { label: "Transactions", href: ROUTES.admin.transactions },
  { label: "Accounts", href: ROUTES.admin.accounts },
  { label: "Settings", href: ROUTES.admin.settings },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50 border-b bg-white/80 dark:bg-background/80 backdrop-blur">
      <nav className="mx-auto flex h-16 items-center justify-between px-6">
        {/* LEFT – LOGO */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2"
        >
          <Link href="/admin/dashboard" className="text-xl font-semibold">
            <span className="text-primary">Fin</span>Board
          </Link>
        </motion.div>

        {/* CENTER – NAV LINKS */}
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

                {/* Active underline */}
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

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          <Link href={ROUTES.admin.overview} className="flex items-center gap-3">
            <ProfileMenu />
          </Link>
        </div>
      </nav>
    </header>
  );
}
