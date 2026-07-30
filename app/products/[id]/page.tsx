"use client"
import { steaks } from "@/public/data/steaks"
import { CirclePlay, ShieldCheck, Truck } from "lucide-react"
import Image from "next/image"
import React, { use, useState } from "react"
import { Button } from "@/components/ui/button"

const ProductDetailsPage = ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const [weight, setWeight] = useState<number>(1)
  const { id } = use(params)
  const steak = steaks.find((s) => s.id === Number(id))
  if (!steak) {
    return (
      <div className='min-h-screen flex flex-col justify-center items-center bg-chart-1 text-xl text-black'>
        Stek nie znaleziony
      </div>
    )
  }
  return (
    <section className='min-h-screen  flex-col bg-foreground p-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start py-20'>
      <div className='lg:col-span-7 space-y-6'>
        <div className='relative aspect-4/5 md:aspect-video overflow-hidden border border-white text-background rounded-none group'>
          <Image
            className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
            alt={steak.title}
            src={steak.detail_images[0]}
            fill
            priority
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
          <div className='absolute bg-black/50 inset-0 z-10'></div>
          <div className='absolute top-6 left-6 flex flex-col gap-2 z-20'>
            <span className=' backdrop-blur-md px-3 py-1 font-semibold text-sm uppercase  border border-white text-background'>
              Sezonowane 28 dni
            </span>
            <span className='bg-primary-container px-3 py-1 font-semibold text-sm uppercase bg-primary  border border-white text-background'>
              Podlasie Premium
            </span>
          </div>
        </div>
        <div className='grid grid-cols-3 gap-4'>
          <div className='aspect-square overflow-hidden border border-white text-background hover:border-primary transition-colors cursor-pointer group'>
            <Image
              className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
              alt={steak.title}
              src={steak.detail_images[1]}
              width={200}
              height={200}
            />
          </div>
          <div className='aspect-square overflow-hidden border border-white text-background hover:border-primary transition-colors cursor-pointer group'>
            <Image
              className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
              alt={steak.title}
              src={steak.detail_images[2]}
              width={200}
              height={200}
            />
          </div>
          <div className='aspect-square overflow-hidden border border-white text-background hover:border-primary transition-colors cursor-pointer group relative'>
            <iframe
              width='100%'
              height='100%'
              src={steak.movie}
              title='YouTube video player'
              frameBorder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
              referrerPolicy='strict-origin-when-cross-origin'
              allowFullScreen
              className='absolute inset-0'
            ></iframe>
          </div>
        </div>
      </div>

      <div className='lg:col-span-5 flex flex-col gap-8 sticky top-32'>
        <div className='space-y-2'>
          <p className='font-normal text-lg uppercase text-chart-1 tracking-widest'>
            {steak.tag}
          </p>
          <h1 className='font-semibold text-4xl text-background'>
            {steak.title}
          </h1>
          <div className='flex items-center gap-4 mt-4'>
            <span className='font-normal text-2xl text-chart-1'>
              {steak.price} {`PLN`}
            </span>
            <span className='font-normal text-lg text-chart-1 line-through'>
              {(Number(steak.price) * 1.15).toFixed(2)} {`PLN`}
            </span>
          </div>
        </div>
        <p className='font-normal text-base text-chart-1'>{steak.desc}</p>

        <div className='space-y-6'>
          <div>
            <label className='font-normal text-base uppercase text-chart-1 mb-3 block'>
              Wybierz Wagę
            </label>
            <div className='grid grid-cols-3 gap-2'>
              <Button
                className='h-10 rounded-none text-background hover:border-primary  uppercase transition-all focus:border-primary cursor-pointer'
                onClick={() => {
                  setWeight(0.3)
                }}
              >
                300g
              </Button>
              <Button
                className='h-10 rounded-none text-background hover:border-primary  uppercase transition-all focus:border-primary cursor-pointer'
                onClick={() => {
                  setWeight(0.5)
                }}
              >
                500g
              </Button>
              <Button
                className='h-10 rounded-none text-background hover:border-primary uppercase transition-all focus:border-primary cursor-pointer'
                onClick={() => {
                  setWeight(1)
                }}
              >
                1kg
              </Button>
            </div>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div className='p-4  border border-white text-background'>
              <p className=' text-base text-chart-1 uppercase'>
                Marmurkowatość
              </p>
              <p className=' mt-1'>{steak.marbling}</p>
            </div>
            <div className='p-4  border border-white text-background'>
              <p className=' text-base text-chart-1 uppercase'>Pochodzenie</p>
              <p className=' mt-1'>{steak.lineage}</p>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          <Button className='h-12 w-full bg-primary text-background  font-bold uppercase  tracking-widest active:scale-[0.98] transition-all hover:brightness-110 cursor-pointer ro  rounded-none'>
            Dodaj do koszyka — {(Number(steak.price) * weight).toFixed(2)}{" "}
            {`PLN`}
          </Button>
          <Button className='h-12 w-full border bg-foreground/30  border-background text-background  font-bold uppercase tracking-widest hover:bg-foreground/10 transition-all active:scale-[0.98] cursor-pointer rounded-none'>
            Kup teraz z dostawą jutro
          </Button>
        </div>
        <div className='flex items-center gap-6 pt-4 border-t border-white text-background'>
          <div className='flex items-center gap-2'>
            <ShieldCheck />
            <span className='font-label-sm text-[10px] uppercase text-on-surface-variant'>
              Certyfikat Premium
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <Truck />
            <span className='font-label-sm text-[10px] uppercase text-on-surface-variant'>
              Chłodniczy Transport
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductDetailsPage
