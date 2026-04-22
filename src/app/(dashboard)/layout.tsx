"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFDFD]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="h-12 w-12 animate-spin rounded-xl border-2 border-slate-900 border-t-transparent shadow-sm" />
            <div className="absolute inset-0 flex items-center justify-center font-bold italic text-slate-900">N</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-900">Nítido</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#FDFDFD]">
      {/* Sidebar - Controlado internamente para desktop */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden pb-20 md:pb-0">
        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto relative custom-scrollbar flex flex-col">
          <div className="flex-1">
            {children}
          </div>
          
          {/* Footer - Quiet Luxury */}
          <footer className="w-full py-8 mt-auto flex justify-center items-center">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-medium">
              designed by: <span className="text-slate-900 font-bold">Juan17md</span>
            </p>
          </footer>
        </main>
      </div>

      {/* Mobile Navigation - Controlado internamente para móviles */}
      <MobileNav />
    </div>
  );
}
