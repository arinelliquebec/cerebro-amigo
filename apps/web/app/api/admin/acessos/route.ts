import { NextRequest, NextResponse } from "next/server"
import { gateway, gatewayErrorResponse } from "@/lib/gateway"

// Trilha de acesso a dados sensíveis (read-only). Filtro `q` por médico/paciente.
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? ""
  try {
    const data = await gateway.get(`/api/v1/admin/acessos?q=${encodeURIComponent(q)}`)
    return NextResponse.json(data)
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}
