import { NextRequest, NextResponse } from "next/server"
import { gateway, gatewayErrorResponse } from "@/lib/gateway"

// Médico assume a conversa escalada e a devolve ao fluxo.
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ conversaId: string }> },
) {
  const { conversaId } = await params
  try {
    await gateway.post(`/api/v1/escalacoes/${conversaId}/assumir`, {})
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}
