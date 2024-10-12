import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { Header } from "~/app/_components/header";
import { Footer } from "./_components/footer";
import { Sidebar } from "./_components/sidebar";
import { SportHeader } from "./_components/sport-header";
import { getServerAuthSession } from "~/server/auth";

export const metadata: Metadata = {
  title: "Referee AI",
  description: "Your intelligent companion for NFHS rulebooks",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerAuthSession();

  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <div className="flex min-h-screen w-full flex-col">
            <Header />
            <div className="flex flex-1">
              {session && <Sidebar />}
              <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto py-6">
                  {/* SportHeader will be rendered in specific sport pages */}
                  {children}
                </div>
              </main>
            </div>
            <Footer />
          </div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
