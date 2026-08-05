import { Send, Share2 } from "lucide-react"
import Link from "next/link"
import React from "react"

const Footer = () => {
  return (
    <footer className='p-8 flex flex-col md:flex-row justify-between items-center gap-8 bg-foreground  '>
      <div className='flex flex-col gap-12 text-chart-1'>
        <div className='font-bold text-lg '>POLSKA WOŁOWINA</div>
        <p className=' font-small uppercase tracking-widest'>
          © 2026 Polska Wołowina Premium. Rzemieślnicza jakość.
        </p>
      </div>
      <div className='flex flex-wrap justify-center gap-10 text-chart-1'>
        <Link
          className=' font-small uppercase tracking-widest hover:text-primary transition-colors'
          href='#'
        >
          Dostawa
        </Link>
        <Link
          className=' font-small uppercase tracking-widest hover:text-primary transition-colors'
          href='#'
        >
          Reklamacje
        </Link>
        <Link
          className=' font-small uppercase tracking-widest hover:text-primary transition-colors'
          href='#'
        >
          Pochodzenie
        </Link>
        <Link
          className=' font-small uppercase tracking-widest hover:text-primary transition-colors'
          href='#'
        >
          Metody Sezonowania
        </Link>
      </div>
      <div className='flex gap-4'>
        <Link
          className='w-10 h-10 border border-chart-1 flex items-center justify-center hover:border-primary transition-colors'
          href='/share'
        >
          <Share2 className='text-chart-1' />
        </Link>
        <Link
          className='w-10 h-10 border border-chart-1 flex items-center justify-center hover:border-primary transition-colors'
          href='#'
        >
          <Send className='text-chart-1' />
        </Link>
      </div>
    </footer>
  )
}

export default Footer
