'use client';

import { AuthProvider } from "@/context/AuthContext";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <AuthProvider>
        {children}
      </AuthProvider>
    </div>
  );
} 