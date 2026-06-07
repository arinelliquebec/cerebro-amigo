import { NextRequest, NextResponse } from "next/server"
import { gateway, gatewayErrorResponse } from "@/lib/gateway"

// Agenda do médico no intervalo [de, ate). Default no gateway: hoje..+7d.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const qs = new URLSearchParams()
  const de = searchParams.get("de")
  const ate = searchParams.get("ate")
  if (de) qs.set("de", de)
  if (ate) qs.set("ate", ate)
  const sufixo = qs.toString() ? `?${qs}` : ""

  try {
    const data = await gateway.get(`/api/v1/consultas/${sufixo}`)
    return NextResponse.json(data)
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}

// Agenda nova consulta.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: "corpo inválido" }, { status: 400 })
  try {
    const data = await gateway.post("/api/v1/consultas/", body)
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}
