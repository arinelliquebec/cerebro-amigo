"use client"

import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns"

interface Consulta {
  id: string
  iniciaEm: string
  status: string
}

const CAB = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]

export function MesView({
  consultas,
  mesAnchor,
  onDiaClick,
}: {
  consultas: Consulta[]
  mesAnchor: Date
  onDiaClick: (d: Date) => void
}) {
  const inicio = startOfWeek(startOfMonth(mesAnchor), { weekStartsOn: 1 })
  const fim = endOfWeek(endOfMonth(mesAnchor), { weekStartsOn: 1 })
  const dias = eachDayOfInterval({ start: inicio, end: fim })

  function contar(d: Date) {
    return consultas.filter((c) => c.status !== "cancelada" && isSameDay(new Date(c.iniciaEm), d)).length
  }

  return (
    <div>
      <div className="mb-1 grid grid-cols-7 gap-1">
        {CAB.map((c) => (
          <div key={c} className="text-center text-[11px] font-medium text-muted-foreground">
            {c}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {dias.map((d) => {
          const n = contar(d)
          const noMes = isSameMonth(d, mesAnchor)
          const hoje = isSameDay(d, new Date())
          return (
            <button
              key={d.toISOString()}
              onClick={() => onDiaClick(d)}
              className={`flex aspect-square flex-col rounded-md border p-1 text-left transition-colors hover:bg-secondary ${
                noMes ? "border-border/60" : "border-transparent opacity-40"
              } ${hoje ? "ring-1 ring-primary" : ""}`}
            >
              <span className={`text-xs ${hoje ? "font-semibold text-primary" : "text-foreground"}`}>
                {format(d, "d")}
              </span>
              {n > 0 && (
                <span className="mt-auto inline-flex w-fit rounded-full bg-primary/15 px-1.5 text-[10px] font-medium text-primary">
                  {n}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
