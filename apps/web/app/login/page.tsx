import { Suspense } from "react"
import Link from "next/link"
import { BrandWordmark } from "@/components/brand-wordmark"
import { Logo } from "@/components/logo"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LoginForm } from "@/components/login-form"

export const metadata = {
  title: "Entrar — Cérebro Amigo",
  description: "Acesse sua conta do Cérebro Amigo",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_70%_50%,rgba(148,134,201,0.08),transparent)]" />
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-10">
            <Logo showText={false} size="lg" variant="light" />
          </div>
          <h1 className="mb-5">
            <BrandWordmark size="auth" variant="light" />
          </h1>
          <p className="text-lg text-white/70 mb-10 leading-relaxed max-w-md">
            O CRM que trabalha entre consultas. Cuide dos seus pacientes com mais eficiência e acolhimento.
          </p>
          <div className="space-y-4">
            {["Prontuário eletrônico completo", "Comunicação segura com pacientes", "Conformidade com a LGPD"].map((txt) => (
              <div key={txt} className="flex items-center gap-3.5">
                <div className="h-9 w-9 rounded-lg bg-primary/15 border border-primary/10 flex items-center justify-center shrink-0">
                  <svg className="h-4 w-4 text-accent-on-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-white/70 text-sm font-medium">{txt}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute top-32 -right-16 w-48 h-48 bg-coral/6 rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo size="lg" />
          </div>
          <Card className="border-border/40 shadow-xl shadow-navy/5">
            <CardHeader className="text-center pb-5 pt-7">
              <CardTitle className="text-2xl font-semibold text-navy tracking-tight">
                Bem-vindo de volta
              </CardTitle>
              <CardDescription className="text-muted-foreground/80 mt-1">
                Entre com suas credenciais para acessar o sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 px-7 pb-7">
              <Suspense fallback={null}>
                <LoginForm />
              </Suspense>
            </CardContent>
          </Card>
          <p className="text-center text-xs text-muted-foreground/60 mt-6">
            Ao entrar, você concorda com nossos{" "}
            <Link href="/terms" className="text-primary hover:underline font-medium">Termos de Uso</Link>{" "}
            e{" "}
            <Link href="/privacy" className="text-primary hover:underline font-medium">Política de Privacidade</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
