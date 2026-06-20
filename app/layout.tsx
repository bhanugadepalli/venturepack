import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VenturePack",
  description: "Prepare your startup before the first legal conversation.",
  openGraph: {
    title: "VenturePack",
    description: "Prepare your startup before the first legal conversation.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
