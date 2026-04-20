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
import { Scissors, Waves, LogIn, ShieldCheck, Eye, EyeOff } from "lucide-react";
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12 sm:px-6 lg:px-8">
      {/* --- Background Elements --- */}
      {/* Animated Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            x: [0, -40, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] -right-[10%] h-[600px] w-[600px] rounded-full bg-secondary/5 blur-[120px]" 
        />
      </div>

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.03] [mask-image:radial-gradient(ellipse_at_center,white,transparent)] pointer-events-none">
        <div className="h-full w-full bg-[grid-linear-to-r_#000_1px_transparent_1px,_grid-linear-to-b_#000_1px_transparent_1px] bg-[size:40px_40px]" />
      </div>

      {/* --- Content --- */}
      <div className="relative z-10 w-full max-w-[440px]">
        {/* Logo Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8 flex flex-col items-center justify-center space-y-4"
        >
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 0 }}
            initial={{ rotate: 3 }}
            className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-2xl shadow-primary/30 cursor-pointer"
          >
            <span className="text-4xl font-black italic tracking-tighter">N</span>
          </motion.div>
          <div className="text-center">
            <h1 className="text-5xl font-black tracking-tighter text-gradient leading-tight">
              NÍTIDO
            </h1>
            <div className="mt-1 flex items-center justify-center gap-2 text-sm font-medium tracking-wider text-muted-foreground uppercase">
              <span className="flex items-center gap-1.5"><Scissors className="h-3.5 w-3.5" /> Barber</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
              <span className="flex items-center gap-1.5"><Waves className="h-3.5 w-3.5" /> Laundry</span>
            </div>
          </div>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          <Card className="glass overflow-hidden border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
            <div className="h-1.5 w-full bg-linear-to-r from-primary via-indigo-500 to-secondary" />
            
            <CardHeader className="space-y-2 pb-6 pt-8">
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
                  Acceso
                </CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              </div>
              <CardDescription className="text-base text-slate-500">
                Gestiona tu negocio con precisión clínica y estilo urbano.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleLogin}>
              <CardContent className="grid gap-6">
                {/* Email Field */}
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="grid gap-2.5"
                >
                  <Label htmlFor="email" className="text-sm font-semibold text-slate-700 ml-0.5">
                    Correo Electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nombre@nitido.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 bg-white/40 border-slate-200/60 transition-all focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-base font-medium placeholder:text-slate-400"
                  />
                </motion.div>

                {/* Password Field */}
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="grid gap-2.5"
                >
                  <div className="flex items-center justify-between ml-0.5">
                    <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                      Contraseña
                    </Label>
                    <button 
                      type="button" 
                      className="text-xs font-bold text-primary hover:underline underline-offset-4"
                      onClick={() => toast.info("Contacta al administrador para recuperar tu acceso.")}
                    >
                      ¿Olvidaste tu clave?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 bg-white/40 border-slate-200/60 transition-all focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary pr-11 text-base font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </motion.div>
              </CardContent>

              <CardFooter className="flex flex-col gap-6 pb-8 pt-2">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="w-full"
                >
                  <Button 
                    type="submit" 
                    className="group relative w-full h-14 overflow-hidden rounded-2xl bg-slate-900 font-bold text-lg text-white shadow-xl transition-all hover:bg-slate-800 active:scale-[0.98]" 
                    disabled={loading}
                  >
                    <AnimatePresence mode="wait">
                      {loading ? (
                        <motion.span 
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center gap-3"
                        >
                          <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Autenticando...
                        </motion.span>
                      ) : (
                        <motion.span 
                          key="ready"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center justify-center gap-3"
                        >
                          <LogIn className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                          Entrar a la Plataforma
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>

                <div className="flex w-full items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  <div className="h-px flex-1 bg-slate-100" />
                  <span className="px-4">Sistema Control Total</span>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex flex-col items-center justify-center space-y-4 text-center"
        >
          <p className="text-sm font-medium text-slate-500">
            &copy; {new Date().getFullYear()} <span className="font-bold text-slate-900">Nítido Ecosistema</span>. v1.0.0
          </p>
          <div className="flex gap-4">
            <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
            <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
            <span className="h-1.5 w-1.5 rounded-full bg-secondary/40" />
          </div>
        </motion.div>
      </div>

      {/* Decorative Technical data (Fira Code) */}
      <div className="absolute bottom-8 left-8 hidden xl:block">
        <p className="font-mono text-[10px] text-slate-300 uppercase tracking-tighter leading-none">
          Auth_Module :: secure_connect <br />
          Env :: production <br />
          Node :: active_stable
        </p>
      </div>
      
      <div className="absolute top-8 right-8 hidden xl:block">
        <p className="font-mono text-[10px] text-slate-300 uppercase tracking-tighter text-right leading-none">
          Barber_Logic [OK] <br />
          Laundry_Sync [OK] <br />
          Finances_Core [LOADED]
        </p>
      </div>
    </div>
  );
}