import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/organisms/NavBar";
import { SearchProvider } from "@/search-context/search-provider/components";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Dailymotion Search",
  description: "This web site allows to search videos and series with filters, and save search history and favorites",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <SearchProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

          <header></header>
          <Navbar />

          <main className='main min-w-400 md:max-w-screen-xl lg:max-w-screen-2xl'>
          {children}
          </main>

          <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
          
        </body>
      </html>
    </SearchProvider>
  );
}
