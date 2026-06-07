import { NextRequest, NextResponse } from "next/server"
import { gateway, gatewayErrorResponse } from "@/lib/gateway"

// Detalhe da última crise de um paciente (read-only). Tenant via JWT do médico.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ pacienteId: string }> },
) {
  const { pacienteId } = await params
  try {
    const data = await gateway.get(`/api/v1/crise/${pacienteId}`)
    return NextResponse.json(data)
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}
