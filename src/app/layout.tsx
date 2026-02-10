import "~/styles/globals.css";

import { type Metadata } from "next";
import { Inter } from "next/font/google"

export const metadata: Metadata = {
  title: "ContentHelper",
  description: "An app inspire from Elevenlabs",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.className}`}>
      <body>{children}</body>
    </html>
  );
}
