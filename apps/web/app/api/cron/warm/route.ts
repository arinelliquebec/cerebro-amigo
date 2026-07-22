import { NextResponse } from "next/server"

/**
 * Warming do cockpit (disparado por um scheduler externo, a cada 5min).
 *
 * O dashboard/admin renderiza na Vercel (função serverless). Após ociosidade, a 1ª
 * carga é fria (~600ms de TTFB medido em 2026-06-18) — não é o EC2/RDS, é cold start
 * da função. Este endpoint mantém a função quente pingando as rotas do cockpit num
 * intervalo curto, e de quebra repopula o cache de 60s do funil do Check-up
 * (ADR-046/050) ao exercitar a BFF de aquisição.
 *
 * Não usa sessão: as rotas-alvo respondem 401/redirect sem cookie, mas a FUNÇÃO roda
 * por inteiro (a BFF chama o gateway; o fetch do funil popula o Data Cache), o que basta
 * pra aquecer runtime + caminho. Não é rota autenticada e não expõe dado clínico.
 *
 * Trigger: o plano da Vercel é Hobby (cron nativo só diário), então o disparo vem de
 * um EventBridge Rule `rate(5 minutes)` → API destination (sa-east-1, regra
 * `cerebro-cockpit-warm`), que injeta `Authorization: Bearer $CRON_SECRET` via Connection.
 *
 * Proteção: exige `Authorization: Bearer $CRON_SECRET`. Sem a env CRON_SECRET, roda
 * aberto (não quebra dev/preview) — em produção a env está setada.
 */

// Lê o header Authorization → handler é sempre dinâmico (nunca cacheado). Bom: cron
// precisa rodar ao vivo a cada disparo.
export const maxDuration = 30

const ALVOS = [
  "/api/admin/aquisicao", // BFF do cockpit: aquece gateway + repopula o cache do funil (revalidate:60)
  "/api/admin/cockpit", // BFF da receita
  "/admin/aquisicao", // shell RSC da página do cockpit
]

function baseUrl(): string {
  const explicit = process.env.WARM_BASE_URL
  if (explicit) return explicit.replace(/\/+$/, "")
  // Envs auto-injetadas pela Vercel em runtime.
  const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (prod) return `https://${prod}`
  const dep = process.env.VERCEL_URL
  if (dep) return `https://${dep}`
  return "http://localhost:3000"
}

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "não autorizado" }, { status: 401 })
  }

  const base = baseUrl()
  const inicio = Date.now()

  const resultados = await Promise.allSettled(
    ALVOS.map(async (path) => {
      const t0 = Date.now()
      const r = await fetch(`${base}${path}`, {
        redirect: "manual", // não seguir 307 de login: só queremos aquecer a rota
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      })
      return { path, status: r.status, ms: Date.now() - t0 }
    }),
  )

  const warmed = resultados.map((r, i) =>
    r.status === "fulfilled"
      ? r.value
      : { path: ALVOS[i], erro: r.reason instanceof Error ? r.reason.message : "falhou" },
  )

  return NextResponse.json({ ok: true, totalMs: Date.now() - inicio, warmed })
}
