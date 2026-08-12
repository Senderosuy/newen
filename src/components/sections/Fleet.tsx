import { motion } from "framer-motion"
import { Users, Luggage, CheckCircle2, ChevronLeft, ChevronRight, X, Expand } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { getFleet } from "@/lib/queries"
import type { FleetVehicle } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"

const FALLBACK_IMG = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80"

interface LightboxState {
  images: string[]
  index: number
  name: string
}

export function Fleet() {
  const [fleet, setFleet] = useState<FleetVehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState<LightboxState | null>(null)

  useEffect(() => {
    getFleet()
      .then(setFleet)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const closeLightbox = useCallback(() => setLightbox(null), [])
  const stepLightbox = useCallback(
    (dir: -1 | 1) => {
      setLightbox((lb) =>
        lb ? { ...lb, index: (lb.index + dir + lb.images.length) % lb.images.length } : lb,
      )
    },
    [],
  )

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
                  <div className="space-y-3">
                    <button
                      onClick={() => setLightbox({ images, index: 0, name: vehicle.name })}
                      className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-muted group w-full cursor-zoom-in"
                      aria-label={`Ampliar fotos de ${vehicle.name}`}
                    >
                      <img
                        src={images[0]}
                        alt={vehicle.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white rounded-full p-3">
                          <Expand size={22} />
                        </span>
                      </div>
                    </button>
                    {images.length > 1 && (
                      <div className="grid grid-cols-5 gap-2">
                        {images.slice(1, 6).map((img, i) => (
                          <button
                            key={img + i}
                            onClick={() => setLightbox({ images, index: i + 1, name: vehicle.name })}
                            className="relative aspect-video rounded-xl overflow-hidden bg-muted cursor-zoom-in group/thumb"
                            aria-label={`Ver foto ${i + 2} de ${vehicle.name}`}
                          >
                            <img
                              src={img}
                              alt={`Detalle de ${vehicle.name} — imagen ${i + 2}`}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                            />
                            {i === 4 && images.length > 6 && (
                              <span className="absolute inset-0 bg-black/60 text-white text-sm font-bold flex items-center justify-center">
                                +{images.length - 6}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
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

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
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
            className="absolute left-3 md:left-8 text-white/80 hover:text-white z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ChevronLeft size={28} />
          </button>
          <img
            src={lightbox.images[lightbox.index]}
            alt={`${lightbox.name} — foto ${lightbox.index + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => {
              e.stopPropagation()
              stepLightbox(1)
            }}
            aria-label="Foto siguiente"
            className="absolute right-3 md:right-8 text-white/80 hover:text-white z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ChevronRight size={28} />
          </button>
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {lightbox.name} — {lightbox.index + 1} / {lightbox.images.length}
          </p>
        </div>
      )}
    </section>
  )
}
