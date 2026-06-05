import { NextRequest, NextResponse } from "next/server"
import { gateway, gatewayErrorResponse } from "@/lib/gateway"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await gateway.get(`/api/v1/rede/posts/${encodeURIComponent(id)}/comentarios`)
    return NextResponse.json(data)
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: "corpo invalido" }, { status: 400 })
  try {
    const { id } = await params
    const data = await gateway.post(`/api/v1/rede/posts/${encodeURIComponent(id)}/comentarios`, body)
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}
