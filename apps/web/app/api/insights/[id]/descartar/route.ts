import { NextRequest, NextResponse } from "next/server"
import { gateway, gatewayErrorResponse } from "@/lib/gateway"

// Descarta um insight (soft — grava descartado_em no gateway). Tenant via JWT do médico.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const body = (await req.json().catch(() => ({}))) as { motivo?: string }
  try {
    await gateway.post(`/api/v1/insights/${id}/descartar`, { motivo: body?.motivo ?? "" })
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}
