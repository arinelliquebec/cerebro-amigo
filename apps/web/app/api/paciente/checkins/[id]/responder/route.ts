import { NextRequest, NextResponse } from "next/server"
import { gatewayPaciente, gatewayPacienteErrorResponse } from "@/lib/gateway-paciente"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  try {
    await gatewayPaciente.post(`/api/v1/portal/paciente/checkins/${id}/responder`, {
      resposta: body?.resposta ?? {},
    })
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    return gatewayPacienteErrorResponse(err)
  }
}
