import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { ContinualPreview } from "./continual-preview";
import "./styles.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Continual App",
  description: "A framework-native Continual App starter.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} next-fonts`}>
      <body className="min-h-dvh antialiased">
        <ContinualPreview />
        {children}
      </body>
    </html>
  );
}
