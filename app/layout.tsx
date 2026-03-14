import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const noto = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-main",
});

export const metadata: Metadata = {
  title: "Vibe Coding",
  description: "너만의 캐릭터가 태어나는 대화형 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={noto.variable}>{children}</body>
    </html>
  );
}