import { NextRequest, NextResponse } from "next/server"

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/")
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("auth_token")?.value
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
    const payload = decodeJwtPayload(token)
    const role = payload?.role as string | undefined
    if (role !== "owner" && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
