"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, Calendar, MessageSquare, Heart } from "lucide-react"

const stats = [
  {
    title: "Total de Pacientes",
    value: "248",
    change: "+12%",
    changeType: "positive" as const,
    icon: Users,
    iconBg: "bg-primary/8",
  },
  {
    title: "Consultas Hoje",
    value: "8",
    subtitle: "3 confirmadas",
    icon: Calendar,
    iconBg: "bg-coral/8",
  },
  {
    title: "Mensagens Pendentes",
    value: "5",
    change: "2 urgentes",
    changeType: "warning" as const,
    icon: MessageSquare,
    iconBg: "bg-warning/8",
  },
  {
    title: "Check-ins Recebidos",
    value: "23",
    change: "+18%",
    changeType: "positive" as const,
    icon: Heart,
    iconBg: "bg-success/8",
  },
]

const delayClass = ["delay-100", "delay-200", "delay-300", "delay-400"]

export function StatsCards() {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <div
          key={stat.title}
          className={`animate-fade-up ${delayClass[i]}`}
        >
          <Card className="h-full border-border/60 hover:border-primary/25 hover:shadow-[0_8px_32px_rgba(94,75,139,0.08)] hover:-translate-y-1 transition-all duration-300 group bg-gradient-to-br from-card to-transparent">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-5">
                <p className="text-sm font-medium text-muted-foreground/80 leading-tight">
                  {stat.title}
                </p>
                <div className={`h-10 w-10 rounded-xl ${stat.iconBg} flex items-center justify-center flex-shrink-0 ml-2 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-[18px] w-[18px] text-primary" />
                </div>
              </div>
              <p className="text-[2rem] font-bold text-navy leading-none mb-2 tracking-tight">
                {stat.value}
              </p>
              {stat.change && (
                <p
                  className={`text-xs font-semibold ${
                    stat.changeType === "positive"
                      ? "text-success"
                      : stat.changeType === "warning"
                      ? "text-warning"
                      : "text-muted-foreground"
                  }`}
                >
                  {stat.changeType === "positive" && "↑ "}
                  {stat.change}
                  {stat.changeType === "positive" && " desde o mês passado"}
                </p>
              )}
              {stat.subtitle && (
                <p className="text-xs text-muted-foreground/70 font-medium">{stat.subtitle}</p>
              )}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}
