import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Uzhavar Sandhai - Coimbatore",
  description: "Coimbatore-in uzhavargalukkana oru online sandhai.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Header />
        <div className="flex-1">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
