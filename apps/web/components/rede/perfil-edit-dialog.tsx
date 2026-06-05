"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { PerfilPublico } from "@/lib/rede"

interface Props {
  perfil: PerfilPublico
  trigger: React.ReactNode
  onSaved: () => void
}

export function PerfilEditDialog({ perfil, trigger, onSaved }: Props) {
  const [open, setOpen] = useState(false)
  const [handle, setHandle] = useState(perfil.handle)
  const [bio, setBio] = useState(perfil.bio ?? "")
  const [cidade, setCidade] = useState(perfil.cidade ?? "")
  const [instituicao, setInstituicao] = useState(perfil.instituicao ?? "")
  const [fotoUrl, setFotoUrl] = useState(perfil.fotoUrl ?? "")
  const [salvando, setSalvando] = useState(false)

  async function salvar() {
    setSalvando(true)
    try {
      const res = await fetch("/api/rede/perfil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          handle: handle.trim() || null,
          bio: bio.trim() || null,
          cidade: cidade.trim() || null,
          instituicao: instituicao.trim() || null,
          fotoUrl: fotoUrl.trim() || null,
          capaUrl: perfil.capaUrl,
        }),
      })
      if (res.status === 204) {
        toast.success("Perfil atualizado.")
        setOpen(false)
        onSaved()
        return
      }
      const data = await res.json().catch(() => null)
      if (data?.error === "handle_em_uso") toast.error("Esse @handle já está em uso.")
      else if (data?.error === "handle_invalido") toast.error("Handle inválido (3–30 caracteres: letras, números, . _ -).")
      else toast.error("Não foi possível salvar.")
    } catch {
      toast.error("Erro de conexão.")
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
          <DialogDescription>Como você aparece para outros médicos na Comunidade.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="handle">@handle</Label>
            <Input id="handle" value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="dr-fulano" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} maxLength={500} placeholder="Especialidade, áreas de interesse…" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="cidade">Cidade</Label>
              <Input id="cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="instituicao">Instituição</Label>
              <Input id="instituicao" value={instituicao} onChange={(e) => setInstituicao(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="foto">URL da foto</Label>
            <Input id="foto" value={fotoUrl} onChange={(e) => setFotoUrl(e.target.value)} placeholder="https://…" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={salvar} disabled={salvando}>{salvando ? "Salvando…" : "Salvar"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
