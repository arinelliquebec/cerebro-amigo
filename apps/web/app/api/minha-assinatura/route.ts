import { NextResponse } from "next/server"
import { gateway, gatewayErrorResponse } from "@/lib/gateway"

// Assinatura da plataforma do médico logado (Fluxo A, ADR-034).
export async function GET() {
  try {
    const data = await gateway.get("/api/v1/minha-assinatura")
    return NextResponse.json(data)
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}
