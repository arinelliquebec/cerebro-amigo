import { NextResponse } from "next/server"
import { gateway, gatewayErrorResponse } from "@/lib/gateway"

// Ativa uma versão de prompt. 'ativar' é segmento ESTÁTICO (antes de [id]) para
// não criar dois slugs dinâmicos irmãos sob /api/prompts ([agente] vs [id]),
// que o Next.js proíbe e fazia o app inteiro retornar 500.
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await gateway.post(`/api/v1/prompts/${encodeURIComponent(id)}/ativar`, {})
    return NextResponse.json(data)
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}
