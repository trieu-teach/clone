import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ThemeProvider as NextThemesProvider } from "next-themes"

const LexendSans = Lexend({ subsets: ['latin', 'latin-ext', 'vietnamese'] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full">
      <body
        className={`${LexendSans.className} antialiased flex flex-col min-h-full`}
      >
        <Header />
        <div className="z-10 m-auto container px-2">
          {children}
        </div>
        <div className="grow shrink-0 basis-auto min-h-2"></div>
        <div className="absolute inset-0">
          <div className="fixed inset-0 -z-10 h-full w-full  bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>
        </div>
        <div className="shrink-0">
          <Footer />
        </div>
      </body>
    </html>
  );
}
