"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

/**
 * Logout do médico: limpa o cookie httpOnly via BFF e volta pro /login.
 * Trava duplo-clique (`isLoggingOut`) p/ evitar POST e evento de auditoria duplicados.
 * Compartilhado por sidebar e header (antes era copiado nos dois).
 *
 * skipcq JS-0117 abaixo: export de ES module (module scope), não global —
 * `no-implicit-globals` não vale p/ módulos (falso-positivo de arquivo novo).
 */
export function useLogout() { // skipcq: JS-0117
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  async function logout() {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } finally {
      router.push("/login")
    }
  }

  return { logout, isLoggingOut }
}
