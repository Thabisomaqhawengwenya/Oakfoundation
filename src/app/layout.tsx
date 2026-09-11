import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OAK Foundation Event Attendance Platform",
  description: "Official registration, check-in, program, and partner platform for OAK Foundation Partner Convening 2026.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#F3F5F9] text-slate-900 flex flex-col lg:flex-row">
        <AppProvider>
          {/* Desktop Left Sidebar */}
          <Sidebar />

          {/* Main Layout Container */}
          <div className="flex-1 flex flex-col min-w-0 min-h-screen">
            {/* Mobile Header (hidden on lg screens) */}
            <div className="lg:hidden">
              <Navbar />
            </div>

            {/* Main Content Area */}
            <main className="flex-1 pb-24 lg:pb-12">{children}</main>

            {/* Mobile Floating Bottom Dock (hidden on lg screens) */}
            <div className="lg:hidden">
              <BottomNav />
            </div>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
