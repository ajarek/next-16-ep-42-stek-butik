"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { getUserTransactions, Transaction, transactionStatusLabels, transactionStatusColors } from "@/lib/services/transactionService";
import { motion } from "motion/react";
import { User, Package, ShoppingBag, LogIn, Receipt, Clock, Truck, Store, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import AuthModal from "@/components/AuthModal";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      setFetchError(null);
      return;
    }

    setIsLoading(true);
    setFetchError(null);

    getUserTransactions(user.uid)
      .then(setTransactions)
      .catch((err) => {
        console.error("Błąd pobierania transakcji:", err);
        const code = err?.code as string | undefined;
        if (code === "permission-denied") {
          setFetchError(
            "Brak uprawnień do odczytu zamówień. Sprawdź reguły Firestore w Firebase Console."
          );
        } else {
          setFetchError("Nie udało się pobrać historii zamówień. Spróbuj ponownie później.");
        }
        setTransactions([]);
      })
      .finally(() => setIsLoading(false));
  }, [user]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut(auth);
      router.push("/");
    } catch (err) {
      console.error("Błąd wylogowania:", err);
      setIsLoggingOut(false);
    }
  };

  if (loading || isLoading) {
    return (
      <main className="min-h-screen bg-foreground pt-32 pb-20 flex justify-center items-center">
        <div className="animate-pulse text-chart-1 text-lg uppercase tracking-widest">
          Ładowanie...
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-foreground pt-32 pb-20 flex flex-col justify-center items-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-slate-950/90 border border-white/10 p-10 space-y-6 rounded-2xl"
        >
          <div className="mx-auto w-20 h-20 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center">
            <LogIn className="w-10 h-10 text-amber-400" />
          </div>
          <h1 className="text-3xl font-bold text-background uppercase tracking-wider">
            Zaloguj się
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Musisz się zalogować, aby zobaczyć historię swoich zamówień.
          </p>
          <Button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full h-12 bg-linear-to-r from-red-600 to-amber-600 text-white font-bold uppercase tracking-widest rounded-xl hover:brightness-110 cursor-pointer"
          >
            Zaloguj / Zarejestruj
          </Button>
        </motion.div>

        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-foreground text-background pt-28 pb-20 px-4 md:px-8 lg:px-16">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-white/10 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight">
              Mój Profil
            </h1>
            <p className="text-slate-400 text-base">
              Historię i szczegóły Twoich zamówień
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center gap-4 px-4 py-3 bg-slate-900/80 border border-white/10 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center overflow-hidden shrink-0">
                {user.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "Avatar"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-amber-400" />
                )}
              </div>
              <div>
                <p className="text-xs text-slate-400">Zalogowany jako</p>
                {user.displayName && (
                  <p className="text-sm font-bold text-white">{user.displayName}</p>
                )}
                <p className={`text-sm ${user.displayName ? "text-slate-400" : "font-bold text-white"}`}>
                  {user.email}
                </p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center justify-center gap-2 px-4 py-3 h-auto rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 hover:text-red-300 transition-colors font-semibold cursor-pointer disabled:opacity-60"
            >
              <LogOut className="w-4 h-4" />
              {isLoggingOut ? "Wylogowywanie..." : "Wyloguj się"}
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            {
              icon: Receipt,
              label: "Wszystkich zamówień",
              value: transactions.length,
              color: "text-amber-400",
              bg: "bg-amber-400/10 border-amber-400/20",
            },
            {
              icon: Package,
              label: "W realizacji",
              value: transactions.filter((t) => t.status !== "delivered").length,
              color: "text-blue-400",
              bg: "bg-blue-400/10 border-blue-400/20",
            },
            {
              icon: ShoppingBag,
              label: "Łączna wartość",
              value: `${transactions.reduce((acc, t) => acc + t.totalAmount, 0).toFixed(2)} PLN`,
              color: "text-emerald-400",
              bg: "bg-emerald-400/10 border-emerald-400/20",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`p-5 rounded-xl border ${stat.bg} space-y-2`}
            >
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
              <p className="text-slate-400 text-xs uppercase tracking-wider">{stat.label}</p>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Transactions */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold uppercase tracking-wide">Historia Zamówień</h2>

          {transactions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 space-y-4"
            >
              <ShoppingBag className="w-16 h-16 text-slate-600 mx-auto" />
              <p className="text-slate-400">Nie masz jeszcze żadnych zamówień.</p>
              <Link href="/products">
                <Button className="bg-primary text-background font-bold uppercase tracking-widest rounded-none hover:brightness-110 cursor-pointer">
                  Przeglądaj steki
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {transactions.map((txn, i) => (
                <motion.div
                  key={txn.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-slate-950/80 border border-white/10 rounded-xl p-5 md:p-6 space-y-4 hover:border-white/20 transition-colors"
                >
                  {/* Top row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500 font-mono">#{txn.id?.slice(0, 12).toUpperCase()}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        {txn.createdAt?.toDate().toLocaleString("pl-PL", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${transactionStatusColors[txn.status]}`}>
                        {transactionStatusLabels[txn.status]}
                      </span>
                      <span className="text-xl font-black text-chart-1">
                        {txn.totalAmount.toFixed(2)} PLN
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="flex flex-wrap gap-3">
                    {txn.items.map((item, j) => (
                      <div key={j} className="flex items-center gap-2 bg-slate-900 border border-white/5 rounded-lg p-2">
                        {item.image && (
                          <div className="relative w-10 h-10 rounded overflow-hidden shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-bold text-white leading-tight">{item.name}</p>
                          <p className="text-[11px] text-slate-400">x{item.quantity} · {(item.price * item.quantity).toFixed(2)} PLN</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center gap-4 text-xs text-slate-500 border-t border-white/5 pt-3">
                    {txn.deliveryMethod === "courier" ? (
                      <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-blue-400" /> Kurier chłodniczy</span>
                    ) : (
                      <span className="flex items-center gap-1"><Store className="w-3.5 h-3.5 text-emerald-400" /> Odbiór osobisty</span>
                    )}
                    <span>·</span>
                    <span className="capitalize">{txn.paymentMethod === "card" ? "Karta/BLIK" : txn.paymentMethod === "transfer" ? "Przelew" : "Pobranie"}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
