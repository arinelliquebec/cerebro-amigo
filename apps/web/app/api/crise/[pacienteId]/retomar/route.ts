import { NextRequest, NextResponse } from "next/server"
import { gateway, gatewayErrorResponse } from "@/lib/gateway"

// Médico retoma a automação do paciente após avaliar a crise. Ato auditado no gateway.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ pacienteId: string }> },
) {
  const { pacienteId } = await params
  const body = (await req.json().catch(() => ({}))) as { observacao?: string }
  try {
    await gateway.post(`/api/v1/crise/${pacienteId}/retomar`, {
      observacao: body?.observacao ?? "",
    })
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}
