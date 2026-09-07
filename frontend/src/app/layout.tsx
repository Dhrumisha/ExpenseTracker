import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { AuthInitializer } from "@/components/AuthInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FinBoard — Personal Finance Tracker",
  description:
    "Track accounts, income, and expenses in one clean dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning is required here because next-themes sets the
    // theme class/color-scheme on <html> after hydration (to avoid a
    // flash of the wrong theme); without it React logs a mismatch warning
    // on every page load even though nothing is actually broken.
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <AuthInitializer/>
          {children}
        </Providers>
      </body>
    </html>
  );
}
