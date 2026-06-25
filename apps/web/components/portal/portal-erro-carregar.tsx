"use client"

import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PortalErroCarregar({
  mensagem = "Não foi possível carregar. Verifique sua conexão.",
  onRetry,
}: {
  mensagem?: string
  onRetry: () => void
}) {
  return (
    <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center space-y-3">
      <p className="text-sm text-foreground">{mensagem}</p>
      <Button variant="outline" size="sm" className="gap-2" onClick={onRetry}>
        <RefreshCw className="h-4 w-4" /> Tentar de novo
      </Button>
    </div>
  )
}
