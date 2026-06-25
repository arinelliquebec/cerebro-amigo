import { Suspense } from "react"
import { headers } from "next/headers"
import Link from "next/link"
import { BookText, Heart, Pill, MessageCircle, CalendarClock } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { PortalOnboarding } from "@/components/portal/portal-onboarding"

/**
 * Shell do portal do paciente. A AUTENTICAÇÃO é do middleware (proxy.ts):
 * /p/* exige `paciente_token`, exceto /p/entrar. Aqui só decidimos o chrome:
 * /p/entrar renderiza sem a bottom-nav. O pathname vem do header `x-pathname`.
 *
 * O acesso dinâmico (`headers()`) + o conteúdo das páginas ficam DENTRO do
 * <Suspense> — exigência do PPR (cacheComponents) para acesso a dados
 * não-cacheados (cookies/headers).
 */
export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="theme-noir">
      <Suspense fallback={<PortalFallback withNav />}>
        <PortalShell>{children}</PortalShell>
      </Suspense>
    </div>
  )
}

async function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get("x-pathname") ?? ""
  const semChrome =
    pathname.startsWith("/p/entrar") ||
    pathname.startsWith("/p/trocar-senha") ||
    pathname.startsWith("/p/consulta/")

  if (semChrome) return <>{children}</>

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      <main className="flex-1 pb-24">{children}</main>
      <PortalOnboarding />

      <nav
        className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-border/80 bg-background/95 backdrop-blur-md"
        aria-label="Navegação principal"
      >
        <div className="flex items-end justify-around px-1 pb-2 pt-1">
          <NavItem href="/p" label="Início" active={pathname === "/p"}>
            <Heart className="h-5 w-5" />
          </NavItem>
          <NavItem href="/p/agenda" label="Agenda" active={pathname.startsWith("/p/agenda")}>
            <CalendarClock className="h-5 w-5" />
          </NavItem>
          <NavConversa active={pathname.startsWith("/p/conversa")} />
          <NavItem href="/p/diario" label="Diário" active={pathname.startsWith("/p/diario")}>
            <BookText className="h-5 w-5" />
          </NavItem>
          <NavItem href="/p/medicacoes" label="Meds" active={pathname.startsWith("/p/medicacoes")}>
            <Pill className="h-5 w-5" />
          </NavItem>
        </div>
      </nav>
    </div>
  )
}

function NavItem({
  href,
  label,
  active,
  children,
}: {
  href: string
  label: string
  active?: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={`flex min-w-[3.25rem] flex-col items-center gap-0.5 px-2 py-1 transition-colors ${
        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
      <span className="text-[10px] leading-none">{label}</span>
    </Link>
  )
}

/** Tab central elevada — coração do produto entre consultas (Tier 3). */
function NavConversa({ active }: { active: boolean }) {
  return (
    <Link
      href="/p/conversa"
      className="-mt-5 flex min-w-[4rem] flex-col items-center gap-1 px-1"
      aria-current={active ? "page" : undefined}
    >
      <span
        className={`grid h-[3.25rem] w-[3.25rem] place-items-center rounded-full shadow-[0_0_28px_-6px_var(--noir-glow-purple)] ring-[3px] ring-background transition-transform active:scale-95 ${
          active
            ? "bg-primary text-primary-foreground"
            : "bg-primary/90 text-primary-foreground hover:bg-primary"
        }`}
      >
        <MessageCircle className="h-6 w-6" />
      </span>
      <span className={`text-[10px] font-medium leading-none ${active ? "text-primary" : "text-muted-foreground"}`}>
        Conversa
      </span>
    </Link>
  )
}

function PortalFallback({ withNav }: { withNav?: boolean }) {
  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      <div className="flex-1 p-4 pt-8 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>
      {withNav && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md border-t bg-background/95 py-2" />
      )}
    </div>
  )
}
