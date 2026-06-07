import { NextRequest, NextResponse } from "next/server"
import { gatewayPaciente, gatewayPacienteErrorResponse } from "@/lib/gateway-paciente"

// Registra subscription. Recebe o PushSubscription.toJSON() do browser:
//   { endpoint, keys: { p256dh, auth } }
export async function POST(req: NextRequest) {
  const sub = await req.json().catch(() => null)
  const endpoint = sub?.endpoint
  const p256dh = sub?.keys?.p256dh
  const auth = sub?.keys?.auth
  if (!endpoint || !p256dh || !auth) {
    return NextResponse.json({ erro: "subscription inválida" }, { status: 400 })
  }
  try {
    await gatewayPaciente.post("/api/v1/portal/paciente/push/subscribe", {
      endpoint,
      p256dhKey: p256dh,
      authKey: auth,
    })
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    return gatewayPacienteErrorResponse(err)
  }
}

// Cancela subscription. Recebe { endpoint }.
export async function DELETE(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const endpoint = body?.endpoint
  if (!endpoint) return NextResponse.json({ erro: "endpoint ausente" }, { status: 400 })
  try {
    await gatewayPaciente.post("/api/v1/portal/paciente/push/unsubscribe", { endpoint })
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    return gatewayPacienteErrorResponse(err)
  }
}
