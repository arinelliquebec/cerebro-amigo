import { NextRequest, NextResponse } from "next/server"
import { gateway, gatewayErrorResponse } from "@/lib/gateway"

export async function GET(req: NextRequest) {
  const desativados = new URL(req.url).searchParams.get("desativados")
  const path = desativados === "true"
    ? "/api/v1/admin/usuarios?desativados=true"
    : "/api/v1/admin/usuarios"
  try {
    const data = await gateway.get(path)
    return NextResponse.json(data)
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: "corpo inválido" }, { status: 400 })
  try {
    const data = await gateway.post("/api/v1/admin/usuarios", body)
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}
