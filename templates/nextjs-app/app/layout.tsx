import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ContinualPreview } from "./continual-preview";
import "./styles.css";

export const metadata: Metadata = { title: "Continual App" };

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ContinualPreview />
        {children}
      </body>
    </html>
  );
}
