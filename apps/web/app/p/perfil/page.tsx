"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { User, Stethoscope, Loader2, Check, LogOut, ClipboardCheck, ChevronRight, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PushToggle } from "@/components/portal/push-toggle"
import { sairPaciente } from "../entrar/actions"

interface Perfil {
  nome: string | null
  email: string | null
  cpf: string | null
  telefone: string | null
  cep: string | null
  logradouro: string | null
  numero: string | null
  complemento: string | null
  bairro: string | null
  cidade: string | null
  uf: string | null
  nomeMedico: string
  crmMedico: string
}

// CPF: remove não-dígitos, valida 11 dígitos + dois dígitos verificadores.
function validarCpf(raw: string): boolean {
  const d = raw.replace(/\D/g, "")
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false
  const dig = (n: number) => {
    let s = 0
    for (let i = 0; i < n; i++) s += Number(d[i]) * (n + 1 - i)
    const r = (s * 10) % 11
    return r >= 10 ? 0 : r
  }
  return dig(9) === Number(d[9]) && dig(10) === Number(d[10])
}

function maskCpf(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11)
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4")
}

function maskTelefone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11)
  if (d.length <= 2) return d.replace(/(\d{0,2})/, "($1")
  if (d.length <= 6) return d.replace(/(\d{2})(\d+)/, "($1) $2")
  if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d+)/, "($1) $2-$3")
  return d.replace(/(\d{2})(\d{5})(\d+)/, "($1) $2-$3")
}

function maskCep(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 8)
  return d.replace(/(\d{5})(\d)/, "$1-$2")
}

export default function PerfilPage() {
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [cpf, setCpf] = useState("")
  const [telefone, setTelefone] = useState("")
  const [cep, setCep] = useState("")
  const [logradouro, setLogradouro] = useState("")
  const [numero, setNumero] = useState("")
  const [complemento, setComplemento] = useState("")
  const [bairro, setBairro] = useState("")
  const [cidade, setCidade] = useState("")
  const [uf, setUf] = useState("")

  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [salvo, setSalvo] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [cpfErro, setCpfErro] = useState(false)
  const [buscandoCep, setBuscandoCep] = useState(false)
  const cepTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    fetch("/api/paciente/perfil")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((p: Perfil) => {
        setPerfil(p)
        setNome(p.nome ?? "")
        setEmail(p.email ?? "")
        setCpf(maskCpf(p.cpf ?? ""))
        setTelefone(maskTelefone(p.telefone ?? ""))
        setCep(maskCep(p.cep ?? ""))
        setLogradouro(p.logradouro ?? "")
        setNumero(p.numero ?? "")
        setComplemento(p.complemento ?? "")
        setBairro(p.bairro ?? "")
        setCidade(p.cidade ?? "")
        setUf(p.uf ?? "")
      })
      .catch(() => setPerfil(null))
      .finally(() => setLoading(false))
  }, [])

  function onCep(v: string) {
    const masked = maskCep(v)
    setCep(masked)
    const raw = masked.replace(/\D/g, "")
    if (cepTimer.current) clearTimeout(cepTimer.current)
    if (raw.length !== 8) return
    cepTimer.current = setTimeout(async () => {
      setBuscandoCep(true)
      try {
        const r = await fetch(`https://viacep.com.br/ws/${raw}/json/`)
        if (!r.ok) return
        const data = await r.json()
        if (data.erro) return
        setLogradouro(data.logradouro ?? "")
        setBairro(data.bairro ?? "")
        setCidade(data.localidade ?? "")
        setUf(data.uf ?? "")
      } catch { /* ignore — usuário pode preencher manualmente */ } finally {
        setBuscandoCep(false)
      }
    }, 400)
  }

  async function salvar() {
    const cpfRaw = cpf.replace(/\D/g, "")
    if (cpfRaw && !validarCpf(cpfRaw)) { setCpfErro(true); return }
    setCpfErro(false)
    setSalvando(true); setSalvo(false); setErro(null)
    try {
      const r = await fetch("/api/paciente/perfil", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nome || null,
          email: email || null,
          cpf: cpfRaw || null,
          telefone: telefone.replace(/\D/g, "") || null,
          cep: cep.replace(/\D/g, "") || null,
          logradouro: logradouro || null,
          numero: numero || null,
          complemento: complemento || null,
          bairro: bairro || null,
          cidade: cidade || null,
          uf: uf || null,
        }),
      })
      if (r.ok) {
        setSalvo(true)
        setTimeout(() => setSalvo(false), 2000)
      } else {
        setErro("Não conseguimos salvar suas alterações agora. Verifique a conexão e tente novamente.")
      }
    } catch {
      setErro("Não conseguimos salvar suas alterações agora. Verifique a conexão e tente novamente.")
    } finally {
      setSalvando(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-4 pt-8 space-y-6">
      <h1 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
        <User className="h-6 w-6 text-primary" /> Meu perfil
      </h1>

      {perfil?.nomeMedico && (
        <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{perfil.nomeMedico}</p>
            <p className="text-xs text-muted-foreground">{perfil.crmMedico}</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Dados básicos */}
        <div className="space-y-1.5">
          <Label htmlFor="nome">Nome</Label>
          <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        {/* Contato */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              inputMode="numeric"
              value={cpf}
              onChange={(e) => { setCpf(maskCpf(e.target.value)); setCpfErro(false) }}
              placeholder="000.000.000-00"
              className={cpfErro ? "border-destructive" : ""}
            />
            {cpfErro && <p className="text-xs text-destructive">CPF inválido</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="telefone">Celular / WhatsApp</Label>
            <Input
              id="telefone"
              inputMode="tel"
              value={telefone}
              onChange={(e) => setTelefone(maskTelefone(e.target.value))}
              placeholder="(11) 91234-5678"
            />
          </div>
        </div>

        {/* Endereço */}
        <div className="space-y-3 rounded-2xl border border-border/60 bg-card p-4">
          <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            <MapPin className="h-4 w-4 text-primary" /> Endereço
          </p>
          <div className="space-y-1.5">
            <Label htmlFor="cep">CEP</Label>
            <div className="relative">
              <Input
                id="cep"
                inputMode="numeric"
                value={cep}
                onChange={(e) => onCep(e.target.value)}
                placeholder="00000-000"
                className="pr-8"
              />
              {buscandoCep && (
                <Loader2 className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-muted-foreground" />
              )}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="logradouro">Rua / Avenida</Label>
            <Input
              id="logradouro"
              value={logradouro}
              onChange={(e) => setLogradouro(e.target.value)}
              placeholder="Preenchido pelo CEP"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="numero">Número</Label>
              <Input id="numero" value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="123" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="complemento">Complemento</Label>
              <Input id="complemento" value={complemento} onChange={(e) => setComplemento(e.target.value)} placeholder="Apto 4B" />
            </div>
          </div>
          <div className="grid grid-cols-[1fr_auto_auto] gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="bairro">Bairro</Label>
              <Input id="bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} placeholder="Centro" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cidade">Cidade</Label>
              <Input id="cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="São Paulo" className="min-w-[140px]" />
            </div>
            <div className="space-y-1.5 w-16">
              <Label htmlFor="uf">UF</Label>
              <Input
                id="uf"
                value={uf}
                onChange={(e) => setUf(e.target.value.toUpperCase().slice(0, 2))}
                placeholder="SP"
                maxLength={2}
              />
            </div>
          </div>
        </div>

        <Button onClick={salvar} disabled={salvando} className="w-full bg-primary hover:bg-purple-dark text-primary-foreground">
          {salvando ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : salvo ? (
            <><Check className="mr-1 h-4 w-4" /> Salvo</>
          ) : (
            "Salvar"
          )}
        </Button>
        {erro && <p role="alert" className="text-sm text-destructive">{erro}</p>}
      </div>

      <PushToggle />

      <Link
        href="/p/checkins"
        className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4"
      >
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary">
          <ClipboardCheck className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">Check-ins</p>
          <p className="text-xs text-muted-foreground">Perguntas rápidas da sua psiquiatra</p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Link>

      <form action={sairPaciente} className="pt-2">
        <Button variant="outline" type="submit" className="w-full gap-2 text-muted-foreground">
          <LogOut className="h-4 w-4" /> Sair
        </Button>
      </form>
    </div>
  )
}
