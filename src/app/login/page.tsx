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
import { Scissors, Waves, LogIn } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Shapes for Urban Clinical feel */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="w-full max-w-md space-y-8 z-10">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/20 rotate-3 transition-transform hover:rotate-0">
            <span className="text-3xl font-black italic">N</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-primary">NÍTIDO</h1>
          <p className="text-muted-foreground font-medium">Gestión de Barbería & Lavandería</p>
        </div>

        <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para acceder al sistema.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nombre@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/50"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/50"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full font-bold h-11" 
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Cargando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Acceder al Sistema
                  </span>
                )}
              </Button>
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground font-medium uppercase tracking-widest">
                <div className="flex items-center gap-1">
                  <Scissors className="h-3 w-3" />
                  <span>Barbería</span>
                </div>
                <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                <div className="flex items-center gap-1">
                  <Waves className="h-3 w-3" />
                  <span>Lavandería</span>
                </div>
              </div>
            </CardFooter>
          </form>
        </Card>
        
        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Nítido. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}