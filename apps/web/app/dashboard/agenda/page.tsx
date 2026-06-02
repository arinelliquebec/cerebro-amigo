"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Clock, Video, MapPin, FileText, Loader2, CheckCircle2 } from "lucide-react"
import { NovaConsultaDialog } from "@/components/agenda/nova-consulta-dialog"

interface Consulta {
  id: string
  pacienteId: string
  pacienteNome: string | null
  iniciaEm: string
  modalidade: string
  status: string
}

function ymd(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const dia = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${dia}`
}
function hora(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
}
function iniciais(nome: string | null) {
  if (!nome) return "?"
  const p = nome.trim().split(/\s+/)
  return ((p[0]?.[0] ?? "") + (p.length > 1 ? p[p.length - 1][0] : "")).toUpperCase() || "?"
}

const STATUS: Record<string, { rotulo: string; cls: string }> = {
  agendada: { rotulo: "Agendada", cls: "bg-muted text-muted-foreground" },
  confirmada: { rotulo: "Confirmada", cls: "bg-success/10 text-success" },
  realizada: { rotulo: "Realizada", cls: "bg-primary/10 text-primary" },
  cancelada: { rotulo: "Cancelada", cls: "bg-destructive/10 text-destructive" },
}

export default function AgendaPage() {
  const [dia, setDia] = useState<Date>(() => new Date())
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [loading, setLoading] = useState(true)
  const [acao, setAcao] = useState<string | null>(null)

  const carregar = useCallback(async (d: Date) => {
    setLoading(true)
    const dataStr = ymd(d)
    try {
      const r = await fetch(`/api/consultas?de=${dataStr}&ate=${dataStr}`)
      const rows = r.ok ? await r.json() : []
      setConsultas(Array.isArray(rows) ? rows : [])
    } catch {
      setConsultas([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    carregar(dia)
  }, [dia, carregar])

  function navega(delta: number) {
    setDia((d) => {
      const n = new Date(d)
      n.setDate(n.getDate() + delta)
      return n
    })
  }

  async function mudarStatus(id: string, status: string) {
    setAcao(id)
    try {
      const r = await fetch(`/api/consultas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (r.ok) setConsultas((cs) => cs.map((c) => (c.id === id ? { ...c, status } : c)))
    } finally {
      setAcao(null)
    }
  }

  const ehHoje = ymd(dia) === ymd(new Date())
  const ordenadas = [...consultas].sort((a, b) => a.iniciaEm.localeCompare(b.iniciaEm))

  return (
    <div className="min-h-screen">
      <Header title="Agenda" />

      <div className="p-8 space-y-6">
        {/* Controles de dia */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navega(-1)} aria-label="Dia anterior">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-[220px] text-center">
              <p className="text-lg font-semibold text-foreground capitalize">
                {dia.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
              </p>
              {ehHoje && <p className="text-xs text-primary">Hoje</p>}
            </div>
            <Button variant="outline" size="icon" onClick={() => navega(1)} aria-label="Próximo dia">
              <ChevronRight className="h-4 w-4" />
            </Button>
            {!ehHoje && (
              <Button variant="ghost" size="sm" className="text-primary" onClick={() => setDia(new Date())}>
                Hoje
              </Button>
            )}
          </div>

          <NovaConsultaDialog diaInicial={ymd(dia)} onCriada={() => carregar(dia)} />
        </div>

        {/* Lista */}
        {loading ? (
          <div className="flex justify-center py-16 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : ordenadas.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              Nenhuma consulta neste dia.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {ordenadas.map((c) => {
              const st = STATUS[c.status] ?? STATUS.agendada
              const cancelada = c.status === "cancelada"
              return (
                <Card key={c.id} className={`border-border/60 ${cancelada ? "opacity-60" : ""}`}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex w-16 shrink-0 flex-col items-center">
                      <Clock className="mb-1 h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold text-foreground">{hora(c.iniciaEm)}</span>
                    </div>

                    <Avatar className="h-11 w-11 border-2 border-primary/15">
                      <AvatarFallback className="bg-secondary text-sm font-semibold text-primary">
                        {iniciais(c.pacienteNome)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{c.pacienteNome ?? "Paciente"}</p>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 capitalize">
                          {c.modalidade === "teleconsulta" ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                          {c.modalidade}
                        </span>
                        <Badge className={`border-0 text-[10px] ${st.cls}`}>{st.rotulo}</Badge>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      {!cancelada && c.status === "agendada" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 text-xs text-success"
                          disabled={acao === c.id}
                          onClick={() => mudarStatus(c.id, "confirmada")}
                        >
                          {acao === c.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                          Confirmar
                        </Button>
                      )}
                      <Button variant="outline" size="sm" asChild className="gap-1 text-xs">
                        <Link href={`/dashboard/consultas/${c.id}/briefing`}>
                          <FileText className="h-3.5 w-3.5" /> Briefing
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
