import { NextRequest, NextResponse } from "next/server"
import { gatewayPaciente, gatewayPacienteErrorResponse } from "@/lib/gateway-paciente"

// Minhas consultas
export async function GET() {
  try {
    const data = await gatewayPaciente.get("/api/v1/portal/paciente/agenda")
    return NextResponse.json(data)
  } catch (err) {
    return gatewayPacienteErrorResponse(err)
  }
}

// Agendar consulta (nasce pendente de confirmação do médico)
export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => null)
  if (!b?.iniciaEm) return NextResponse.json({ erro: "iniciaEm obrigatório" }, { status: 400 })
  try {
    await gatewayPaciente.post("/api/v1/portal/paciente/agenda", {
      iniciaEm: b.iniciaEm,
      modalidade: b.modalidade ?? "teleconsulta",
    })
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    return gatewayPacienteErrorResponse(err)
  }
}
