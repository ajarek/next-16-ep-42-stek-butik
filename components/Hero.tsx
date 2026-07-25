"use client";
import { useRouter } from 'next/navigation';

const Hero = () => {
    const router = useRouter();
    return (
        <section className="relative h-[921px] flex items-center overflow-hidden">
                            <div className="absolute inset-0 z-0">
                                <div className="absolute inset-0 bg-black/40 z-10"></div>
                                <img className="w-full h-full object-cover scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLrLrixbKd3u8CMjSfbUHyR5wXMhsTk1shNQCniiLTvZd7sXt62DqHhKHtXX4bhUV3GxSpIfeONDReBb9Jmi_774HNWZXTHCFyP654Zj13AblNYpu4-AFyKlCBOQqT5OX6yr9BrohIFUpLlq6YA4Grcp2IX5q9ARvpeQHrwNw2nHtkBqCp8osuGw8a_pNSHSlqMjtVbX7ycU4XPhl2k_cRC83cglaFE5h31G6X1eTMqQfqM2Otj6L84TUPkAe1LCo5w6-X7Wk5KOs-" alt="Premium dry-aged ribeye" />
                            </div>
                            <div className="container mx-auto px-gutter relative z-20">
                                <div className="max-w-4xl">
                                    <span className="font-label-sm text-label-sm uppercase tracking-[0.3em] text-secondary mb-6 block animate-fade-up">Tradycja spotyka luksus</span>
                                    <h1 className="font-display-lg text-display-lg md:text-[120px] leading-[0.9] text-on-surface mb-8 animate-fade-up delay-100">Rzemieślnicza Jakość</h1>
                                    <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-12 animate-fade-up delay-200">
                                        Odkryj smak autentycznej polskiej wołowiny, sezonowanej na sucho przez minimum 28 dni. Wyselekcjonowane cięcia z lokalnych, ekologicznych hodowli.
                                    </p>
                                    <div className="flex flex-wrap gap-6 animate-fade-up delay-300">
                                        <button onClick={() => router.push('/cuts')} className="bg-primary-container text-on-primary-container px-10 py-5 font-label-sm uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all">Kup Teraz</button>
                                        <button className="border border-white/20 text-on-surface px-10 py-5 font-label-sm uppercase tracking-widest hover:bg-white/5 transition-all backdrop-blur-sm">Nasza Metoda</button>
                                    </div>
                                </div>
                            </div>
                        </section>
  )
}

export default Hero