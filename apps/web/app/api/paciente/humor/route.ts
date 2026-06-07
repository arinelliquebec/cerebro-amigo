import { NextRequest, NextResponse } from "next/server"
import { gatewayPaciente, gatewayPacienteErrorResponse } from "@/lib/gateway-paciente"

// Histórico de humor (timeline)
export async function GET(req: NextRequest) {
  const dias = req.nextUrl.searchParams.get("dias") ?? "30"
  try {
    const data = await gatewayPaciente.get(`/api/v1/portal/paciente/humor/historico?dias=${dias}`)
    return NextResponse.json(data)
  } catch (err) {
    return gatewayPacienteErrorResponse(err)
  }
}

// Registrar humor do dia
export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => null)
  if (typeof b?.humor !== "number") {
    return NextResponse.json({ erro: "humor (1-10) obrigatório" }, { status: 400 })
  }
  try {
    await gatewayPaciente.post("/api/v1/portal/paciente/humor", {
      humor: b.humor,
      ansiedade: b.ansiedade ?? null,
      sonoHoras: b.sonoHoras ?? null,
      energia: b.energia ?? null,
      nota: b.nota ?? null,
    })
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    return gatewayPacienteErrorResponse(err)
  }
}
