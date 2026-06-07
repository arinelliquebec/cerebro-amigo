import { NextResponse } from "next/server"
import { gateway, gatewayErrorResponse } from "@/lib/gateway"

// Pacientes do médico com automação pausada por crise (fila de crise ativa).
export async function GET() {
  try {
    const data = await gateway.get("/api/v1/crise/ativas")
    return NextResponse.json(data)
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}
