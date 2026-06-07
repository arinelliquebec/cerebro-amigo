import { NextRequest, NextResponse } from "next/server"
import { gatewayPaciente, gatewayPacienteErrorResponse } from "@/lib/gateway-paciente"

// Instrumento versionado (PHQ-9/GAD-7) p/ o portal renderizar o formulário.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await params
  try {
    const data = await gatewayPaciente.get(`/api/v1/portal/paciente/escalas/${codigo}`)
    return NextResponse.json(data)
  } catch (err) {
    return gatewayPacienteErrorResponse(err)
  }
}
