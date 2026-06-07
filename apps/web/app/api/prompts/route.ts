import { NextRequest, NextResponse } from "next/server"
import { gateway, gatewayErrorResponse } from "@/lib/gateway"
import { promptTravado } from "@/lib/prompts-guard"

/**
 * GET /api/prompts — lista prompts ativos do gateway.
 * POST /api/prompts — cria nova versão de prompt (admin only).
 */

export async function GET() {
  try {
    const data = await gateway.get("/api/v1/prompts/")
    return NextResponse.json(data)
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: "corpo inválido" }, { status: 400 })

  // Defesa em profundidade (a trava definitiva vive no gateway): bloqueia já no
  // BFF a criação de versão de prompt de salvaguarda clínica (crise/auditoria).
  if (promptTravado(body.agente, body.nome))
    return NextResponse.json(
      {
        error: "prompt_travado",
        detalhe:
          "Prompt de salvaguarda clínica (detecção de crise / auditoria) não pode ser alterado pelo painel.",
      },
      { status: 409 },
    )

  try {
    const data = await gateway.post("/api/v1/prompts/", body)
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}
