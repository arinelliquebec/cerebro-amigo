import { NextRequest, NextResponse } from "next/server"
import { gateway, gatewayErrorResponse } from "@/lib/gateway"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const dias = _req.nextUrl.searchParams.get("dias") ?? "30"
  try {
    const data = await gateway.get(`/api/v1/pacientes/${id}/timeline?dias=${dias}`)
    return NextResponse.json(data)
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}
