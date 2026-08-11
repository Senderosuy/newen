import { motion } from "framer-motion"
import * as Icons from "lucide-react"
import { useEffect, useState } from "react"
import { getServices } from "@/lib/queries"
import type { Service } from "@/types"

export function Services() {
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    getServices().then(setServices).catch(console.error)
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
          {services.map((service, index) => {
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
