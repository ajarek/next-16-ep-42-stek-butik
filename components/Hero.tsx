"use client"

import { Glass } from "@/components/canvasui/Glass"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

const Hero = () => {
  const router = useRouter()

  return (
    <Glass>
      <section className='relative flex min-h-screen w-full items-center overflow-hidden'>
        <div className='absolute inset-0 z-0'>
          <div className='absolute inset-0 z-10 bg-black/30' />
          <Image
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            priority
            className='object-cover object-center scale-105'
            src='https://lh3.googleusercontent.com/aida-public/AB6AXuDLrLrixbKd3u8CMjSfbUHyR5wXMhsTk1shNQCniiLTvZd7sXt62DqHhKHtXX4bhUV3GxSpIfeONDReBb9Jmi_774HNWZXTHCFyP654Zj13AblNYpu4-AFyKlCBOQqT5OX6yr9BrohIFUpLlq6YA4Grcp2IX5q9ARvpeQHrwNw2nHtkBqCp8osuGw8a_pNSHSlqMjtVbX7ycU4XPhl2k_cRC83cglaFE5h31G6X1eTMqQfqM2Otj6L84TUPkAe1LCo5w6-X7Wk5KOs-'
            alt='Premium dry-aged ribeye'
          />
        </div>

        <div className='container relative z-20 mx-auto w-full px-8'>
          <div className='max-w-4xl'>
            <span className='text-xl mb-4 block uppercase tracking-[0.2em] text-secondary animate-fade-up sm:mb-6 sm:tracking-[0.3em]'>
              Tradycja spotyka luksus
            </span>

            <h1 className='font-bold text-6xl mb-6 text-white animate-fade-up delay-100 sm:mb-8'>
              Rzemieślnicza Jakość
            </h1>

            <p className='font-normal text-lg mb-8 max-w-xl text-secondary animate-fade-up delay-200 sm:mb-12'>
              Odkryj smak autentycznej polskiej wołowiny, sezonowanej na sucho
              przez minimum 28 dni. Wyselekcjonowane cięcia z lokalnych,
              ekologicznych hodowli.
            </p>

            <div className='md:w-xl w-full flex  justify-end items-center  animate-fade-up delay-300'>
              <Link
                href='/products'
                className='bg-primary text-primary-foreground w-fit  px-6 py-4 uppercase tracking-widest transition-all hover:brightness-110 active:scale-95 sm:w-auto sm:px-10 sm:py-5'
              >
                Kup Teraz
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Glass>
  )
}

export default Hero
