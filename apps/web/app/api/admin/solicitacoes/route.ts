import { NextRequest, NextResponse } from "next/server"
import { gateway, gatewayErrorResponse } from "@/lib/gateway"

// Solicitações de direitos do titular (LGPD). GET lista, POST registra.
export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status") ?? ""
  try {
    const data = await gateway.get(`/api/v1/admin/solicitacoes?status=${encodeURIComponent(status)}`)
    return NextResponse.json(data)
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: "corpo inválido" }, { status: 400 })
  try {
    const data = await gateway.post("/api/v1/admin/solicitacoes", body)
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}
