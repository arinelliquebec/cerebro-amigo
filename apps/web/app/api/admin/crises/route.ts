import { NextResponse } from "next/server"
import { gateway, gatewayErrorResponse } from "@/lib/gateway"

// Sala de supervisão de crise (read-only sobre a trilha imutável). Só metadados.
export async function GET() {
  try {
    const data = await gateway.get("/api/v1/admin/crises")
    return NextResponse.json(data)
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}
