import { NextRequest, NextResponse } from "next/server"
import { gateway, GatewayError } from "@/lib/gateway"

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body?.token || !body?.senha)
    return NextResponse.json({ error: "token e senha obrigatórios" }, { status: 400 })
  try {
    await gateway.post("/api/v1/auth/ativar-conta", { token: body.token, senha: body.senha })
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    if (err instanceof GatewayError) {
      if (err.status === 400) return NextResponse.json({ error: "token_invalido" }, { status: 400 })
      if (err.status === 410) return NextResponse.json({ error: "token_expirado" }, { status: 410 })
    }
    return NextResponse.json({ error: "erro interno" }, { status: 500 })
  }
}
