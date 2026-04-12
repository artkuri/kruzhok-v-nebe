import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: {
    default: "Кружок в небе — студия творчества",
    template: "%s | Кружок в небе",
  },
  description:
    "Студия творчества «Кружок в небе» — рисование, арт-терапия, рукоделие и керамика для детей и взрослых",
  keywords: ["студия творчества", "рисование", "арт-терапия", "рукоделие", "керамика", "дети"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
