"use client";
import { Navbar } from "@/components/layout/Navbar";

export default function BarberiaPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="container py-8">
        <h1 className="text-3xl font-black uppercase italic text-blue-600">Gestión de Barbería</h1>
        <p className="text-muted-foreground mt-2">Módulo en construcción...</p>
      </main>
    </div>
  );
}
