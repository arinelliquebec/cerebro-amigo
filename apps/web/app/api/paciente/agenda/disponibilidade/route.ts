import { NextRequest, NextResponse } from "next/server"
import { gatewayPaciente, gatewayPacienteErrorResponse } from "@/lib/gateway-paciente"

// Slots livres do meu médico num dia (YYYY-MM-DD)
export async function GET(req: NextRequest) {
  const data = req.nextUrl.searchParams.get("data")
  if (!data) return NextResponse.json({ erro: "data obrigatória" }, { status: 400 })
  try {
    const result = await gatewayPaciente.get(
      `/api/v1/portal/paciente/agenda/disponibilidade?data=${encodeURIComponent(data)}`,
    )
    return NextResponse.json(result)
  } catch (err) {
    return gatewayPacienteErrorResponse(err)
  }
}
