"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Lock, Loader2, LogOut } from "lucide-react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onClose();
    } catch (err) {
      setError((err as any).message || "Wystąpił błąd podczas autoryzacji.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && 
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-70 w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-6"
          >
            <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-white/10 p-8 shadow-2xl">
              {/* Glassmorphism elements */}
              <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-red-500/20 blur-3xl" />
              <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-amber-500/20 blur-3xl" />

              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative z-10">
                {user ? (
                  <div className="text-center space-y-6">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20 border border-amber-500/50">
                      <Mail className="h-8 w-8 text-amber-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Jesteś zalogowany</h2>
                      <p className="text-slate-400">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/20 px-4 py-3 font-semibold text-red-500 transition-colors hover:bg-red-500/30"
                    >
                      <LogOut className="h-5 w-5" />
                      Wyloguj się
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-white mb-6">
                      {isLogin ? "Witaj ponownie!" : "Dołącz do nas"}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full rounded-xl border border-white/10 bg-black/50 py-3 pl-10 pr-4 text-white placeholder-slate-500 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
                            placeholder="twoj@email.com"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Hasło
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full rounded-xl border border-white/10 bg-black/50 py-3 pl-10 pr-4 text-white placeholder-slate-500 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>

                      {error && (
                        <p className="text-sm text-red-400 mt-2">{error}</p>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-red-600 to-amber-600 py-3 font-bold text-white shadow-lg shadow-red-900/20 transition-transform active:scale-[0.98] disabled:opacity-70"
                      >
                        {isSubmitting ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : isLogin ? (
                          "Zaloguj się"
                        ) : (
                          "Zarejestruj się"
                        )}
                      </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-400">
                      {isLogin ? "Nie masz konta? " : "Masz już konto? "}
                      <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                      >
                        {isLogin ? "Zarejestruj się" : "Zaloguj się"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      }
    </AnimatePresence>
  );
}
