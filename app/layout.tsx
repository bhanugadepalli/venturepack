import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VenturePack",
  description: "Your startup preparation dashboard.",
  icons: {
    icon: "/brand/venturepack-icon-transparent.png",
    apple: "/brand/venturepack-icon-transparent.png",
  },
  openGraph: {
    title: "VenturePack",
    description: "Your startup preparation dashboard.",
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
