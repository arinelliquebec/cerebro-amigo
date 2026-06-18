// Gate de ESCRITA do trial de aquisição (ADR-065), lado cliente. Espelha o
// ReadOnlyTrialFilter do gateway (403 `read_only_trial`) e o cap de pacientes
// (403 `trial_limite_pacientes`). O backend é a fonte da verdade; aqui só decidimos
// como mostrar banner/teaser e travar a afordância antes de chamar.

import type { Me } from "@/lib/use-me"

/** O médico está no trial read-only? (pendente, em prazo, sem plano pago.) */
export function isReadOnly(me: Me | null | undefined): boolean {
  return me?.readOnly === true
}

export interface ReadOnlyBlock {
  checkoutUrl: string
}

/**
 * Detecta o bloqueio de escrita do trial numa resposta de fetch. Só dispara em 403
 * com `read_only_trial` (não confunde com Forbid genérico de autorização, que não
 * traz corpo JSON). Usa res.clone() p/ não consumir o corpo do chamador.
 */
export async function readReadOnlyGate(res: Response): Promise<ReadOnlyBlock | null> {
  if (res.status !== 403) return null
  const body = await res.clone().json().catch(() => null)
  if (body && body.error === "read_only_trial") {
    return { checkoutUrl: String(body.checkoutUrl ?? "/dashboard/financeiro") }
  }
  return null
}

export interface TrialLimitBlock {
  limite: number | null
  checkoutUrl: string
}

/** Detecta o cap de pacientes do trial (403 `trial_limite_pacientes`). */
export async function readTrialLimitGate(res: Response): Promise<TrialLimitBlock | null> {
  if (res.status !== 403) return null
  const body = await res.clone().json().catch(() => null)
  if (body && body.error === "trial_limite_pacientes") {
    return {
      limite: typeof body.limite === "number" ? body.limite : null,
      checkoutUrl: String(body.checkoutUrl ?? "/dashboard/financeiro"),
    }
  }
  return null
}
