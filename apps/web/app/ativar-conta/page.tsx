"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/logo"
import { AlertTriangle, Eye, EyeOff, CheckCircle2 } from "lucide-react"

type Forca = "fraca" | "media" | "forte"

function calcForca(senha: string): Forca {
  if (senha.length < 8) return "fraca"
  let score = 0
  if (/[a-z]/.test(senha)) score++
  if (/[A-Z]/.test(senha)) score++
  if (/[0-9]/.test(senha)) score++
  if (/[^a-zA-Z0-9]/.test(senha)) score++
  if (senha.length >= 12 && score >= 3) return "forte"
  if (score >= 2) return "media"
  return "fraca"
}

const FORCA_CONFIG: Record<Forca, { label: string; cor: string; barras: number }> = {
  fraca: { label: "Fraca", cor: "bg-destructive", barras: 1 },
  media: { label: "Média", cor: "bg-warning", barras: 2 },
  forte: { label: "Forte", cor: "bg-success", barras: 3 },
}

function MedidorSenha({ senha }: { senha: string }) {
  if (!senha) return null
  const forca = calcForca(senha)
  const { label, cor, barras } = FORCA_CONFIG[forca]
  return (
    <div className="space-y-1.5">
      <div className="flex gap-1.5">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${n <= barras ? cor : "bg-muted/30"}`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${forca === "fraca" ? "text-destructive" : forca === "media" ? "text-warning" : "text-success"}`}>
        Senha {label.toLowerCase()}
      </p>
    </div>
  )
}

function AtivarContaForm() {
  const router = useRouter()
  const params = useSearchParams()
  const token = params.get("token") ?? ""

  const [senha, setSenha] = useState("")
  const [confirmar, setConfirmar] = useState("")
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [ok, setOk] = useState(false)

  if (!token) {
    return (
      <div className="flex flex-col items-center gap-3 text-center py-8">
        <AlertTriangle className="h-8 w-8 text-destructive" />
        <p className="font-medium text-foreground">Link inválido</p>
        <p className="text-sm text-muted-foreground">O link de ativação é inválido ou já foi usado.</p>
      </div>
    )
  }

  if (ok) {
    return (
      <div className="flex flex-col items-center gap-4 text-center py-8">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-success/15 border border-success/20">
          <CheckCircle2 className="h-7 w-7 text-success" />
        </span>
        <div>
          <p className="font-semibold text-foreground text-lg">Conta ativada!</p>
          <p className="text-sm text-muted-foreground mt-1">Sua senha foi criada com sucesso.</p>
        </div>
        <Button variant="coral" className="mt-2 w-full" onClick={() => router.push("/login")}>
          Ir para o login
        </Button>
      </div>
    )
  }

  async function submeter(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)
    if (senha.length < 8) return setErro("Senha deve ter ao menos 8 caracteres.")
    if (senha !== confirmar) return setErro("As senhas não coincidem.")
    setEnviando(true)
    try {
      const r = await fetch("/api/ativar-conta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, senha }),
      })
      if (r.status === 410) return setErro("Link expirado. Peça ao administrador um novo convite.")
      if (!r.ok) return setErro("Link inválido ou já utilizado.")
      setOk(true)
    } catch { setErro("Erro de conexão. Tente novamente.") }
    finally { setEnviando(false) }
  }

  return (
    <form onSubmit={submeter} className="space-y-5">
      {erro && (
        <div className="flex items-start gap-2 rounded-lg bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {erro}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="senha">Nova senha</Label>
        <div className="relative">
          <Input
            id="senha"
            type={mostrarSenha ? "text" : "password"}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Mínimo 8 caracteres"
            required
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setMostrarSenha((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {senha && <MedidorSenha senha={senha} />}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirmar">Repetir senha</Label>
        <div className="relative">
          <Input
            id="confirmar"
            type={mostrarConfirmar ? "text" : "password"}
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            placeholder="Repita a senha"
            required
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setMostrarConfirmar((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {mostrarConfirmar ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {confirmar && senha !== confirmar && (
          <p className="text-xs text-destructive">As senhas não coincidem</p>
        )}
      </div>

      <Button type="submit" variant="coral" className="w-full" disabled={enviando || senha.length < 8 || senha !== confirmar}>
        {enviando ? "Ativando…" : "Criar senha e ativar conta"}
      </Button>
    </form>
  )
}

export default function AtivarContaPage() {
  return (
    <div className="theme-noir min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <Logo size="md" variant="light" />
          <div>
            <h1 className="text-xl font-semibold text-foreground">Criar sua senha</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Defina uma senha segura para acessar o Cérebro Amigo.
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-noir-line bg-noir-surface p-6">
          <Suspense>
            <AtivarContaForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
