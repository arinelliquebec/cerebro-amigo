import { NextRequest, NextResponse } from "next/server"
import { gateway, gatewayErrorResponse } from "@/lib/gateway"

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const qs = new URLSearchParams()
  const escopo = sp.get("escopo")
  const comunidade = sp.get("comunidade")
  const pagina = sp.get("pagina")
  if (escopo) qs.set("escopo", escopo)
  if (comunidade) qs.set("comunidade", comunidade)
  if (pagina) qs.set("pagina", pagina)
  const suffix = qs.toString() ? `?${qs.toString()}` : ""

  try {
    const data = await gateway.get(`/api/v1/rede/feed${suffix}`)
    return NextResponse.json(data)
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}
