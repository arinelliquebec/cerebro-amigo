import { NextResponse } from "next/server"
import { gateway, gatewayErrorResponse } from "@/lib/gateway"

// Próximas consultas + status do lembrete (médico logado).
export async function GET() {
  try {
    const data = await gateway.get("/api/v1/consultas/lembretes")
    return NextResponse.json(data)
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}
