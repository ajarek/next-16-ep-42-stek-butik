"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useAuthStore } from "@/store/authStore"
import { isAdminEmail } from "@/lib/admin"
import {
  getSteaks,
  addProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/services/productService"
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
  const [products, setProducts] = useState<Steak[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const isAdmin = isAdminEmail(user?.email)

  const loadProducts = () => {
    setIsLoading(true)
    getSteaks()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    if (!isAdmin) return
    getSteaks()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setIsLoading(false))
  }, [isAdmin])

  if (!user) {
    return (
      <main className='min-h-screen bg-foreground flex items-center justify-center px-4'>
        <div className='max-w-md w-full text-center bg-slate-950/80 border border-white/10 rounded-2xl p-10 space-y-4'>
          <Lock className='w-12 h-12 text-amber-400 mx-auto' />
          <h1 className='text-2xl font-bold uppercase tracking-wider'>
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
          <h1 className='text-2xl font-bold uppercase tracking-wider'>
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

  return (
    <main className='min-h-screen bg-foreground pt-24 pb-20 px-4 text-background'>
      <div className='max-w-5xl mx-auto space-y-6'>
        <div className='flex items-center justify-between gap-4 flex-wrap'>
          <div>
            <h1 className='text-3xl font-extrabold uppercase tracking-tight'>
              Panel Admina
            </h1>
            <p className='text-slate-400 text-sm'>
              Dodawaj i edytuj produkty w sklepie.
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <Link
              href='/'
              className='inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors'
            >
              <ArrowLeft className='w-4 h-4' /> Wróć do sklepu
            </Link>
          </div>
        </div>

        {error && (
          <div className='bg-red-500/15 border border-red-500/40 text-red-300 p-3 rounded-xl text-sm'>
            {error}
          </div>
        )}
        {success && (
          <div className='bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 p-3 rounded-xl text-sm'>
            {success}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className='bg-slate-950/80 border border-white/10 rounded-2xl p-6 space-y-4'
        >
          <h2 className='font-bold text-lg uppercase tracking-wide flex items-center gap-2'>
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
                className='text-xs font-normal text-slate-400 ml-auto hover:text-white'
              >
                Anuluj edycję
              </button>
            )}
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <label className='block space-y-1'>
              <span className='text-xs font-semibold text-slate-400'>
                Nazwa
              </span>
              <input
                type='text'
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className='w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-amber-400'
              />
            </label>
            <label className='block space-y-1'>
              <span className='text-xs font-semibold text-slate-400'>
                Cena (PLN)
              </span>
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
              <span className='text-xs font-semibold text-slate-400'>
                Obraz (URL)
              </span>
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

            {/* ─── Pola Steak ─── */}
            <label className='block space-y-1'>
              <span className='text-xs font-semibold text-slate-400'>
                Tag (opcjonalny)
              </span>
              <input
                type='text'
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
                placeholder='np. BESTSELLER'
                className='w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-amber-400'
              />
            </label>
            <label className='block space-y-1'>
              <span className='text-xs font-semibold text-slate-400'>
                Klasa / Grade (opcjonalny)
              </span>
              <input
                type='text'
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
                placeholder='np. A5, Prime'
                className='w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-amber-400'
              />
            </label>
            <label className='block space-y-1'>
              <span className='text-xs font-semibold text-slate-400'>
                Pochodzenie / Lineage (opcjonalny)
              </span>
              <input
                type='text'
                value={form.lineage}
                onChange={(e) => setForm({ ...form, lineage: e.target.value })}
                placeholder='np. Japonii, USA'
                className='w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-amber-400'
              />
            </label>
            <label className='block space-y-1'>
              <span className='text-xs font-semibold text-slate-400'>
                Marmurkowatość / Marbling (opcjonalny)
              </span>
              <input
                type='text'
                value={form.marbling}
                onChange={(e) => setForm({ ...form, marbling: e.target.value })}
                placeholder='np. BMS 10'
                className='w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-amber-400'
              />
            </label>
            <label className='block space-y-1 md:col-span-2'>
              <span className='text-xs font-semibold text-slate-400'>
                Film (URL, opcjonalny)
              </span>
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

        {/* Product list */}
        <div className='space-y-3'>
          <h2 className='font-bold uppercase tracking-wide text-slate-300'>
            Produkty ({products.length})
          </h2>
          {isLoading ? (
            <div className='flex items-center gap-2 text-slate-400 text-sm py-8'>
              <Loader2 className='w-4 h-4 animate-spin' /> Ładowanie...
            </div>
          ) : (
            products.map((p) => (
              <div
                key={p.id}
                className='flex items-center gap-4 bg-slate-950/80 border border-white/10 rounded-xl p-3'
              >
                <div className='relative w-16 h-16 overflow-hidden rounded-lg border border-white/10 shrink-0'>
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
    </main>
  )
}
