import { NextRequest, NextResponse } from "next/server"
import { gatewayPaciente, gatewayPacienteErrorResponse } from "@/lib/gateway-paciente"

export async function GET() {
  try {
    const data = await gatewayPaciente.get("/api/v1/portal/paciente/diario/?pageSize=30")
    return NextResponse.json(data)
  } catch (err) {
    return gatewayPacienteErrorResponse(err)
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body?.conteudo) {
    return NextResponse.json({ erro: "conteudo obrigatório" }, { status: 400 })
  }
  try {
    const data = await gatewayPaciente.post("/api/v1/portal/paciente/diario/", {
      titulo: body.titulo ?? null,
      conteudo: body.conteudo,
      humor: body.humor ?? null,
      tags: body.tags ?? [],
      compartilharComMedico: body.compartilharComMedico ?? false,
      tipo: body.tipo ?? "texto",
      transcricao: body.transcricao ?? null,
    })
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    return gatewayPacienteErrorResponse(err)
  }
}
