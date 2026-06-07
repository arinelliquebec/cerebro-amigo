import { NextRequest, NextResponse } from "next/server"
import { gateway, gatewayErrorResponse } from "@/lib/gateway"

// GET retorna o último resumo cacheado: { ultimo: ResumoPreConsultaDto | null }
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const data = await gateway.get(`/api/v1/pacientes/${id}/resumo-pre-consulta`)
    return NextResponse.json(data)
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}

// POST dispara geração on-demand (agents-py). Pode demorar — deixa o gateway esperar.
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const data = await gateway.post(`/api/v1/pacientes/${id}/resumo-pre-consulta`, {})
    return NextResponse.json(data)
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}
