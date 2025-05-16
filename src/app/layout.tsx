import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import NavbarWrapper from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Astro Tracker",
  description: "Track your job applications, interviews, and career journey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-slate-50 to-indigo-50/20 min-h-screen flex flex-col`}
      >
        {/* Background animation */}
        <AnimatedBackground />
        
        <AuthProvider>
          {/* Navbar is already styled with glassmorphism in the component */}
          <NavbarWrapper />
          
          {/* Main content with glass effect card */}
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-grow">
            <div className="relative z-10">
              {children}
            </div>
          </main>
          
          {/* Footer */}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
