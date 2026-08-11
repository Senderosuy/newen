import { motion } from "framer-motion"
import * as Icons from "lucide-react"
import { useEffect, useState } from "react"
import { getServices } from "@/lib/queries"
import type { Service } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"

// Contenido por defecto si la tabla está vacía: el sitio nunca se ve roto.
const DEFAULT_SERVICES: Service[] = [
  { id: "d1", icon: "MapPin", title: "Turismo y Larga Distancia", description: "Viajes grupales, excursiones y traslados a cualquier punto del país.", sort_order: 1 },
  { id: "d2", icon: "Briefcase", title: "Transfers Ejecutivos", description: "Traslados corporativos, aeropuertos y eventos empresariales.", sort_order: 2 },
  { id: "d3", icon: "Users", title: "Eventos Sociales", description: "Casamientos, cumpleaños, egresados y salidas grupales.", sort_order: 3 },
  { id: "d4", icon: "Calendar", title: "Servicios Chárter", description: "Contrataciones por jornada o recorridos personalizados.", sort_order: 4 },
]

export function Services() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getServices()
      .then((data) => setServices(data && data.length > 0 ? data : DEFAULT_SERVICES))
      .catch(() => setServices(DEFAULT_SERVICES))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="servicios" className="py-24 px-6 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestros Servicios</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ofrecemos soluciones de transporte personalizadas para cada necesidad, con el máximo confort y puntualidad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading
            ? [0, 1, 2, 3].map((i) => (
                <div key={i} className="bg-card p-8 rounded-2xl border border-border">
                  <Skeleton className="w-12 h-12 rounded-xl mb-6" />
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ))
            : services.map((service, index) => {
                const IconComponent = (Icons as any)[service.icon] || Icons.MapPin
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card p-8 rounded-2xl shadow-sm border border-border hover:shadow-lg hover:-translate-y-1 transition-all group"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                      <IconComponent size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </motion.div>
                )
              })}
        </div>
      </div>
    </section>
  )
}
