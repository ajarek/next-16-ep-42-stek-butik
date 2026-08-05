"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useHasMounted } from "@/hooks/useHasMounted"
import {
  Trash2,
  Plus,
  Minus,
  Snowflake,
  Store,
  CreditCard,
  Landmark,
  Banknote,
  ShieldCheck,
  Lock,
  Headphones,
  ShoppingBag,
  ArrowRight,
  Info,
  CheckCircle2,
  LogIn,
} from "lucide-react"
import { useCartStore } from "@/store/cartStore"
import { useAuthStore } from "@/store/authStore"
import { Button } from "@/components/ui/button"
import { createTransaction } from "@/lib/services/transactionService"
import AuthModal from "@/components/AuthModal"

export default function CartPage() {
  const mounted = useHasMounted()
  const [deliveryMethod, setDeliveryMethod] = useState<"courier" | "pickup">(
    "courier"
  )
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "transfer" | "cod"
  >("card")
  const [isOrdering, setIsOrdering] = useState(false)
  const [orderCompleted, setOrderCompleted] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  const { items, increment, decrement, removeItemFromCart, removeAllFromCart } =
    useCartStore()
  const { user } = useAuthStore()

  if (!mounted) {
    return (
      <div className='min-h-screen bg-foreground pt-28 pb-20 px-4 md:px-8 flex justify-center items-center'>
        <div className='animate-pulse text-chart-1 text-lg uppercase tracking-widest'>
          Ładowanie koszyka...
        </div>
      </div>
    )
  }

  const itemsTotal = items.reduce(
    (acc, item) => acc + item.price * (item.quantity ?? 1),
    0
  )

  const deliveryCost = itemsTotal === 0 ? 0 : deliveryMethod === "courier" ? 35.0 : 0
  const discount = itemsTotal > 0 ? 20.0 : 0
  const grandTotal = Math.max(0, itemsTotal + deliveryCost - discount)

  const handleOrder = async () => {
    if (items.length === 0) return
    if (!user) {
      setIsAuthModalOpen(true)
      return
    }
    setIsOrdering(true)
    try {
      const id = await createTransaction(
        user.uid,
        user.email ?? "",
        items,
        deliveryMethod,
        paymentMethod,
        grandTotal
      )
      setOrderId(id)
      removeAllFromCart()
      setOrderCompleted(true)
    } catch (err) {
      console.error("Order error:", err)
    } finally {
      setIsOrdering(false)
    }
  }

  if (orderCompleted) {
    return (
      <main className='min-h-screen bg-foreground pt-32 pb-20 px-4 md:px-8 flex flex-col justify-center items-center text-center'>
        <div className='max-w-md w-full bg-slate-950/80 border border-white/10 p-8 space-y-6'>
          <div className='w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30'>
            <CheckCircle2 className='w-10 h-10' />
          </div>
          <h1 className='text-3xl font-bold text-background uppercase tracking-wider'>
            Dziękujemy za zamówienie!
          </h1>
          <p className='text-chart-1 text-sm leading-relaxed'>
            Twoje wykwintne cięcia wołowe zostały przekazane do przygotowania.
            Wkrótce otrzymasz potwierdzenie zamówienia oraz informacje o dostawie chłodniczej.
          </p>
          {orderId && (
            <p className='text-xs text-slate-500 font-mono'>ID zamówienia: {orderId}</p>
          )}
          <div className='pt-4 flex flex-col gap-3'>
            <Link href='/profile'>
              <Button className='w-full h-12 bg-emerald-700 hover:bg-emerald-600 text-white font-bold uppercase tracking-widest rounded-none cursor-pointer'>
                Moje Zamówienia
              </Button>
            </Link>
            <Link href='/products'>
              <Button className='w-full h-12 bg-primary text-background font-bold uppercase tracking-widest rounded-none hover:brightness-110 cursor-pointer'>
                Wróć do sklepu
              </Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (items.length === 0) {
    return (
      <main className='min-h-screen bg-foreground pt-32 pb-20 px-4 md:px-8 flex flex-col justify-center items-center text-center'>
        <div className='max-w-md w-full bg-slate-950/80 border border-white/10 p-10 space-y-6'>
          <div className='w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto border border-primary/20'>
            <ShoppingBag className='w-10 h-10 text-chart-1' />
          </div>
          <h1 className='text-3xl font-bold text-background uppercase tracking-wider'>
            Twój Koszyk jest pusty
          </h1>
          <p className='text-chart-1 text-sm leading-relaxed'>
            Przejrzyj naszą ofertę wyselekcjonowanej polskiej wołowiny premium i dodaj pierwsze cięcie do swojego koszyka.
          </p>
          <div className='pt-2'>
            <Link href='/products'>
              <Button className='w-full h-12 bg-primary text-background font-bold uppercase tracking-widest rounded-none hover:brightness-110 cursor-pointer flex items-center justify-center gap-2'>
                <span>Przeglądaj steki</span>
                <ArrowRight className='w-4 h-4' />
              </Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className='min-h-screen bg-foreground text-background pt-28 pb-20 px-4 md:px-8 lg:px-16'>
      <div className='max-w-7xl mx-auto space-y-8'>
        {/* Header */}
        <div className='space-y-2 border-b border-white/10 pb-6'>
          <h1 className='text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-background'>
            Twój Koszyk
          </h1>
          <p className='text-chart-1 text-base md:text-lg font-light'>
            Przejrzyj wybrane cięcia przed finalizacją zamówienia.
          </p>
        </div>

        {/* Content Layout */}
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'>
          {/* Left Column - Cart Items & Options */}
          <div className='lg:col-span-7 space-y-10'>
            {/* Cart Items List */}
            <div className='space-y-4'>
              {items.map((item) => {
                const quantity = item.quantity ?? 1
                return (
                  <div
                    key={item.id}
                    className='bg-slate-950/80 border border-white/10 p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors hover:border-white/20'
                  >
                    <div className='flex items-center gap-4 w-full sm:w-auto'>
                      {/* Product Thumbnail */}
                      <div className='relative w-20 h-20 md:w-24 md:h-24 shrink-0 overflow-hidden border border-white/20 bg-neutral-900'>
                        <Image
                          src={item.image || "/data/placeholder.jpg"}
                          alt={item.name}
                          fill
                          sizes='(max-width: 768px) 80px, 96px'
                          className='object-cover'
                        />
                      </div>

                      {/* Info */}
                      <div className='space-y-1 flex-1'>
                        <span className='text-[10px] md:text-xs font-semibold uppercase tracking-widest text-chart-1 block'>
                          {item.category || "PREMIUM CUT"}
                        </span>
                        <h3 className='text-lg font-bold text-background leading-snug'>
                          {item.name}
                        </h3>
                        <p className='text-xs text-slate-400 font-light'>
                          Waga: ~{item.weight || "300g"} | Pochodzenie: Podlasie
                        </p>

                        {/* Quantity Counter Mobile/Desktop */}
                        <div className='flex items-center gap-2 pt-2'>
                          <div className='flex items-center border border-white/20 bg-slate-900'>
                            <button
                              onClick={() => decrement(item.id)}
                              className='p-1.5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer'
                              aria-label='Zmniejsz ilość'
                            >
                              <Minus className='w-3.5 h-3.5' />
                            </button>
                            <span className='px-3 text-xs font-bold text-background min-w-8 text-center'>
                              {quantity}
                            </span>
                            <button
                              onClick={() => increment(item.id)}
                              className='p-1.5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer'
                              aria-label='Zwiększ ilość'
                            >
                              <Plus className='w-3.5 h-3.5' />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Price & Remove Button */}
                    <div className='flex sm:flex-col justify-between items-end w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10'>
                      <div className='text-right'>
                        <span className='text-xl font-bold text-chart-1 tracking-tight block'>
                          {(item.price * quantity).toFixed(2)} PLN
                        </span>
                      </div>
                      <button
                        onClick={() => removeItemFromCart(item.id)}
                        className='text-[11px] font-semibold uppercase tracking-wider text-red-400/80 hover:text-red-400 flex items-center gap-1 cursor-pointer transition-colors pt-2'
                      >
                        <Trash2 className='w-3.5 h-3.5' />
                        <span>USUŃ</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Metoda Dostawy Section */}
            <div className='space-y-4 pt-2'>
              <h2 className='text-2xl font-bold uppercase tracking-wide text-background'>
                Metoda Dostawy
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Courier Option */}
                <div
                  onClick={() => setDeliveryMethod("courier")}
                  className={`p-4 border cursor-pointer transition-all flex items-center justify-between ${
                    deliveryMethod === "courier"
                      ? "bg-slate-900 border-primary text-background shadow-md shadow-red-950/20"
                      : "bg-slate-950/60 border-white/10 text-slate-400 hover:border-white/20"
                  }`}
                >
                  <div className='flex items-center gap-3'>
                    <div
                      className={`p-2.5 rounded-none border ${
                        deliveryMethod === "courier"
                          ? "bg-primary/20 border-primary text-chart-1"
                          : "bg-slate-900 border-white/10 text-slate-400"
                      }`}
                    >
                      <Snowflake className='w-5 h-5' />
                    </div>
                    <div>
                      <div className='text-sm font-bold uppercase text-background'>
                        Kurier Chłodniczy
                      </div>
                      <div className='text-xs text-slate-400 font-light'>
                        Gwarancja świeżości (24-48h)
                      </div>
                    </div>
                  </div>
                  <div className='text-sm font-bold text-chart-1'>
                    35.00 PLN
                  </div>
                </div>

                {/* Pickup Option */}
                <div
                  onClick={() => setDeliveryMethod("pickup")}
                  className={`p-4 border cursor-pointer transition-all flex items-center justify-between ${
                    deliveryMethod === "pickup"
                      ? "bg-slate-900 border-primary text-background shadow-md shadow-red-950/20"
                      : "bg-slate-950/60 border-white/10 text-slate-400 hover:border-white/20"
                  }`}
                >
                  <div className='flex items-center gap-3'>
                    <div
                      className={`p-2.5 rounded-none border ${
                        deliveryMethod === "pickup"
                          ? "bg-primary/20 border-primary text-chart-1"
                          : "bg-slate-900 border-white/10 text-slate-400"
                      }`}
                    >
                      <Store className='w-5 h-5' />
                    </div>
                    <div>
                      <div className='text-sm font-bold uppercase text-background'>
                        Odbiór Osobisty
                      </div>
                      <div className='text-xs text-slate-400 font-light'>
                        Butcher Shop, Warszawa
                      </div>
                    </div>
                  </div>
                  <div className='text-sm font-bold text-emerald-400'>
                    BEZPŁATNIE
                  </div>
                </div>
              </div>
            </div>

            {/* Metoda Płatności Section */}
            <div className='space-y-4 pt-2'>
              <h2 className='text-2xl font-bold uppercase tracking-wide text-background'>
                Metoda Płatności
              </h2>
              <div className='grid grid-cols-3 gap-3 md:gap-4'>
                <button
                  type='button'
                  onClick={() => setPaymentMethod("card")}
                  className={`p-4 border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                    paymentMethod === "card"
                      ? "bg-slate-900 border-primary text-background shadow-md shadow-red-950/20"
                      : "bg-slate-950/60 border-white/10 text-slate-400 hover:border-white/20"
                  }`}
                >
                  <CreditCard className='w-5 h-5 text-chart-1' />
                  <span className='text-xs font-bold uppercase tracking-wider text-center'>
                    KARTA / BLIK
                  </span>
                </button>

                <button
                  type='button'
                  onClick={() => setPaymentMethod("transfer")}
                  className={`p-4 border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                    paymentMethod === "transfer"
                      ? "bg-slate-900 border-primary text-background shadow-md shadow-red-950/20"
                      : "bg-slate-950/60 border-white/10 text-slate-400 hover:border-white/20"
                  }`}
                >
                  <Landmark className='w-5 h-5 text-chart-1' />
                  <span className='text-xs font-bold uppercase tracking-wider text-center'>
                    PRZELEW
                  </span>
                </button>

                <button
                  type='button'
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-4 border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "bg-slate-900 border-primary text-background shadow-md shadow-red-950/20"
                      : "bg-slate-950/60 border-white/10 text-slate-400 hover:border-white/20"
                  }`}
                >
                  <Banknote className='w-5 h-5 text-chart-1' />
                  <span className='text-xs font-bold uppercase tracking-wider text-center'>
                    POBRANIE
                  </span>
                </button>
              </div>

              <p className='text-xs text-slate-400 font-light italic pt-1'>
                Wszystkie transakcje są szyfrowane i bezpieczne. Wspieramy szybkie płatności rzemieślnicze.
              </p>
            </div>
          </div>

          {/* Right Column - Summary & Help */}
          <div className='lg:col-span-5 space-y-6 sticky top-24'>
            {/* Summary Box */}
            <div className='bg-slate-950/90 border border-white/10 p-6 md:p-8 space-y-6'>
              <div className='text-center space-y-2 relative pb-4 border-b border-white/10'>
                <h2 className='text-2xl font-bold uppercase tracking-wider text-background'>
                  Podsumowanie
                </h2>
                <div className='w-12 h-0.5 bg-primary mx-auto'></div>
              </div>

              {/* Price Breakdown */}
              <div className='space-y-4 text-sm font-light text-slate-300'>
                <div className='flex justify-between items-center'>
                  <span>Wartość produktów</span>
                  <span className='font-semibold text-background'>
                    {itemsTotal.toFixed(2)} PLN
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span>
                    Dostawa (
                    {deliveryMethod === "courier" ? "Chłodnia" : "Odbiór"})
                  </span>
                  <span className='font-semibold text-background'>
                    {deliveryCost === 0
                      ? "0.00 PLN"
                      : `${deliveryCost.toFixed(2)} PLN`}
                  </span>
                </div>
                <div className='flex justify-between items-center text-chart-1'>
                  <span className='flex items-center gap-1'>
                    Rabat Premium <Info className='w-3.5 h-3.5 opacity-80' />
                  </span>
                  <span className='font-semibold'>
                    - {discount.toFixed(2)} PLN
                  </span>
                </div>
              </div>

              <div className='border-t border-white/10 pt-4 flex items-baseline justify-between'>
                <span className='text-lg font-bold uppercase tracking-widest text-background'>
                  RAZEM
                </span>
                <span className='text-3xl md:text-4xl font-black text-chart-1 tracking-tight'>
                  {grandTotal.toFixed(2)} <span className='text-lg font-normal'>PLN</span>
                </span>
              </div>

              {/* Auth prompt */}
              {!user && (
                <div className='flex items-center gap-3 p-3 rounded-lg bg-amber-400/10 border border-amber-400/30'>
                  <LogIn className='w-5 h-5 text-amber-400 shrink-0' />
                  <p className='text-xs text-amber-300'>
                    <button onClick={() => setIsAuthModalOpen(true)} className='font-bold underline underline-offset-2'>Zaloguj się</button>, aby zapisać historię zamówień.
                  </p>
                </div>
              )}

              {/* Order CTA */}
              <Button
                onClick={handleOrder}
                disabled={isOrdering}
                className='w-full h-14 bg-red-700 hover:bg-red-600 active:scale-[0.98] text-white font-bold uppercase tracking-widest text-base rounded-none shadow-lg shadow-red-950/40 cursor-pointer transition-all disabled:opacity-50'
              >
                {isOrdering ? "PRZETWARZANIE..." : "ZAMAWIAM I PŁACĘ"}
              </Button>

              <p className='text-[10px] text-center text-slate-500 uppercase tracking-widest leading-relaxed'>
                POTWIERDZAJĄC ZAMÓWIENIE AKCEPTUJESZ REGULAMIN SKLEPU
              </p>

              {/* Trust Badges */}
              <div className='grid grid-cols-2 gap-3 pt-2 border-t border-white/10'>
                <div className='p-3 border border-white/10 bg-slate-900/50 flex flex-col items-center justify-center text-center gap-1.5'>
                  <ShieldCheck className='w-5 h-5 text-chart-1' />
                  <span className='text-[10px] font-bold uppercase tracking-wider text-slate-300 leading-snug'>
                    GWARANCJA POCHODZENIA
                  </span>
                </div>

                <div className='p-3 border border-white/10 bg-slate-900/50 flex flex-col items-center justify-center text-center gap-1.5'>
                  <Lock className='w-5 h-5 text-chart-1' />
                  <span className='text-[10px] font-bold uppercase tracking-wider text-slate-300 leading-snug'>
                    BEZPIECZNE PŁATNOŚCI
                  </span>
                </div>
              </div>
            </div>

            {/* Help Box */}
            <div className='p-5 bg-slate-950/90 border border-white/10 flex items-center gap-4'>
              <div className='p-3 bg-primary/20 border border-primary/30 text-chart-1 shrink-0'>
                <Headphones className='w-6 h-6' />
              </div>
              <div className='space-y-0.5'>
                <div className='text-sm font-bold text-background uppercase tracking-wide'>
                  Potrzebujesz pomocy?
                </div>
                <div className='text-xs text-slate-400 font-light leading-relaxed'>
                  Nasz sommelier mięsny jest do Twojej dyspozycji:{" "}
                  <a
                    href='tel:+48500600700'
                    className='text-chart-1 font-semibold hover:underline'
                  >
                    +48 500 600 700
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </main>
  )
}
