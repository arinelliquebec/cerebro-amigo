import Link from "next/link"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export async function NavHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40">
      <div className="glass-strong border-b border-white/20">
        <div className="container mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <Logo size="md" />
          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: "#como-funciona", label: "Como funciona" },
              { href: "#recursos", label: "Recursos" },
              { href: "#seguranca", label: "Segurança" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-navy transition-colors duration-200 rounded-lg hover:bg-secondary/60"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-navy/80 hover:text-navy hover:bg-secondary/60 font-medium"
              asChild
            >
              <Link href="/login">Entrar</Link>
            </Button>
            <Button
              className="bg-coral hover:bg-coral-dark text-white font-medium shadow-lg shadow-coral/20 hover:shadow-xl hover:shadow-coral/25 transition-all duration-300 hover:-translate-y-0.5"
              asChild
            >
              <Link href="/dashboard">
                Ver demonstração
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
