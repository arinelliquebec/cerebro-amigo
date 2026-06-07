import { NextResponse } from "next/server"
import { gateway, gatewayErrorResponse } from "@/lib/gateway"

// Token do prescritor MEMED para o SDK do frontend. Repassa 400 (cadastro
// incompleto) e 502 (MEMED indisponível) com o corpo do gateway.
export async function GET() {
  try {
    const data = await gateway.get("/api/v1/memed/prescritor-token")
    return NextResponse.json(data)
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}
