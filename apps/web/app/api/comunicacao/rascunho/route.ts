import { NextRequest, NextResponse } from "next/server"
import { gateway, gatewayErrorResponse } from "@/lib/gateway"

// Rascunho de comunicação ADMINISTRATIVA (IA, via gateway→orchestrator). Nunca clínico.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  try {
    const data = await gateway.post("/api/v1/comunicacao/rascunho", body)
    return NextResponse.json(data)
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}
