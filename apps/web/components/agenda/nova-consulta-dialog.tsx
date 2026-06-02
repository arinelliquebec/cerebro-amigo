"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Loader2, AlertTriangle } from "lucide-react"

interface PacienteOpcao {
  id: string
  nome: string | null
  numero: number
}

export function NovaConsultaDialog({
  diaInicial,
  onCriada,
}: {
  diaInicial: string // YYYY-MM-DD
  onCriada: () => void
}) {
  const [aberto, setAberto] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [pacientes, setPacientes] = useState<PacienteOpcao[]>([])

  const [pacienteId, setPacienteId] = useState("")
  const [data, setData] = useState(diaInicial)
  const [hora, setHora] = useState("09:00")
  const [modalidade, setModalidade] = useState("presencial")

  useEffect(() => {
    if (!aberto) return
    setData(diaInicial)
    fetch("/api/pacientes")
      .then((r) => (r.ok ? r.json() : []))
      .then((rows) => setPacientes(Array.isArray(rows) ? rows : []))
      .catch(() => setPacientes([]))
  }, [aberto, diaInicial])

  function reset() {
    setEnviando(false)
    setErro(null)
    setPacienteId("")
    setHora("09:00")
    setModalidade("presencial")
  }

  async function submeter(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)
    if (!pacienteId) return setErro("Selecione o paciente.")
    if (!data || !hora) return setErro("Informe data e hora.")

    // data+hora locais → ISO (UTC) pro gateway.
    const iniciaEm = new Date(`${data}T${hora}`).toISOString()

    setEnviando(true)
    try {
      const r = await fetch("/api/consultas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pacienteId, iniciaEm, modalidade }),
      })
      if (!r.ok) {
        const d = await r.json().catch(() => null)
        setErro(d?.erro ?? d?.error ?? "Não foi possível agendar.")
        return
      }
      onCriada()
      setAberto(false)
    } catch {
      setErro("Erro de conexão. Tente novamente.")
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Dialog
      open={aberto}
      onOpenChange={(o) => {
        setAberto(o)
        if (!o) reset()
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-purple-dark text-primary-foreground gap-2">
          <Plus className="h-4 w-4" /> Nova consulta
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Agendar consulta</DialogTitle>
          <DialogDescription>Defina paciente, data e modalidade.</DialogDescription>
        </DialogHeader>

        <form onSubmit={submeter} className="space-y-4">
          {erro && (
            <div className="flex items-start gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{erro}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label>Paciente</Label>
            <Select value={pacienteId} onValueChange={setPacienteId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o paciente" />
              </SelectTrigger>
              <SelectContent>
                {pacientes.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.nome ?? `Paciente ${String(p.numero).padStart(2, "0")}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="nc-data">Data</Label>
              <Input id="nc-data" type="date" value={data} onChange={(e) => setData(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nc-hora">Hora</Label>
              <Input id="nc-hora" type="time" value={hora} onChange={(e) => setHora(e.target.value)} required />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Modalidade</Label>
            <Select value={modalidade} onValueChange={setModalidade}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="presencial">Presencial</SelectItem>
                <SelectItem value="teleconsulta">Teleconsulta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setAberto(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={enviando} className="bg-primary hover:bg-purple-dark text-primary-foreground">
              {enviando ? <Loader2 className="h-4 w-4 animate-spin" /> : "Agendar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
