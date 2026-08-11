import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

interface WhatsAppButtonProps {
  phoneNumber: string;
}

export function WhatsAppButton({ phoneNumber }: WhatsAppButtonProps) {
  const formattedNumber = phoneNumber.replace(/\D/g, "");
  
  return (
    <motion.a
      href={`https://wa.me/${formattedNumber}?text=${encodeURIComponent("Hola NEWEN! Estoy viendo tu web newen.com.uy y me gustaría cotizar un servicio.")}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
      title="Contactanos por WhatsApp"
    >
      <MessageCircle size={32} />
    </motion.a>
  );
}
