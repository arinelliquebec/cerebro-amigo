"use client"

import { use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  Pill,
  ShieldCheck,
  MessageSquare,
  Clock,
  Zap,
} from "lucide-react"

// Mock data — substituir por fetch real quando agente estiver integrado
interface BriefingData {
  paciente: { nome: string; iniciais: string; ultimaConsulta: string | null }
  humor: { atual: number; anterior: number; historico: number[] } | null
  adesao: { percentual: number; medicamento: string; diasPerdidos: string[] } | null
  crises: { quantidade: number } | null
  topicos: string[]
  sintese: string | null
  geradoEm: string | null
  horaConsulta: string
  tipoConsulta: string
}

const mockBriefings: Record<string, BriefingData> = {
  "1": {
    paciente: { nome: "Fernanda Lima", iniciais: "FL", ultimaConsulta: null },
    humor: null,
    adesao: null,
    crises: null,
    topicos: [],
    sintese: null,
    geradoEm: null,
    horaConsulta: "08:00",
    tipoConsulta: "Primeira Consulta",
  },
  "2": {
    paciente: { nome: "Maria Santos", iniciais: "MS", ultimaConsulta: "18/05/2026" },
    humor: { atual: 7, anterior: 3, historico: [3, 3, 4, 5, 6, 6, 7] },
    adesao: { percentual: 95, medicamento: "Sertralina 50mg", diasPerdidos: ["qua"] },
    crises: { quantidade: 0 },
    topicos: ["Redução de dose da Sertralina", "Insônia nos últimos 3 dias"],
    sintese:
      "Maria teve melhora consistente de humor esta semana, subindo de 3 para 7 em 7 dias. Adesão excelente (95%), apenas uma dose perdida na quarta-feira. Sem crises registradas desde a última consulta. Principal preocupação relatada: insônia recorrente e interesse em redução gradual de dose.",
    geradoEm: "08:47",
    horaConsulta: "09:00",
    tipoConsulta: "Retorno",
  },
  "3": {
    paciente: { nome: "João Silva", iniciais: "JS", ultimaConsulta: "05/05/2026" },
    humor: { atual: 4, anterior: 6, historico: [6, 5, 5, 4, 4, 3, 4] },
    adesao: { percentual: 68, medicamento: "Escitalopram 10mg", diasPerdidos: ["seg", "qua", "sex"] },
    crises: { quantidade: 1 },
    topicos: ["Estresse no trabalho", "Dificuldade para sair de casa"],
    sintese:
      "João apresentou queda de humor (6 → 4) com adesão abaixo do esperado na semana. Registrou 1 crise leve na última terça-feira. Relata piora dos sintomas ansiosos ligados a conflito no trabalho. Atenção redobrada recomendada — avaliar ajuste de dose e suporte psicossocial.",
    geradoEm: "10:15",
    horaConsulta: "10:30",
    tipoConsulta: "Retorno",
  },
}

function Sparkline({ values }: { values: number[] }) {
  const min = 1
  const max = 10
  const w = 200
  const h = 48
  const pad = 4

  const points = values
    .map((v, i) => {
      const x = pad + (i / (values.length - 1)) * (w - pad * 2)
      const y = h - pad - ((v - min) / (max - min)) * (h - pad * 2)
      return `${x},${y}`
    })
    .join(" ")

  const last = values[values.length - 1]
  const lastX = w - pad
  const lastY = h - pad - ((last - min) / (max - min)) * (h - pad * 2)

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-12">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        className="text-primary"
      />
      <circle cx={lastX} cy={lastY} r="3" className="fill-primary" />
      {values.map((v, i) => {
        const x = pad + (i / (values.length - 1)) * (w - pad * 2)
        const y = h - pad - ((v - min) / (max - min)) * (h - pad * 2)
        return (
          <circle key={i} cx={x} cy={y} r="2" className="fill-primary opacity-40" />
        )
      })}
    </svg>
  )
}

function HumorBadge({ valor }: { valor: number }) {
  if (valor >= 7) return <span className="text-xs font-medium text-success">Bom</span>
  if (valor >= 4) return <span className="text-xs font-medium text-warning">Moderado</span>
  return <span className="text-xs font-medium text-destructive">Baixo</span>
}

export default function BriefingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const briefing = mockBriefings[id] ?? mockBriefings["2"]
  const { paciente, humor, adesao, crises, topicos, sintese, geradoEm, horaConsulta, tipoConsulta } = briefing
  const isPrimeira = tipoConsulta === "Primeira Consulta"

  const humorDelta = humor ? humor.atual - humor.anterior : 0
  const TrendIcon = humorDelta > 0 ? TrendingUp : humorDelta < 0 ? TrendingDown : Minus
  const trendColor = humorDelta > 0 ? "text-success" : humorDelta < 0 ? "text-destructive" : "text-muted-foreground"

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border/50 px-6 py-3 flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild className="gap-2 text-muted-foreground">
          <Link href="/dashboard/agenda">
            <ArrowLeft className="h-4 w-4" />
            Agenda
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-primary">Consulta: {horaConsulta}</span>
          <Badge className="bg-primary/10 text-primary border-0 text-xs">
            {tipoConsulta}
          </Badge>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Patient header */}
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/20">
            <AvatarFallback className="bg-secondary text-primary text-xl font-semibold">
              {paciente.iniciais}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-navy">{paciente.nome}</h1>
            {paciente.ultimaConsulta ? (
              <p className="text-sm text-muted-foreground">
                Última consulta: {paciente.ultimaConsulta}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">Primeira consulta</p>
            )}
          </div>
          {geradoEm && (
            <div className="ml-auto text-right">
              <p className="text-xs text-muted-foreground">Briefing gerado às</p>
              <p className="text-sm font-semibold text-navy">{geradoEm}</p>
            </div>
          )}
        </div>

        {isPrimeira ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center">
            <p className="text-muted-foreground text-sm">
              Primeira consulta — sem histórico anterior para análise.
            </p>
          </div>
        ) : (
          <>
            {/* Metric cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Humor */}
              <div className="rounded-2xl border border-border/50 bg-card p-4 space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Humor</p>
                <div className="flex items-end gap-1.5">
                  <span className="text-3xl font-bold text-navy">{humor?.atual ?? "—"}</span>
                  <span className="text-sm text-muted-foreground mb-0.5">/10</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendIcon className={`h-3.5 w-3.5 ${trendColor}`} />
                  <span className={`text-xs font-medium ${trendColor}`}>
                    {humorDelta > 0 ? `+${humorDelta}` : humorDelta} vs. última
                  </span>
                </div>
                {humor && <HumorBadge valor={humor.atual} />}
              </div>

              {/* Adesão */}
              <div className="rounded-2xl border border-border/50 bg-card p-4 space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Adesão</p>
                <div className="flex items-end gap-1">
                  <span className={`text-3xl font-bold ${
                    (adesao?.percentual ?? 0) >= 80 ? "text-success" : "text-warning"
                  }`}>
                    {adesao?.percentual ?? "—"}
                    {adesao && <span className="text-lg">%</span>}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-snug">
                  {adesao?.medicamento}
                </p>
                {adesao && adesao.diasPerdidos.length > 0 && (
                  <p className="text-xs text-warning">
                    Perdeu: {adesao.diasPerdidos.join(", ")}
                  </p>
                )}
              </div>

              {/* Crises */}
              <div className="rounded-2xl border border-border/50 bg-card p-4 space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Crises</p>
                <span className={`text-3xl font-bold ${
                  (crises?.quantidade ?? 0) === 0 ? "text-success" : "text-destructive"
                }`}>
                  {crises?.quantidade ?? "—"}
                </span>
                <p className="text-xs text-muted-foreground">desde última consulta</p>
                {crises?.quantidade === 0 && (
                  <span className="text-xs font-medium text-success flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> Sem ocorrências
                  </span>
                )}
              </div>

              {/* Tópicos */}
              <div className="rounded-2xl border border-border/50 bg-card p-4 space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Tópicos</p>
                <span className="text-3xl font-bold text-navy">{topicos.length}</span>
                <p className="text-xs text-muted-foreground">assuntos para discutir</p>
                {topicos.length > 0 && (
                  <span className="text-xs text-primary flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" /> ver abaixo
                  </span>
                )}
              </div>
            </div>

            {/* Sparkline */}
            {humor && (
              <div className="rounded-2xl border border-border/50 bg-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-navy">Evolução do humor — últimos 7 dias</p>
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((d, i) => (
                      <span key={i}>{d}</span>
                    ))}
                  </div>
                </div>
                <Sparkline values={humor.historico} />
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>{humor.anterior} (início)</span>
                  <span>{humor.atual} (hoje)</span>
                </div>
              </div>
            )}

            {/* Tópicos do paciente */}
            {topicos.length > 0 && (
              <div className="rounded-2xl border border-border/50 bg-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold text-navy">O que a paciente quer discutir</p>
                </div>
                <ul className="space-y-2">
                  {topicos.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Síntese IA */}
            {sintese && (
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold text-primary">Síntese do período</p>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{sintese}</p>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            {geradoEm ? `Gerado às ${geradoEm} por Cérebro Amigo` : "Sem dados de histórico"}
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/agenda">Voltar à agenda</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
