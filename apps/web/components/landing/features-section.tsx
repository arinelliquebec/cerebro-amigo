'use cache'

import { cacheLife } from 'next/cache'
import { CardContent } from "@/components/ui/card"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import {
  ClipboardList,
  Smile,
  ShieldAlert,
  Bell,
  TrendingUp,
  Lock,
  Sparkles,
  Brain,
} from "lucide-react"

const features = [
  {
    icon: ClipboardList,
    title: "Prontuário eletrônico",
    description:
      "Histórico clínico completo, organizado por consulta. Evolução, condutas e medicações num só lugar.",
    gradient: "from-primary/5 to-secondary/30",
  },
  {
    icon: Smile,
    title: "Check-in de humor",
    description:
      "Escalas validadas (PHQ-9, GAD-7) enviadas automaticamente entre consultas e armazenadas na evolução.",
    gradient: "from-coral/5 to-secondary/30",
  },
  {
    icon: ShieldAlert,
    title: "Protocolo de crise",
    description:
      "Detecção automática de risco com notificação imediata ao médico. Texto de crise fixo — nunca gerado por IA.",
    gradient: "from-warning/5 to-secondary/30",
  },
  {
    icon: Bell,
    title: "Lembretes automatizados",
    description:
      "Medicação, tarefas terapêuticas e retornos agendados com envio por push ou mensagem.",
    gradient: "from-primary/5 to-secondary/30",
  },
  {
    icon: TrendingUp,
    title: "Evolução clínica",
    description:
      "Gráficos de humor, aderência e progresso ao longo do tempo para embasar decisões no retorno.",
    gradient: "from-success/5 to-secondary/30",
  },
  {
    icon: Lock,
    title: "Privacidade LGPD",
    description:
      "Dados de saúde mental protegidos por criptografia, minimização de dados e trilhas de auditoria imutáveis.",
    gradient: "from-primary/5 to-secondary/30",
  },
]

const featuredFeature = {
  icon: Brain,
  title: "Briefing pré-consulta com IA",
  description:
    "Antes de cada retorno, a IA consolida tudo que aconteceu no intervalo: variações de humor, aderência a medicações, eventos registrados e alertas. O médico entra na consulta com um resumo claro — sem precisar garimpar anotações.",
  badge: "Inteligência Artificial",
}

export async function FeaturesSection() {
  cacheLife('days')

  return (
    <section id="recursos" className="py-28 relative">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(94,75,139,0.05),transparent)]" />

      <div className="container mx-auto max-w-7xl px-6 relative">
        <div className="max-w-2xl mb-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">
            Recursos
          </p>
          <h2 className="text-3xl lg:text-[2.75rem] font-semibold text-navy leading-[1.15] text-balance">
            Tudo que o acompanhamento entre consultas exige
          </h2>
        </div>

        {/* Briefing com IA — card em destaque */}
        <SpotlightCard className="mb-6 bg-gradient-to-br from-secondary/60 via-white to-white border border-primary/10">
          <CardContent className="p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 flex items-center justify-center flex-shrink-0 shadow-sm shadow-primary/10">
                <featuredFeature.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-2xl font-semibold text-navy">{featuredFeature.title}</h3>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 text-[11px] font-semibold text-primary uppercase tracking-wider">
                    <Sparkles className="h-3 w-3" />
                    {featuredFeature.badge}
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed max-w-2xl text-base">
                  {featuredFeature.description}
                </p>
              </div>
            </div>
          </CardContent>
        </SpotlightCard>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <SpotlightCard key={feature.title} className="group">
              <CardContent className={`p-8 space-y-5 bg-gradient-to-br ${feature.gradient}`}>
                <div className="h-12 w-12 rounded-xl bg-white border border-border/60 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:border-primary/20 transition-all duration-300">
                  <feature.icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy mb-2 text-[17px]">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  )
}
