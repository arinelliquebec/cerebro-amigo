import { NextResponse } from "next/server"
import { gatewayPaciente, gatewayPacienteErrorResponse } from "@/lib/gateway-paciente"

export async function GET() {
  try {
    const data = await gatewayPaciente.get("/api/v1/portal/paciente/home")
    return NextResponse.json(data)
  } catch (err) {
    return gatewayPacienteErrorResponse(err)
  }
}
