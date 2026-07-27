import { steaks } from '@/public/data/steaks'
import { CirclePlay } from 'lucide-react'
import Image from 'next/image'
import React from 'react'


const ProductDetailsPage = async ({params}: {params: Promise<{id: string}>}) => {
  const { id } = await params
  const steak = steaks.find((s) => s.id === Number(id))
  if (!steak) {
    return <div className='min-h-screen flex flex-col justify-center items-center bg-chart-1 text-xl text-black'>Stek nie znaleziony</div>
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
            <Image
              className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60'
              alt={steak.title}
              src={steak.movie}
              width={200}
              height={200}
            />
            <div className='absolute inset-0 flex items-center justify-center'>
              <CirclePlay className='size-12 text-background'/>
            </div>
          </div>
        </div>
      </div>

      <div className='lg:col-span-5 flex flex-col gap-8 sticky top-32'>
        <div className='space-y-2'>
          <p className='font-label-sm text-label-sm uppercase text-secondary tracking-[0.2em]'>
            ANTRYKOT SEZONOWANY
          </p>
          <h1 className='font-display-lg text-display-lg'>
            Stek Ribeye Premium
          </h1>
          <div className='flex items-center gap-4 mt-4'>
            <span className='font-headline-md text-headline-md text-primary'>
              od 189,00 zł
            </span>
            <span className='font-label-sm text-label-sm text-on-surface-variant line-through uppercase'>
              229,00 zł
            </span>
          </div>
        </div>
        <p className='font-body-lg text-body-lg text-on-surface-variant'>
          Nasz flagowy Antrykot pochodzący z wyselekcjonowanych stad z regionu
          Podlasia. Sezonowany na sucho przez minimum 28 dni w kontrolowanej
          temperaturze, co nadaje mu głęboki, orzechowy aromat i niespotykaną
          kruchość.
        </p>

        <div className='space-y-6'>
          <div>
            <label className='font-label-sm text-label-sm uppercase text-on-surface-variant mb-3 block'>
              Wybierz Wagę
            </label>
            <div className='grid grid-cols-3 gap-2'>
              <button className='border border-primary bg-primary-container/10 text-primary py-3 font-label-sm text-label-sm uppercase transition-all'>
                300g
              </button>
              <button className='border border-white text-background hover:border-primary py-3 font-label-sm text-label-sm uppercase transition-all'>
                500g
              </button>
              <button className='border border-white text-background hover:border-primary py-3 font-label-sm text-label-sm uppercase transition-all'>
                1kg
              </button>
            </div>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div className='p-4 bg-surface-container border border-white text-background'>
              <p className='font-label-sm text-label-sm text-on-surface-variant uppercase'>
                Marmurkowatość
              </p>
              <p className='font-body-lg text-body-lg text-on-surface mt-1'>
                BMS 7-9
              </p>
            </div>
            <div className='p-4 bg-surface-container border border-white text-background'>
              <p className='font-label-sm text-label-sm text-on-surface-variant uppercase'>
                Pochodzenie
              </p>
              <p className='font-body-lg text-body-lg text-on-surface mt-1'>
                Podlasie
              </p>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          <button className='w-full bg-primary-container text-white py-5 font-label-sm text-label-sm uppercase font-bold tracking-widest active:scale-[0.98] transition-all hover:brightness-110'>
            Dodaj do koszyka — 189,00 zł
          </button>
          <button className='w-full border border-white text-background text-on-surface py-5 font-label-sm text-label-sm uppercase font-bold tracking-widest hover:bg-surface-container-high transition-all'>
            Kup teraz z dostawą jutro
          </button>
        </div>
        <div className='flex items-center gap-6 pt-4 border-t border-white text-background'>
          <div className='flex items-center gap-2'>
            <span className='material-symbols-outlined text-primary text-xl'>
              verified_user
            </span>
            <span className='font-label-sm text-[10px] uppercase text-on-surface-variant'>
              Certyfikat Premium
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <span className='material-symbols-outlined text-primary text-xl'>
              local_shipping
            </span>
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
