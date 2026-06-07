import { NextRequest, NextResponse } from "next/server"
import { gateway, gatewayErrorResponse } from "@/lib/gateway"

// Espelho: receita emitida no MEMED → registra + clona meds em prescricoes.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  try {
    const data = await gateway.post("/api/v1/memed/receitas", body)
    return NextResponse.json(data)
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}
