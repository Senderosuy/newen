import { motion } from "framer-motion"
import { Users, Luggage, CheckCircle2, ChevronLeft, ChevronRight, X, Expand } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { getFleet } from "@/lib/queries"
import type { FleetVehicle } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"

const FALLBACK_IMG = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80"

interface LightboxState {
  images: string[]
  index: number
  name: string
}

/** Galería deslizable (swipe en móvil, flechas en desktop) para cada vehículo. */
function VehicleGallery({
  images,
  name,
  onOpen,
}: {
  images: string[]
  name: string
  onOpen: (index: number) => void
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: images.length > 1 })
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap())
    emblaApi.on("select", onSelect)
    onSelect()
    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi])

  return (
    <div className="space-y-3">
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-muted group">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex touch-pan-y">
            {images.map((img, i) => (
              <button
                key={img + i}
                onClick={() => onOpen(i)}
                className="relative flex-[0_0_100%] min-w-0 aspect-video cursor-zoom-in"
                aria-label={`Ampliar foto ${i + 1} de ${name}`}
              >
                <img
                  src={img}
                  alt={`${name} — foto ${i + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Ícono de ampliar al pasar el mouse (desktop) */}
        <div className="absolute top-3 right-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="bg-black/60 text-white rounded-full p-2.5 inline-flex">
            <Expand size={18} />
          </span>
        </div>

        {images.length > 1 && (
          <>
            {/* Flechas (solo desktop; en móvil se desliza con el dedo) */}
            <button
              onClick={() => emblaApi?.scrollPrev()}
              aria-label="Foto anterior"
              className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white items-center justify-center transition-colors"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              aria-label="Foto siguiente"
              className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white items-center justify-center transition-colors"
            >
              <ChevronRight size={22} />
            </button>

            {/* Contador */}
            <span className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              {selected + 1} / {images.length}
            </span>

            {/* Puntos indicadores */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  aria-label={`Ir a la foto ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === selected ? "w-5 bg-white" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Miniaturas (desktop): saltan a esa foto */}
      {images.length > 1 && (
        <div className="hidden md:grid grid-cols-6 gap-2">
          {images.slice(0, 6).map((img, i) => (
            <button
              key={img + i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`relative aspect-video rounded-lg overflow-hidden bg-muted transition-all ${
                i === selected ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100"
              }`}
              aria-label={`Ver foto ${i + 1} de ${name}`}
            >
              <img
                src={img}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover"
                draggable={false}
              />
              {i === 5 && images.length > 6 && (
                <span className="absolute inset-0 bg-black/60 text-white text-xs font-bold flex items-center justify-center">
                  +{images.length - 6}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function Fleet() {
  const [fleet, setFleet] = useState<FleetVehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState<LightboxState | null>(null)
  const touchStartX = useRef<number | null>(null)

  useEffect(() => {
    getFleet()
      .then(setFleet)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const closeLightbox = useCallback(() => setLightbox(null), [])
  const stepLightbox = useCallback((dir: -1 | 1) => {
    setLightbox((lb) =>
      lb ? { ...lb, index: (lb.index + dir + lb.images.length) % lb.images.length } : lb,
    )
  }, [])

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox()
      if (e.key === "ArrowLeft") stepLightbox(-1)
      if (e.key === "ArrowRight") stepLightbox(1)
    }
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [lightbox, closeLightbox, stepLightbox])

  return (
    <section id="flota" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestra Flota</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Vehículos modernos, equipados con la última tecnología para garantizar un viaje placentero y seguro.
          </p>
        </div>

        {loading && (
          <div className="space-y-24">
            {[0, 1].map((i) => (
              <div key={i} className="flex flex-col lg:flex-row gap-12 items-center">
                <Skeleton className="flex-1 w-full aspect-video rounded-3xl" />
                <div className="flex-1 w-full space-y-4">
                  <Skeleton className="h-8 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-24">
          {fleet.map((vehicle, index) => {
            const images = vehicle.images && vehicle.images.length > 0 ? vehicle.images : [FALLBACK_IMG]
            return (
              <div
                key={vehicle.id}
                className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-12 items-center`}
              >
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex-1 w-full"
                >
                  <VehicleGallery
                    images={images}
                    name={vehicle.name}
                    onOpen={(i) => setLightbox({ images, index: i, name: vehicle.name })}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex-1 space-y-6"
                >
                  <h3 className="text-3xl font-bold">{vehicle.name}</h3>
                  <p className="text-muted-foreground text-lg">{vehicle.description}</p>

                  <div className="flex gap-6 py-4">
                    <div className="flex items-center gap-2">
                      <Users className="text-primary" size={24} />
                      <span className="font-semibold">{vehicle.capacity} Pasajeros</span>
                    </div>
                    {vehicle.name.includes("Extralarga") && (
                      <div className="flex items-center gap-2">
                        <Luggage className="text-primary" size={24} />
                        <span className="font-semibold">Equipaje XL</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Array.isArray(vehicle.features) &&
                      vehicle.features.map((feature: string) => (
                        <div key={feature} className="flex items-start gap-2">
                          <CheckCircle2 size={18} className="text-primary shrink-0 mt-1" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                  </div>
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Lightbox con soporte de swipe */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0]?.clientX ?? null
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return
            const endX = e.changedTouches[0]?.clientX ?? touchStartX.current
            const delta = endX - touchStartX.current
            touchStartX.current = null
            if (Math.abs(delta) > 50) stepLightbox(delta < 0 ? 1 : -1)
          }}
        >
          <button
            onClick={closeLightbox}
            aria-label="Cerrar"
            className="absolute top-5 right-5 text-white/80 hover:text-white z-10 p-2"
          >
            <X size={30} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              stepLightbox(-1)
            }}
            aria-label="Foto anterior"
            className="hidden md:flex absolute left-3 md:left-8 text-white/80 hover:text-white z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ChevronLeft size={28} />
          </button>
          <img
            src={lightbox.images[lightbox.index]}
            alt={`${lightbox.name} — foto ${lightbox.index + 1}`}
            className="max-h-[85vh] max-w-[92vw] object-contain rounded-lg shadow-2xl select-none"
            onClick={(e) => e.stopPropagation()}
            draggable={false}
          />
          <button
            onClick={(e) => {
              e.stopPropagation()
              stepLightbox(1)
            }}
            aria-label="Foto siguiente"
            className="hidden md:flex absolute right-3 md:right-8 text-white/80 hover:text-white z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ChevronRight size={28} />
          </button>

          {/* Puntos + contador */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            {lightbox.images.length > 1 && (
              <div className="flex gap-1.5">
                {lightbox.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation()
                      setLightbox({ ...lightbox, index: i })
                    }}
                    aria-label={`Ir a la foto ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === lightbox.index ? "w-5 bg-white" : "w-1.5 bg-white/40"
                    }`}
                  />
                ))}
              </div>
            )}
            <p className="text-white/70 text-sm">
              {lightbox.name} — {lightbox.index + 1} / {lightbox.images.length}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
