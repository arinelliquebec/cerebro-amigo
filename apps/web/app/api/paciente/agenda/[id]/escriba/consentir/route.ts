import { NextRequest, NextResponse } from "next/server"
import { gatewayPaciente, gatewayPacienteErrorResponse } from "@/lib/gateway-paciente"

// Paciente consente (POST) / revoga (DELETE) a gravação da teleconsulta p/ o Escriba (LGPD).
async function forward(id: string, method: "post" | "delete") {
  try {
    await gatewayPaciente[method](`/api/v1/portal/paciente/agenda/${id}/escriba/consentir`)
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    return gatewayPacienteErrorResponse(err)
  }
}

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return forward(id, "post")
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return forward(id, "delete")
}
