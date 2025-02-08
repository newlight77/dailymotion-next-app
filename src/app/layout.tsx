import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/organisms/NavBar";
import { SearchModule } from "@/bounded-contexts/videosearch-context/view";
import { AnimeListModule } from "@/bounded-contexts/animelist-context/view";
import { UserPreferenceshModule } from "@/bounded-contexts/user-preferences-context";

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

const routes = [
  { id: 1, route: "/", label: 'home' },
  { id: 2, route: '/animelist', label: "anime list" },
  { id: 3, route: '/schedule', label: "schedule" },
  { id: 4, route: '/history', label: "history" },
  { id: 5, route: '/favorites', label: "favorites" },
  { id: 6, route: '/followings', label: "followings" },
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
          <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

              <header></header>
              <Navbar routes={routes} />

              <main className='main'>
              {/* <main className='main min-w-400 md:max-w-screen-xl lg:max-w-screen-2xl'> */}
              {children}
              </main>

              <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>

            </body>
          </html>
        </UserPreferenceshModule>
      </AnimeListModule>
    </SearchModule>
  );
}
