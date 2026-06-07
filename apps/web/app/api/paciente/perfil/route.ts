import { NextRequest, NextResponse } from "next/server"
import { gatewayPaciente, gatewayPacienteErrorResponse } from "@/lib/gateway-paciente"

export async function GET() {
  try {
    const data = await gatewayPaciente.get("/api/v1/portal/paciente/perfil")
    return NextResponse.json(data)
  } catch (err) {
    return gatewayPacienteErrorResponse(err)
  }
}

export async function PATCH(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  try {
    await gatewayPaciente.patch("/api/v1/portal/paciente/perfil", {
      nome: body?.nome ?? null,
      email: body?.email ?? null,
    })
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    return gatewayPacienteErrorResponse(err)
  }
}
