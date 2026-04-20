"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Scissors, Waves, LayoutDashboard, History, LogOut, User, Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Barbería", href: "/barberia", icon: Scissors },
    { name: "Lavandería", href: "/lavanderia", icon: Waves },
    { name: "Historial", href: "/historial", icon: History },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-slate-100">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="group flex items-center space-x-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white font-black italic shadow-lg shadow-primary/30 group-hover:rotate-6 transition-transform">
              N
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-white rounded-full border-2 border-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight uppercase leading-none">Nítido</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mt-1">Management</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-bold transition-all",
                    isActive 
                      ? "text-primary" 
                      : "text-muted-foreground hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <item.icon className={cn("h-4 w-4 transition-transform", isActive && "scale-110")} />
                  {item.name}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-2xl text-muted-foreground hover:bg-slate-50 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-rose-500 rounded-full border-2 border-white" />
          </Button>
          
          <div className="h-8 w-[1px] bg-slate-100 mx-2" />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button variant="ghost" className="relative flex items-center gap-2 h-11 pr-2 pl-1 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm border border-slate-100 text-slate-600">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="hidden sm:flex flex-col items-start pr-2">
                    <span className="text-xs font-black uppercase tracking-tight leading-none truncate max-w-[100px]">
                      {user.email?.split("@")[0]}
                    </span>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider leading-none mt-1">
                      Admin
                    </span>
                  </div>
                </Button>
              } />
              <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl border-slate-100 shadow-2xl">
                <DropdownMenuLabel className="px-4 py-3">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-black uppercase tracking-tight">{user.email?.split("@")[0]}</p>
                    <p className="text-xs font-medium text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-50" />
                <DropdownMenuItem className="rounded-xl focus:bg-slate-50 cursor-pointer py-3 px-4">
                  <User className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span className="font-bold text-sm">Mi Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-50" />
                <DropdownMenuItem onClick={handleLogout} className="rounded-xl focus:bg-rose-50 text-rose-600 focus:text-rose-600 cursor-pointer py-3 px-4">
                  <LogOut className="mr-3 h-4 w-4" />
                  <span className="font-bold text-sm">Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login" className={cn(buttonVariants({ variant: "default" }), "rounded-2xl font-black uppercase tracking-widest text-xs h-11 px-8 shadow-lg shadow-primary/20")}>
              Acceder
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
