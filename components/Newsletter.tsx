"use client"

import { Button } from "./ui/button"

const Newsletter = () => {
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Tutaj możesz dodać logikę formularza
    alert('Dziękujemy za zapis do newslettera! Zapisano email: '+(e.currentTarget[0] as HTMLInputElement).value)
    e.currentTarget.reset()
  }

  return (
    <section className=' p-8'>
      <div className='container mx-auto px-gutter text-center max-w-3xl'>
        <h2 className='font-bold md:text-4xl text-xl text-background mb-8'>
          Zostań koneserem
        </h2>
        <p className='font-semibold text-chart-1 text-xl mb-12'>
          Zapisz się do newslettera po informacje o limitowanych dostawach
          sezonowych antrykotów i ekskluzywnych przepisach naszych szefów
          kuchni.
        </p>
        <form
          className='flex flex-col md:flex-row gap-4'
          onSubmit={handleFormSubmit}
        >
          <input
            className='flex-1 bg-chart-1 border-none focus:ring-0 text-foreground  h-14 px-6'
            placeholder='Twój adres e-mail'
            type='email'
            required
          />
          <Button className='h-14 px-8 rounded-none bg-primary uppercase tracking-widest hover:brightness-110 transition-all cursor-pointer' type='submit'>
            Dołącz
          </Button>
        </form>
      </div>
    </section>
  )
}

export default Newsletter
