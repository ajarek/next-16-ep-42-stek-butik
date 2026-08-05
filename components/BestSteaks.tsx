"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { getSteaks } from "@/lib/services/productService"
import type { Steak } from "@/types/typeProduct"

const BestSteaks = () => {
  const [steaks, setSteaks] = useState<Steak[]>([])

  useEffect(() => {
    getSteaks()
      .then(setSteaks)
      .catch(() => setSteaks([]))
  }, [])

  const featured = steaks.slice(0, 4)

  return (
    <section className='container mx-auto p-8 space-y-12'>
      <div className='flex flex-col md:flex-row justify-between items-center '>
        <div className='max-w-2xl'>
          <h2 className='font-semibold text-3xl text-background mb-4'>
            Najlepsze na steki
          </h2>
          <p className='font-lg text-chart-1'>
            Wybierz idealne cięcie dla swoich kulinarnych preferencji.Każdy stek
            jest ręcznie krojony przez naszych mistrzów rzemiosła, aby zapewnić
            najwyższą jakość i świeżość.
          </p>
        </div>
        <Link
          href='/cuts'
          className='font-lg text-primary uppercase border-b border-primary hover:text-secondary hover:border-secondary transition-colors'
        >
          Zobacz wszystkie kategorie
        </Link>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {featured.map((item, idx) => (
          <Link
            key={item.id ?? idx}
            href={`/products/${item.id}`}
            className=' group relative aspect-4/5 overflow-hidden block'
          >
            <Image
              className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
              src={item.img}
              alt={item.title}
              fill
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
            <div className='absolute inset-0  flex flex-col justify-end p-8'>
              <span className='font-semibold text-chart-1 mb-2'>
                {item.tag}
              </span>
              <h4 className='font-extrabold text-3xl text-background mb-2'>
                {item.title}
              </h4>
              <div className='font-bold text-xl text-primary '>
                {item.price}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default BestSteaks
