"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "./ui/button"
import {
  Menu,
  X,
  Search,
  ShoppingCart,
  Heart,
  User,
  Flame,
  ChevronRight,
  Phone,
  MapPin,
  Sparkles,
  Award,
  Utensils,
  Clock,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react"

import { useCartStore } from "@/store/cartStore"

const navLinks = [
  {
    name: "Strona Główna",
    href: "/",
    icon: Utensils,
  },
  {
    name: "Produkty",
    href: "/products",
    badge: "DRY AGED",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    icon: Flame,
  },
  {
    name: "Antrykot ",
    href: "/products/2",
    badge: "BESTSELLER",
    badgeColor: "bg-red-500/20 text-red-300 border-red-500/30",
    icon: Sparkles,
  },
  {
    name: "Porterhouse",
    href: "/products/1",
    badge: "PREMIUM",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    icon: Award,
  },
  {
    name: "Polędwica ",
    href: "/products/3",
    icon: ShieldCheck,
  },
  {
    name: "Rostbef ",
    href: "/products/4",
    icon: Utensils,
  },
]

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [mounted, setMounted] = useState(false)

  const items = useCartStore((state) => state.items)

  useEffect(() => {
    setMounted(true)
  }, [])

  const cartCount = mounted
    ? items.reduce((acc, item) => acc + (item.quantity ?? 1), 0)
    : 0

  // Lock body scroll when mobile menu is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <>
      <nav className='h-16 fixed top-0 left-0 w-full z-50 flex justify-between items-center bg-primary/95 backdrop-blur-md px-4 shadow-lg border-b border-white/10'>
        {/* Brand Logo */}
        <Link
          href='/'
          className='flex items-center gap-2 text-lg md:text-3xl font-bold text-primary-foreground uppercase tracking-tighter hover:opacity-90 transition-opacity'
          onClick={() => setIsOpen(false)}
        >
          <Flame className='w-6 h-6 text-amber-300 animate-pulse' />
          <span>POLSKA WOŁOWINA</span>
        </Link>

        {/* Desktop Links */}
        <div className='hidden md:flex items-center gap-8'>
          {navLinks.map((link, idx) => {
            return (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * idx }}
              >
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className='group flex items-center justify-between p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-200'
                >
                  <div className='flex items-center gap-3.5'>
                    <span className='text-sm font-medium text-slate-200 group-hover:text-white'>
                      {link.name}
                    </span>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Desktop & Mobile Actions */}
        <div className='flex items-center gap-4 md:gap-6'>
          {/* Desktop Search Icon */}
          <Button className='hidden md:block text-primary-foreground hover:scale-110 transition-transform'>
            <Search className='w-5 h-5' />
          </Button>

          {/* Desktop Favorites */}
          <Button className='hidden md:block text-primary-foreground hover:scale-110 transition-transform'>
            <Heart className='w-5 h-5' />
          </Button>

          {/* Shopping Cart Shortcut */}
          <Link
            href='/cart'
            className='relative hover:scale-105 transition-transform'
          >
            <ShoppingCart className='w-6 h-6 text-primary-foreground' />
            <span className='absolute -top-2 -right-2 bg-amber-400 text-slate-950 text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-md'>
              {cartCount}
            </span>
          </Link>

          {/* User Icon (Desktop) */}
          <Button className='hidden md:block text-primary-foreground hover:scale-110 transition-transform'>
            <User className='w-5 h-5' />
          </Button>

          {/* Mobile Hamburger Toggle Button */}
          <Button
            onClick={() => setIsOpen(!isOpen)}
            aria-label='Toggle Mobile Menu'
            className='md:hidden relative z-50 p-2 text-primary-foreground focus:outline-none rounded-full hover:bg-white/10 transition-colors'
          >
            <motion.div
              animate={isOpen ? "open" : "closed"}
              className='w-6 h-6 flex items-center justify-center'
            >
              {isOpen ? (
                <X className='w-6 h-6' />
              ) : (
                <Menu className='w-6 h-6' />
              )}
            </motion.div>
          </Button>
        </div>
      </nav>

      {/* App-Style Slide-Out Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Overlay with Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
              className='fixed inset-0 z-50 bg-black/70 backdrop-blur-sm md:hidden'
            />

            {/* Mobile Drawer Container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className='fixed right-0 top-0 bottom-0 z-50 w-[88vw] max-w-sm h-full bg-slate-950 text-slate-100 flex flex-col shadow-2xl border-l border-white/10 md:hidden overflow-hidden'
            >
              {/* Drawer App Top Header */}
              <div className='p-5 bg-linear-to-r from-neutral-900 to-slate-900 border-b border-white/10 flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary-foreground font-bold'>
                    <User className='w-5 h-5 text-amber-400' />
                  </div>
                  <div>
                    <div className='text-xs font-semibold uppercase tracking-wider text-amber-400/90'>
                      Stek Butik App
                    </div>
                    <div className='text-sm font-bold text-white'>
                      Witaj w Rzeźni Premium
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setIsOpen(false)}
                  className='p-2 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all'
                >
                  <X className='w-5 h-5' />
                </Button>
              </div>

              {/* Drawer Body - Scrollable */}
              <div className='flex-1 overflow-y-auto px-4 py-5 space-y-6 custom-scrollbar'>
                {/* Search Bar inside Drawer */}
                <div className='relative'>
                  <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                  <input
                    type='text'
                    placeholder='Szukaj steka, wycięcia, wagyu...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-all'
                  />
                </div>

                {/* Main Navigation Category List */}
                <div className='space-y-1'>
                  <div className='text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 mb-2'>
                    Kategorie Steków
                  </div>
                  {navLinks.map((link, idx) => {
                    const IconComponent = link.icon
                    return (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * idx }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className='group flex items-center justify-between p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-200'
                        >
                          <div className='flex items-center gap-3.5'>
                            <div className='p-2 rounded-lg bg-slate-900 border border-white/5 text-amber-400 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors'>
                              <IconComponent className='w-4 h-4' />
                            </div>
                            <span className='text-sm font-medium text-slate-200 group-hover:text-white'>
                              {link.name}
                            </span>
                          </div>

                          <div className='flex items-center gap-2'>
                            {link.badge && (
                              <span
                                className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${link.badgeColor}`}
                              >
                                {link.badge}
                              </span>
                            )}
                            <ChevronRight className='w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all' />
                          </div>
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>

                {/* App Quick Stats & Favorites Card */}
                <div className='p-4 rounded-2xl bg-linear-to-br from-red-950/40 to-amber-950/20 border border-red-500/20 space-y-3'>
                  <div className='flex items-center justify-between text-xs font-bold text-amber-300'>
                    <span className='flex items-center gap-1.5'>
                      <Flame className='w-4 h-4 text-red-500' />
                      Dostawa Chłodnicza 24h
                    </span>
                    <span className='text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full border border-red-500/30'>
                      FRESH
                    </span>
                  </div>
                  <p className='text-xs text-slate-300 leading-relaxed'>
                    Każdy stek zapakowany próżniowo w boxie z lądem
                    modyfikowanym.
                  </p>
                  <div className='pt-1 flex items-center justify-between text-xs text-slate-400 border-t border-white/10'>
                    <span className='flex items-center gap-1'>
                      <Clock className='w-3.5 h-3.5 text-amber-400' /> Dziś
                      otwarte do 20:00
                    </span>
                    <span className='flex items-center gap-1'>
                      <MapPin className='w-3.5 h-3.5 text-amber-400' /> Warszawa
                    </span>
                  </div>
                </div>

                {/* Direct Hotline Contact Banner */}
                <a
                  href='tel:+48123456789'
                  className='flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-white/10 hover:border-amber-400/50 transition-colors group'
                >
                  <div className='flex items-center gap-3'>
                    <div className='p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'>
                      <Phone className='w-4 h-4' />
                    </div>
                    <div>
                      <div className='text-xs font-bold text-white'>
                        Doradca Rzeźnika
                      </div>
                      <div className='text-[11px] text-slate-400'>
                        Pomoc w doborze steka
                      </div>
                    </div>
                  </div>
                  <ArrowRight className='w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all' />
                </a>
              </div>

              {/* Drawer Bottom Mobile Quick Actions */}
              <div className='p-4 bg-slate-900 border-t border-white/10 space-y-3'>
                <Link
                  href='/cart'
                  onClick={() => setIsOpen(false)}
                  className='w-full py-3 px-4 rounded-xl bg-linear-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-900/30 transition-all active:scale-[0.98]'
                >
                  <ShoppingBag className='w-4 h-4' />
                  <span>Przejdź do koszyka ({cartCount})</span>
                </Link>

                <div className='flex items-center justify-around text-slate-400 text-xs pt-1'>
                  <Button className='flex items-center gap-1 hover:text-white transition-colors'>
                    <Heart className='w-4 h-4 text-red-400' /> Ulubione
                  </Button>
                  <span className='text-slate-700'>•</span>
                  <Button className='flex items-center gap-1 hover:text-white transition-colors'>
                    <User className='w-4 h-4 text-amber-400' /> Moje Konto
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
