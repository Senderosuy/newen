import { motion } from "framer-motion"
import { Users, Luggage, CheckCircle2 } from "lucide-react"
import { useEffect, useState } from "react"
import { getFleet } from "@/lib/queries"
import type { FleetVehicle } from "@/types"

export function Fleet() {
  const [fleet, setFleet] = useState<FleetVehicle[]>([])

  useEffect(() => {
    getFleet().then(setFleet).catch(console.error)
  }, [])

  return (
    <section id="flota" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestra Flota</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Vehículos modernos, equipados con la última tecnología para garantizar un viaje placentero y seguro.
          </p>
        </div>

        <div className="space-y-24">
          {fleet.map((vehicle, index) => (
            <div 
              key={vehicle.id}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
            >
              <motion.div 
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex-1 w-full"
              >
                <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-muted group">
                  <div className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                    {vehicle.images && vehicle.images.length > 0 ? (
                      vehicle.images.map((img, i) => (
                        <img 
                          key={i}
                          src={img} 
                          alt={`${vehicle.name} - ${i + 1}`}
                          className="w-full h-full object-cover shrink-0 snap-center"
                        />
                      ))
                    ) : (
                      <img 
                        src='https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80'
                        alt={vehicle.name}
                        className="w-full h-full object-cover shrink-0 snap-center"
                      />
                    )}
                  </div>
                  {vehicle.images && vehicle.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      {vehicle.images.map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/50" />
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
                  {vehicle.name.includes('Extralarga') && (
                    <div className="flex items-center gap-2">
                      <Luggage className="text-primary" size={24} />
                      <span className="font-semibold">Equipaje XL</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Array.isArray(vehicle.features) && vehicle.features.map((feature: string) => (
                    <div key={feature} className="flex items-start gap-2">
                      <CheckCircle2 size={18} className="text-primary shrink-0 mt-1" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
