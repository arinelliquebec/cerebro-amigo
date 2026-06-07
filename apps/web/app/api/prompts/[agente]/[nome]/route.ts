import { NextResponse } from "next/server"
import { gateway, gatewayErrorResponse } from "@/lib/gateway"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ agente: string; nome: string }> }
) {
  try {
    const { agente, nome } = await params
    const data = await gateway.get(
      `/api/v1/prompts/${encodeURIComponent(agente)}/${encodeURIComponent(nome)}`
    )
    return NextResponse.json(data)
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}
