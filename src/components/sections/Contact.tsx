import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import type { SiteSettings } from "@/types"

export function Contact({ settings }: { settings: SiteSettings | null }) {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    servicio: "Turismo y Larga Distancia",
    origen: "",
    destino: "",
    fecha: "",
    pasajeros: "",
    comentarios: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const message = `Hola NEWEN! Estoy viendo tu web newen.com.uy y me gustaría cotizar un viaje:
Nombre: ${formData.nombre}
Teléfono: ${formData.telefono}
Servicio: ${formData.servicio}
Origen: ${formData.origen}
Destino: ${formData.destino}
Fecha: ${formData.fecha}
Pasajeros: ${formData.pasajeros}
Comentarios: ${formData.comentarios}`

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${settings?.whatsapp_number?.replace(/\D/g, "") || "59899738955"}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <section id="contacto" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Estamos para ayudarte</h2>
            <p className="text-muted-foreground text-lg mb-12">
              Cotizá tu próximo viaje con nosotros de forma rápida y sencilla. Completá el formulario y te contactaremos por WhatsApp.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Llamanos</h4>
                  <p className="text-muted-foreground">{settings?.phone || "+598 99 738 955"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Email</h4>
                  <p className="text-muted-foreground">{settings?.email || "contacto@newen.com.uy"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Cobertura</h4>
                  <p className="text-muted-foreground">{settings?.coverage_area || "Todo el país y región"}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card p-8 rounded-3xl border border-border shadow-xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input 
                  placeholder="Tu nombre" 
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  required
                />
                <Input 
                  placeholder="Tu teléfono" 
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.servicio}
                  onChange={(e) => setFormData({...formData, servicio: e.target.value})}
                >
                  <option>Turismo y Larga Distancia</option>
                  <option>Transfers Ejecutivos</option>
                  <option>Eventos Sociales</option>
                  <option>Servicios Chárter</option>
                </select>
                <Input 
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input 
                  placeholder="Origen" 
                  value={formData.origen}
                  onChange={(e) => setFormData({...formData, origen: e.target.value})}
                  required
                />
                <Input 
                  placeholder="Destino" 
                  value={formData.destino}
                  onChange={(e) => setFormData({...formData, destino: e.target.value})}
                  required
                />
              </div>
              <Input 
                type="number" 
                placeholder="Cantidad de pasajeros" 
                value={formData.pasajeros}
                onChange={(e) => setFormData({...formData, pasajeros: e.target.value})}
                required
              />
              <Textarea 
                placeholder="Comentarios adicionales..." 
                className="min-h-[100px]"
                value={formData.comentarios}
                onChange={(e) => setFormData({...formData, comentarios: e.target.value})}
              />
              <Button type="submit" className="w-full gap-2" size="lg">
                Enviar cotización <Send size={18} />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
