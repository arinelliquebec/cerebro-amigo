import { NextResponse } from "next/server"
import { gatewayPaciente, gatewayPacienteErrorResponse } from "@/lib/gateway-paciente"

// Cobranças pendentes do paciente logado (portal) — para pagar via Pix.
export async function GET() {
  try {
    const data = await gatewayPaciente.get("/api/v1/portal/paciente/cobrancas")
    return NextResponse.json(data)
  } catch (err) {
    return gatewayPacienteErrorResponse(err)
  }
}
