import type { Metadata } from "next";
import "./globals.css";
import { Poppins as FontSans } from "next/font/google";
import Header from "@/components/Header";
import ConvexClientProvider from "./ConvexClientProvider";
import { Toaster } from "@/components/ui/toaster";
import SideNav from "@/components/SideNav";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Logo from "@/components/ui/Logo";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

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
    <html lang="en">
      <body className={fontSans.variable}>
        <Toaster />

        <ConvexClientProvider>
          <SignedOut>
            <div className="bg-primary">
              <header className=" flex items-center justify-between p-6 text-background">
                <Logo />
              </header>
            </div>
          </SignedOut>
          <SignedIn>
            <Header />
          </SignedIn>
          <div className="flex min-h-screen">
            <SignedIn>
              <SideNav />
            </SignedIn>
            <main className="flex-1 p-20">{children}</main>
          </div>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
