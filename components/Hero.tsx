"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"

const Hero = () => {
  const router = useRouter()

  return (
    <section className="relative flex min-h-100svh w-full items-center overflow-hidden py-16 sm:py-20 md:py-0">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 z-10 bg-black/40" />
        <Image
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLrLrixbKd3u8CMjSfbUHyR5wXMhsTk1shNQCniiLTvZd7sXt62DqHhKHtXX4bhUV3GxSpIfeONDReBb9Jmi_774HNWZXTHCFyP654Zj13AblNYpu4-AFyKlCBOQqT5OX6yr9BrohIFUpLlq6YA4Grcp2IX5q9ARvpeQHrwNw2nHtkBqCp8osuGw8a_pNSHSlqMjtVbX7ycU4XPhl2k_cRC83cglaFE5h31G6X1eTMqQfqM2Otj6L84TUPkAe1LCo5w6-X7Wk5KOs-"
          alt="Premium dry-aged ribeye"
        />
      </div>

      <div className="container relative z-20 mx-auto w-full px-gutter">
        <div className="max-w-4xl">
          <span className="font-label-sm text-label-sm mb-4 block uppercase tracking-[0.2em] text-secondary animate-fade-up sm:mb-6 sm:tracking-[0.3em]">
            Tradycja spotyka luksus
          </span>

          <h1 className="font-display-lg text-display-lg mb-6 text-on-surface animate-fade-up delay-100 sm:mb-8">
            Rzemieślnicza Jakość
          </h1>

          <p className="font-body-lg text-body-lg mb-8 max-w-xl text-on-surface-variant animate-fade-up delay-200 sm:mb-12">
            Odkryj smak autentycznej polskiej wołowiny, sezonowanej na sucho
            przez minimum 28 dni. Wyselekcjonowane cięcia z lokalnych,
            ekologicznych hodowli.
          </p>

          <div className="flex flex-col gap-3 animate-fade-up delay-300 sm:flex-row sm:flex-wrap sm:gap-4 md:gap-6">
            <button
              onClick={() => router.push("/cuts")}
              className="bg-primary-container text-on-primary-container font-label-sm w-full px-6 py-4 uppercase tracking-widest transition-all hover:brightness-110 active:scale-95 sm:w-auto sm:px-10 sm:py-5"
            >
              Kup Teraz
            </button>
            <button className="border border-white/20 text-on-surface font-label-sm w-full px-6 py-4 uppercase tracking-widest backdrop-blur-sm transition-all hover:bg-white/5 sm:w-auto sm:px-10 sm:py-5">
              Nasza Metoda
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
