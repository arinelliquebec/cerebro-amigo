import { NextRequest, NextResponse } from "next/server"
import { gateway, gatewayErrorResponse } from "@/lib/gateway"

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body?.token || !body?.senha)
    return NextResponse.json({ error: "token e senha obrigatórios" }, { status: 400 })
  try {
    await gateway.post("/api/v1/auth/ativar-conta", { token: body.token, senha: body.senha })
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}
