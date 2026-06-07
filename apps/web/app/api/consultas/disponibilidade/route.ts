import { NextRequest, NextResponse } from "next/server"
import { gateway, gatewayErrorResponse } from "@/lib/gateway"

// Slots livres do médico logado num dia (YYYY-MM-DD).
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const data = searchParams.get("data")
  if (!data) return NextResponse.json({ error: "data obrigatória" }, { status: 400 })
  try {
    const d = await gateway.get(`/api/v1/consultas/disponibilidade?data=${encodeURIComponent(data)}`)
    return NextResponse.json(d)
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}
