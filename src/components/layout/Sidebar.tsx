"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Scissors, 
  Waves, 
  Settings, 
  LogOut, 
  User, 
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  History,
  Briefcase,
  Database,
  BarChart3
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

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

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Auto-expand if current route is a sub-item
  useEffect(() => {
    navItems.forEach(item => {
      if (item.subItems?.some(sub => pathname === sub.href)) {
        setExpandedItems(prev => prev.includes(item.name) ? prev : [...prev, item.name]);
      }
    });
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleExpand = (name: string) => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setExpandedItems([name]);
      return;
    }
    setExpandedItems(prev => 
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className={cn(
        "relative z-50 hidden md:flex flex-col h-screen bg-white border-r border-slate-100 transition-all duration-500 ease-in-out",
        "shadow-[10px_0_40px_rgba(0,0,0,0.02)]"
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={() => {
          setIsCollapsed(!isCollapsed);
          if (!isCollapsed) setExpandedItems([]);
        }}
        className="absolute -right-3 top-10 flex h-6 w-6 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-400 shadow-sm transition-transform hover:scale-110 hover:text-slate-900"
      >
        {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Logo Section */}
      <div className={cn(
        "flex items-center px-6 py-10 transition-all duration-300",
        isCollapsed ? "justify-center px-0" : "justify-start gap-4"
      )}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg transition-transform hover:rotate-3">
          <span className="text-xl font-bold italic">N</span>
        </div>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <span className="text-sm font-bold tracking-[0.25em] text-slate-900 uppercase leading-none">Nítido</span>
            <span className="mt-1.5 text-[10px] font-bold uppercase leading-none tracking-[0.22em] text-slate-500">Ecosistema</span>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          const isMainActive = pathname === item.href || item.subItems?.some(sub => pathname === sub.href);
          const isExpanded = expandedItems.includes(item.name);
          const hasSubItems = item.subItems && item.subItems.length > 0;

          return (
            <div key={item.name} className="space-y-1">
              {hasSubItems ? (
                <button
                  onClick={() => toggleExpand(item.name)}
                  className={cn(
                    "w-full group relative flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-300",
                    isMainActive && !isExpanded
                      ? "bg-slate-50 text-slate-900" 
                      : "text-slate-400 hover:bg-slate-50/50 hover:text-slate-600"
                  )}
                >
                  <item.icon size={18} className={cn("shrink-0 transition-transform duration-300", isMainActive && "scale-110")} />
                  {!isCollapsed && (
                    <>
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      className="flex-1 text-left text-[11px] font-bold uppercase tracking-[0.16em]"
                      >
                        {item.name}
                      </motion.span>
                      <ChevronDown size={14} className={cn("transition-transform duration-300", isExpanded && "rotate-180")} />
                    </>
                  )}
                  {isMainActive && !isExpanded && (
                    <motion.div
                      layoutId="active-indicator"
                      className="absolute left-0 top-1/4 h-1/2 w-1 rounded-r-full bg-slate-900"
                    />
                  )}
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-300",
                    pathname === item.href 
                      ? "bg-slate-50 text-slate-900" 
                      : "text-slate-400 hover:bg-slate-50/50 hover:text-slate-600"
                  )}
                >
                  <item.icon size={18} className={cn("shrink-0 transition-transform duration-300", pathname === item.href && "scale-110")} />
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-[11px] font-bold uppercase tracking-[0.16em]"
                    >
                      {item.name}
                    </motion.span>
                  )}
                  {pathname === item.href && (
                    <motion.div
                      layoutId="active-indicator"
                      className="absolute left-0 top-1/4 h-1/2 w-1 rounded-r-full bg-slate-900"
                    />
                  )}
                </Link>
              )}

              {/* Sub-items Accordion */}
              <AnimatePresence>
                {!isCollapsed && hasSubItems && isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="mt-1 space-y-1 border-l border-slate-100 ml-6 pl-4">
                      {item.subItems.map((sub) => {
                        const isSubActive = pathname === sub.href;
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200",
                              isSubActive 
                                ? "text-slate-900 font-bold" 
                                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50/50"
                            )}
                          >
                            <sub.icon size={14} className={cn(isSubActive ? "text-slate-900" : "text-slate-300")} />
                            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                              {sub.name}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Bottom Section: User */}
      <div className="mt-auto border-t border-slate-50 p-4 space-y-4">
        {/* User Profile */}
        <div className={cn(
          "flex items-center gap-3 rounded-2xl bg-slate-50/50 p-3 transition-all",
          isCollapsed ? "justify-center px-0" : "justify-start"
        )}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm border border-slate-100 text-slate-400">
            <User size={20} />
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col min-w-0"
            >
              <span className="truncate text-[10px] font-bold uppercase tracking-tight text-slate-900">
                {user?.email?.split("@")[0]}
              </span>
              <span className="text-[10px] font-medium text-slate-500">Administrador</span>
            </motion.div>
          )}
          {!isCollapsed && (
            <button 
              onClick={handleLogout}
              className="ml-auto text-slate-300 hover:text-slate-900 transition-colors p-1"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
