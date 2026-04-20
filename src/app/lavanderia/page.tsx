"use client";
import { Navbar } from "@/components/layout/Navbar";

export default function LavanderiaPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="container py-8">
        <h1 className="text-3xl font-black uppercase italic text-indigo-600">Gestión de Lavandería</h1>
        <p className="text-muted-foreground mt-2">Módulo en construcción...</p>
      </main>
    </div>
  );
}
