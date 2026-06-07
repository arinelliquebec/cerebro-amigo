import { NextRequest, NextResponse } from "next/server"
import { gateway, gatewayErrorResponse } from "@/lib/gateway"

// Médico entra na sala de teleconsulta: o gateway valida tenant + modalidade,
// abre a sala e devolve os iceServers (STUN + TURN efêmero) para o WebRTC.
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const data = await gateway.post(`/api/v1/consultas/${id}/video/entrar`, {})
    return NextResponse.json(data)
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}
