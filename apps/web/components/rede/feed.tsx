"use client"

import { useCallback, useEffect, useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostComposer } from "@/components/rede/post-composer"
import { PostCard } from "@/components/rede/post-card"
import type { Comunidade, PerfilMe, Post } from "@/lib/rede"
import { Globe } from "lucide-react"

export function Feed() {
  const [me, setMe] = useState<PerfilMe | null>(null)
  const [comunidades, setComunidades] = useState<Comunidade[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [escopo, setEscopo] = useState<"descobrir" | "seguindo">("descobrir")
  const [loading, setLoading] = useState(true)

  const carregarFeed = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/rede/feed?escopo=${escopo}`)
      setPosts(res.ok ? await res.json() : [])
    } catch {
      setPosts([])
    } finally {
      setLoading(false)
    }
  }, [escopo])

  useEffect(() => {
    fetch("/api/rede/perfil/me")
      .then((r) => (r.ok ? r.json() : null))
      .then(setMe)
      .catch(() => setMe(null))
    fetch("/api/rede/comunidades")
      .then((r) => (r.ok ? r.json() : []))
      .then(setComunidades)
      .catch(() => setComunidades([]))
  }, [])

  useEffect(() => {
    carregarFeed()
  }, [carregarFeed])

  const podeInteragir = me?.verificado ?? false

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <PostComposer me={me} comunidades={comunidades} onCreated={carregarFeed} />

      <Tabs value={escopo} onValueChange={(v) => setEscopo(v as "descobrir" | "seguindo")}>
        <TabsList className="w-full">
          <TabsTrigger value="descobrir" className="flex-1">Descobrir</TabsTrigger>
          <TabsTrigger value="seguindo" className="flex-1">Seguindo</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-muted/40" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border/60 py-16 text-center">
          <Globe className="h-8 w-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            {escopo === "seguindo"
              ? "Você ainda não segue ninguém — ou ninguém publicou ainda."
              : "Ainda não há publicações. Seja o primeiro a compartilhar!"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              podeInteragir={podeInteragir}
              onRemoved={(id) => setPosts((cur) => cur.filter((x) => x.id !== id))}
            />
          ))}
        </div>
      )}
    </div>
  )
}
