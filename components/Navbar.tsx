import { HeartIcon, Search, ShoppingCartIcon, User } from "lucide-react"
import Link from "next/link"
import React from "react"

const Navbar = () => {
  return (
    <nav className='h-16 fixed top-0 left-0 w-full z-50 flex justify-between items-center  bg-primary backdrop-blur-md px-4'>
      <Link
        href='/'
        className='text-lg md:text-3xl font-normal text-primary-foreground uppercase tracking-tighter'
      >
        POLSKA WOŁOWINA
      </Link>
      <div className='hidden md:flex items-center gap-8'>
        <Link
          href='/'
          className='text-primary-foreground font-normal text-xl hover:text-secondary-foreground transition-colors duration-300'
        >
          Home
        </Link>
        <Link
          href='/cuts'
          className='text-primary-foreground font-normal text-xl hover:text-secondary-foreground transition-colors duration-300'
        >
          Sezonowane
        </Link>
        <Link
          href='/product/ribeye'
          className='text-primary-foreground font-normal text-xl hover:text-secondary-foreground transition-colors duration-300'
        >
          Antrykot
        </Link>
        <Link
          href='/cuts'
          className='text-primary-foreground font-normal text-xl hover:text-secondary-foreground transition-colors duration-300'
        >
          Rostbef
        </Link>
        <Link
          href='/cuts'
          className='text-primary-foreground font-normal text-xl hover:text-secondary-foreground transition-colors duration-300'
        >
          Polędwica
        </Link>
      </div>
      <div className='flex items-center gap-6'>
        <Search className='text-primary-foreground cursor-pointer hover:scale-110 transition-transform' />
        <HeartIcon className='text-primary-foreground cursor-pointer hover:scale-110 transition-transform' />
        <div className='relative'>
          <ShoppingCartIcon className='text-primary-foreground cursor-pointer hover:scale-110 transition-transform' />
          <span className='absolute -top-2 -right-2 bg-primary-foreground text-primary text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold'>
            3
          </span>
        </div>
        <User className='text-primary-foreground cursor-pointer hover:scale-110 transition-transform' />
      </div>
    </nav>
  )
}

export default Navbar
