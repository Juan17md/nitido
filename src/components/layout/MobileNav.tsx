"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Scissors, 
  Waves, 
  History,
  Menu,
  X,
  ChevronRight,
  Briefcase,
  Database,
  BarChart3,
  Settings
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Panel", href: "/", icon: LayoutDashboard },
  { 
    name: "Barbería", 
    href: "/barberia", 
    icon: Scissors,
    subItems: [
      { name: "Panel Principal", href: "/barberia", icon: LayoutDashboard },
      { name: "Servicios", href: "/barberia/servicios", icon: Briefcase },
      { name: "Historial", href: "/barberia/historial", icon: History },
      { name: "Inventario", href: "/barberia/inventario", icon: Database },
      { name: "Finanzas", href: "/barberia/finanzas", icon: BarChart3 },
    ]
  },
  { 
    name: "Lavandería", 
    href: "/lavanderia", 
    icon: Waves,
    subItems: [
      { name: "Panel Principal", href: "/lavanderia", icon: LayoutDashboard },
      { name: "Servicios", href: "/lavanderia/servicios", icon: Briefcase },
      { name: "Historial", href: "/lavanderia/historial", icon: History },
      { name: "Máquinas", href: "/lavanderia/maquinas", icon: Settings },
      { name: "Finanzas", href: "/lavanderia/finanzas", icon: BarChart3 },
    ]
  },
];

export function MobileNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close menu when pathname changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white/90 backdrop-blur-2xl border-t border-slate-100 px-3 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.03)]">
        <nav className="grid h-12 grid-cols-3 gap-2">
          <Link
            href="/"
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl text-[10px] font-bold uppercase tracking-[0.12em] transition-all duration-300 active:scale-95",
              pathname === "/" ? "bg-slate-950 text-white shadow-sm" : "text-slate-400 hover:bg-slate-50"
            )}
          >
            <LayoutDashboard size={16} />
            <span>Inicio</span>
          </Link>

          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 transition-all duration-300 active:scale-95 hover:bg-slate-50"
          >
            <Menu size={16} />
            <span>Menú</span>
          </button>

          <Link
            href="/historial"
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl text-[10px] font-bold uppercase tracking-[0.12em] transition-all duration-300 active:scale-95",
              pathname.includes("historial") ? "bg-slate-950 text-white shadow-sm" : "text-slate-400 hover:bg-slate-50"
            )}
          >
            <History size={16} />
            <span>Global</span>
          </Link>
        </nav>
      </div>

      {/* Bottom Sheet Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[70] bg-slate-900/40 backdrop-blur-sm md:hidden"
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-[80] bg-white overflow-y-auto md:hidden shadow-[0_-20px_60px_rgba(0,0,0,0.1)] pb-10"
            >
              {/* Header con botón de cierre pegajoso o con más aire */}
              <div className="sticky top-0 z-[90] bg-white/80 backdrop-blur-md px-8 py-6 flex items-center justify-between border-b border-slate-50 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Navegación</h2>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Ecosistema Nítido</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 active:scale-90 transition-transform"
                >
                  <X size={20} />
                </button>
              </div>


              {/* Menu Items */}
              <div className="px-6 space-y-6">
                {navItems.map((item) => {
                  const isMainActive = pathname === item.href || item.subItems?.some(sub => pathname === sub.href);
                  
                  return (
                    <div key={item.name} className="space-y-3">
                      <Link 
                        href={item.href}
                        className="flex items-center gap-3 px-2 active:opacity-60 transition-opacity"
                      >
                        <div className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-lg",
                          isMainActive ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-400"
                        )}>
                          <item.icon size={16} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-900">
                          {item.name}
                        </span>
                      </Link>

                      {item.subItems && (
                        <div className="grid grid-cols-2 gap-2">
                          {item.subItems.map((sub) => {
                            const isSubActive = pathname === sub.href;
                            return (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                className={cn(
                                  "flex items-center gap-3 p-4 rounded-2xl border transition-all active:scale-95",
                                  isSubActive 
                                    ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-200" 
                                    : "bg-white border-slate-100 text-slate-500 active:bg-slate-50"
                                )}
                              >
                                <sub.icon size={16} className={cn(isSubActive ? "text-white" : "text-slate-300")} />
                                <span className="text-[10px] font-bold uppercase tracking-tight truncate">
                                  {sub.name}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
