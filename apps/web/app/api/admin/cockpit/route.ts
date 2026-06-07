import { NextResponse } from "next/server"
import { gateway, gatewayErrorResponse } from "@/lib/gateway"

// Cockpit de receita do /admin (Fluxo A): MRR, receita/mês, inadimplência, funil.
export async function GET() {
  try {
    const data = await gateway.get("/api/v1/admin/cockpit")
    return NextResponse.json(data)
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}
