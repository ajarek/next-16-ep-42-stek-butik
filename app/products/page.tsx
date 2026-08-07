"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { getProducts } from "@/lib/services/productService";

import type { Product } from "@/types/typeProduct";
import {
  Flame,
  Loader2,
  Search,
  X,
  SlidersHorizontal,
  RotateCcw,
  ArrowUpDown,
  Beef,
} from "lucide-react";

type SortOption = "default" | "price-asc" | "price-desc" | "name-asc";

const sortOptions: { id: SortOption; label: string }[] = [
  { id: "default", label: "Polecane" },
  { id: "price-asc", label: "Cena rosnąco" },
  { id: "price-desc", label: "Cena malejąco" },
  { id: "name-asc", label: "Nazwa A-Z" },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sort, setSort] = useState<SortOption>("default");

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setIsLoading(false));
  }, []);

  const categories = useMemo(() => {
    const counter = new Map<string, number>();
    products.forEach((item) => {
      const key = item.category?.trim() || "INNE";
      counter.set(key, (counter.get(key) ?? 0) + 1);
    });
    return Array.from(counter.entries())
      .map(([id, count]) => ({ id, count }))
      .sort((a, b) => a.id.localeCompare(b.id));
  }, [products]);

  const priceBounds = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 0 };
    const prices = products.map((item) => item.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [products]);

  const activePrice =
    maxPrice === null ? priceBounds.max : Math.min(maxPrice, priceBounds.max);

  const filteredProducts = useMemo(() => {
    const q = query.toLowerCase().trim();

    const result = products.filter((item) => {
      const itemCategory = item.category?.trim() || "INNE";
      const matchesCategory = category === "all" || itemCategory === category;
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        itemCategory.toLowerCase().includes(q);
      const matchesPrice = item.price <= activePrice;
      return matchesCategory && matchesQuery && matchesPrice;
    });

    switch (sort) {
      case "price-asc":
        return [...result].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...result].sort((a, b) => b.price - a.price);
      case "name-asc":
        return [...result].sort((a, b) => a.name.localeCompare(b.name, "pl"));
      default:
        return result;
    }
  }, [products, query, category, activePrice, sort]);

  const isFiltered =
    query.trim() !== "" ||
    category !== "all" ||
    sort !== "default" ||
    activePrice < priceBounds.max;

  const resetFilters = () => {
    setQuery("");
    setCategory("all");
    setSort("default");
    setMaxPrice(priceBounds.max);
  };

  return (
    <section className="min-h-screen flex flex-col gap-8 bg-foreground p-8">
      <div className="flex flex-col md:flex-row justify-between items-center py-16">
        <div className="max-w-2xl">
          <h1 className="font-semibold text-3xl text-background mb-4">
            Najlepsze na steki
          </h1>
          <p className="font-lg text-chart-1">
            Wybierz idealne cięcie dla swoich kulinarnych preferencji. Każdy stek
            jest ręcznie krojony przez naszych mistrzów rzemiosła, aby zapewnić
            najwyższą jakość i świeżość.
          </p>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Ładowanie oferty...
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 bg-foreground border border-chart-1 p-6 rounded-none">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-chart-1" />
          <input
            type="text"
            placeholder="Szukaj steka..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border border-chart-1 text-background pl-10 pr-4 py-3 focus:outline-none focus:border-primary transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-chart-1 hover:text-primary"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Beef className="w-5 h-5 text-chart-1" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-transparent border border-chart-1 text-background py-3 px-4 focus:outline-none focus:border-primary transition-colors cursor-pointer"
            >
              <option value="all" className="bg-foreground text-background">Wszystkie kategorie</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-foreground text-background">
                  {c.id} ({c.count})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4 min-w-50">
            <SlidersHorizontal className="w-5 h-5 text-chart-1" />
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex justify-between text-xs text-chart-1">
                <span>{priceBounds.min} PLN</span>
                <span>{activePrice} PLN</span>
              </div>
              <input
                type="range"
                min={priceBounds.min}
                max={priceBounds.max}
                value={activePrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-5 h-5 text-chart-1" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="bg-transparent border border-chart-1 text-background py-3 px-4 focus:outline-none focus:border-primary transition-colors cursor-pointer"
            >
              {sortOptions.map((s) => (
                <option key={s.id} value={s.id} className="bg-foreground text-background">
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {isFiltered && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 text-chart-1 hover:text-primary transition-colors py-3 px-4"
              title="Resetuj filtry"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {!isLoading && filteredProducts.length === 0 && (
        <div className="text-center py-20 space-y-3">
          <Flame className="w-12 h-12 text-chart-1 mx-auto" />
          <h3 className="text-lg font-bold text-background uppercase tracking-wider">
            Brak wyników
          </h3>
          <p className="text-chart-1 text-sm max-w-md mx-auto">
            Żaden stek nie pasuje do wybranych kryteriów. Spróbuj zmienić
            kategorię, zakres ceny lub frazę wyszukiwania.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((item, idx) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: Math.min(idx, 8) * 0.08 }}
          >
            <Link
              href={`/products/${item.id}`}
              className="group relative aspect-4/5 overflow-hidden block border border-chart-1 hover:border-primary transition-colors cursor-pointer"
            >
              <Image
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <span className="font-semibold text-chart-1 mb-2 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  {item.category}
                </span>
                <h4 className="font-extrabold text-3xl text-background mb-2">
                  {item.name}
                </h4>
                <div className="font-bold text-xl text-primary">
                  {item.price.toFixed(2)} PLN
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
        </AnimatePresence>
      </div>
    </section>
  );
}