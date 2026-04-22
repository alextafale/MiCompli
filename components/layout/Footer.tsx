'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  MailOutlined, 
  Phone, 
  Favorite 
} from '@mui/icons-material'
import { motion } from 'framer-motion'

function SocialIcon({ icon: Icon, href }: { icon: any; href: string }) {
  return (
    <a 
      href={href} 
      className="w-12 h-12 rounded-2xl border border-white/5 flex items-center justify-center hover:bg-rose transition-all duration-500 hover:border-rose text-white/40 hover:text-white"
    >
      <Icon className="w-5 h-5" />
    </a>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-[15px] font-medium text-white/40 hover:text-rose transition-all duration-300 block">
        {children}
      </Link>
    </li>
  )
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0A0A0A] text-white pt-32 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          {/* Col 1 */}
          <div className="space-y-8">
            <motion.div
              whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              className="inline-block"
            >
              <Link href="/" className="inline-block relative h-24 w-80 opacity-60 hover:opacity-100 transition-all duration-300 invert grayscale">
                <Image
                  src="/images/micompliLOGO.jpeg"
                  alt="MiCompli Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </Link>
            </motion.div>
            <p className="text-white/40 text-[15px] leading-relaxed max-w-xs font-medium">
              Transformamos la intención en acción, creando momentos mágicos orquestados por cómplices reales.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={Instagram} href="#" />
              <SocialIcon icon={Facebook} href="#" />
              <SocialIcon icon={Twitter} href="#" />
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-display text-[11px] font-bold uppercase tracking-[3px] mb-8 text-white">Navegación</h4>
            <ul className="space-y-5">
              <FooterLink href="/explorar">Explorar Experiencias</FooterLink>
              <FooterLink href="/explorar?cat=regalo">Regalos</FooterLink>
              <FooterLink href="/complices">Ser un Cómplice</FooterLink>
              <FooterLink href="/nosotros">Nuestra Historia</FooterLink>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-display text-[11px] font-bold uppercase tracking-[3px] mb-8 text-white">Ayuda</h4>
            <ul className="space-y-5">
              <FooterLink href="/faq">Preguntas Frecuentes</FooterLink>
              <FooterLink href="/contacto">Contacto</FooterLink>
              <FooterLink href="/terminos">Términos y Condiciones</FooterLink>
              <FooterLink href="/privacidad">Aviso de Privacidad</FooterLink>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="font-display text-[11px] font-bold uppercase tracking-[3px] mb-8 text-white">Contacto</h4>
            <ul className="space-y-5">
              <li className="flex items-center gap-3 text-[14px] text-white/50 font-medium">
                <MailOutlined className="w-4 h-4 text-rose" />
                hola@micompli.com
              </li>
              <li className="flex items-center gap-3 text-[14px] text-white/50 font-medium">
                <Phone className="w-4 h-4 text-rose" />
                +52 (55) 1234 5678
              </li>
              <li className="pt-6">
                <div className="inline-flex px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <p className="text-[10px] uppercase tracking-[2px] text-rose font-bold">
                    ✦ Disponible 24/7 ✦
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Large Decorative Logo */}
        <div className="py-20 border-t border-white/5 flex justify-center overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative h-48 w-160 opacity-[0.05] grayscale invert pointer-events-none"
          >
             <Image
                src="/images/micompliLOGO.jpeg"
                alt="MiCompli Logo Large"
                fill
                className="object-contain"
              />
          </motion.div>
        </div>

        {/* Copyright */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[11px] text-white/20 uppercase tracking-[2px] font-bold">
            © {currentYear} MiCompli. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <p className="text-[11px] text-white/20 uppercase tracking-[2px] font-bold flex items-center gap-2">
              Hecho con <Favorite className="text-rose w-3 h-3" /> en México
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
