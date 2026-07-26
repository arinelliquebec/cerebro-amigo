"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { gatewayPaciente, GatewayPacienteError } from "@/lib/gateway-paciente"

export interface PacienteAuthState {
  error: string | null
}

const COOKIE_NAME = "paciente_token"
const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 dias — igual ao TTL do JWT do paciente
}

function destinoSeguro(next: FormDataEntryValue | null): string {
  const n = typeof next === "string" ? next : ""
  // só aceita caminhos internos do portal
  return n.startsWith("/p") ? n : "/p"
}

// ─── Convite por magic link: valida token + define senha ───────────────────
export async function entrarComLink(
  _prev: PacienteAuthState,
  formData: FormData,
): Promise<PacienteAuthState> {
  const token = formData.get("token") as string
  const novaSenha = formData.get("novaSenha") as string
  const confirmar = formData.get("confirmar") as string

  if (!token) return { error: "Invalid invitation. Ask your physician for a new link." }
  if (!novaSenha || novaSenha.length < 8)
    return { error: "Your password must contain at least 8 characters." }
  if (novaSenha !== confirmar) return { error: "The passwords do not match." }

  try {
    const data = await gatewayPaciente.post<{ token: string }>(
      "/api/v1/auth/paciente/magic-validar",
      { token, novaSenha },
    )
    ;(await cookies()).set(COOKIE_NAME, data.token, COOKIE_OPTS)
  } catch (err) {
    if (err instanceof GatewayPacienteError && err.status === 401)
      return { error: "This invitation expired or has already been used. Ask your physician for a new one." }
    return { error: "We could not activate your account. Please try again." }
  }

  redirect(destinoSeguro(formData.get("next")))
}

// ─── Esqueci minha senha (anônimo) ─────────────────────────────────────────
// Anti-enumeração: SEMPRE devolve a mesma mensagem neutra, exista ou não a conta.
// O gateway responde 202 sem revelar nada e dispara o e-mail só se for paciente.
export interface EsqueciSenhaState {
  ok: boolean
  msg: string | null
}

const MSG_NEUTRA =
  "If an account exists for this email, we sent a password-reset link. " +
  "Check your inbox and spam folder."

export async function esqueciSenha(
  _prev: EsqueciSenhaState,
  formData: FormData,
): Promise<EsqueciSenhaState> {
  const email = (formData.get("email") as string)?.trim()
  if (!email) return { ok: false, msg: "Enter your email address." }

  try {
    await gatewayPaciente.post("/api/v1/auth/paciente/esqueci-senha", { email })
  } catch {
    // Silencia qualquer erro (inclusive rede): não revela se o e-mail existe.
  }
  // Resposta sempre neutra — não vaza quem é paciente.
  return { ok: true, msg: MSG_NEUTRA }
}

// ─── Login com email + senha ───────────────────────────────────────────────
export async function entrarComSenha(
  _prev: PacienteAuthState,
  formData: FormData,
): Promise<PacienteAuthState> {
  const email = formData.get("email") as string
  const senha = formData.get("senha") as string

  if (!email || !senha) return { error: "Email and password are required." }

  let senhaTemporaria = false
  try {
    const data = await gatewayPaciente.post<{ token: string; senhaTemporaria: boolean }>(
      "/api/v1/auth/paciente/login",
      { email, senha },
    )
    ;(await cookies()).set(COOKIE_NAME, data.token, COOKIE_OPTS)
    senhaTemporaria = data.senhaTemporaria
  } catch (err) {
    if (err instanceof GatewayPacienteError) {
      if (err.status === 401) return { error: "Incorrect email or password." }
      if (err.status === 409)
        return { error: "This email belongs to a physician account. Use /login." }
      if (err.status === 429)
        return { error: "Too many attempts. Try again in a few minutes." }
    }
    return { error: "Connection error. Please try again." }
  }

  redirect(senhaTemporaria ? "/p/trocar-senha" : destinoSeguro(formData.get("next")))
}

// ─── Troca de senha (autenticado) ──────────────────────────────────────────
export async function trocarSenha(
  _prev: PacienteAuthState,
  formData: FormData,
): Promise<PacienteAuthState> {
  const senhaAtual = formData.get("senhaAtual") as string
  const novaSenha = formData.get("novaSenha") as string
  const confirmar = formData.get("confirmar") as string

  if (!senhaAtual) return { error: "Informe a senha atual." }
  if (!novaSenha || novaSenha.length < 8)
    return { error: "A nova senha precisa ter pelo menos 8 caracteres." }
  if (novaSenha !== confirmar) return { error: "As senhas não coincidem." }

  try {
    await gatewayPaciente.post("/api/v1/auth/paciente/senha", { senhaAtual, novaSenha })
  } catch (err) {
    if (err instanceof GatewayPacienteError && err.status === 401)
      return { error: "Senha atual incorreta." }
    return { error: "Não foi possível trocar a senha. Tente novamente." }
  }

  redirect("/p")
}

// ─── Logout ────────────────────────────────────────────────────────────────
// CSRF (T1-9): é um Server Action — o Next já valida Origin × Host nativamente e
// rejeita POST cross-site, então não precisa do guard manual do Route Handler do
// médico (lib/same-origin.ts). O lado paciente fica coberto pela proteção do framework.
export async function sairPaciente(): Promise<void> {
  ;(await cookies()).set(COOKIE_NAME, "", { ...COOKIE_OPTS, maxAge: 0 })
  redirect("/p/entrar")
}
