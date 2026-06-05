import { NextResponse } from "next/server"
import { gateway, gatewayErrorResponse } from "@/lib/gateway"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params
    const data = await gateway.get(`/api/v1/rede/perfil/${encodeURIComponent(handle)}`)
    return NextResponse.json(data)
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}
