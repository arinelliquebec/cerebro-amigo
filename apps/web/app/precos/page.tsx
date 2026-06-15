import Link from "next/link"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { AuroraBackdrop } from "@/components/landing/aurora-backdrop"
import { Eyebrow } from "@/components/landing/eyebrow"
import { Reveal, RevealGroup, RevealItem } from "@/components/landing/reveal"
import { FooterSection } from "@/components/landing/footer-section"
import { Schema } from "@/components/seo/schema"
import {
  Check, ArrowRight, ShieldCheck, Lock, Zap, Users, Brain, ChevronDown, ChevronUp, Star,
} from "lucide-react"

export const metadata = {
  title: "Preços",
  description:
    "Planos para psiquiatras e clínicas. Solo Pro mensal, pronto para usar. Os planos Consultoria personalizam o programa à sua prática ou clínica.",
  openGraph: {
    title: "Preços — Cérebro Amigo",
    description: "Solo Pro mensal e pronto para usar; Consultoria personaliza o programa ao médico ou à clínica.",
  },
  alternates: { canonical: "https://www.cerebroamigo.com.br/precos" },
}

// Três planos (decisão do dono, 2026-06-15):
//  - Solo Pro            → plataforma pronta, self-serve, 1 médico, MENSAL (sem fidelidade).
//  - Solo Consultoria    → Pro + personalização do programa (done-with-you), 1 médico, mín. 3 meses.
//  - Clínica Consultoria → personalização desenhada p/ a operação da clínica (multi-médico), mín. 3 meses.
// "Consultoria" = configuração + advisory sobre a plataforma (condutas/protocolos/portal),
// nunca código sob medida por cliente. Preços = âncoras; a mensalidade dos planos Consultoria
// é custom por cliente (assinaturas.valor_mensal, ADR-034) e a implementação é cobrança avulsa.
// NB: a copy NÃO oferece trial. O onboarding (ADR-046) ainda cria assinatura trial 30d —
// alinhar isso no backend é follow-up à parte (toca gateway/cobrança), fora deste PR.
const planos = [
  {
    nome: "Solo Pro",
    preco: "R$ 497",
    sub: "/mês · 1 médico",
    destaque: true,
    badge: "Mais popular",
    desc: "A plataforma completa, pronta para usar. Sem configuração técnica — você no controle.",
    cor: "border-primary/40 bg-primary/5 glow-purple-lg",
    features: [
      "1 médico · pacientes ilimitados",
      "Diário por voz, check-ins e lembretes",
      "Briefing pré-consulta + agentes de IA",
      "Teleconsulta com escriba clínico",
      "Protocolo de crise integrado",
      "Evolução em gráficos + editor de prompts",
      "Suporte prioritário",
    ],
    cta: "Criar conta",
    href: "/medicos/cadastro",
    nota: "Mensal · sem fidelidade",
  },
  {
    nome: "Solo Consultoria",
    preco: "R$ 1.490",
    sub: "/mês · 1 médico",
    destaque: false,
    badge: "Feito com você",
    desc: "A plataforma desenhada em volta do seu jeito de trabalhar — configuramos e otimizamos com você.",
    cor: "border-accent/40 bg-accent/5",
    features: [
      "Tudo do Solo Pro",
      "Programa personalizado à sua prática",
      "Condutas, protocolos e automações sob medida",
      "Portal do paciente com a sua marca",
      "Onboarding e migração feitos por nós",
      "Revisões periódicas de otimização (advisory)",
      "Suporte dedicado",
    ],
    cta: "Agendar conversa",
    href: "/sobre#contato",
    nota: "Mín. 3 meses · + implementação a partir de R$ 4.900",
  },
  {
    nome: "Clínica Consultoria",
    preco: "R$ 2.900",
    sub: "/mês · a partir de",
    destaque: false,
    badge: "",
    desc: "O programa desenhado para a operação inteira da clínica — padroniza e escala o acompanhamento.",
    cor: "border-noir-line bg-noir-surface",
    features: [
      "Tudo do Solo Consultoria",
      "Múltiplos médicos + painel da clínica",
      "Programa e protocolos para a operação",
      "Relatórios agregados da clínica",
      "Gestão de equipe e papéis",
      "SLA e contrato",
    ],
    cta: "Falar com a equipe",
    href: "/sobre#contato",
    nota: "Mín. 3 meses · + implementação a partir de R$ 9.800",
  },
]

const faqs = [
  {
    q: "Qual a diferença entre Solo Pro e os planos Consultoria?",
    a: "No Solo Pro você usa a plataforma pronta e configura por conta própria. Nos planos Consultoria (Solo ou Clínica), nós desenhamos e otimizamos o programa com você — condutas, protocolos, automações e portal personalizados à sua prática ou à operação da clínica — com onboarding feito por nós e revisões periódicas.",
  },
  {
    q: "Como funciona a implementação dos planos Consultoria?",
    a: "Há uma etapa inicial (taxa de implementação) em que configuramos o programa ao seu jeito de trabalhar e migramos seus pacientes, além da mensalidade da plataforma. Depois, acompanhamos com revisões periódicas de otimização.",
  },
  {
    q: "Tem fidelidade? E se eu quiser cancelar?",
    a: "O Solo Pro é mensal — cancele quando quiser, com acesso até o fim do ciclo pago. Os planos Consultoria têm período mínimo de 3 meses (pela etapa de personalização e implementação); concluído esse período, o cancelamento é livre.",
  },
  {
    q: "Os dados dos meus pacientes são seguros?",
    a: "Todos os dados ficam em servidores AWS no Brasil (sa-east-1), criptografados em repouso e em trânsito. A plataforma segue a LGPD para dados de saúde mental (categoria especial, art. 11).",
  },
  {
    q: "A IA substitui minha avaliação clínica?",
    a: "Não. A IA organiza, resume e alerta — a decisão clínica é sempre sua. O protocolo de crise é fixo e pré-aprovado; nunca gerado dinamicamente. Você está no loop em cada momento que importa.",
  },
  {
    q: "Tenho uma clínica com vários médicos. Qual plano?",
    a: "O Clínica Consultoria atende equipes, com o programa desenhado para a operação inteira e painel da clínica. Para redes e hospitais maiores, fale com a equipe para um plano sob medida.",
  },
]

// Schema FAQPage para Google Rich Results
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group border-b border-noir-line py-5 [&>summary]:list-none">
      <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-medium text-foreground">
        {q}
        <span className="shrink-0 text-muted-foreground transition-transform group-open:rotate-180">
          <ChevronDown className="h-5 w-5" />
        </span>
      </summary>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a}</p>
    </details>
  )
}

export default function PrecosPage() {
  return (
    <main className="theme-noir min-h-screen bg-background text-foreground antialiased">
      <Schema data={faqSchema} />

      {/* Nav */}
      <header className="sticky top-0 z-50">
        <div className="glass-noir border-b border-noir-line">
          <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
            <Link href="/medico"><Logo size="md" variant="light" /></Link>
            <nav className="hidden items-center gap-1 md:flex">
              {[
                { href: "/medico#como-funciona", label: "Como funciona" },
                { href: "/medico#recursos", label: "Recursos" },
                { href: "/precos", label: "Preços" },
                { href: "/sobre", label: "Sobre" },
              ].map((i) => (
                <Link key={i.href} href={i.href} className="rounded-lg px-4 py-2 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:bg-noir-surface-raised/60 hover:text-foreground">
                  {i.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground" asChild>
                <Link href="/login">Entrar</Link>
              </Button>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pb-16 pt-20">
        <AuroraBackdrop shader intensity={0.6} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
        <div className="container relative mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <Eyebrow className="mb-4">Sem letras miúdas</Eyebrow>
            <h1 className="font-serif text-5xl font-medium leading-[1.02] tracking-tight">
              Preços transparentes,{" "}
              <span className="italic text-accent [text-shadow:0_0_40px_var(--noir-glow-coral)]">sem surpresas</span>.
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
              O Solo Pro é mensal, sem fidelidade. Os planos Consultoria
              personalizam o programa à sua prática ou clínica.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Planos */}
      <section className="container mx-auto max-w-6xl px-6 pb-20">
        <RevealGroup className="grid gap-6 md:grid-cols-3">
          {planos.map((p) => (
            <RevealItem key={p.nome}>
              <div className={`relative flex h-full flex-col rounded-3xl border p-7 ${p.cor}`}>
                {p.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1 text-xs font-semibold text-primary-foreground">
                      <Star className="h-3 w-3" /> {p.badge}
                    </span>
                  </div>
                )}
                <Eyebrow className="mb-3">{p.nome}</Eyebrow>
                <div className="mb-1">
                  <span className="text-4xl font-bold text-foreground">{p.preco}</span>
                  <span className="ml-2 text-sm text-muted-foreground">{p.sub}</span>
                </div>
                {p.nota && (
                  <p className="mb-3 text-xs font-medium text-accent">{p.nota}</p>
                )}
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                <Button
                  variant={p.destaque ? "coral" : "glass"}
                  className="mb-7 w-full gap-1.5"
                  asChild
                >
                  <Link href={p.href}>
                    {p.cta} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <ul className="flex-1 space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/90">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Enterprise row */}
        <Reveal delay={0.2}>
          <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-noir-line bg-noir-surface px-8 py-5 sm:flex-row">
            <div className="flex items-center gap-4">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent/15 text-accent">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Redes e hospitais</p>
                <p className="text-sm text-muted-foreground">Operações maiores, integrações sob medida e contrato em volume.</p>
              </div>
            </div>
            <Button variant="glass" className="shrink-0 gap-1.5" asChild>
              <Link href="/sobre#contato">Falar com a equipe <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </Reveal>
      </section>

      {/* Trust bar */}
      <Reveal>
        <div className="border-y border-noir-line bg-noir-surface py-8">
          <div className="container mx-auto max-w-4xl px-6">
            <div className="grid gap-5 text-center sm:grid-cols-4">
              {[
                { icon: ShieldCheck, label: "LGPD", sub: "Dados de saúde mental protegidos" },
                { icon: Lock, label: "AWS Brasil", sub: "Dados armazenados no Brasil (sa-east-1)" },
                { icon: Zap, label: "Contrato claro", sub: "Solo Pro mensal · Consultoria mín. 3 meses" },
                { icon: Brain, label: "Protocolo fixo", sub: "Crise com texto pré-aprovado, nunca gerado por IA" },
              ].map((t) => (
                <div key={t.label} className="flex flex-col items-center gap-2">
                  <t.icon className="h-5 w-5 text-primary" />
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-foreground">{t.label}</p>
                  <p className="text-xs leading-snug text-muted-foreground">{t.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* FAQ */}
      <section className="container mx-auto max-w-2xl px-6 py-20">
        <Reveal className="mb-12 text-center">
          <Eyebrow className="mb-4">Perguntas frequentes</Eyebrow>
          <h2 className="font-serif text-4xl font-medium leading-tight">
            Tira dúvidas
          </h2>
        </Reveal>
        <div>
          {faqs.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-24 text-center">
        <AuroraBackdrop grid />
        <div className="container relative mx-auto max-w-xl px-6">
          <Reveal>
            <h2 className="font-serif text-4xl font-medium leading-tight text-balance">
              Pronto para começar?
            </h2>
            <p className="mx-auto mt-3 text-muted-foreground">Solo Pro mensal, sem fidelidade. Consultoria com mínimo de 3 meses.</p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Button variant="coral" size="lg" className="gap-2 px-8 py-6 text-base" asChild>
                <Link href="/medicos/cadastro">Criar conta <ArrowRight className="h-5 w-5" /></Link>
              </Button>
              <Button variant="glass" size="lg" className="px-8 py-6 text-base" asChild>
                <Link href="/login">Já tenho conta</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <FooterSection />
    </main>
  )
}
