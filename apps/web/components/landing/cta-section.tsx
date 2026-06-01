'use cache'

import { cacheLife } from 'next/cache'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export async function CTASection() {
  cacheLife('days')

  return (
    <section className="py-32 bg-navy relative overflow-hidden">
      {/* Decorative elements */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(148,134,201,0.12),transparent)]" />
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-coral/8 blur-3xl" />

      <div className="container mx-auto max-w-7xl px-6 text-center relative">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-on-dark mb-5">
          Para psiquiatras e clínicos
        </p>
        <h2 className="text-3xl lg:text-[2.75rem] font-semibold text-white mb-6 text-balance max-w-3xl mx-auto leading-[1.15]">
          Comece a acompanhar seus pacientes entre consultas
        </h2>
        <p className="text-white/50 text-lg mb-12 max-w-lg mx-auto leading-relaxed">
          Demonstração gratuita. Sem cartão de crédito. Configure em minutos.
        </p>
        <Button
          size="lg"
          className="bg-coral hover:bg-coral-dark text-white text-base px-10 py-6 rounded-xl shadow-2xl shadow-coral/25 hover:shadow-coral/40 transition-all duration-300 hover:-translate-y-1"
          asChild
        >
          <Link href="/dashboard">
            Ver demonstração gratuita
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </section>
  )
}
