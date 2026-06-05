import { NextRequest, NextResponse } from "next/server"
import { gateway, gatewayErrorResponse } from "@/lib/gateway"

export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: "corpo invalido" }, { status: 400 })
  try {
    await gateway.put("/api/v1/rede/perfil", body)
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}
