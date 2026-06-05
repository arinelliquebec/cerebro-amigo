import { NextResponse } from "next/server"
import { gateway, gatewayErrorResponse } from "@/lib/gateway"

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ medicoId: string }> }
) {
  try {
    const { medicoId } = await params
    await gateway.post(`/api/v1/rede/perfil/${encodeURIComponent(medicoId)}/seguir`, {})
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ medicoId: string }> }
) {
  try {
    const { medicoId } = await params
    await gateway.delete(`/api/v1/rede/perfil/${encodeURIComponent(medicoId)}/seguir`)
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}
