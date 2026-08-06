"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import { useAuthStore } from "@/store/authStore"
import { isAdminEmail } from "@/lib/admin"
import {
  getSteaks,
  addProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/services/productService"
import {
  getAllTransactions,
  updateTransactionStatus,
  Transaction,
  TransactionStatus,
  transactionStatusLabels,
  transactionStatusColors,
} from "@/lib/services/transactionService"
import type { Steak, ProductInput } from "@/types/typeProduct"
import { Button } from "@/components/ui/button"
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  ShieldCheck,
  Lock,
  Package,
  Receipt,
  Search,
  RefreshCw,
  Clock,
  PackageCheck,
  CreditCard,
  Store,
  DollarSign,
  User,
  Calendar,
  ChevronDown,
  Truck,
} from "lucide-react"

const emptyForm = {
  name: "",
  image: "",
  description: "",
  price: "",
  weight: "",
  tag: "",
  grade: "",
  detail_images: "",
  movie: "",
  lineage: "",
  marbling: "",
}

export default function AdminPage() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState<"products" | "transactions">("transactions")
  const [products, setProducts] = useState<Steak[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true)
  const [updatingTxId, setUpdatingTxId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const isAdmin = isAdminEmail(user?.email)

  const fetchProducts = useCallback(() => {
    return getSteaks()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setIsLoadingProducts(false))
  }, [])

  const fetchTransactions = useCallback(() => {
    return getAllTransactions()
      .then(setTransactions)
      .catch((err) => {
        console.error(err)
        setTransactions([])
        const code = err?.code as string | undefined
        if (code === "permission-denied") {
          setError(
            "Brak uprawnie\u0144 w Firestore do odczytu kolekcji zam\u00f3wie\u0144 (permission-denied). Sprawd\u017a czy jeste\u015b zalogowany na w\u0142a\u015bciwy adres e-mail administratora.",
          )
        } else {
          setError("B\u0142\u0105d podczas pobierania transakcji z Firestore.")
        }
      })
      .finally(() => setIsLoadingTransactions(false))
  }, [])

  const loadProducts = () => {
    setIsLoadingProducts(true)
    void fetchProducts()
  }

  const loadTransactions = () => {
    setIsLoadingTransactions(true)
    void fetchTransactions()
  }

  useEffect(() => {
    if (!isAdmin) return
    void fetchProducts()
    void fetchTransactions()
  }, [fetchProducts, fetchTransactions, isAdmin])

  if (!user) {
    return (
      <main className='min-h-screen bg-foreground flex items-center justify-center px-4'>
        <div className='max-w-md w-full text-center bg-slate-950/80 border border-white/10 rounded-2xl p-10 space-y-4'>
          <Lock className='w-12 h-12 text-amber-400 mx-auto' />
          <h1 className='text-2xl font-bold uppercase tracking-wider text-white'>
            Panel Admina
          </h1>
          <p className='text-slate-400 text-sm'>
            Musisz być zalogowany, aby uzyskać dostęp do panelu.
          </p>
          <Button onClick={() => (window.location.href = "/")} className='mt-2'>
            Wróć do sklepu
          </Button>
        </div>
      </main>
    )
  }

  if (!isAdmin) {
    return (
      <main className='min-h-screen bg-foreground flex items-center justify-center px-4'>
        <div className='max-w-md w-full text-center bg-slate-950/80 border border-white/10 rounded-2xl p-10 space-y-4'>
          <ShieldCheck className='w-12 h-12 text-red-400 mx-auto' />
          <h1 className='text-2xl font-bold uppercase tracking-wider text-white'>
            Brak uprawnień
          </h1>
          <p className='text-slate-400 text-sm'>
            Twoje konto nie ma praw administratora. Ta sekcja jest dostępna
            tylko dla wybranych użytkowników.
          </p>
          <Link
            href='/'
            className='inline-flex items-center gap-2 text-amber-400 text-sm hover:underline'
          >
            <ArrowLeft className='w-4 h-4' /> Wróć na stronę główną
          </Link>
        </div>
      </main>
    )
  }

  const handleEdit = (p: Steak) => {
    setEditingId(p.id!)
    setForm({
      name: p.title,
      image: p.img,
      description: p.desc,
      price: p.price,
      weight: p.weight,
      tag: p.tag ?? "",
      grade: p.grade ?? "",
      detail_images: (p.detail_images ?? []).join(", "),
      movie: p.movie ?? "",
      lineage: p.lineage ?? "",
      marbling: p.marbling ?? "",
    })
    setError("")
    setSuccess("")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const resetForm = () => {
    setEditingId(null)
    setForm(emptyForm)
    setError("")
    setSuccess("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")

    const price = parseFloat(form.price)
    if (!form.name.trim() || isNaN(price) || price <= 0) {
      setError("Podaj nazwę i prawidłową cenę produktu.")
      setSaving(false)
      return
    }

    const data: ProductInput = {
      name: form.name.trim(),
      image: form.image.trim(),
      description: form.description.trim(),
      price,
      weight: form.weight.trim(),
    }
    if (form.tag.trim()) data.tag = form.tag.trim()
    if (form.grade.trim()) data.grade = form.grade.trim()
    if (form.detail_images.trim())
      data.detail_images = form.detail_images
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    if (form.movie.trim()) data.movie = form.movie.trim()
    if (form.lineage.trim()) data.lineage = form.lineage.trim()
    if (form.marbling.trim()) data.marbling = form.marbling.trim()

    try {
      if (editingId) {
        await updateProduct(editingId, data)
        setSuccess("Produkt został zaktualizowany.")
      } else {
        await addProduct(data)
        setSuccess("Produkt został dodany.")
      }
      resetForm()
      loadProducts()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Błąd zapisu do Firestore."
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Na pewno usunąć ten produkt?")) return
    try {
      await deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
      setSuccess("Produkt został usunięty.")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Błąd usuwania produktu."
      setError(message)
    }
  }

  const handleStatusChange = async (txId: string, newStatus: TransactionStatus) => {
    setUpdatingTxId(txId)
    setError("")
    setSuccess("")
    try {
      await updateTransactionStatus(txId, newStatus)
      setTransactions((prev) =>
        prev.map((t) => (t.id === txId ? { ...t, status: newStatus } : t))
      )
      setSuccess(`Zmieniono status zamówienia na: "${transactionStatusLabels[newStatus]}"`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Błąd zmiany statusu transakcji."
      setError(message)
    } finally {
      setUpdatingTxId(null)
    }
  }
  const filteredTransactions = transactions.filter((tx) => {
    const matchesStatus = statusFilter === "all" || tx.status === statusFilter
    const q = searchQuery.toLowerCase().trim()
    const matchesQuery =
      !q ||
      (tx.id && tx.id.toLowerCase().includes(q)) ||
      (tx.userEmail && tx.userEmail.toLowerCase().includes(q))
    return matchesStatus && matchesQuery
  })
  const totalRevenue = transactions
    .filter((t) => t.status !== "cancelled")
    .reduce((acc, t) => acc + (t.totalAmount || 0), 0)
  const pendingCount = transactions.filter((t) => t.status === "pending").length
  const deliveredCount = transactions.filter((t) => t.status === "delivered").length

  return (
    <main className='min-h-screen bg-foreground pt-24 pb-20 px-4 text-background'>
      <div className='max-w-5xl mx-auto space-y-6'>
        <div className='flex items-center justify-between gap-4 flex-wrap'>
          <div>
            <div className='flex items-center gap-2'>
              <h1 className='text-3xl font-extrabold uppercase tracking-tight text-white'>
                Panel Admina
              </h1>
              <span className='px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-400 uppercase tracking-wider'>
                Manager
              </span>
            </div>
            <p className='text-slate-400 text-sm mt-1'>
              Zarządzaj ofertą steków oraz zamówieniami klientów w czasie rzeczywistym.
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <Link
              href='/'
              className='inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors bg-slate-900/80 px-3.5 py-2 rounded-xl border border-white/10'
            >
              <ArrowLeft className='w-4 h-4' /> Wróć do sklepu
            </Link>
          </div>
        </div>
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className='bg-red-500/15 border border-red-500/40 text-red-300 p-4 rounded-xl text-sm flex items-center justify-between'
            >
              <span>{error}</span>
              <button onClick={() => setError("")} className='text-xs opacity-70 hover:opacity-100 cursor-pointer'>✕</button>
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className='bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 p-4 rounded-xl text-sm flex items-center justify-between'
            >
              <span>{success}</span>
              <button onClick={() => setSuccess("")} className='text-xs opacity-70 hover:opacity-100 cursor-pointer'>✕</button>
            </motion.div>
          )}
        </AnimatePresence>
        <div className='flex items-center gap-2 p-1.5 bg-slate-950/80 border border-white/10 rounded-2xl'>
          <button
            onClick={() => setActiveTab("transactions")}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "transactions"
                ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Receipt className='w-4 h-4' />
            Zamówienia & Transakcje
            {transactions.length > 0 && (
              <span
                className={`ml-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
                  activeTab === "transactions"
                    ? "bg-slate-950/30 text-slate-950"
                    : "bg-amber-400/10 border border-amber-400/30 text-amber-400"
                }`}
              >
                {transactions.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "products"
                ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Package className='w-4 h-4' />
            Produkty
            <span
              className={`ml-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
                activeTab === "products"
                  ? "bg-slate-950/30 text-slate-950"
                  : "bg-white/10 text-slate-300"
              }`}
            >
              {products.length}
            </span>
          </button>
        </div>
        {activeTab === "transactions" && (
          <div className='space-y-6'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
              <div className='bg-slate-950/80 border border-white/10 rounded-2xl p-4 flex items-center gap-4'>
                <div className='w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0'>
                  <DollarSign className='w-6 h-6' />
                </div>
                <div>
                  <p className='text-xs font-semibold text-slate-400 uppercase tracking-wider'>Suma przychodów</p>
                  <p className='text-xl font-extrabold text-amber-400 mt-0.5'>
                    {totalRevenue.toFixed(2)} <span className='text-xs font-semibold'>PLN</span>
                  </p>
                </div>
              </div>

              <div className='bg-slate-950/80 border border-white/10 rounded-2xl p-4 flex items-center gap-4'>
                <div className='w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0'>
                  <Receipt className='w-6 h-6' />
                </div>
                <div>
                  <p className='text-xs font-semibold text-slate-400 uppercase tracking-wider'>Wszystkie zamówienia</p>
                  <p className='text-xl font-extrabold text-white mt-0.5'>{transactions.length}</p>
                </div>
              </div>

              <div className='bg-slate-950/80 border border-white/10 rounded-2xl p-4 flex items-center gap-4'>
                <div className='w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 animate-pulse'>
                  <Clock className='w-6 h-6' />
                </div>
                <div>
                  <p className='text-xs font-semibold text-slate-400 uppercase tracking-wider'>Oczekujące</p>
                  <p className='text-xl font-extrabold text-amber-400 mt-0.5'>{pendingCount}</p>
                </div>
              </div>

              <div className='bg-slate-950/80 border border-white/10 rounded-2xl p-4 flex items-center gap-4'>
                <div className='w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0'>
                  <PackageCheck className='w-6 h-6' />
                </div>
                <div>
                  <p className='text-xs font-semibold text-slate-400 uppercase tracking-wider'>Dostarczone</p>
                  <p className='text-xl font-extrabold text-emerald-400 mt-0.5'>{deliveredCount}</p>
                </div>
              </div>
            </div>
            <div className='bg-slate-950/80 border border-white/10 rounded-2xl p-4 space-y-4'>
              <div className='flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4'>
                <div className='relative flex-1'>
                  <Search className='w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400' />
                  <input
                    type='text'
                    placeholder='Szukaj po emailu klienta lub ID zamówienia...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400'
                  />
                </div>
                <button
                  onClick={loadTransactions}
                  disabled={isLoadingTransactions}
                  className='inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 text-sm font-medium transition-colors cursor-pointer disabled:opacity-50'
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingTransactions ? "animate-spin text-amber-400" : ""}`} />
                  Odśwież
                </button>
              </div>
              <div className='flex items-center gap-2 flex-wrap pt-2 border-t border-white/5 text-xs'>
                <span className='text-slate-400 font-semibold mr-1 uppercase tracking-wider'>Status:</span>
                {[
                  { id: "all", label: "Wszystkie" },
                  { id: "pending", label: "Oczekujące" },
                  { id: "confirmed", label: "Potwierdzone" },
                  { id: "shipped", label: "W dostawie" },
                  { id: "delivered", label: "Dostarczone" },
                  { id: "cancelled", label: "Anulowane" },
                ].map((pill) => (
                  <button
                    key={pill.id}
                    onClick={() => setStatusFilter(pill.id as TransactionStatus | "all")}
                    className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer font-medium ${
                      statusFilter === pill.id
                        ? "bg-amber-500 text-slate-950 border-amber-500 font-bold"
                        : "bg-slate-900 border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>
            {isLoadingTransactions ? (
              <div className='bg-slate-950/80 border border-white/10 rounded-2xl p-12 text-center space-y-3'>
                <Loader2 className='w-8 h-8 animate-spin text-amber-400 mx-auto' />
                <p className='text-slate-400 text-sm'>Ładowanie zamówień z Firestore...</p>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className='bg-slate-950/80 border border-white/10 rounded-2xl p-12 text-center space-y-3'>
                <Receipt className='w-12 h-12 text-slate-600 mx-auto' />
                <h3 className='text-lg font-bold text-white uppercase tracking-wider'>Brak transakcji</h3>
                <p className='text-slate-400 text-sm max-w-md mx-auto'>
                  {searchQuery || statusFilter !== "all"
                    ? "Nie znaleziono zamówień spełniających wybrane kryteria wyszukiwania."
                    : "W bazie Firestore nie zarejestrowano jeszcze żadnych zamówień."}
                </p>
              </div>
            ) : (
              <div className='space-y-4'>
                {filteredTransactions.map((tx) => {
                  const createdDate = tx.createdAt?.toDate
                    ? tx.createdAt.toDate().toLocaleString("pl-PL", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Brak daty"

                  const isUpdating = updatingTxId === tx.id

                  return (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className='bg-slate-950/80 border border-white/10 rounded-2xl p-5 space-y-4 hover:border-white/20 transition-all'
                    >
                      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10'>
                        <div className='space-y-1'>
                          <div className='flex items-center gap-2 flex-wrap'>
                            <span className='font-mono text-xs font-bold text-slate-400 bg-slate-900 border border-white/10 px-2.5 py-1 rounded-md'>
                              ID: {tx.id}
                            </span>
                            <span className='inline-flex items-center gap-1 text-xs text-slate-400'>
                              <Calendar className='w-3.5 h-3.5 text-amber-400' />
                              {createdDate}
                            </span>
                          </div>

                          <div className='flex items-center gap-1.5 text-sm text-slate-300 font-medium pt-1'>
                            <User className='w-4 h-4 text-amber-400 shrink-0' />
                            <span>{tx.userEmail}</span>
                          </div>
                        </div>
                        <div className='flex items-center gap-3 self-start md:self-auto'>
                          <div className='text-right'>
                            <span className='text-xs font-semibold text-slate-400 block uppercase tracking-wider mb-1'>
                              Zmień status:
                            </span>
                            <div className='relative inline-block'>
                              <select
                                value={tx.status}
                                disabled={isUpdating}
                                onChange={(e) =>
                                  tx.id && handleStatusChange(tx.id, e.target.value as TransactionStatus)
                                }
                                className={`appearance-none cursor-pointer pl-3 pr-8 py-2 rounded-xl text-xs font-bold border transition-all focus:outline-none ${
                                  transactionStatusColors[tx.status] || "bg-slate-900 text-white border-white/20"
                                } disabled:opacity-60`}
                              >
                                {Object.entries(transactionStatusLabels).map(([key, label]) => (
                                  <option key={key} value={key} className='bg-slate-900 text-white'>
                                    {label}
                                  </option>
                                ))}
                              </select>
                              {isUpdating ? (
                                <Loader2 className='w-3.5 h-3.5 animate-spin absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-white' />
                              ) : (
                                <ChevronDown className='w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-70' />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='space-y-2'>
                        <p className='text-xs font-bold uppercase tracking-wider text-slate-400'>
                          Zamówione produkty ({tx.items?.length || 0}):
                        </p>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-2.5'>
                          {tx.items?.map((item, idx) => (
                            <div
                              key={idx}
                              className='flex items-center gap-3 bg-slate-900/60 border border-white/5 rounded-xl p-2.5'
                            >
                              <div className='relative w-12 h-12 overflow-hidden rounded-lg border border-white/10 shrink-0 bg-slate-950'>
                                {item.image ? (
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className='object-cover'
                                    sizes='48px'
                                  />
                                ) : (
                                  <Package className='w-6 h-6 text-slate-600 m-auto mt-3' />
                                )}
                              </div>
                              <div className='flex-1 min-w-0'>
                                <p className='font-semibold text-white text-xs truncate'>{item.name}</p>
                                <p className='text-xs text-slate-400 mt-0.5'>
                                  {item.quantity} szt. × {item.price.toFixed(2)} PLN
                                </p>
                              </div>
                              <div className='text-right font-bold text-amber-400 text-xs shrink-0'>
                                {(item.price * item.quantity).toFixed(2)} PLN
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className='pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs'>
                        <div className='flex items-center gap-3 flex-wrap'>
                          <span className='inline-flex items-center gap-1.5 bg-slate-900 border border-white/10 px-2.5 py-1 rounded-lg text-slate-300'>
                            {tx.deliveryMethod === "courier" ? (
                              <>
                                <Truck className='w-3.5 h-3.5 text-amber-400' /> Dostawa Kurierem
                              </>
                            ) : (
                              <>
                                <Store className='w-3.5 h-3.5 text-amber-400' /> Odbiór Osobisty
                              </>
                            )}
                          </span>

                          <span className='inline-flex items-center gap-1.5 bg-slate-900 border border-white/10 px-2.5 py-1 rounded-lg text-slate-300'>
                            <CreditCard className='w-3.5 h-3.5 text-amber-400' />
                            Płatność:{" "}
                            {tx.paymentMethod === "card"
                              ? "Karta online"
                              : tx.paymentMethod === "transfer"
                              ? "Przelew bankowy"
                              : "Przy odbiorze (COD)"}
                          </span>
                        </div>

                        <div className='flex items-center gap-2'>
                          <span className='text-slate-400 uppercase tracking-wider font-semibold'>Wartość zamówienia:</span>
                          <span className='text-lg font-extrabold text-amber-400'>
                            {tx.totalAmount.toFixed(2)} PLN
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        )}
        {activeTab === "products" && (
          <div className='space-y-6'>
            <form
              onSubmit={handleSubmit}
              className='bg-slate-950/80 border border-white/10 rounded-2xl p-6 space-y-4'
            >
              <h2 className='font-bold text-lg uppercase tracking-wide flex items-center gap-2 text-white'>
                {editingId ? (
                  <>
                    <Pencil className='w-5 h-5 text-amber-400' /> Edytuj produkt
                  </>
                ) : (
                  <>
                    <Plus className='w-5 h-5 text-amber-400' /> Dodaj nowy produkt
                  </>
                )}
                {editingId && (
                  <button
                    type='button'
                    onClick={resetForm}
                    className='text-xs font-normal text-slate-400 ml-auto hover:text-white cursor-pointer'
                  >
                    Anuluj edycję
                  </button>
                )}
              </h2>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <label className='block space-y-1'>
                  <span className='text-xs font-semibold text-slate-400'>Nazwa</span>
                  <input
                    type='text'
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className='w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-amber-400'
                  />
                </label>
                <label className='block space-y-1'>
                  <span className='text-xs font-semibold text-slate-400'>Cena (PLN)</span>
                  <input
                    type='number'
                    step='0.01'
                    min='0'
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className='w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-amber-400'
                  />
                </label>

                <label className='block space-y-1'>
                  <span className='text-xs font-semibold text-slate-400'>Waga</span>
                  <input
                    type='text'
                    value={form.weight}
                    onChange={(e) => setForm({ ...form, weight: e.target.value })}
                    placeholder='np. 400g'
                    className='w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-amber-400'
                  />
                </label>
                <label className='block space-y-1 md:col-span-2'>
                  <span className='text-xs font-semibold text-slate-400'>Obraz (URL)</span>
                  <input
                    type='text'
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder='/data/img/ribeye.jpg'
                    className='w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-amber-400'
                  />
                </label>
                <label className='block space-y-1 md:col-span-2'>
                  <span className='text-xs font-semibold text-slate-400'>Opis</span>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    rows={3}
                    className='w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-amber-400 resize-none'
                  />
                </label>
                <label className='block space-y-1'>
                  <span className='text-xs font-semibold text-slate-400'>Tag (opcjonalny)</span>
                  <input
                    type='text'
                    value={form.tag}
                    onChange={(e) => setForm({ ...form, tag: e.target.value })}
                    placeholder='np. BESTSELLER'
                    className='w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-amber-400'
                  />
                </label>
                <label className='block space-y-1'>
                  <span className='text-xs font-semibold text-slate-400'>Klasa / Grade (opcjonalny)</span>
                  <input
                    type='text'
                    value={form.grade}
                    onChange={(e) => setForm({ ...form, grade: e.target.value })}
                    placeholder='np. A5, Prime'
                    className='w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-amber-400'
                  />
                </label>
                <label className='block space-y-1'>
                  <span className='text-xs font-semibold text-slate-400'>Pochodzenie / Lineage (opcjonalny)</span>
                  <input
                    type='text'
                    value={form.lineage}
                    onChange={(e) => setForm({ ...form, lineage: e.target.value })}
                    placeholder='np. Japonii, USA'
                    className='w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-amber-400'
                  />
                </label>
                <label className='block space-y-1'>
                  <span className='text-xs font-semibold text-slate-400'>Marmurkowatość / Marbling (opcjonalny)</span>
                  <input
                    type='text'
                    value={form.marbling}
                    onChange={(e) => setForm({ ...form, marbling: e.target.value })}
                    placeholder='np. BMS 10'
                    className='w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-amber-400'
                  />
                </label>
                <label className='block space-y-1 md:col-span-2'>
                  <span className='text-xs font-semibold text-slate-400'>Film (URL, opcjonalny)</span>
                  <input
                    type='text'
                    value={form.movie}
                    onChange={(e) => setForm({ ...form, movie: e.target.value })}
                    placeholder='np. /data/videos/ribeye.mp4'
                    className='w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-amber-400'
                  />
                </label>
                <label className='block space-y-1 md:col-span-2'>
                  <span className='text-xs font-semibold text-slate-400'>
                    Zdjęcia szczegółowe (URL-e oddzielone przecinkiem, opcjonalne)
                  </span>
                  <input
                    type='text'
                    value={form.detail_images}
                    onChange={(e) =>
                      setForm({ ...form, detail_images: e.target.value })
                    }
                    placeholder='/img/a.jpg, /img/b.jpg'
                    className='w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-amber-400'
                  />
                </label>
              </div>

              <Button
                type='submit'
                disabled={saving}
                className='w-full md:w-auto py-3 px-6 rounded-xl bg-linear-to-r from-red-600 to-amber-600 text-white font-bold uppercase tracking-wider hover:brightness-110 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer'
              >
                {saving ? (
                  <Loader2 className='w-5 h-5 animate-spin' />
                ) : editingId ? (
                  <Pencil className='w-5 h-5' />
                ) : (
                  <Plus className='w-5 h-5' />
                )}
                {saving
                  ? "Zapisywanie..."
                  : editingId
                  ? "Zapisz zmiany"
                  : "Dodaj produkt"}
              </Button>
            </form>
            <div className='space-y-3'>
              <h2 className='font-bold uppercase tracking-wide text-slate-300'>
                Produkty w sklepie ({products.length})
              </h2>
              {isLoadingProducts ? (
                <div className='flex items-center gap-2 text-slate-400 text-sm py-8'>
                  <Loader2 className='w-4 h-4 animate-spin' /> Ładowanie...
                </div>
              ) : (
                products.map((p) => (
                  <div
                    key={p.id}
                    className='flex items-center gap-4 bg-slate-950/80 border border-white/10 rounded-xl p-3'
                  >
                    <div className='relative w-16 h-16 overflow-hidden rounded-lg border border-white/10 shrink-0 bg-slate-900'>
                      <Image
                        src={p.img}
                        alt={p.title}
                        fill
                        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                        className='object-cover'
                      />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='font-bold text-white truncate'>{p.title}</p>
                      <p className='text-xs text-slate-400'>
                        {p.tag ?? "—"} • {p.weight}
                      </p>
                      <p className='text-sm font-semibold text-amber-400'>
                        {parseFloat(p.price).toFixed(2)} PLN
                      </p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() => handleEdit(p)}
                        className='p-2 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-400 hover:bg-amber-500/25 transition-colors cursor-pointer'
                        aria-label='Edytuj'
                      >
                        <Pencil className='w-4 h-4' />
                      </button>
                      <button
                        onClick={() => p.id && handleDelete(p.id)}
                        className='p-2 rounded-lg bg-red-500/15 border border-red-500/40 text-red-400 hover:bg-red-500/25 transition-colors cursor-pointer'
                        aria-label='Usuń'
                      >
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
