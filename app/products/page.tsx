"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { getProducts } from "@/lib/services/productService";
import { steaks } from "@/public/data/steaks";
import type { Product } from "@/types/typeProduct";
import { Flame, Loader2 } from "lucide-react";

// Adapter: convert static steak data to Product shape for display
const staticProducts: Product[] = steaks.map((s) => ({
  id: String(s.id),
  name: s.title,
  image: s.img,
  description: s.desc,
  price: parseFloat(s.price),
  category: s.tag,
  weight: s.weight,
}));

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(staticProducts);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((firestoreProducts) => {
        // Use Firestore products if available, otherwise fall back to static
        if (firestoreProducts.length > 0) {
          setProducts(firestoreProducts);
        }
      })
      .catch(() => {
        // Silently fall back to static data on Firebase error (e.g. not configured)
      })
      .finally(() => setIsLoading(false));
  }, []);

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
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
      </div>
    </section>
  );
}