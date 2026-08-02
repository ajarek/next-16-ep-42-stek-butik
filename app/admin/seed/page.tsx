"use client";

import { useState } from "react";
import { seedProducts } from "@/lib/services/productService";
import { Flame, Loader2, CheckCircle2 } from "lucide-react";

export default function AdminSeedPage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSeed = async () => {
    setIsSeeding(true);
    setError("");
    try {
      await seedProducts();
      setDone(true);
    } catch (err: any) {
      setError(err.message || "Błąd podczas seedowania bazy.");
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <main className="min-h-screen bg-foreground flex flex-col justify-center items-center text-background px-4">
      <div className="max-w-sm w-full space-y-6 text-center bg-slate-950/80 border border-white/10 rounded-2xl p-10">
        <Flame className="w-12 h-12 text-amber-400 mx-auto" />
        <h1 className="text-2xl font-bold uppercase tracking-wider">Admin: Seed Produktów</h1>
        <p className="text-slate-400 text-sm">
          Kliknij poniżej, aby dodać testowe steki do bazy Firestore. Uruchom to tylko raz!
        </p>

        {done ? (
          <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold">
            <CheckCircle2 className="w-5 h-5" />
            Produkty dodane do Firestore!
          </div>
        ) : (
          <button
            onClick={handleSeed}
            disabled={isSeeding}
            className="w-full py-3 rounded-xl bg-linear-to-r from-red-600 to-amber-600 text-white font-bold uppercase tracking-wider hover:brightness-110 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSeeding ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {isSeeding ? "Seeding..." : "Seed Firestore"}
          </button>
        )}

        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
    </main>
  );
}
