"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { LogIn, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("¡Bienvenido a Nítido!");
      router.push("/");
    } catch (error: any) {
      console.error(error);
      toast.error("Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FDFDFD] px-4 py-12 sm:px-6 lg:px-8">
      {/* --- Background: Subtle and Clean --- */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Very subtle glow */}
        <div className="absolute top-[-20%] left-[-10%] h-[1000px] w-[1000px] rounded-full bg-primary/3 blur-[120px]" />
      </div>

      {/* Subtle Dot Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.02] [mask-image:radial-gradient(ellipse_at_center,white,transparent)] pointer-events-none">
        <div className="h-full w-full bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* --- Content --- */}
      <div className="relative z-10 w-full max-w-[400px]">
        {/* Minimal Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="mb-12 flex flex-col items-center justify-center"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 text-white shadow-lg transition-transform hover:scale-105">
            <span className="text-xl font-bold italic">N</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-[0.2em] text-slate-900 uppercase">
            NÍTIDO
          </h1>
          <p className="mt-1 text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase">
            Ecosistema de Gestión
          </p>
        </motion.div>

        {/* Elegant Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "circOut" }}
        >
          <Card className="border border-slate-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
            <CardHeader className="space-y-1.5 pb-8 pt-10 text-center">
              <CardTitle className="text-xl font-semibold tracking-tight text-slate-900">
                Iniciar Sesión
              </CardTitle>
              <CardDescription className="text-xs font-medium text-slate-400">
                Ingresa al panel de control de tu negocio
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleLogin}>
              <CardContent className="grid gap-6 px-8">
                {/* Email Field */}
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                    Correo Electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nombre@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 border-slate-100 bg-slate-50/30 transition-all focus:bg-white focus:ring-0 focus:border-slate-300 text-sm placeholder:text-slate-300"
                  />
                </div>

                {/* Password Field */}
                <div className="grid gap-2">
                  <div className="flex items-center justify-between ml-1">
                    <Label htmlFor="password" className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Contraseña
                    </Label>
                    <button 
                      type="button" 
                      className="text-[10px] font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest"
                      onClick={() => toast.info("Contacta soporte para recuperar tu acceso.")}
                    >
                      ¿Olvidaste?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11 border-slate-100 bg-slate-50/30 transition-all focus:bg-white focus:ring-0 focus:border-slate-300 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-6 pb-10 pt-4 px-8">
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-slate-900 font-bold text-xs uppercase tracking-[0.2em] text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-md active:scale-[0.98]" 
                  disabled={loading}
                >
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.span 
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center gap-2"
                      >
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verificando
                      </motion.span>
                    ) : (
                      <motion.span 
                        key="ready"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center gap-2"
                      >
                        Acceder
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
        
        {/* Minimal Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300">
            Nítido &copy; {new Date().getFullYear()}
          </p>
        </motion.div>
      </div>
    </div>
  );
}