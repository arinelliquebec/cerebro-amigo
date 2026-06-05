import { NextResponse } from "next/server"
import { gateway, gatewayErrorResponse } from "@/lib/gateway"

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await gateway.post(`/api/v1/rede/posts/${encodeURIComponent(id)}/curtir`, {})
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await gateway.delete(`/api/v1/rede/posts/${encodeURIComponent(id)}/curtir`)
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    return gatewayErrorResponse(err)
  }
}
