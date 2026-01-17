import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react"
import "./globals.css";
import Navbar from "../components/organisms/NavBar";
import { SearchModule } from "@/donghua-context/videosearch-feature/view";
import { AnimeListModule } from "@/donghua-context/animelist-feature/view";
import { UserPreferenceshModule } from "@/donghua-context/user-preferences-feature";
import { ScheduleModule } from "@/donghua-context/schedule-feature";

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
  description: "This web site allows to search videos and series with filters, and save search history and follow serie and anime owners",
};

const routes = [
  { id: 1, route: "/videosearch", label: 'search' },
  { id: 2, route: '/animelist', label: "anime list" },
  { id: 3, route: '/schedule', label: "schedule" },
  { id: 4, route: '/history', label: "history" },
  { id: 5, route: '/followings', label: "followings" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <SearchModule>
      <AnimeListModule>
        <UserPreferenceshModule>
          <ScheduleModule>
            <html lang="en">
              <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

                <header></header>
                <Navbar routes={routes} />
                <Analytics />
                <main className='main'>
                {/* <main className='main min-w-400 md:max-w-screen-xl lg:max-w-screen-2xl'> */}
                {children}
                </main>

                <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>

              </body>
            </html>
          </ScheduleModule>
        </UserPreferenceshModule>
      </AnimeListModule>
    </SearchModule>
  );
}
