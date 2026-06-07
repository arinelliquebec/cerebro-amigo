import { NextResponse } from "next/server"
import { gateway, gatewayErrorResponse } from "@/lib/gateway"

// Panorama de evolução do médico (stats + séries + progresso factual).
export async function GET() {
  try {
    const data = await gateway.get("/api/v1/evolucao/resumo")
    return NextResponse.json(data)
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}
