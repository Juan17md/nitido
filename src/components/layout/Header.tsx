"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { User, Search, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

export function Header() {
  const { user } = useAuth();
  const pathname = usePathname();

  // Map pathname to Page Title
  const getPageTitle = () => {
    if (pathname === "/") return "Panel General";
    if (pathname.includes("/barberia")) return "Barbería";
    if (pathname.includes("/lavanderia")) return "Lavandería";
    if (pathname.includes("/historial")) return "Historial de Servicios";
    return "Nítido";
  };

  return (
    <header className="hidden md:block sticky top-0 z-40 w-full bg-[#FDFDFD]/80 backdrop-blur-md border-b border-slate-100/50">
      <div className="expansive-container mx-auto flex h-16 items-center justify-between px-4 md:px-0">
        {/* Left Side: Page Title / Search */}
        <div className="flex items-center gap-4 md:gap-8">
          <h1 className="text-[9px] md:text-xs font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-slate-400">
            {getPageTitle()}
          </h1>
          
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 group transition-all focus-within:border-slate-300">
            <Search className="h-3.5 w-3.5 text-slate-400 group-focus-within:text-slate-600" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="bg-transparent border-none outline-none text-[11px] font-bold tracking-wider placeholder:text-slate-300 w-48"
            />
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-1 md:gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 md:h-9 md:w-9 rounded-xl text-slate-400 hover:bg-slate-50 transition-colors">
            <Settings className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>
          
          <div className="h-4 w-[1px] bg-slate-100 mx-1 md:mx-2" />

          {user && (
            <div className="flex items-center gap-2 md:gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] font-bold uppercase tracking-tight text-slate-900 leading-none">
                  {user.email?.split("@")[0]}
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">
                  En Línea
                </span>
              </div>
              <div className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-600 shadow-sm">
                <User className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
