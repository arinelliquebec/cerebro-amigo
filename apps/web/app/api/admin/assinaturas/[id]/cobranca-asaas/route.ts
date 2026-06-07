import { NextRequest, NextResponse } from "next/server"
import { gateway, gatewayErrorResponse } from "@/lib/gateway"

type Ctx = { params: Promise<{ id: string }> }

// Ativa cobrança recorrente do médico no Asaas (Fluxo A, ADR-034).
export async function POST(_req: NextRequest, { params }: Ctx) {
  const { id } = await params
  try {
    const data = await gateway.post(`/api/v1/admin/assinaturas/${id}/cobranca-asaas`, {})
    return NextResponse.json(data)
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}

// Cancela a cobrança recorrente.
export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { id } = await params
  try {
    await gateway.delete(`/api/v1/admin/assinaturas/${id}/cobranca-asaas`)
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}
