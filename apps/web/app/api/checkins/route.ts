import { NextResponse } from "next/server"
import { gateway, gatewayErrorResponse } from "@/lib/gateway"

// Check-ins de humor recentes (auto-relato dos pacientes do médico).
export async function GET() {
  try {
    const data = await gateway.get("/api/v1/evolucao/checkins")
    return NextResponse.json(data)
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}
