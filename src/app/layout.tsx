import type { Metadata } from "next";
import { Be_Vietnam_Pro, Space_Grotesk, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Career Quest RPG — Từ Intern đến CTO",
    template: "%s | Career Quest RPG",
  },
  description:
    "Nền tảng học lập trình dạng game mô phỏng sự nghiệp IT. Bắt đầu từ Intern, thăng cấp qua Junior, Middle, Senior, Tech Lead, Architect và trở thành CTO!",
  keywords: [
    "học lập trình",
    "coding",
    "career",
    "RPG",
    "gamification",
    "thuật toán",
    "cấu trúc dữ liệu",
    "intern",
    "CTO",
    "thăng cấp",
  ],
  openGraph: {
    title: "Career Quest RPG — Từ Intern đến CTO",
    description: "Nền tảng học lập trình dạng game mô phỏng sự nghiệp IT",
    type: "website",
    locale: "vi_VN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${beVietnam.variable} ${spaceGrotesk.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased overflow-x-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
