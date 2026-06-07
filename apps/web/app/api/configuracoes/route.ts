import { NextRequest, NextResponse } from "next/server"
import { gateway, gatewayErrorResponse } from "@/lib/gateway"

// Configurações do próprio médico (timezone, horário, preferências de notificação).
export async function GET() {
  try {
    const data = await gateway.get("/api/v1/me/config")
    return NextResponse.json(data)
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}

export async function PATCH(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  try {
    await gateway.patch("/api/v1/me/config", body)
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}
