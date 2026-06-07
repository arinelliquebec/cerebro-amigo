import { NextRequest, NextResponse } from "next/server"
import { gateway, gatewayErrorResponse } from "@/lib/gateway"

// Médico registra o resultado de um exame. O gateway compara com a faixa de
// referência armazenada (factual) e devolve { foraFaixa }.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  try {
    return NextResponse.json(await gateway.post(`/api/v1/exames/${id}/resultado`, body))
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}
