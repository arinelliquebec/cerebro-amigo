import { NextResponse } from "next/server"
import { gateway, gatewayErrorResponse } from "@/lib/gateway"

// Fila de atenção do médico — itens ranqueados que precisam de ação.
export async function GET() {
  try {
    const data = await gateway.get("/api/v1/fila-atencao")
    return NextResponse.json(data)
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}
