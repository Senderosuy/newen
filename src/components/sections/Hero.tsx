import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { getCarouselSlides } from "@/lib/queries"
import type { CarouselSlide } from "@/types"
import { CAROUSEL_DATA } from "@/lib/carousel-data"

export function Hero() {
  const [slides, setSlides] = useState<CarouselSlide[]>([])
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })])

  useEffect(() => {
    getCarouselSlides()
      .then(setSlides)
      .catch((err) => {
        console.error(err)
        // Fallback slides
        setSlides(CAROUSEL_DATA.map((s, i) => ({ ...s, id: String(i + 1) })))
      })
  }, [])

  return (
    <section id="inicio" className="relative h-screen w-full overflow-hidden">
      <div className="h-full w-full" ref={emblaRef}>
        <div className="flex h-full">
          {slides.length > 0 ? (
            slides.map((slide) => (
              <div key={slide.id} className="relative min-w-full h-full flex-[0_0_100%]">
                <img
                  src={slide.image_url}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-6">
                  <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-4xl md:text-6xl font-bold text-white mb-4 max-w-4xl"
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg md:text-2xl text-white/90 mb-8 max-w-2xl"
                  >
                    {slide.subtitle}
                  </motion.p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
                      <a href="https://wa.me/59899738955">Cotizar por WhatsApp</a>
                    </Button>
                    <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                      <a href="#servicios">Ver servicios</a>
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="min-w-full h-full flex-[0_0_100%] bg-muted animate-pulse flex items-center justify-center">
              <p className="text-muted-foreground">Cargando experiencias...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
