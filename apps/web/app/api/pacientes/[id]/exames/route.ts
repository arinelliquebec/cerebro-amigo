import { NextRequest, NextResponse } from "next/server"
import { gateway, gatewayErrorResponse } from "@/lib/gateway"

// Agenda de exames de monitoramento de um paciente (S2). Tenant validado no gateway.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    return NextResponse.json(await gateway.get(`/api/v1/pacientes/${id}/exames`))
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}
