import { NextResponse } from "next/server"
import { gateway, gatewayErrorResponse } from "@/lib/gateway"

// Conversas escaladas para atendimento humano (auditor/crise).
export async function GET() {
  try {
    const data = await gateway.get("/api/v1/escalacoes")
    return NextResponse.json(data)
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}
