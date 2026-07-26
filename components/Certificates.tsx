import { Award, Snowflake, Tractor } from 'lucide-react'
import React from 'react'

const Certificates = () => {
  return (
    <section className="p-4 container mx-auto ">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
                                <div className="p-8 border border-primary rounded-xl space-y-2 shadow-sm ">
                                    <Tractor className='text-chart-1 size-12 mb-8' />
                                    <h3 className="font-semibold text-3xl text-background">Lokalne Hodowle</h3>
                                    <p className="font-normal text-lg text-background">Współpracujemy wyłącznie z certyfikowanymi gospodarstwami z Podlasia i Wielkopolski.</p>
                                </div>
                                <div className="p-8 border border-primary   rounded-xl space-y-2 bg-primary text-background shadow-sm">
                                    <Snowflake className='text-background size-12 mb-8' />
                                    <h3 className="font-semibold text-3xl ">Sezonowanie</h3>
                                    <p className="font-body-md opacity-90">Specjalistyczne komory z solą himalajską zapewniają koncentrację smaku i kruchość.</p>
                                </div>
                                <div className="p-8 border border-primary rounded-xl space-y-2 shadow-sm">
                                    <Award className='text-chart-1 size-12 mb-8'/>
                                    <h3 className="font-semibold text-3xl text-background">Certyfikat Jakości</h3>
                                    <p className="font-normal text-lg text-background">Pełna identyfikowalność pochodzenia – od pola aż do Twojego stołu.</p>
                                </div>
                            </div>
                        </section>
  )
}

export default Certificates