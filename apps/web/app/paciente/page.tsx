import Link from "next/link"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { NeuralField } from "@/components/landing/neural-field"
import { AuroraBackdrop } from "@/components/landing/aurora-backdrop"
import { Eyebrow } from "@/components/landing/eyebrow"
import { Reveal, RevealGroup, RevealItem } from "@/components/landing/reveal"
import { InstallPWA } from "@/components/portal/install-pwa"
import {
  Mic,
  MessageCircle,
  Pill,
  Smile,
  CalendarClock,
  Lock,
  ArrowRight,
  HeartHandshake,
  LifeBuoy,
} from "lucide-react"

export const metadata = {
  title: "Cérebro Amigo — Seu acompanhamento entre as consultas",
  description:
    "O portal do paciente do Cérebro Amigo: registre seu humor e diário por voz, converse quando precisar e não esqueça a medicação. Sua psiquiatra acompanha o que importa.",
}

const recursos = [
  { icon: Mic, titulo: "Diário por voz", desc: "Conte como foi seu dia falando. A IA organiza em humor e temas — sem digitar nada." },
  { icon: MessageCircle, titulo: "Converse quando precisar", desc: "Desabafe a qualquer hora. Se houver sinal de risco, sua psiquiatra é avisada na hora." },
  { icon: Pill, titulo: "Lembretes de medicação", desc: "Um toque pra confirmar. Nunca mais perca a hora do remédio." },
  { icon: Smile, titulo: "Check-in de humor", desc: "Registre como você está em segundos. Vira parte da sua evolução." },
  { icon: CalendarClock, titulo: "Próxima consulta à vista", desc: "Saiba quando é e chegue preparado pro que vocês vão conversar." },
  { icon: Lock, titulo: "Privacidade", desc: "Seus dados de saúde protegidos — só você e sua psiquiatra têm acesso." },
]

export default function PacienteLandingPage() {
  return (
    <div className="theme-noir min-h-screen bg-background text-foreground antialiased">
      {/* Nav */}
      <header className="sticky top-0 z-50">
        <div className="glass-noir border-b border-noir-line">
          <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-5">
            <Logo size="md" variant="light" />
            <Button variant="coral" size="sm" className="gap-1.5" asChild>
              <Link href="/p/entrar">
                Entrar <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-5 pt-16 pb-20">
        <AuroraBackdrop />
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <NeuralField />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

        <div className="relative mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="mb-6 inline-flex items-center gap-2 rounded-full glass-noir border border-noir-line px-4 py-2">
              <Eyebrow icon={HeartHandshake}>Seu portal · Cérebro Amigo</Eyebrow>
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="font-serif text-4xl sm:text-5xl font-medium leading-[1.02] tracking-tight text-balance">
              Cuidar de você não termina{" "}
              <span className="italic text-accent [text-shadow:0_0_40px_var(--noir-glow-coral)]">na consulta</span>.
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
              Registre como está, converse quando precisar e não esqueça a medicação — e sua
              psiquiatra acompanha tudo que importa, entre uma consulta e outra.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button variant="coral" size="lg" className="w-full sm:w-auto gap-2 px-8 py-6 text-base" asChild>
                <Link href="/p/entrar">
                  Entrar no meu portal <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <InstallPWA className="w-full sm:w-auto justify-center py-6" />
            </div>
          </Reveal>
          <Reveal delay={0.24}>
            <p className="mt-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <LifeBuoy className="h-3.5 w-3.5 text-accent" />
              Em crise, você não está sozinho · CVV 188 · SAMU 192
            </p>
          </Reveal>
        </div>
      </section>

      {/* Recursos */}
      <section className="px-5 py-16">
        <div className="mx-auto max-w-2xl">
          <Reveal className="mb-10 text-center">
            <Eyebrow className="mb-3">O que você tem aqui</Eyebrow>
            <h2 className="font-serif text-3xl font-medium leading-tight text-balance">
              Feito pra te acompanhar no dia a dia
            </h2>
          </Reveal>
          <RevealGroup className="grid gap-4 sm:grid-cols-2">
            {recursos.map((r) => (
              <RevealItem
                key={r.titulo}
                className="glass-noir rounded-2xl border border-noir-line p-5 transition-all hover:glow-purple-lg"
              >
                <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-noir-surface-raised border border-noir-line text-primary">
                  <r.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-foreground">{r.titulo}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{r.desc}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Reassurance / crise */}
      <section className="relative overflow-hidden border-y border-noir-line bg-noir-bg px-5 py-16">
        <AuroraBackdrop grid />
        <div className="relative mx-auto max-w-2xl text-center">
          <Reveal>
            <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-accent/15 text-accent">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h2 className="font-serif text-2xl font-medium text-balance">
              Sua psiquiatra está no comando
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              A IA organiza e lembra — ela nunca te dá diagnóstico nem ajusta dose. Quem decide é
              sempre sua psiquiatra. Em sinal de risco, ela é avisada imediatamente com um protocolo
              fixo e seguro.
            </p>
            <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-2xl glass-noir border border-noir-line px-5 py-3 text-sm">
              <span className="flex items-center gap-1.5 text-foreground">
                <LifeBuoy className="h-4 w-4 text-accent" /> Precisa de ajuda agora?
              </span>
              <span className="font-mono text-foreground">CVV 188</span>
              <span className="text-muted-foreground">·</span>
              <span className="font-mono text-foreground">SAMU 192</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA final */}
      <section className="px-5 py-20 text-center">
        <Reveal className="mx-auto max-w-md">
          <h2 className="font-serif text-3xl font-medium leading-tight text-balance">
            Recebeu um convite da sua psiquiatra?
          </h2>
          <p className="mt-3 text-muted-foreground">Crie sua senha e comece agora.</p>
          <Button variant="coral" size="lg" className="mt-7 gap-2 px-8 py-6 text-base" asChild>
            <Link href="/p/entrar">
              Entrar no meu portal <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-noir-line bg-noir-surface px-5 py-10">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <Logo size="sm" variant="light" />
          <div className="flex items-center gap-5 text-sm">
            <Link href="/privacy" className="text-noir-text-dim hover:text-foreground transition-colors">Privacidade</Link>
            <Link href="/terms" className="text-noir-text-dim hover:text-foreground transition-colors">Termos</Link>
            <Link href="/login" className="text-noir-text-dim hover:text-foreground transition-colors">Sou médico</Link>
          </div>
          <p className="text-xs text-noir-text-dim/60">© 2026 Cérebro Amigo</p>
        </div>
      </footer>
    </div>
  )
}
