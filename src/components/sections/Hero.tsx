import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useCallback, useEffect, useState } from "react"
import { getCarouselSlides } from "@/lib/queries"
import type { CarouselSlide } from "@/types"
import { CAROUSEL_DATA } from "@/lib/carousel-data"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function Hero() {
  const [slides, setSlides] = useState<CarouselSlide[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: false })])

  useEffect(() => {
    async function loadSlides() {
      try {
        const data = await getCarouselSlides()
        if (data && data.length > 0) {
          setSlides(data)
        } else {
          setSlides(CAROUSEL_DATA.map((s, i) => ({ ...s, id: String(i + 1) })))
        }
      } catch (err) {
        console.error("Error loading carousel slides:", err)
        setSlides(CAROUSEL_DATA.map((s, i) => ({ ...s, id: String(i + 1) })))
      }
    }
    loadSlides()
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.reInit()
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on("select", onSelect)
    onSelect()
    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [slides, emblaApi])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi])

  return (
    <section id="inicio" className="relative h-screen w-full overflow-hidden">
      <div className="h-full w-full" ref={emblaRef}>
        <div className="flex h-full">
          {slides.length > 0 ? (
            slides.map((slide, index) => (
              <div key={slide.id} className="relative min-w-full h-full flex-[0_0_100%]">
                <img
                  src={slide.image_url}
                  alt={slide.title}
                  loading={index === 0 ? "eager" : "lazy"}
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
                    <Button size="lg" asChild className="bg-primary text-white hover:bg-primary/90">
                      <a href="https://wa.me/59899738955" target="_blank" rel="noopener noreferrer">
                        Cotizar por WhatsApp
                      </a>
                    </Button>
                    <Button size="lg" asChild variant="outline" className="text-white border-white bg-transparent hover:bg-white/10 hover:text-white">
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

      {slides.length > 1 && (
        <>
          {/* Flechas de navegación */}
          <button
            onClick={scrollPrev}
            aria-label="Slide anterior"
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white flex items-center justify-center transition-colors"
          >
            <ChevronLeft size={26} />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Slide siguiente"
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white flex items-center justify-center transition-colors"
          >
            <ChevronRight size={26} />
          </button>

          {/* Puntos indicadores */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2.5">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                aria-label={`Ir al slide ${index + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === selectedIndex ? "w-8 bg-white" : "w-2.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
