import { NextRequest, NextResponse } from "next/server"
import { gatewayPaciente, gatewayPacienteErrorResponse } from "@/lib/gateway-paciente"

// Paciente entra na sua teleconsulta: o gateway valida que a consulta é dele +
// modalidade teleconsulta, abre a sala e devolve os iceServers para o WebRTC.
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const data = await gatewayPaciente.post(`/api/v1/portal/paciente/agenda/${id}/video/entrar`)
    return NextResponse.json(data)
  } catch (err) {
    return gatewayPacienteErrorResponse(err)
  }
}
