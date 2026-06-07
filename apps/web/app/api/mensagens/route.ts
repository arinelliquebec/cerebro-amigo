import { NextResponse } from "next/server"
import { gateway, gatewayErrorResponse } from "@/lib/gateway"

// Inbox de conversas do médico (revisão). Não loga conteúdo (LGPD).
export async function GET() {
  try {
    const data = await gateway.get("/api/v1/mensagens/conversas")
    return NextResponse.json(data)
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}
