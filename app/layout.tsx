import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WebAR Marker App",
  description: "AR.js + A-Frame + Next.js WebAR application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
