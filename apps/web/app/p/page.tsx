import Link from "next/link"
import { redirect } from "next/navigation"
import { BookText, CalendarClock, LogOut, MessageCircle, User } from "lucide-react"
import { gatewayPaciente, GatewayPacienteError } from "@/lib/gateway-paciente"
import { Button } from "@/components/ui/button"
import { AudioRecorder } from "@/components/portal/audio-recorder"
import { FaixaDoDia } from "@/components/portal/faixa-do-dia"
import { InstallPwaBanner } from "@/components/portal/install-pwa-banner"
import { MedsHoje, type TomadaHoje } from "@/components/portal/meds-hoje"
import { sairPaciente } from "./entrar/actions"

interface HomeData {
  perfil: { nome: string; nomeMedico: string }
  tomadasHoje: TomadaHoje[]
  proxConsulta: { iniciaEm: string; modalidade: string; status: string } | null
  ultimoHumor: number | null
  jaRegistrouHumorHoje: boolean
  checkinsPendentes: number
}

function horaCurta(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
}

export default async function PortalHome() {
  let data: HomeData
  try {
    data = await gatewayPaciente.get<HomeData>("/api/v1/portal/paciente/home")
  } catch (err) {
    if (err instanceof GatewayPacienteError && (err.status === 401 || err.status === 403)) {
      redirect("/p/entrar")
    }
    throw err
  }

  const primeiroNome = data.perfil.nome?.split(" ")[0] || "Olá"
  const consultaNaFaixa =
    data.checkinsPendentes === 0 &&
    !data.tomadasHoje.some((t) => t.status === "pendente") &&
    data.jaRegistrouHumorHoje &&
    data.proxConsulta != null

  return (
    <div className="p-4 pt-8 space-y-5">
      <div className="portal-rise-in flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Olá, {primeiroNome}</h1>
          {data.perfil.nomeMedico && (
            <p className="mt-0.5 text-sm text-muted-foreground">
              Acompanhamento com {data.perfil.nomeMedico}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="text-muted-foreground" asChild aria-label="Perfil">
            <Link href="/p/perfil">
              <User className="h-5 w-5" />
            </Link>
          </Button>
          <form action={sairPaciente}>
            <Button variant="ghost" size="icon" className="text-muted-foreground" type="submit" aria-label="Sair">
              <LogOut className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>

      <FaixaDoDia
        checkinsPendentes={data.checkinsPendentes ?? 0}
        jaRegistrouHumorHoje={data.jaRegistrouHumorHoje}
        ultimoHumor={data.ultimoHumor}
        tomadasHoje={data.tomadasHoje}
        proxConsulta={data.proxConsulta}
      />

      <div className="portal-rise-in portal-stagger-2">
        <InstallPwaBanner />
      </div>

      <div className="portal-rise-in portal-stagger-3">
        <MedsHoje tomadas={data.tomadasHoje} />
      </div>

      {data.proxConsulta && !consultaNaFaixa && (
        <section className="portal-rise-in portal-stagger-4 rounded-2xl border border-border/60 bg-card p-4">
          <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold text-foreground">
            <CalendarClock className="h-4 w-4 text-primary" /> Próxima consulta
          </h2>
          <p className="text-sm text-foreground">
            {new Date(data.proxConsulta.iniciaEm).toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}{" "}
            às {horaCurta(data.proxConsulta.iniciaEm)}
          </p>
          <p className="text-xs capitalize text-muted-foreground">{data.proxConsulta.modalidade}</p>
        </section>
      )}

      <div className="portal-rise-in portal-stagger-5 grid grid-cols-2 gap-2.5">
        <Link
          href="/p/conversa"
          className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-card p-3.5 transition-colors hover:border-primary/40 hover:bg-secondary/30"
        >
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15 text-primary">
            <MessageCircle className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Conversar</p>
            <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
              Desabafe com limites claros
            </p>
          </div>
        </Link>
        <Link
          href="/p/diario"
          className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-card p-3.5 transition-colors hover:border-primary/40 hover:bg-secondary/30"
        >
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-primary">
            <BookText className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Diário</p>
            <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">Texto ou voz, no seu ritmo</p>
          </div>
        </Link>
      </div>

      <div className="portal-rise-in portal-stagger-6">
        <AudioRecorder />
      </div>
    </div>
  )
}
